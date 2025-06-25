import classes from './side-panel.module.css';
import { ReactNode } from 'react';
import { useRootSelector } from '../../redux';
import { closePaletteAppClip, onPaletteAppClipEmit, setSidePanelMode } from '../../redux/app/app-slice';
import { useDispatch } from 'react-redux';
import { SidePanelMode } from '../../constants/constants';
import StationSidePanel from './station-side-panel/station-side-panel';
import StyleSidePanel from './style-side-panel/style-side-panel';
import { RmgMultiLineString, RmgSidePanelHeader } from '@railmapgen/rmg-components';
import StationSidePanelFooter from './station-side-panel/station-side-panel-footer';
import BranchSidePanel from './branch-side-panel/branch-side-panel';
import { useTranslation } from 'react-i18next';
import RmgPaletteAppClip from '../app-clip/rmg-palette-app-clip';
import { RMSidePanel } from '@railmapgen/mantine-components';
import { Tabs } from '@mantine/core';

const SIDE_PANEL_WIDTH = 410;

export default function SidePanel() {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const { sidePanelMode, selectedStation, paletteAppClipInput } = useRootSelector(state => state.app);
    const name = useRootSelector(state => state.param.stn_list[selectedStation]?.localisedName);

    const modes: Record<SidePanelMode, { header: ReactNode; body?: ReactNode; footer?: ReactNode }> = {
        STATION: {
            header: <RmgMultiLineString text={name?.zh + '/' + name?.en || ''} />,
            body: <StationSidePanel />,
            footer: <StationSidePanelFooter />,
        },
        STYLE: { header: t('StyleSidePanel.header'), body: <StyleSidePanel /> },
        BRANCH: { header: t('BranchSidePanel.header'), body: <BranchSidePanel /> },
        CLOSE: { header: 'Close' },
    };

    const handleClose = () => {
        dispatch(setSidePanelMode(SidePanelMode.CLOSE));
    };

    return (
        <RMSidePanel
            opened={sidePanelMode !== SidePanelMode.CLOSE}
            onClose={handleClose}
            title={t('Settings')}
            width={SIDE_PANEL_WIDTH}
            withCloseButton
        >
            {/*<RmgSidePanelHeader onClose={handleClose}>{mode[sidePanelMode].header}</RmgSidePanelHeader>*/}

            <Tabs classNames={{ root: classes.body, panel: classes['tab-panel'] }}>
                <Tabs.List grow>
                    {[SidePanelMode.STYLE, SidePanelMode.BRANCH, SidePanelMode.STATION].map(mode => (
                        <Tabs.Tab key={mode} value={mode}>
                            {mode}
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
