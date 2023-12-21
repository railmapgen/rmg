import React from 'react';
import { Box, Heading } from '@chakra-ui/react';
import { useRootDispatch, useRootSelector } from '../../../redux';
import { setLoop, setLoopBank, setLoopBottomFactor, setLoopLeftAndRightFactor } from '../../../redux/param/param-slice';
import { RmgFields, RmgFieldsField } from '@railmapgen/rmg-components';
import { useTranslation } from 'react-i18next';

export default function LoopSection() {
    const { t } = useTranslation();
    const dispatch = useRootDispatch();

    const { branches } = useRootSelector(state => state.helper);
    const { loop, loop_info } = useRootSelector(state => state.param);
    const { bank, left_and_right_factor, bottom_factor } = loop_info;

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

    const fields: RmgFieldsField[] = [
        {
            type: 'switch',
            label: t('StyleSidePanel.loop.isLoop'),
            isChecked: loop,
            onChange: checked => dispatch(setLoop(checked)),
            minW: 'full',
            oneLine: true,
        },
        {
            type: 'switch',
            label: t('StyleSidePanel.loop.isBank'),
            isChecked: bank,
            onChange: checked => dispatch(setLoopBank(checked)),
            minW: 'full',
            oneLine: true,
            hidden: !loop,
        },
        {
            type: 'slider',
            label: t('StyleSidePanel.loop.leftRightFactor'),
            value: left_and_right_factor,
            min: 0,
            max: left_and_right_factor_max,
            onChange: val => dispatch(setLoopLeftAndRightFactor(Math.floor(val))),
            hidden: !loop,
        },
        {
            type: 'slider',
            label: t('StyleSidePanel.loop.bottomFactor'),
            value: bottom_factor,
            min: 0,
            max: Math.floor((branches[0].length - 2 - left_and_right_factor * 2) / 2),
            onChange: val => dispatch(setLoopBottomFactor(Math.floor(val))),
            hidden: !loop || (loop && branches.length > 2),
        },
    ];

    return (
        <Box p={1}>
            <Heading as="h5" size="sm">
                {t('StyleSidePanel.loop.title')}
            </Heading>

            <RmgFields fields={fields} />
        </Box>
    );
}
