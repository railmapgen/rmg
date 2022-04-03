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

interface AddStationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddStationModal(props: AddStationModalProps) {
    const { isOpen, onClose } = props;
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
            { '': 'Please select...' }
        );
    };

    const newBranchEndStationOptions = getStationOptions(dispatch(getNewBranchAllowedEnds()));

    const fields: RmgFieldsField[] = [
        {
            type: 'select',
            label: 'Where',
            value: where,
            options: {
                ...branches.reduce(
                    (acc, cur, idx) => ({
                        ...acc,
                        [idx]:
                            idx === 0
                                ? 'Main line'
                                : style !== RmgStyle.SHMetro || !isColineBranch(cur, stationList)
                                ? 'Branch ' + idx
                                : 'External line ' + idx,
                    }),
                    {}
                ),
                new: 'Create a new branch',
                ext: 'Create an external line',
            },
            disabledOptions: style === RmgStyle.SHMetro ? [] : ['ext'],
            onChange: value => handleSelectWhere(value as `${number}` | 'new'),
            minW: 'full',
        },
        {
            type: 'select',
            label: 'From',
            value: from,
            options: ['new', 'ext'].includes(where) ? newBranchEndStationOptions : getStationOptions(selectedBranch),
            disabledOptions: [''],
            onChange: value => handleSelectFrom(value as string),
            isInvalid: Boolean(fromError),
        },
        {
            type: 'select',
            label: 'To',
            value: to,
            options: ['new', 'ext'].includes(where) ? newBranchEndStationOptions : getStationOptions(selectedBranch),
            disabledOptions: [''],
            onChange: value => handleSelectTo(value as string),
            isInvalid: Boolean(toError),
        },
        {
            type: 'select',
            label: 'Position',
            value: position,
            options: {
                upper: 'Upper',
                lower: 'Lower',
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
                <ModalHeader>Add station</ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                    <RmgFields fields={fields} />
                </ModalBody>

                <ModalFooter>
                    <Button
                        colorScheme="teal"
                        title={isSubmitDisabled ? fromError || toError : 'Submit'}
                        onClick={handleSubmit}
                        disabled={isSubmitDisabled}
                    >
                        Submit
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
