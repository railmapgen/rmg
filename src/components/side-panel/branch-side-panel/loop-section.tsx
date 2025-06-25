import classes from '../side-panel.module.css';
import { useTranslation } from 'react-i18next';
import { useRootDispatch, useRootSelector } from '../../../redux';
import { FALSE, RmgStyle, TRUE } from '../../../constants/constants';
import {
    setLoopBank,
    setLoopBottomFactor,
    setLoopClockwise,
    setLoopLeftAndRightFactor,
    setLoopMidpointStation,
} from '../../../redux/param/param-slice';
import {
    RMLabelledSegmentedControl,
    RMLabelledSlider,
    RMSection,
    RMSectionBody,
    RMSectionHeader,
} from '@railmapgen/mantine-components';
import { Checkbox, Group, Select, Title } from '@mantine/core';
import { MdOutlineAdd, MdOutlineRemove } from 'react-icons/md';
import clsx from 'clsx';

export default function LoopSection() {
    const { t } = useTranslation();
    const dispatch = useRootDispatch();

    const { branches } = useRootSelector(state => state.helper);
    const { loop_info, style, stn_list: stationList } = useRootSelector(state => state.param);
    const { bank, left_and_right_factor, bottom_factor, clockwise } = loop_info;

    // loop line with 2 branches has no bottom_factor and a specialized left_and_right_factor_max
    const arc: 'major' | 'minor' = 'minor';
    const branch_stn_ids = branches
        .flat()
        .filter(
            (
                o => v =>
                    (o[v] = (o[v] || 0) + 1) === 2
            )({} as { [stn_id: string]: number })
        ) // count each occurrence
        .filter(stn_id => !['linestart', 'lineend'].includes(stn_id)); // find branch stations
    const _ = Math.abs(branches[0].indexOf(branch_stn_ids[0]) - branches[0].indexOf(branch_stn_ids[1]));
    const left_and_right_factor_max =
        branches.length >= 2
            ? // top length is fixed, change left_and_right_factor only
              (arc === 'minor' ? Math.min : Math.max)(branches[0].length - 2 - _, _)
            : Math.floor((branches[0].length - 2 - bottom_factor * 2) / 2);

    return (
        <RMSection>
            <RMSectionHeader>
                <Title order={3} size="h4">
                    {t('StyleSidePanel.loop.title')}
                </Title>
            </RMSectionHeader>

            <RMSectionBody className={clsx(classes['section-body'], classes.fields)}>
                {style === RmgStyle.SHMetro && (
                    <Group gap="xs">
                        <Checkbox
                            label={t('StyleSidePanel.loop.isBank')}
                            checked={bank}
                            onChange={({ currentTarget: { checked } }) => dispatch(setLoopBank(checked))}
                            style={{ width: '100%', flexBasis: '100%' }}
                        />
                        <RMLabelledSlider
                            fieldLabel={t('StyleSidePanel.loop.leftRightFactor')}
                            defaultValue={left_and_right_factor}
                            min={0}
                            max={left_and_right_factor_max}
                            step={1}
                            onChangeEnd={value => dispatch(setLoopLeftAndRightFactor(Math.floor(value)))}
                            withExternalControls
                            leftIcon={<MdOutlineRemove />}
                            leftIconLabel={t('Decrease')}
                            rightIcon={<MdOutlineAdd />}
                            rightIconLabel={t('Increase')}
                        />
                        {branches.length <= 2 && (
                            <RMLabelledSlider
                                fieldLabel={t('StyleSidePanel.loop.bottomFactor')}
                                defaultValue={bottom_factor}
                                min={0}
                                max={Math.floor((branches[0].length - 2 - left_and_right_factor * 2) / 2)}
                                step={1}
                                onChangeEnd={value => dispatch(setLoopBottomFactor(Math.floor(value)))}
                                withExternalControls
                                leftIcon={<MdOutlineRemove />}
                                leftIconLabel={t('Decrease')}
                                rightIcon={<MdOutlineAdd />}
                                rightIconLabel={t('Increase')}
                            />
                        )}
                    </Group>
                )}
                {style === RmgStyle.GZMTR && (
                    <Group gap="xs">
                        <RMLabelledSegmentedControl
                            label={t('Loop direction')}
                            data={[
                                { label: t('Anticlockwise'), value: FALSE },
                                { label: t('Clockwise'), value: TRUE },
                            ]}
                            value={clockwise?.toString() ?? FALSE}
                            onChange={value => dispatch(setLoopClockwise(value === TRUE))}
                        />
                        <Select
                            label={t('Midpoint station')}
                            value={loop_info.midpoint_station}
                            data={branches[0].slice(1, -1).map(value => {
                                const { zh, en } = stationList[value].localisedName;
                                return { value, label: `${zh}/${en}` };
                            })}
                            onChange={value => dispatch(setLoopMidpointStation(value as string))}
                            allowDeselect={false}
                            searchable
                            style={{ width: '100%', flexBasis: '100%' }}
                        />
                    </Group>
                )}
            </RMSectionBody>
        </RMSection>
    );
}
