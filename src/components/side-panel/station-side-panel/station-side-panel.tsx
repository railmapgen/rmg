import { Divider, Flex } from '@chakra-ui/react';
import React from 'react';
import InfoSection from './info-section';
import InterchangeSection from './interchange-section';
import MoreSection from './more-section';
import BranchSection from './branch-section';

export default function StationSidePanel() {
    return (
        <Flex direction="column" overflowY="auto" p={1}>
            <InfoSection />

            <Divider />

            <InterchangeSection />

            <Divider />

            <BranchSection />

            <Divider />

            <MoreSection />
        </Flex>
    );
}
