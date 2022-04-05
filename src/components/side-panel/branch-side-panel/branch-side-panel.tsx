import { RmgSidePanelBody } from '@railmapgen/rmg-components';
import React from 'react';
import ColineSection from './coline-section';
import { Divider } from '@chakra-ui/react';
import ActionSection from './action-section';
import { useAppSelector } from '../../../redux';
import { RmgStyle } from '../../../constants/constants';
import { isColineBranch } from '../../../redux/param/coline-action';

export default function BranchSidePanel() {
    const selectedBranch = useAppSelector(state => state.app.selectedBranch);
    const { style, stn_list: stationList } = useAppSelector(state => state.param);
    const branches = useAppSelector(state => state.helper.branches);

    return (
        <RmgSidePanelBody>
            {style === RmgStyle.SHMetro && isColineBranch(branches[selectedBranch], stationList) && (
                <>
                    <ColineSection />
                    <Divider />
                </>
            )}

            <ActionSection />
        </RmgSidePanelBody>
    );
}
