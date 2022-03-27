import { Divider } from '@chakra-ui/react';
import React from 'react';
import InfoSection from './info-section';
import InterchangeSection from './interchange-section';
import MoreSection from './more-section';
import BranchSection from './branch-section';
import { RmgSidePanelBody } from '@railmapgen/rmg-components';

export default function StationSidePanel() {
    return (
        <RmgSidePanelBody>
            <InfoSection />

            <Divider />

            <InterchangeSection />

            <Divider />

            <BranchSection />

            <Divider />

            <MoreSection />
        </RmgSidePanelBody>
    );
}
