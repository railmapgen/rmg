import classes from '../side-panel.module.css';
import { useEffect, useState } from 'react';
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
    setPsdLabel,
    setPsdNum,
    setSpanLineNum,
    setTheme,
    staggerStationNames,
    toggleLineNameBeforeDestination,
} from '../../../redux/param/param-slice';
import {
    FALSE,
    PanelTypeGZMTR,
    PanelTypeShmetro,
    PsdLabel,
    RmgStyle,
    ShortDirection,
    TRUE,
} from '../../../constants/constants';
import { MdOutlineSwapVert } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { openPaletteAppClip } from '../../../redux/app/app-slice';
import { Button, Group, NativeSelect, Switch, TextInput, Title } from '@mantine/core';
import {
    RMLabelledSegmentedControl,
    RMSection,
    RMSectionBody,
    RMSectionHeader,
    RMThemeButton,
} from '@railmapgen/mantine-components';
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
        psdLabel,
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

    const psdLabelSelections = [
        { label: '屏蔽门 Screen Door', value: PsdLabel.screen },
        { label: '站台门 Platform Door', value: PsdLabel.platform },
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
            value: TRUE,
        },
        {
            label: t('StyleSidePanel.design.downward'),
            value: FALSE,
        },
    ];

    const staggerNameSelections = [
        {
            label: t('StyleSidePanel.design.alternatively'),
            value: TRUE,
        },
        {
            label: t('StyleSidePanel.design.onOneSide'),
            value: FALSE,
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
                        style={{ minWidth: 30, flex: 'none' }}
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
                            <RMLabelledSegmentedControl
                                label={t('Platform door label')}
                                data={psdLabelSelections}
                                value={psdLabel}
                                onChange={value => dispatch(setPsdLabel(value as PsdLabel))}
                                classNames={{ root: classes['mw-320'] }}
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
                    {style === RmgStyle.MTR && (
                        <>
                            <RMLabelledSegmentedControl
                                label={t('StyleSidePanel.design.nameDisplay')}
                                value={String(namePosMTR.isStagger)}
                                data={staggerNameSelections}
                                onChange={value => dispatch(staggerStationNames(value === TRUE))}
                            />
                            <Button
                                variant="light"
                                leftSection={<MdOutlineSwapVert />}
                                onClick={() => dispatch(flipStationNames())}
                                style={{ alignSelf: 'flex-end' }}
                            >
                                {t('StyleSidePanel.design.flip')}
                            </Button>
                            <Switch
                                label={t('StyleSidePanel.design.legacyDestination')}
                                checked={customiseMTRDest.isLegacy}
                                onChange={({ currentTarget: { checked } }) =>
                                    dispatch(toggleLineNameBeforeDestination(checked))
                                }
                                className="mw-full"
                            />
                            <Switch
                                label={t('StyleSidePanel.design.overrideTerminal')}
                                checked={customiseMTRDest.terminal !== false}
                                onChange={({ currentTarget: { checked } }) =>
                                    dispatch(customiseDestinationName(checked ? ['', ''] : false))
                                }
                                className="mw-full"
                            />
                            {customiseMTRDest.terminal && (
                                <>
                                    <TextInput
                                        label={t('StyleSidePanel.design.terminalZhName')}
                                        value={customiseMTRDest.terminal ? customiseMTRDest.terminal[0] : ''}
                                        placeholder="機場及博覽館"
                                        onChange={({ currentTarget: { value } }) =>
                                            dispatch(
                                                customiseDestinationName([
                                                    value,
                                                    customiseMTRDest.terminal ? customiseMTRDest.terminal[1] : '',
                                                ])
                                            )
                                        }
                                    />
                                    <TextInput
                                        label={t('StyleSidePanel.design.terminalEnName')}
                                        value={customiseMTRDest.terminal ? customiseMTRDest.terminal[1] : ''}
                                        placeholder="Airport and AsiaWorld-Expo"
                                        onChange={({ currentTarget: { value } }) =>
                                            dispatch(
                                                customiseDestinationName([
                                                    customiseMTRDest.terminal ? customiseMTRDest.terminal[0] : '',
                                                    value,
                                                ])
                                            )
                                        }
                                    />
                                </>
                            )}
                        </>
                    )}
                    {style === RmgStyle.SHMetro && lineServices === 1 && !loop && (
                        <RMLabelledSegmentedControl
                            label={t('StyleSidePanel.design.firstStationNameDisplay')}
                            value={String(namePosMTR.isFlip)}
                            data={flipNameSelections}
                            onChange={value => dispatch(flipStationNames(value === TRUE))}
                        />
                    )}
                </Group>
            </RMSectionBody>
        </RMSection>
    );
}
