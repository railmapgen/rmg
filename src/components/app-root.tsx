import React from 'react';
import SvgRouter from '../svgs/svg-router';
import SidePanel from './side-panel/side-panel';
import PageHeader from './page-header/page-header';
import StationDataTable from './data-table/station-data-table';
import WindowHeader from './window-header';
import { Box, Flex, useColorModeValue } from '@chakra-ui/react';

export default function AppRoot() {
    const tableBg = useColorModeValue('gray.50', 'gray.700');

    return (
        <Flex direction="column" height="100%" overflow="hidden">
            <WindowHeader />
            <Flex direction="column" flex={1} overflow="hidden">
                <PageHeader />
                <Flex flex={1} overflow="hidden">
                    <Flex as="section" direction="column" flex={1} ml={1} mr={1} overflow="hidden">
                        <Box>
                            <SvgRouter />
                        </Box>
                        <Box flex={1} overflowY="auto" bg={tableBg}>
                            <StationDataTable />
                        </Box>
                    </Flex>

                    <SidePanel />
                </Flex>
            </Flex>
        </Flex>
    );
}
