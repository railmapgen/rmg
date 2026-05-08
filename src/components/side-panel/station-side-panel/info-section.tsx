import classes from '../side-panel.module.css';
import {
    toggleStationSecondaryName,
    updateStationName,
    updateStationNum,
    updateStationSecondaryName,
} from '../../../redux/param/action';
import { useRootDispatch, useRootSelector } from '../../../redux';
import { RmgStyle } from '../../../constants/constants';
import { useTranslation } from 'react-i18next';
import { RMSection, RMSectionBody, RMSectionHeader } from '@railmapgen/mantine-components';
import { Group, Switch, TextInput, Title } from '@mantine/core';
import clsx from 'clsx';

export default function InfoSection() {
    const { t } = useTranslation();
    const dispatch = useRootDispatch();

    const selectedStation = useRootSelector(state => state.app.selectedStation);
    console.log('InfoSection:: Rendering for', selectedStation);
    const style = useRootSelector(state => state.param.style);
    const { num, localisedName, localisedSecondaryName } = useRootSelector(
        state => state.param.stn_list[selectedStation]
    );

    return (
        <RMSection>
            <RMSectionHeader>
                <Title order={3} size="h4">
                    {t('StationSidePanel.info.title')}
                </Title>
            </RMSectionHeader>

            <RMSectionBody className={clsx(classes['section-body'], classes.fields)}>
                <Group gap="xs">
                    {style === RmgStyle.GZMTR && (
                        <TextInput
                            label={t('StationSidePanel.info.num')}
                            value={num}
                            placeholder="01"
                            onChange={({ currentTarget: { value } }) =>
                                dispatch(updateStationNum(selectedStation, value))
                            }
                        />
                    )}
                    <TextInput
                        label={t('Chinese name')}
                        value={localisedName.zh ?? ''}
                        onChange={({ currentTarget: { value } }) =>
                            dispatch(updateStationName(selectedStation, 'zh', value))
                        }
                    />
                    <TextInput
                        label={t('English name')}
                        value={localisedName.en ?? ''}
                        onChange={({ currentTarget: { value } }) =>
                            dispatch(updateStationName(selectedStation, 'en', value))
                        }
                    />
                    {style === RmgStyle.GZMTR && (
                        <>
                            <Switch
                                label={t('Secondary names')}
                                checked={!!localisedSecondaryName}
                                onChange={({ currentTarget: { checked } }) =>
                                    dispatch(toggleStationSecondaryName(selectedStation, checked))
                                }
                            />
                            {localisedSecondaryName && (
                                <>
                                    <TextInput
                                        label={t('StationSidePanel.info.zhSecondary')}
                                        value={localisedSecondaryName?.zh ?? ''}
                                        placeholder="1号航站楼"
                                        onChange={({ currentTarget: { value } }) =>
                                            dispatch(updateStationSecondaryName(selectedStation, 'zh', value))
                                        }
                                    />
                                    <TextInput
                                        label={t('StationSidePanel.info.enSecondary')}
                                        value={localisedSecondaryName?.en ?? ''}
                                        placeholder="Terminal 1"
                                        onChange={({ currentTarget: { value } }) =>
                                            dispatch(updateStationSecondaryName(selectedStation, 'en', value))
                                        }
                                    />
                                </>
                            )}
                        </>
                    )}
                </Group>
            </RMSectionBody>
        </RMSection>
    );
}
