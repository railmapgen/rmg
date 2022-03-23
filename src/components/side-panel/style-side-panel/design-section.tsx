import React, { useState } from 'react';
import { Box, Button, Heading, HStack } from '@chakra-ui/react';
import { useAppSelector } from '../../../redux';
import ThemeButton from '../theme-button';
import ColourModal from '../../modal/colour-modal/colour-modal';
import { useDispatch } from 'react-redux';
import {
    customiseDestinationName,
    flipStationNames,
    setDirection,
    setLineName,
    setLineNum,
    setPanelType,
    setPlatform,
    setPsdNum,
    setTheme,
    staggerStationNames,
    toggleLineNameBeforeDestination,
} from '../../../redux/param/action';
import RmgButtonGroup from '../../common/rmg-button-group';
import { PanelTypeGZMTR, PanelTypeShmetro, RmgStyle, ShortDirection } from '../../../constants/constants';
import { MdSwapVert } from 'react-icons/md';
import GZMTRNoteSection from './gzmtr-note/gzmtr-note-section';
import { RmgFields, RmgFieldsField, RmgLabel } from '@railmapgen/rmg-components';

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
        namePosMTR,
        customiseMTRDest,
        info_panel_type,
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

    const panelTypeGZMTROptions = Object.values(PanelTypeGZMTR).reduce<Record<string, string>>(
        (acc, cur) => ({
            ...acc,
            [cur]: cur,
        }),
        {}
    );

    const panelTypeSHMetroOptions = Object.values(PanelTypeShmetro).reduce<Record<string, string>>(
        (acc, cur) => ({
            ...acc,
            [cur]: cur,
        }),
        {}
    );

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
            minW: 'full',
            oneLine: true,
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
            hidden: ![RmgStyle.GZMTR].includes(style),
        },
        {
            type: 'select',
            label: 'Panel type',
            value: info_panel_type,
            options: style === RmgStyle.GZMTR ? panelTypeGZMTROptions : panelTypeSHMetroOptions,
            onChange: value => dispatch(setPanelType(value as PanelTypeGZMTR | PanelTypeShmetro)),
            hidden: ![RmgStyle.GZMTR, RmgStyle.SHMetro].includes(style),
        },
    ];

    const staggerNameSelections = [
        {
            label: 'Alternatively',
            value: true,
        },
        {
            label: 'On one side',
            value: false,
        },
    ];

    const mtrSpecifiedFields: RmgFieldsField[] = [
        {
            type: 'custom',
            label: 'Display station names',
            component: (
                <HStack>
                    <RmgButtonGroup
                        selections={staggerNameSelections}
                        defaultValue={namePosMTR.isStagger}
                        onChange={value => dispatch(staggerStationNames(value))}
                    />
                    <Button
                        size="xs"
                        variant="ghost"
                        leftIcon={<MdSwapVert />}
                        onClick={() => dispatch(flipStationNames())}
                    >
                        Flip position
                    </Button>
                </HStack>
            ),
            minW: 'full',
            hidden: ![RmgStyle.MTR].includes(style),
        },
        {
            type: 'switch',
            label: 'Display line name on direction sign',
            isChecked: customiseMTRDest.isLegacy,
            onChange: checked => dispatch(toggleLineNameBeforeDestination(checked)),
            hidden: ![RmgStyle.MTR].includes(style),
            minW: 'full',
            oneLine: true,
        },
        {
            type: 'switch',
            label: 'Override terminals',
            isChecked: customiseMTRDest.terminal !== false,
            onChange: checked => dispatch(customiseDestinationName(checked ? ['', ''] : false)),
            hidden: ![RmgStyle.MTR].includes(style),
            minW: 'full',
            oneLine: true,
        },
        {
            type: 'input',
            label: 'Chinese terminal name',
            value: customiseMTRDest.terminal ? customiseMTRDest.terminal[0] : '',
            placeholder: '機場及博覽館',
            onChange: value =>
                dispatch(
                    customiseDestinationName([value, customiseMTRDest.terminal ? customiseMTRDest.terminal[1] : ''])
                ),
            hidden: ![RmgStyle.MTR].includes(style) || customiseMTRDest.terminal === false,
        },
        {
            type: 'input',
            label: 'English terminal name',
            value: customiseMTRDest.terminal ? customiseMTRDest.terminal[1] : '',
            placeholder: 'Airport and AsiaWorld-Expo',
            onChange: value =>
                dispatch(
                    customiseDestinationName([customiseMTRDest.terminal ? customiseMTRDest.terminal[0] : '', value])
                ),
            hidden: ![RmgStyle.MTR].includes(style) || customiseMTRDest.terminal === false,
        },
    ];

    return (
        <Box p={1}>
            <Heading as="h5" size="sm">
                Design
            </Heading>

            <HStack spacing={0.5}>
                <RmgLabel label="Colour">
                    <ThemeButton theme={theme} onClick={() => setIsModalOpen(true)} />
                </RmgLabel>

                <RmgFields fields={fields1} />
            </HStack>

            <RmgFields fields={[...fields2, ...mtrSpecifiedFields]} />

            {RmgStyle.GZMTR === style && <GZMTRNoteSection />}

            <ColourModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                defaultTheme={theme}
                onUpdate={nextTheme => dispatch(setTheme(nextTheme))}
            />
        </Box>
    );
}
