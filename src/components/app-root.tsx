import React, { useEffect } from 'react';
import SvgRouter from '../svgs/svg-router';
import SidePanel from './side-panel/side-panel';
import PageHeader from './page-header/page-header';
import WindowHeader from './root/window-header';
import { Box, Flex } from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '../redux';
import GridTabs from './ag-grid/grid-tabs';
import LoadingModal from './modal/loading-modal';
import GlobalAlerts from './root/global-alerts';
import { setGlobalAlert } from '../redux/app/action';

export default function AppRoot() {
    const dispatch = useAppDispatch();

    const param = useAppSelector(state => state.param);
    const paramString = JSON.stringify(param);

    useEffect(() => {
        window.rmgStorage.writeFile('rmgParam', paramString).then();
    }, [paramString]);

    useEffect(() => {
        setTimeout(() => {
            dispatch(
                setGlobalAlert(
                    'info',
                    'Stand with Shanghainese who are starving!',
                    'https://zhuanlan.zhihu.com/p/495171971'
                )
            );
        }, 5000);
    }, []);

    return (
        <Flex direction="column" height="100%" overflow="hidden">
            <LoadingModal />
            <WindowHeader />
            <Flex direction="column" flex={1} overflow="hidden">
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
            </Flex>

            <canvas style={{ display: 'none' }} />
        </Flex>
    );
}
