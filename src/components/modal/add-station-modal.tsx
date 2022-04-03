import React, { useState } from 'react';
import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
} from '@chakra-ui/react';
import { RmgFields, RmgFieldsField } from '@railmapgen/rmg-components';
import { useAppDispatch, useAppSelector } from '../../redux';
import { addStation, getNewBranchAllowedEnds, verifyNewBranchEnds } from '../../redux/param/add-station-action';
import { RmgStyle } from '../../constants/constants';
import { isColineBranch } from '../../redux/param/coline-action';
import { useTranslation } from 'react-i18next';

interface AddStationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddStationModal(props: AddStationModalProps) {
    const { isOpen, onClose } = props;
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const [where, setWhere] = useState<`${number}` | 'new' | 'ext'>('0');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [position, setPosition] = useState<'upper' | 'lower'>('upper');

    const [fromError, setFromError] = useState('');
    const [toError, setToError] = useState('');

    const { style, stn_list: stationList } = useAppSelector(state => state.param);
    const branches = useAppSelector(state => state.helper.branches);

    const selectedBranch = ['new', 'ext'].includes(where) ? [] : branches[Number(where)];

    const getStationOptions = (stationIdList: string[]): Record<string, string> => {
        return stationIdList.reduce(
            (acc, cur) => ({
                ...acc,
                [cur]: stationList[cur]?.name.join(' - '),
            }),
            { '': t('AddStationModal.pleaseSelect') }
        );
    };

    const newBranchEndStationOptions = getStationOptions(dispatch(getNewBranchAllowedEnds()));

    const fields: RmgFieldsField[] = [
        {
            type: 'select',
            label: t('AddStationModal.where'),
            value: where,
            options: {
                ...branches.reduce(
                    (acc, cur, idx) => ({
                        ...acc,
                        [idx]:
                            idx === 0
                                ? t('AddStationModal.main')
                                : style !== RmgStyle.SHMetro || !isColineBranch(cur, stationList)
                                ? t('AddStationModal.branch') + ' ' + idx
                                : t('AddStationModal.external') + ' ' + idx,
                    }),
                    {}
                ),
                new: t('AddStationModal.new'),
                ext: t('AddStationModal.ext'),
            },
            disabledOptions: style === RmgStyle.SHMetro ? [] : ['ext'],
            onChange: value => handleSelectWhere(value as `${number}` | 'new'),
            minW: 'full',
        },
        {
            type: 'select',
            label: t('AddStationModal.from'),
            value: from,
            options: ['new', 'ext'].includes(where) ? newBranchEndStationOptions : getStationOptions(selectedBranch),
            disabledOptions: [''],
            onChange: value => handleSelectFrom(value as string),
            isInvalid: Boolean(fromError),
        },
        {
            type: 'select',
            label: t('AddStationModal.to'),
            value: to,
            options: ['new', 'ext'].includes(where) ? newBranchEndStationOptions : getStationOptions(selectedBranch),
            disabledOptions: [''],
            onChange: value => handleSelectTo(value as string),
            isInvalid: Boolean(toError),
        },
        {
            type: 'select',
            label: t('AddStationModal.position'),
            value: position,
            options: {
                upper: t('AddStationModal.upper'),
                lower: t('AddStationModal.lower'),
            },
            onChange: value => setPosition(value as 'upper' | 'lower'),
            minW: 'full',
            hidden: where !== 'new' || style === RmgStyle.SHMetro,
        },
    ];

    const handleSelectWhere = (value: `${number}` | 'new' | 'ext') => {
        setWhere(value);
        setFrom('');
        setTo('');
        setFromError('');
        setToError('');
    };

    const handleSelectFrom = (value: string) => {
        setFrom(value);
        setFromError('');

        if (value && to) {
            if (selectedBranch.length) {
                if (selectedBranch.indexOf(to) - selectedBranch.indexOf(value) === 1) {
                    setToError('');
                } else {
                    setToError("Must be next station of 'from'");
                }
            } else {
                setToError(dispatch(verifyNewBranchEnds(value, to)));
            }
        }
    };

    const handleSelectTo = (value: string) => {
        setTo(value);
        setToError('');

        if (from && value) {
            if (selectedBranch.length) {
                if (selectedBranch.indexOf(value) - selectedBranch.indexOf(from) === 1) {
                    setFromError('');
                } else {
                    setFromError("Must be previous station of 'to'");
                }
            } else {
                setFromError(dispatch(verifyNewBranchEnds(from, value)));
            }
        }
    };

    const handleSubmit = () => {
        let result: boolean;
        switch (where) {
            case 'ext':
                // SHMetro specific - treat lower branch as external line
                result = dispatch(addStation('new', from, to, 'lower'));
                break;
            case 'new':
                if (style === RmgStyle.SHMetro) {
                    result = dispatch(addStation('new', from, to, 'upper'));
                } else {
                    result = dispatch(addStation('new', from, to, position));
                }
                break;
            default:
                result = dispatch(addStation(where, from, to));
        }

        if (result) {
            onClose();
        }
    };

    const isSubmitDisabled = Boolean(!from || !to || fromError || toError);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{t('AddStationModal.title')}</ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                    <RmgFields fields={fields} />
                </ModalBody>

                <ModalFooter>
                    <Button
                        colorScheme="teal"
                        title={isSubmitDisabled ? fromError || toError : t('AddStationModal.submit')}
                        onClick={handleSubmit}
                        disabled={isSubmitDisabled}
                    >
                        {t('AddStationModal.submit')}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
