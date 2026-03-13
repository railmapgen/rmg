import classes from '../side-panel.module.css';
import { useTranslation } from 'react-i18next';
import { FACILITIES, Facilities, FALSE, RmgStyle, Services, TEMP, TRUE } from '../../../constants/constants';
import { useRootDispatch, useRootSelector } from '../../../redux';
import {
    updateStationCharacterSpacing,
    updateStationCharacterSpacingToAll,
    updateStationFacility,
    updateStationIntPadding,
    updateStationIntPaddingToAll,
    updateStationLoopPivot,
    updateStationOneLine,
    updateStationServices,
    updateStationUnderConstruction,
} from '../../../redux/param/action';
import { RMLabelledSegmentedControl, RMSection, RMSectionBody, RMSectionHeader } from '@railmapgen/mantine-components';
import { Button, Group, MultiSelect, NativeSelect, NumberInput, Switch, Title } from '@mantine/core';
import clsx from 'clsx';

export default function MoreSection() {
    const { t } = useTranslation();
    const dispatch = useRootDispatch();

    const selectedStation = useRootSelector(state => state.app.selectedStation);
    const { style, loop } = useRootSelector(state => state.param);
    const { services, facility, loop_pivot, one_line, int_padding, character_spacing, underConstruction } =
        useRootSelector(state => state.param.stn_list[selectedStation]);

    const serviceSelections = Object.values(Services).map(service => {
        return {
            label: t('StationSidePanel.more.' + service),
            value: service,
            disabled:
                (service === Services.local && style !== RmgStyle.SHMetro) ||
                (service === Services.direct && style !== RmgStyle.SHMetro),
        };
    });

    const mtrFacilityOptions = [
        { value: '', label: t('None') },
        ...Object.entries(FACILITIES)
            .filter(([f]) => !['railway'].includes(f))
            .map(([f, name]) => ({ value: f, label: t(name) })),
    ];
    const shmetroFacilityOptions = [
        { value: '', label: t('None') },
        ...Object.entries(FACILITIES)
            .filter(([f]) => !['np360'].includes(f))
            .map(([f, name]) => ({ value: f, label: t(name) })),
    ];

    return (
        <RMSection>
            <RMSectionHeader>
                <Title order={3} size="h4">
                    {t('StationSidePanel.more.title')}
                </Title>
            </RMSectionHeader>

            <RMSectionBody className={clsx(classes['section-body'], classes.fields)}>
                <Group gap="xs">
                    {[RmgStyle.GZMTR, RmgStyle.SHMetro].includes(style) && (
                        <MultiSelect
                            label={t('StationSidePanel.more.service')}
                            value={services}
                            data={serviceSelections}
                            onChange={services =>
                                dispatch(updateStationServices(selectedStation, services as Services[]))
                            }
                            style={{ width: '100%', flexBasis: '100%' }}
                        />
                    )}
                    {style === RmgStyle.GZMTR && (
                        <RMLabelledSegmentedControl
                            label={t('Under construction')}
                            value={String(underConstruction ?? false)}
                            data={[
                                { label: t('No'), value: FALSE },
                                { label: t('Temporary'), value: TEMP },
                                { label: t('Yes'), value: TRUE },
                            ]}
                            onChange={value =>
                                dispatch(
                                    updateStationUnderConstruction(
                                        selectedStation,
                                        value === TRUE ? true : value === FALSE ? false : TEMP
                                    )
                                )
                            }
                        />
                    )}
                    {[RmgStyle.MTR, RmgStyle.SHMetro].includes(style) && (
                        <NativeSelect
                            label={t('StationSidePanel.more.facility')}
                            value={facility ?? ''}
                            data={style === RmgStyle.MTR ? mtrFacilityOptions : shmetroFacilityOptions}
                            onChange={({ currentTarget: { value } }) =>
                                dispatch(updateStationFacility(selectedStation, value as Facilities | ''))
                            }
                        />
                    )}
                    {style === RmgStyle.SHMetro && (
                        <>
                            <Switch
                                label={t('StationSidePanel.more.oneLine')}
                                checked={one_line}
                                onChange={({ currentTarget: { checked } }) =>
                                    dispatch(updateStationOneLine(selectedStation, checked))
                                }
                                style={{ width: '100%', flexBasis: '100%' }}
                            />
                            <NumberInput
                                label={t('StationSidePanel.more.intPadding')}
                                value={int_padding}
                                allowDecimal={false}
                                onChange={value => dispatch(updateStationIntPadding(selectedStation, Number(value)))}
                                rightSection={
                                    <Button
                                        variant="light"
                                        w={170}
                                        onClick={() => dispatch(updateStationIntPaddingToAll(selectedStation))}
                                    >
                                        {t('StationSidePanel.more.intPaddingApplyGlobal')}
                                    </Button>
                                }
                                rightSectionWidth={170}
                                style={{ width: '100%', flexBasis: '100%' }}
                            />
                        </>
                    )}
                    {[RmgStyle.GZMTR, RmgStyle.SHMetro].includes(style) && loop && (
                        <Switch
                            label={t('StationSidePanel.more.pivot')}
                            checked={loop_pivot}
                            onChange={({ currentTarget: { checked } }) =>
                                dispatch(updateStationLoopPivot(selectedStation, checked))
                            }
                        />
                    )}
                    {style === RmgStyle.SHSuburbanRailway && (
                        <NumberInput
                            label={t('StationSidePanel.more.characterSpacing')}
                            value={character_spacing}
                            allowDecimal={false}
                            onChange={value => dispatch(updateStationCharacterSpacing(selectedStation, Number(value)))}
                            rightSection={
                                <Button
                                    variant="light"
                                    w={170}
                                    onClick={() => dispatch(updateStationCharacterSpacingToAll(selectedStation))}
                                >
                                    {t('StationSidePanel.more.intPaddingApplyGlobal')}
                                </Button>
                            }
                            rightSectionWidth={170}
                            className="mw-full"
                        />
                    )}
                </Group>
            </RMSectionBody>
        </RMSection>
    );
}
