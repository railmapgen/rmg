import React from 'react';
import { Box, Heading } from '@chakra-ui/react';
import RmgFields, { RmgFieldsField } from '../../common/rmg-fields';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../redux';
import { setLoop, setLoopBank, setLoopLeftAndRightFactor, setLoopBottomFactor } from '../../../redux/param/action';

export default function LoopSection() {
    const dispatch = useDispatch();

    const { branches } = useAppSelector(state => state.helper);
    const { loop, loop_info } = useAppSelector(state => state.param);
    const { bank, left_and_right_factor, bottom_factor } = loop_info;

    const loopFields: RmgFieldsField[] = [
        {
            type: 'checkbox',
            label: 'Treat this line as a loop line',
            checked: loop,
            disabled: branches.length > 1,
            onChange: val => dispatch(setLoop(val)),
        },
        {
            type: 'checkbox',
            label: 'Bank the closed rectangular path in railmap',
            checked: bank,
            onChange: val => dispatch(setLoopBank(val)),
            hidden: true,
        },
    ];

    const loopFactorsFields: RmgFieldsField[] = [
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

            <RmgFields fields={loopFields} />
            <RmgFields fields={loopFactorsFields} />
        </Box>
    );
}
