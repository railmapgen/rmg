import React, { Fragment } from 'react';
import { Button, Heading, VStack } from '@chakra-ui/react';
import { useAppSelector } from '../../../../redux';
import InterchangeCard from './interchange-card';
import { useDispatch } from 'react-redux';
import { addInterchange, removeInterchange, updateInterchange } from '../../../../redux/param/action';
import { InterchangeInfo, MonoColour } from '../../../../constants/constants';
import { MdAdd } from 'react-icons/md';

export default function InterchangeSection() {
    const dispatch = useDispatch();

    const selectedStation = useAppSelector(state => state.app.selectedStation);
    const theme = useAppSelector(state => state.param.theme);
    const { transfer } = useAppSelector(state => state.param.stn_list[selectedStation]);

    const handleAdd = (i: number) => (info: InterchangeInfo) => {
        dispatch(addInterchange(selectedStation, i, info));
    };

    const handleDelete = (i: number) => (j: number) => {
        dispatch(removeInterchange(selectedStation, i, j));
    };

    const handleUpdate = (i: number) => (j: number, info: InterchangeInfo) => {
        dispatch(updateInterchange(selectedStation, i, j, info));
    };

    const handleAddOSIGroup = () => {
        dispatch(
            addInterchange(selectedStation, transfer.info.length, [theme[0], '', '#AAAAAA', MonoColour.white, '', ''])
        );
    };

    return (
        <VStack align="flex-start">
            {transfer.info.map((infoList, i) => (
                <Fragment key={i}>
                    <Heading as="h5" size="sm">
                        {i === 0 ? 'Within-station interchange' : `Out-of-station interchange (Group ${i})`}
                    </Heading>

                    <InterchangeCard
                        interchangeList={infoList}
                        onAdd={handleAdd(i)}
                        onDelete={handleDelete(i)}
                        onUpdate={handleUpdate(i)}
                    />
                </Fragment>
            ))}

            <Button size="xs" variant="ghost" alignSelf="flex-end" leftIcon={<MdAdd />} onClick={handleAddOSIGroup}>
                Add OSI group
            </Button>
        </VStack>
    );
}
