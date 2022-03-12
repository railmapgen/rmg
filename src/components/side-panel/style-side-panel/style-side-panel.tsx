import { Divider, Flex } from '@chakra-ui/react';
import React from 'react';
import { useAppSelector } from '../../../redux';
import { RmgStyle } from '../../../constants/constants';
import LayoutSection from './layout-section';
import DesignSection from './design-section';
import LoopSection from './loop-section';

export default function StyleSidePanel() {
    const { style } = useAppSelector(state => state.param);

    return (
        <Flex direction="column" overflowY="auto" p={1}>
            <LayoutSection />

            <Divider />

            <DesignSection />

            {style === RmgStyle.SHMetro && (
                <>
                    <Divider />

                    <LoopSection />
                </>
            )}
        </Flex>
    );
}
