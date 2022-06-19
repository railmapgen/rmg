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
import { InterchangeInfo, MonoColour, RmgStyle, ShortDirection } from '../../../constants/constants';
import { MdAdd } from 'react-icons/md';
import { RmgFields, RmgFieldsField } from '@railmapgen/rmg-components';
import { useTranslation } from 'react-i18next';
import RmgButtonGroup from '../../common/rmg-button-group';

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
            value: transfer.osi_names[setIndex]?.[0],
            hidden: ![RmgStyle.MTR].includes(style),
            onChange: value =>
                dispatch(updateStationOsiName(selectedStation, setIndex, [value, transfer.osi_names[setIndex]?.[1]])),
        },
        {
            type: 'input',
            label: t('Station English name'),
            value: transfer.osi_names[setIndex]?.[1],
            hidden: ![RmgStyle.MTR].includes(style),
            onChange: value =>
                dispatch(updateStationOsiName(selectedStation, setIndex, [transfer.osi_names[setIndex]?.[0], value])),
        },
        {
            type: 'switch',
            label: t('Paid area'),
            isChecked: transfer.paid_area,
            onChange: checked => dispatch(updateStationPaidArea(selectedStation, checked)),
            hidden: ![RmgStyle.MTR].includes(style) || setIndex !== 0,
            oneLine: true,
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

            {transfer.info.map((infoList, i) => (
                <Fragment key={i}>
                    <Heading as="h6" size="xs">
                        {i === 0
                            ? t('StationSidePanel.interchange.within')
                            : i === 1
                            ? t('StationSidePanel.interchange.outStation')
                            : t('StationSidePanel.interchange.outSystem')}
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
                    {t('StationSidePanel.interchange.addGroup')}
                </Button>
            )}
        </VStack>
    );
}
