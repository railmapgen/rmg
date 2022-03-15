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
import { useAppSelector } from '../../redux';

interface AddStationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddStationModal(props: AddStationModalProps) {
    const { isOpen, onClose } = props;

    const [where, setWhere] = useState('0');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');

    const [fromError, setFromError] = useState(false);
    const [toError, setToError] = useState(false);

    const stationList = useAppSelector(state => state.param.stn_list);
    const branches = useAppSelector(state => state.helper.branches);

    useEffect(() => {
        setFromError(false);

        if (from && to && where !== 'new') {
            const selectedBranch = branches[Number(where)];
            setToError(selectedBranch.indexOf(to) - selectedBranch.indexOf(from) !== 1);
        }
    }, [from]);

    useEffect(() => {
        setToError(false);

        if (from && to && where !== 'new') {
            const selectedBranch = branches[Number(where)];
            setFromError(selectedBranch.indexOf(to) - selectedBranch.indexOf(from) !== 1);
        }
    }, [to]);

    const getStationOptions = (stationIdList: string[]): Record<string, string> => {
        return stationIdList.reduce(
            (acc, cur) => ({
                ...acc,
                [cur]: stationList[cur]?.name[0],
            }),
            { '': 'Please select...' }
        );
    };

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
            onChange: value => setWhere(value as string),
        },
        {
            type: 'select',
            label: 'From',
            value: from,
            options: where === 'new' ? {} : getStationOptions(branches[Number(where)]),
            disabledOptions: [''],
            onChange: value => setFrom(value as string),
            isInvalid: fromError,
        },
        {
            type: 'select',
            label: 'To',
            value: to,
            options: where === 'new' ? {} : getStationOptions(branches[Number(where)]),
            disabledOptions: [''],
            onChange: value => setTo(value as string),
            isInvalid: toError,
        },
    ];

    const handleSubmit = () => {
        console.log(where, to, from);
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
