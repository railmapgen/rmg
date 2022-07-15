import React, { useEffect } from 'react';
import SvgRouter from '../svgs/svg-router';
import SidePanel from './side-panel/side-panel';
import PageHeader from './page-header/page-header';
import WindowHeader from './root/window-header';
import { Box, Flex } from '@chakra-ui/react';
import { useRootSelector } from '../redux';
import GridTabs from './ag-grid/grid-tabs';
import LoadingModal from './modal/loading-modal';
import GlobalAlerts from './root/global-alerts';
import { RmgPage, RmgWindow } from '@railmapgen/rmg-components';

export default function AppRoot() {
    const param = useRootSelector(state => state.param);
    const paramString = JSON.stringify(param);

    useEffect(() => {
        window.rmgStorage.writeFile('rmgParam', paramString).then();
    }, [paramString]);

    return (
        <RmgWindow>
            <LoadingModal />
            <WindowHeader />
            <RmgPage>
                <PageHeader />
                <GlobalAlerts />
                <Flex flex={1} overflow="hidden" position="relative">
                    <Flex as="section" direction="column" flex={1} ml={1} mr={1} overflow="hidden">
                        <Box>
                            <SvgRouter />
                        </Box>
                        <GridTabs />
                    </Flex>

                    <SidePanel />
                </Flex>
            </RmgPage>

            <canvas style={{ display: 'none' }} />
        </RmgWindow>
    );
}
