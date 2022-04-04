import { Divider } from '@chakra-ui/react';
import React from 'react';
import { useAppSelector } from '../../../redux';
import { RmgStyle } from '../../../constants/constants';
import LayoutSection from './layout-section';
import DesignSection from './design-section';
import LoopSection from './loop-section';
import { RmgSidePanelBody } from '@railmapgen/rmg-components';
import GZMTRNoteSection from './gzmtr-note-section';

export default function StyleSidePanel() {
    const { style } = useAppSelector(state => state.param);

    return (
        <RmgSidePanelBody>
            <LayoutSection />

            <Divider />

            <DesignSection />

            {style === RmgStyle.GZMTR && (
                <>
                    <Divider />

                    <GZMTRNoteSection />
                </>
            )}

            {style === RmgStyle.SHMetro && (
                <>
                    <Divider />

                    <LoopSection />
                </>
            )}
        </RmgSidePanelBody>
    );
}
