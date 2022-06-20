import React, { ReactNode } from 'react';
import { useRootSelector } from '../../redux';
import { setSidePanelMode } from '../../redux/app/app-slice';
import { useDispatch } from 'react-redux';
import { SidePanelMode } from '../../constants/constants';
import StationSidePanel from './station-side-panel/station-side-panel';
import StyleSidePanel from './style-side-panel/style-side-panel';
import { RmgMultiLineString, RmgSidePanel, RmgSidePanelHeader } from '@railmapgen/rmg-components';
import StationSidePanelFooter from './station-side-panel/station-side-panel-footer';
import BranchSidePanel from './branch-side-panel/branch-side-panel';
import { useTranslation } from 'react-i18next';

const SIDE_PANEL_WIDTH = 375;

export default function SidePanel() {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const { sidePanelMode, selectedStation } = useRootSelector(state => state.app);
    const name = useRootSelector(state => state.param.stn_list[selectedStation]?.name);

    const mode: Record<SidePanelMode, { header: ReactNode; body?: ReactNode; footer?: ReactNode }> = {
        STATION: {
            header: <RmgMultiLineString text={name?.join(' - ') || ''} />,
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
        <RmgSidePanel isOpen={sidePanelMode !== SidePanelMode.CLOSE} width={SIDE_PANEL_WIDTH} header="Dummy header">
            <RmgSidePanelHeader onClose={handleClose}>{mode[sidePanelMode].header}</RmgSidePanelHeader>
            {mode[sidePanelMode]?.body}
            {mode[sidePanelMode]?.footer}
        </RmgSidePanel>
    );
}
