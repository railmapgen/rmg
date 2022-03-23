import React from 'react';
import { Box, Heading } from '@chakra-ui/react';
import { updateStationName, updateStationNum, updateStationSecondaryName } from '../../../redux/param/action';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../redux';
import { RmgStyle } from '../../../constants/constants';
import { RmgFields, RmgFieldsField } from '@railmapgen/rmg-components';

export default function InfoSection() {
    const dispatch = useDispatch();

    const selectedStation = useAppSelector(state => state.app.selectedStation);
    const style = useAppSelector(state => state.param.style);
    const { num, name, secondaryName } = useAppSelector(state => state.param.stn_list[selectedStation]);

    const fields: RmgFieldsField[] = [
        {
            type: 'input',
            label: 'Station number',
            value: num,
            placeholder: '01',
            onChange: (value: string) => dispatch(updateStationNum(selectedStation, value)),
            hidden: ![RmgStyle.GZMTR].includes(style),
        },
        {
            type: 'input',
            label: 'Chinese name',
            value: name[0],
            placeholder: '地鐵站',
            onChange: (value: string) => dispatch(updateStationName(selectedStation, [value, name[1]])),
        },
        {
            type: 'input',
            label: 'English name',
            value: name[1],
            placeholder: 'Metro Station',
            onChange: (value: string) => dispatch(updateStationName(selectedStation, [name[0], value])),
        },
        {
            type: 'input',
            label: 'Chinese secondary',
            value: secondaryName ? secondaryName[0] : '',
            placeholder: '1號客運大樓',
            onChange: (value: string) =>
                dispatch(updateStationSecondaryName(selectedStation, [value, secondaryName ? secondaryName[1] : ''])),
            hidden: ![RmgStyle.GZMTR].includes(style),
        },
        {
            type: 'input',
            label: 'English secondary',
            value: secondaryName ? secondaryName[1] : '',
            placeholder: 'Terminal 1',
            onChange: (value: string) =>
                dispatch(updateStationSecondaryName(selectedStation, [secondaryName ? secondaryName[0] : '', value])),
            hidden: ![RmgStyle.GZMTR].includes(style),
        },
    ];

    return (
        <Box p={1}>
            <Heading as="h5" size="sm">
                Basic info
            </Heading>

            <RmgFields fields={fields} minW={100} />
        </Box>
    );
}
