import { useEffect, useState } from 'react';
import { HStack, IconButton } from '@chakra-ui/react';
import { useRootDispatch, useRootSelector } from '../../../redux';
import {
    customiseDestinationName,
    flipStationNames,
    setCoachNum,
    setDirection,
    setLineName,
    setLineNum,
    setPanelType,
    setPlatform,
    setPsdNum,
    setSpanLineNum,
    setTheme,
    staggerStationNames,
    toggleLineNameBeforeDestination,
} from '../../../redux/param/param-slice';
import { PanelTypeGZMTR, PanelTypeShmetro, RmgStyle, ShortDirection } from '../../../constants/constants';
import { MdSwapVert } from 'react-icons/md';
import { RmgButtonGroup, RmgFields, RmgFieldsField } from '@railmapgen/rmg-components';
import { useTranslation } from 'react-i18next';
import { openPaletteAppClip } from '../../../redux/app/app-slice';
import { Group, NativeSelect, Switch, TextInput, Title } from '@mantine/core';
import {
    RMLabelledSegmentedControl,
    RMSection,
    RMSectionBody,
    RMSectionHeader,
    RMThemeButton,
} from '@railmapgen/mantine-components';
import classes from '../side-panel.module.css';
import clsx from 'clsx';

export default function DesignSection() {
    const { t } = useTranslation();
    const dispatch = useRootDispatch();

    const { paletteAppClipOutput } = useRootSelector(state => state.app);
    const {
        style,
        theme,
        line_name: lineName,
        line_num: lineNum,
        spanLineNum,
        direction,
        platform_num: platformNum,
        psd_num: psdNum,
        coachNum,
        namePosMTR,
        customiseMTRDest,
        info_panel_type,
        stn_list,
        loop,
    } = useRootSelector(state => state.param);

    const lineServices = Math.max(...Object.values(stn_list).map(s => s.services.length));

    const [isThemeRequested, setIsThemeRequested] = useState(false);

    useEffect(() => {
        if (isThemeRequested && paletteAppClipOutput) {
            dispatch(setTheme(paletteAppClipOutput));
            setIsThemeRequested(false);
        }
    }, [paletteAppClipOutput?.toString()]);

    const directionSelections = [
        {
            label: t('StyleSidePanel.design.left'),
            value: ShortDirection.left,
        },
        {
            label: t('StyleSidePanel.design.right'),
            value: ShortDirection.right,
        },
    ];

    const panelTypeGZMTROptions = Object.values(PanelTypeGZMTR).map(value => ({
        value,
        label: t('StyleSidePanel.design.' + value),
        disabled: value === PanelTypeGZMTR.gz1822,
    }));

    const panelTypeSHMetroOptions = Object.values(PanelTypeShmetro).map(value => ({
        value,
        label: t('StyleSidePanel.design.' + value),
    }));

    const flipNameSelections = [
        {
            label: t('StyleSidePanel.design.upwards'),
            value: true,
        },
        {
            label: t('StyleSidePanel.design.downward'),
            value: false,
        },
    ];

    const shmetroSpecifiedFields: RmgFieldsField[] = [
        {
            type: 'custom',
            label: t('StyleSidePanel.design.firstStationNameDisplay'),
            component: (
                <HStack spacing={0.5}>
                    <RmgButtonGroup
                        selections={flipNameSelections}
                        defaultValue={namePosMTR.isFlip ?? true}
                        onChange={value => dispatch(flipStationNames(value))}
                    />
                </HStack>
            ),
            minW: 'full',
            oneLine: true,
            hidden: ![RmgStyle.SHMetro].includes(style) || lineServices > 1 || loop,
        },
    ];

    const staggerNameSelections = [
        {
            label: t('StyleSidePanel.design.alternatively'),
            value: true,
        },
        {
            label: t('StyleSidePanel.design.onOneSide'),
            value: false,
        },
    ];

    const mtrSpecifiedFields: RmgFieldsField[] = [
        {
            type: 'custom',
            label: t('StyleSidePanel.design.nameDisplay'),
            component: (
                <HStack spacing={0.5}>
                    <IconButton
                        size="xs"
                        variant="ghost"
                        aria-label={t('StyleSidePanel.design.flip')}
                        title={t('StyleSidePanel.design.flip')}
                        icon={<MdSwapVert />}
                        onClick={() => dispatch(flipStationNames())}
                    />
                    <RmgButtonGroup
                        selections={staggerNameSelections}
                        defaultValue={namePosMTR.isStagger}
                        onChange={value => dispatch(staggerStationNames(value))}
                    />
                </HStack>
            ),
            minW: 'full',
            oneLine: true,
            hidden: ![RmgStyle.MTR].includes(style),
        },
        {
            type: 'switch',
            label: t('StyleSidePanel.design.legacyDestination'),
            isChecked: customiseMTRDest.isLegacy,
            onChange: checked => dispatch(toggleLineNameBeforeDestination(checked)),
            hidden: ![RmgStyle.MTR].includes(style),
            minW: 'full',
            oneLine: true,
        },
        {
            type: 'switch',
            label: t('StyleSidePanel.design.overrideTerminal'),
            isChecked: customiseMTRDest.terminal !== false,
            onChange: checked => dispatch(customiseDestinationName(checked ? ['', ''] : false)),
            hidden: ![RmgStyle.MTR].includes(style),
            minW: 'full',
            oneLine: true,
        },
        {
            type: 'input',
            label: t('StyleSidePanel.design.terminalZhName'),
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
            label: t('StyleSidePanel.design.terminalEnName'),
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
        <RMSection>
            <RMSectionHeader>
                <Title order={3} size="h4">
                    {t('StyleSidePanel.design.title')}
                </Title>
            </RMSectionHeader>

            <RMSectionBody className={clsx(classes['section-body'], classes.fields)}>
                <Group gap="xs">
                    <RMThemeButton
                        bg={theme[2]}
                        fg={theme[3]}
                        aria-label={t('Colour')}
                        title={t('Colour')}
                        onClick={() => {
                            setIsThemeRequested(true);
                            dispatch(openPaletteAppClip(theme));
                        }}
                        style={{ minWidth: 15 }}
                    >
                        Aa
                    </RMThemeButton>
                    <TextInput
                        label={t('StyleSidePanel.design.zhLineName')}
                        value={lineName[0]}
                        onChange={({ currentTarget: { value } }) => dispatch(setLineName([value, lineName[1]]))}
                    />
                    <TextInput
                        label={t('StyleSidePanel.design.enLineName')}
                        value={lineName[1]}
                        onChange={({ currentTarget: { value } }) => dispatch(setLineName([lineName[0], value]))}
                    />
                    {style === RmgStyle.GZMTR && (
                        <>
                            <TextInput
                                label={t('StyleSidePanel.design.lineNum')}
                                value={lineNum}
                                onChange={({ currentTarget: { value } }) => dispatch(setLineNum(value))}
                            />
                            <Switch
                                label={t('Span digits over rows')}
                                checked={!!spanLineNum}
                                onChange={({ currentTarget: { checked } }) => dispatch(setSpanLineNum(checked))}
                            />
                        </>
                    )}
                    <TextInput
                        label={t('StyleSidePanel.design.platformNum')}
                        value={platformNum || ''}
                        onChange={({ currentTarget: { value } }) => dispatch(setPlatform(value))}
                    />
                    {style === RmgStyle.GZMTR && (
                        <>
                            <TextInput
                                label={t('StyleSidePanel.design.psdNum')}
                                value={psdNum}
                                onChange={({ currentTarget: { value } }) => dispatch(setPsdNum(value))}
                            />
                            <TextInput
                                label={t('Coach number')}
                                value={coachNum}
                                onChange={({ currentTarget: { value } }) => dispatch(setCoachNum(value))}
                            />
                        </>
                    )}
                    {[RmgStyle.GZMTR, RmgStyle.SHMetro].includes(style) && (
                        <NativeSelect
                            label={t('StyleSidePanel.design.panelType')}
                            value={info_panel_type}
                            data={style === RmgStyle.GZMTR ? panelTypeGZMTROptions : panelTypeSHMetroOptions}
                            onChange={({ currentTarget: { value } }) =>
                                dispatch(setPanelType(value as PanelTypeGZMTR | PanelTypeShmetro))
                            }
                        />
                    )}
                    <RMLabelledSegmentedControl
                        label={t('StyleSidePanel.design.direction')}
                        data={directionSelections}
                        value={direction}
                        onChange={value => dispatch(setDirection(value as ShortDirection))}
                    />
                </Group>
                <RmgFields fields={[...mtrSpecifiedFields, ...shmetroSpecifiedFields]} minW={130} />
            </RMSectionBody>
        </RMSection>
    );
}
