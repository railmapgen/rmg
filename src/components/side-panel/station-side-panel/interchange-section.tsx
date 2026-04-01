import classes from '../side-panel.module.css';
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
import { MdOutlineAdd } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { MonoColour } from '@railmapgen/rmg-palette-resources';
import { RMLabelledSegmentedControl, RMSection, RMSectionBody, RMSectionHeader } from '@railmapgen/mantine-components';
import { Button, Group, Stack, Switch, TextInput, Title } from '@mantine/core';
import clsx from 'clsx';

export default function InterchangeSection() {
    const { t } = useTranslation();
    const dispatch = useRootDispatch();

    const selectedStation = useRootSelector(state => state.app.selectedStation);
    const { theme, style } = useRootSelector(state => state.param);
    const { transfer } = useRootSelector(state => state.param.stn_list[selectedStation]);

    const getOSINameFields = (setIndex: number) => (
        <Group gap="xs" wrap="nowrap">
            <TextInput
                size="xs"
                label={t('Station Chinese name')}
                value={transfer.groups[setIndex].name?.[0] ?? ''}
                onChange={({ currentTarget: { value } }) =>
                    dispatch(
                        updateStationOsiName(selectedStation, setIndex, [
                            value,
                            transfer.groups[setIndex].name?.[1] ?? '',
                        ])
                    )
                }
            />
            <TextInput
                size="xs"
                label={t('Station English name')}
                value={transfer.groups[setIndex].name?.[1] ?? ''}
                onChange={({ currentTarget: { value } }) =>
                    dispatch(
                        updateStationOsiName(selectedStation, setIndex, [
                            transfer.groups[setIndex].name?.[0] ?? '',
                            value,
                        ])
                    )
                }
            />
            {setIndex !== 0 && (
                <Switch
                    size="xs"
                    label={t('Paid area')}
                    checked={transfer.paid_area}
                    onChange={({ currentTarget: { checked } }) =>
                        dispatch(updateStationPaidArea(selectedStation, checked))
                    }
                    style={{ minWidth: 100 }}
                />
            )}
        </Group>
    );

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
        <RMSection>
            <RMSectionHeader>
                <Title order={3} size="h4">
                    {t('StationSidePanel.interchange.title')}
                </Title>
            </RMSectionHeader>

            <RMSectionBody className={clsx(classes['section-body'], classes.fields)}>
                {style === RmgStyle.MTR && (
                    <Group gap="xs">
                        <RMLabelledSegmentedControl
                            label={t('Text position')}
                            value={transfer.tick_direc}
                            data={[
                                { label: t('On the left'), value: ShortDirection.left },
                                { label: t('On the right'), value: ShortDirection.right },
                            ]}
                            onChange={value =>
                                dispatch(updateStationTickDirection(selectedStation, value as ShortDirection))
                            }
                        />
                    </Group>
                )}

                <Stack gap="xs">
                    {transfer.groups.map((group, i) => (
                        <InterchangeCard
                            key={i}
                            title={
                                i === 0
                                    ? t('StationSidePanel.interchange.within')
                                    : i === 1
                                      ? t('StationSidePanel.interchange.outStation')
                                      : t('StationSidePanel.interchange.outSystem')
                            }
                            interchangeList={group.lines ?? []}
                            beforeChildren={i !== 0 && style === RmgStyle.MTR && getOSINameFields(i)}
                            onAdd={handleAdd(i)}
                            onDelete={handleDelete(i)}
                            onUpdate={handleUpdate(i)}
                        />
                    ))}
                </Stack>

                {transfer.groups.length < 3 && (
                    <Group gap="xs">
                        <Button variant="default" leftSection={<MdOutlineAdd />} onClick={handleAddInterchangeGroup}>
                            {t('StationSidePanel.interchange.addGroup')}
                        </Button>
                    </Group>
                )}
            </RMSectionBody>
        </RMSection>
    );
}
