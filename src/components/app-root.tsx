import React, { useEffect } from 'react';
import SvgRouter from '../svgs/svg-router';
import SidePanel from './side-panel/side-panel';
import PageHeader from './page-header/page-header';
import WindowHeader from './window-header';
import { Alert, AlertIcon, Box, CloseButton, Flex } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../redux';
import { setGlobalAlert } from '../redux/app/action';
import GridTabs from './ag-grid/grid-tabs';
import LoadingModal from './modal/loading-modal';

export default function AppRoot() {
    const dispatch = useDispatch();

    const globalAlert = useAppSelector(state => state.app.globalAlert);
    const param = useAppSelector(state => state.param);
    const paramString = JSON.stringify(param);

    useEffect(() => {
        window.rmgStorage.writeFile('rmgParam', paramString).then();
    }, [paramString]);

    return (
        <Flex direction="column" height="100%" overflow="hidden">
            <LoadingModal />
            <WindowHeader />
            <Flex direction="column" flex={1} overflow="hidden">
                <PageHeader />
                <Flex flex={1} overflow="hidden" position="relative">
                    <Flex as="section" direction="column" flex={1} ml={1} mr={1} overflow="hidden">
                        {globalAlert && (
                            <Alert status={globalAlert.status} variant="solid" size="xs" pl={3} pr={1} pb={0} pt={0}>
                                <AlertIcon />
                                {globalAlert.message}
                                <CloseButton ml="auto" onClick={() => dispatch(setGlobalAlert())} />
                            </Alert>
                        )}

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
