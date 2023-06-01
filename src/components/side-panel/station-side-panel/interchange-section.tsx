import React, { Fragment } from 'react';
import { Button, Flex, Heading, VStack } from '@chakra-ui/react';
import { useRootDispatch, useRootSelector } from '../../../redux';
import InterchangeCard from './interchange-card';
import {
    addInterchange,
    removeInterchange,
    updateInterchange,
    updateStationOsiName,
    updateStationPaidArea,
    updateStationTickDirection,
} from '../../../redux/param/action';
import { ExtendedInterchangeInfo, RmgStyle, ShortDirection } from '../../../constants/constants';
import { MdAdd } from 'react-icons/md';
import { RmgButtonGroup, RmgFields, RmgFieldsField } from '@railmapgen/rmg-components';
import { useTranslation } from 'react-i18next';
import { MonoColour } from '@railmapgen/rmg-palette-resources';

export default function InterchangeSection() {
    const { t } = useTranslation();
    const dispatch = useRootDispatch();

    const selectedStation = useRootSelector(state => state.app.selectedStation);
    const { theme, style } = useRootSelector(state => state.param);
    const { transfer } = useRootSelector(state => state.param.stn_list[selectedStation]);

    const getOSINameFields = (setIndex: number): RmgFieldsField[] => [
        {
            type: 'input',
            label: t('Station Chinese name'),
            value: transfer.groups[setIndex].name?.[0] ?? '',
            hidden: ![RmgStyle.MTR].includes(style),
            onChange: value =>
                dispatch(
                    updateStationOsiName(selectedStation, setIndex, [value, transfer.groups[setIndex].name?.[1] ?? ''])
                ),
        },
        {
            type: 'input',
            label: t('Station English name'),
            value: transfer.groups[setIndex].name?.[1] ?? '',
            hidden: ![RmgStyle.MTR].includes(style),
            onChange: value =>
                dispatch(
                    updateStationOsiName(selectedStation, setIndex, [transfer.groups[setIndex].name?.[0] ?? '', value])
                ),
        },
        {
            type: 'switch',
            label: t('Paid area'),
            isChecked: transfer.paid_area,
            onChange: checked => dispatch(updateStationPaidArea(selectedStation, checked)),
            hidden: ![RmgStyle.MTR].includes(style) || setIndex === 0,
            oneLine: true,
        },
    ];

    const handleAdd = (i: number) => (info: ExtendedInterchangeInfo) => {
        dispatch(addInterchange(selectedStation, i, info));
    };

    const handleDelete = (i: number) => (j: number) => {
        dispatch(removeInterchange(selectedStation, i, j));
    };

    const handleUpdate = (i: number) => (j: number, info: ExtendedInterchangeInfo) => {
        dispatch(updateInterchange(selectedStation, i, j, info));
    };

    const handleAddInterchangeGroup = () => {
        dispatch(
            addInterchange(selectedStation, transfer.groups.length, {
                theme: [theme[0], '', '#AAAAAA', MonoColour.white],
                name: ['', ''],
            })
        );
    };

    return (
        <VStack align="flex-start" p={1}>
            <Flex w="100%">
                <Heading as="h5" size="sm" mr="auto">
                    {t('StationSidePanel.interchange.title')}
                </Heading>

                {style === RmgStyle.MTR && (
                    <RmgButtonGroup
                        selections={[
                            { label: t('Text on the left'), value: ShortDirection.left },
                            { label: t('Text on the right'), value: ShortDirection.right },
                        ]}
                        defaultValue={transfer.tick_direc}
                        onChange={value => dispatch(updateStationTickDirection(selectedStation, value))}
                    />
                )}
            </Flex>

            {transfer.groups.map((group, i) => (
                <Fragment key={i}>
                    <Heading as="h6" size="xs">
                        {i === 0
                            ? t('StationSidePanel.interchange.within')
                            : i === 1
                            ? t('StationSidePanel.interchange.outStation')
                            : t('StationSidePanel.interchange.outSystem')}
                    </Heading>

                    {i !== 0 && <RmgFields fields={getOSINameFields(i)} />}

                    <InterchangeCard
                        interchangeList={group.lines}
                        onAdd={handleAdd(i)}
                        onDelete={handleDelete(i)}
                        onUpdate={handleUpdate(i)}
                    />
                </Fragment>
            ))}

            {transfer.groups.length < 3 && (
                <Button
                    size="xs"
                    variant="ghost"
                    alignSelf="flex-end"
                    leftIcon={<MdAdd />}
                    onClick={handleAddInterchangeGroup}
                >
                    {t('StationSidePanel.interchange.addGroup')}
                </Button>
            )}
        </VStack>
    );
}
