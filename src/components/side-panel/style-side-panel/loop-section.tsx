import React from 'react';
import { Box, Heading } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../redux';
import { setLoop, setLoopBank, setLoopLeftAndRightFactor, setLoopBottomFactor } from '../../../redux/param/action';
import { RmgFields, RmgFieldsField } from '@railmapgen/rmg-components';
import { useTranslation } from 'react-i18next';

export default function LoopSection() {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const { branches } = useAppSelector(state => state.helper);
    const { loop, loop_info } = useAppSelector(state => state.param);
    const { bank, left_and_right_factor, bottom_factor } = loop_info;

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
            isDisabled: true,
            onChange: checked => dispatch(setLoopBank(checked)),
            minW: 'full',
            oneLine: true,
        },
        {
            type: 'slider',
            label: t('StyleSidePanel.loop.leftRightFactor'),
            value: left_and_right_factor,
            min: 0,
            max: Math.floor((branches[0].length - bottom_factor * 2) / 2),
            onChange: val => dispatch(setLoopLeftAndRightFactor(Math.floor(val))),
            hidden: !loop,
        },
        {
            type: 'slider',
            label: t('StyleSidePanel.loop.bottomFactor'),
            value: bottom_factor,
            min: 0,
            max: Math.floor((branches[0].length - left_and_right_factor * 2) / 2),
            onChange: val => dispatch(setLoopBottomFactor(Math.floor(val))),
            hidden: !loop,
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
