import React, { useEffect, useState } from 'react';
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
import { RmgStyle } from '../../constants/constants';
import { isColineBranch } from '../../redux/param/coline-action';
import { useTranslation } from 'react-i18next';
import { addStationToExistingBranch } from '../../redux/param/add-station-action';

interface AddStationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddStationModal(props: AddStationModalProps) {
    const { isOpen, onClose } = props;
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const selectedBranch = useAppSelector(state => state.app.selectedBranch);
    const { style, stn_list: stationList } = useAppSelector(state => state.param);
    const branches = useAppSelector(state => state.helper.branches);

    const [where, setWhere] = useState(selectedBranch);
    const [preposition, setPreposition] = useState<'before' | 'after'>('before');
    const [pivot, setPivot] = useState('');

    useEffect(() => {
        setWhere(selectedBranch);
    }, [selectedBranch]);

    const selectableStations = branches[Number(where)]?.slice(1, -1) ?? [];

    const getStationOptions = (stationIdList: string[]): Record<string, string> => {
        return stationIdList.reduce(
            (acc, cur) => ({
                ...acc,
                [cur]: stationList[cur]?.name.join(' - '),
            }),
            { '': t('AddStationModal.pleaseSelect') }
        );
    };

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
            },
            onChange: value => handleSelectWhere(value as number),
            minW: 'full',
        },
        {
            type: 'select',
            label: t('AddStationModal.preposition'),
            value: preposition,
            options: {
                before: t('AddStationModal.before'),
                after: t('AddStationModal.after'),
            },
            onChange: value => setPreposition(value as 'before' | 'after'),
        },
        {
            type: 'select',
            label: t('AddStationModal.pivot'),
            value: pivot,
            options: getStationOptions(selectableStations),
            disabledOptions: [''],
            onChange: value => setPivot(value as string),
        },
    ];

    const handleSelectWhere = (value: number) => {
        setWhere(value);
        setPivot('');
    };

    const handleSubmit = () => {
        const result = dispatch(addStationToExistingBranch(where, preposition, pivot));
        if (result) {
            onClose();
        }
    };

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
                    <Button colorScheme="teal" onClick={handleSubmit} disabled={!pivot}>
                        {t('AddStationModal.submit')}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
