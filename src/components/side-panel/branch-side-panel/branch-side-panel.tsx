import { RmgSidePanelBody } from '@railmapgen/rmg-components';
import ColineSection from './coline-section';
import { Divider } from '@chakra-ui/react';
import ActionSection from './action-section';
import { useRootSelector } from '../../../redux';
import { RmgStyle } from '../../../constants/constants';
import { isColineBranch } from '../../../redux/param/coline-action';
import LoopSection from './loop-section';

export default function BranchSidePanel() {
    const selectedBranch = useRootSelector(state => state.app.selectedBranch);
    const { style, stn_list: stationList, loop } = useRootSelector(state => state.param);
    const branches = useRootSelector(state => state.helper.branches);

    return (
        <RmgSidePanelBody>
            {style === RmgStyle.SHMetro &&
                (selectedBranch === 0 || isColineBranch(branches[selectedBranch], stationList)) && (
                    <>
                        <ColineSection />
                        <Divider />
                    </>
                )}

            {loop && (
                <>
                    <LoopSection />
                    <Divider />
                </>
            )}

            <ActionSection />
        </RmgSidePanelBody>
    );
}
