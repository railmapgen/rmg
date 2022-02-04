import React, { useState } from 'react';
import { Box, Heading, HStack } from '@chakra-ui/react';
import RmgFields, { RmgFieldsField } from '../../common/rmg-fields';
import { useAppSelector } from '../../../redux';
import ThemeButton from '../theme-button';
import RmgLabel from '../../common/rmg-label';
import ColourModal from '../../modal/colour-modal/colour-modal';
import { useDispatch } from 'react-redux';
import { setDirection, setLineName, setLineNum, setPlatform, setPsdNum, setTheme } from '../../../redux/param/action';
import RmgButtonGroup from '../../common/rmg-button-group';
import { RmgStyle, ShortDirection } from '../../../constants/constants';

export default function DesignSection() {
    const dispatch = useDispatch();

    const {
        style,
        theme,
        line_name: lineName,
        line_num: lineNum,
        direction,
        platform_num: platformNum,
        psd_num: psdNum,
    } = useAppSelector(state => state.param);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const fields1: RmgFieldsField[] = [
        {
            type: 'input',
            label: 'Chinese line name',
            value: lineName[0],
            onChange: value => dispatch(setLineName([value, lineName[1]])),
        },
        {
            type: 'input',
            label: 'English line name',
            value: lineName[1],
            onChange: value => dispatch(setLineName([lineName[0], value])),
        },
        {
            type: 'input',
            label: 'Line code',
            value: lineNum,
            onChange: value => dispatch(setLineNum(value)),
            hidden: ![RmgStyle.GZMTR].includes(style),
        },
    ];

    const directionSelections = [
        {
            label: 'Left',
            value: ShortDirection.left,
        },
        {
            label: 'Right',
            value: ShortDirection.right,
        },
    ];

    const fields2: RmgFieldsField[] = [
        {
            type: 'custom',
            label: 'Train direction',
            component: (
                <RmgButtonGroup
                    selections={directionSelections}
                    defaultValue={direction}
                    onChange={nextDirection => dispatch(setDirection(nextDirection))}
                />
            ),
        },
        {
            type: 'input',
            label: 'Platform number',
            value: platformNum || '',
            onChange: value => dispatch(setPlatform(value)),
        },
        {
            type: 'input',
            label: 'Platform door number',
            value: psdNum,
            onChange: value => dispatch(setPsdNum(value)),
        },
    ];

    return (
        <Box>
            <Heading as="h5" size="sm">
                Design
            </Heading>

            <HStack spacing={0.5}>
                <RmgLabel label="Colour">
                    <ThemeButton theme={theme} onClick={() => setIsModalOpen(true)} />
                </RmgLabel>

                <RmgFields fields={fields1} />
            </HStack>

            <RmgFields fields={fields2} />

            <ColourModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                defaultTheme={theme}
                onUpdate={nextTheme => dispatch(setTheme(nextTheme))}
            />
        </Box>
    );
}
