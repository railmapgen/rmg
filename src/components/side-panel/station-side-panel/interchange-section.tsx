import React, { Fragment } from 'react';
import { Button, Heading, VStack } from '@chakra-ui/react';
import { useAppSelector } from '../../../redux';
import InterchangeCard from '../interchange/interchange-card';
import { useDispatch } from 'react-redux';
import {
    addInterchange,
    removeInterchange,
    updateInterchange,
    updateStationOsiName,
} from '../../../redux/param/action';
import { InterchangeInfo, MonoColour } from '../../../constants/constants';
import { MdAdd } from 'react-icons/md';
import RmgFields, { RmgFieldsField } from '../../common/rmg-fields';

export default function InterchangeSection() {
    const dispatch = useDispatch();

    const selectedStation = useAppSelector(state => state.app.selectedStation);
    const theme = useAppSelector(state => state.param.theme);
    const { transfer } = useAppSelector(state => state.param.stn_list[selectedStation]);

    const getOSINameFields = (setIndex: number): RmgFieldsField[] => [
        {
            type: 'input',
            label: 'Station Chinese name',
            value: transfer.osi_names[setIndex]?.[0],
            onChange: value =>
                dispatch(updateStationOsiName(selectedStation, setIndex, [value, transfer.osi_names[setIndex]?.[1]])),
        },
        {
            type: 'input',
            label: 'Station English name',
            value: transfer.osi_names[setIndex]?.[1],
            onChange: value =>
                dispatch(updateStationOsiName(selectedStation, setIndex, [transfer.osi_names[setIndex]?.[0], value])),
        },
    ];

    const handleAdd = (i: number) => (info: InterchangeInfo) => {
        dispatch(addInterchange(selectedStation, i, info));
    };

    const handleDelete = (i: number) => (j: number) => {
        dispatch(removeInterchange(selectedStation, i, j));
    };

    const handleUpdate = (i: number) => (j: number, info: InterchangeInfo) => {
        dispatch(updateInterchange(selectedStation, i, j, info));
    };

    const handleAddInterchangeGroup = () => {
        dispatch(
            addInterchange(selectedStation, transfer.info.length, [theme[0], '', '#AAAAAA', MonoColour.white, '', ''])
        );
    };

    return (
        <VStack align="flex-start" p={1}>
            <Heading as="h5" size="sm">
                Interchange
            </Heading>

            {transfer.info.map((infoList, i) => (
                <Fragment key={i}>
                    <Heading as="h6" size="xs">
                        {i === 0
                            ? 'Within-station interchange'
                            : i === 1
                            ? 'Out-of-station interchange'
                            : 'Out-of-system interchange'}
                    </Heading>

                    {i !== 0 && <RmgFields fields={getOSINameFields(i - 1)} />}

                    <InterchangeCard
                        interchangeList={infoList}
                        onAdd={handleAdd(i)}
                        onDelete={handleDelete(i)}
                        onUpdate={handleUpdate(i)}
                    />
                </Fragment>
            ))}

            {transfer.info.length < 3 && (
                <Button
                    size="xs"
                    variant="ghost"
                    alignSelf="flex-end"
                    leftIcon={<MdAdd />}
                    onClick={handleAddInterchangeGroup}
                >
                    Add interchange group
                </Button>
            )}
        </VStack>
    );
}
