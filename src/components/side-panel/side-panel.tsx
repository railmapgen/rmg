import classes from './side-panel.module.css';
import { ReactNode } from 'react';
import { useRootSelector } from '../../redux';
import {
    closePaletteAppClip,
    onPaletteAppClipEmit,
    setIsSidePanelOpen,
    setSidePanelMode,
} from '../../redux/app/app-slice';
import { useDispatch } from 'react-redux';
import { SidePanelMode } from '../../constants/constants';
import StationSidePanel from './station-side-panel/station-side-panel';
import StyleSidePanel from './style-side-panel/style-side-panel';
import StationSidePanelFooter from './station-side-panel/station-side-panel-footer';
import BranchSidePanel from './branch-side-panel/branch-side-panel';
import { useTranslation } from 'react-i18next';
import RmgPaletteAppClip from '../app-clip/rmg-palette-app-clip';
import { RMSidePanel } from '@railmapgen/mantine-components';
import { Tabs } from '@mantine/core';
import { MdOutlinePalette, MdOutlineShare, MdOutlineTrain } from 'react-icons/md';

const SIDE_PANEL_WIDTH = 410;

export default function SidePanel() {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const { isSidePanelOpen, sidePanelMode, paletteAppClipInput } = useRootSelector(state => state.app);

    const modes: Record<SidePanelMode, { icon: ReactNode; label: string; body?: ReactNode; footer?: ReactNode }> = {
        STATION: {
            icon: <MdOutlineTrain />,
            label: t('Station'),
            body: <StationSidePanel />,
            footer: <StationSidePanelFooter />,
        },
        STYLE: { icon: <MdOutlinePalette />, label: t('Style'), body: <StyleSidePanel /> },
        BRANCH: { icon: <MdOutlineShare />, label: t('Line section'), body: <BranchSidePanel /> },
    };

    return (
        <RMSidePanel
            opened={isSidePanelOpen}
            onClose={() => dispatch(setIsSidePanelOpen(false))}
            title={t('Settings')}
            width={SIDE_PANEL_WIDTH}
            withCloseButton
            className={classes.root}
        >
            <Tabs
                value={sidePanelMode}
                onChange={mode => dispatch(setSidePanelMode(mode as SidePanelMode))}
                classNames={{ root: classes.body, panel: classes['tab-panel'] }}
            >
                <Tabs.List grow>
                    {[SidePanelMode.STYLE, SidePanelMode.BRANCH, SidePanelMode.STATION].map(mode => (
                        <Tabs.Tab key={mode} value={mode} leftSection={modes[mode].icon}>
                            {modes[mode].label}
                        </Tabs.Tab>
                    ))}
                </Tabs.List>

                {[SidePanelMode.STYLE, SidePanelMode.BRANCH, SidePanelMode.STATION].map(mode => (
                    <Tabs.Panel key={mode} value={mode}>
                        {modes[mode]?.body}

                        {modes[mode]?.footer}
                    </Tabs.Panel>
                ))}
            </Tabs>

            <RmgPaletteAppClip
                isOpen={!!paletteAppClipInput}
                onClose={() => dispatch(closePaletteAppClip())}
                defaultTheme={paletteAppClipInput}
                onSelect={nextTheme => dispatch(onPaletteAppClipEmit(nextTheme))}
            />
        </RMSidePanel>
    );
}
