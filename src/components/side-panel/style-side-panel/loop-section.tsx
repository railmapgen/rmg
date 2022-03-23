import React from 'react';
import { Box, Checkbox, Heading } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../redux';
import { setLoop, setLoopBank, setLoopLeftAndRightFactor, setLoopBottomFactor } from '../../../redux/param/action';
import { RmgFields, RmgFieldsField } from '@railmapgen/rmg-components';

export default function LoopSection() {
    const dispatch = useDispatch();

    const { branches } = useAppSelector(state => state.helper);
    const { loop, loop_info } = useAppSelector(state => state.param);
    const { bank, left_and_right_factor, bottom_factor } = loop_info;

    const fields: RmgFieldsField[] = [
        {
            type: 'switch',
            label: 'Treat this line as a loop line',
            isChecked: loop,
            onChange: checked => dispatch(setLoop(checked)),
            minW: 'full',
            oneLine: true,
        },
        {
            type: 'custom',
            label: 'Bank the closed rectangular path in railmap',
            component: (
                <Checkbox
                    variant="flushed"
                    size="sm"
                    h={6}
                    defaultChecked={bank}
                    isDisabled={true}
                    onChange={({ target: { checked } }) => dispatch(setLoopBank(checked))}
                />
            ),
        },
        {
            type: 'slider',
            label: 'left_and_right_factor',
            value: left_and_right_factor,
            min: 0,
            max: Math.floor((branches[0].length - bottom_factor * 2) / 2),
            onChange: val => dispatch(setLoopLeftAndRightFactor(Math.floor(val))),
            hidden: !loop,
        },
        {
            type: 'slider',
            label: 'bottom_factor',
            value: bottom_factor,
            min: 1,
            max: Math.floor((branches[0].length - left_and_right_factor * 2) / 2),
            onChange: val => dispatch(setLoopBottomFactor(Math.floor(val))),
            hidden: !loop,
        },
    ];

    return (
        <Box p={1}>
            <Heading as="h5" size="sm">
                Loop
            </Heading>

            <RmgFields fields={fields} />
        </Box>
    );
}
