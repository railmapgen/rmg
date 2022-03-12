import { Divider, Flex } from '@chakra-ui/react';
import React from 'react';
import LayoutSection from './layout-section';
import DesignSection from './design-section';
import LoopSection from './loop-section';

export default function StyleSidePanel() {
    return (
        <Flex direction="column" overflowY="auto" p={1}>
            <LayoutSection />

            <Divider />

            <DesignSection />

            <Divider />

            <LoopSection />
        </Flex>
    );
}
