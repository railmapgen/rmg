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
import { addStation, getNewBranchAllowedEnds, verifyNewBranchEnds } from '../../redux/param/add-station-action';

interface AddStationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddStationModal(props: AddStationModalProps) {
    const { isOpen, onClose } = props;
    const dispatch = useAppDispatch();

    const [where, setWhere] = useState<`${number}` | 'new'>('0');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [position, setPosition] = useState<'upper' | 'lower'>('upper');

    const [fromError, setFromError] = useState(false);
    const [toError, setToError] = useState(false);

    const stationList = useAppSelector(state => state.param.stn_list);
    const branches = useAppSelector(state => state.helper.branches);

    const selectedBranch = where === 'new' ? [] : branches[Number(where)];

    useEffect(() => {
        setFromError(false);
        if (from && to) {
            if (selectedBranch.length) {
                setToError(selectedBranch.indexOf(to) - selectedBranch.indexOf(from) !== 1);
            } else {
                const newBranchEndsVerification = dispatch(verifyNewBranchEnds(from, to));
                if (newBranchEndsVerification) {
                    console.log(newBranchEndsVerification);
                    setToError(true);
                } else {
                    setToError(false);
                }
            }
        }
    }, [from]);

    useEffect(() => {
        setToError(false);
        if (from && to) {
            if (selectedBranch.length) {
                setFromError(selectedBranch.indexOf(to) - selectedBranch.indexOf(from) !== 1);
            } else {
                const newBranchEndsVerification = dispatch(verifyNewBranchEnds(from, to));
                if (newBranchEndsVerification) {
                    console.log(newBranchEndsVerification);
                    setFromError(true);
                } else {
                    setFromError(false);
                }
            }
        }
    }, [to]);

    useEffect(() => {
        if (from && to && selectedBranch.length) {
            const isError = selectedBranch.indexOf(to) - selectedBranch.indexOf(from) !== 1;
            setFromError(isError);
            setToError(isError);
        }
    }, [selectedBranch?.toString()]);

    const getStationOptions = (stationIdList: string[]): Record<string, string> => {
        return stationIdList.reduce(
            (acc, cur) => ({
                ...acc,
                [cur]: stationList[cur]?.name[0],
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
                        [idx]: idx === 0 ? 'Main line' : 'Branch ' + idx,
                    }),
                    {}
                ),
                new: 'Create a new branch',
            },
            onChange: value => setWhere(value as `${number}` | 'new'),
        },
        {
            type: 'select',
            label: 'From',
            value: from,
            options: where === 'new' ? newBranchEndStationOptions : getStationOptions(selectedBranch),
            disabledOptions: [''],
            onChange: value => setFrom(value as string),
            isInvalid: fromError,
        },
        {
            type: 'select',
            label: 'To',
            value: to,
            options: where === 'new' ? newBranchEndStationOptions : getStationOptions(selectedBranch),
            disabledOptions: [''],
            onChange: value => setTo(value as string),
            isInvalid: toError,
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
            hidden: where !== 'new',
        },
    ];

    const handleSubmit = () => {
        let result: boolean;
        if (where !== 'new') {
            result = dispatch(addStation(where, from, to));
        } else {
            result = dispatch(addStation(where, from, to, position));
        }

        if (result) {
            onClose();
        }
    };

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
                    <Button colorScheme="teal" onClick={handleSubmit} disabled={!from || !to || fromError || toError}>
                        Submit
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
