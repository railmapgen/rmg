import { Divider } from '@chakra-ui/react';
import { useRootSelector } from '../../../redux';
import { RmgStyle } from '../../../constants/constants';
import LayoutSection from './layout-section';
import DesignSection from './design-section';
import LoopSection from './loop-section';
import { RmgSidePanelBody } from '@railmapgen/rmg-components';
import GZMTRNoteSection from './gzmtr-note-section';

export default function StyleSidePanel() {
    const { style } = useRootSelector(state => state.param);

    return (
        <RmgSidePanelBody>
            <LayoutSection />

            <Divider />

            <DesignSection />

            {[RmgStyle.GZMTR, RmgStyle.SHMetro].includes(style) && (
                <>
                    <Divider />

                    <LoopSection />
                </>
            )}

            {style === RmgStyle.GZMTR && (
                <>
                    <Divider />

                    <GZMTRNoteSection />
                </>
            )}
        </RmgSidePanelBody>
    );
}
