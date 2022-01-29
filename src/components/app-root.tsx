import React, { useEffect } from 'react';
import SvgRouter from '../svgs/svg-router';
import SidePanel from './side-panel/side-panel';
import PageHeader from './page-header/page-header';
import StationDataTable from './data-table/station-data-table';
import WindowHeader from './window-header';
import { Alert, AlertIcon, Box, CloseButton, Flex, useColorModeValue } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../redux';
import { setGlobalAlert } from '../redux/app/action';

export default function AppRoot() {
    const tableBg = useColorModeValue('gray.50', 'gray.700');

    const dispatch = useDispatch();

    const globalAlert = useAppSelector(state => state.app.globalAlert);
    const param = useAppSelector(state => state.param);
    const paramString = JSON.stringify(param);

    useEffect(() => {
        window.rmgStorage.writeFile('rmgParam', paramString).then();
    }, [paramString]);

    return (
        <Flex direction="column" height="100%" overflow="hidden">
            <WindowHeader />
            <Flex direction="column" flex={1} overflow="hidden">
                <PageHeader />
                <Flex flex={1} overflow="hidden">
                    <Flex as="section" direction="column" flex={1} ml={1} mr={1} overflow="hidden" bg={tableBg}>
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
                        <Box flex={1} overflowY="auto" p={2}>
                            <StationDataTable />
                        </Box>
                    </Flex>

                    <SidePanel />
                </Flex>
            </Flex>
        </Flex>
    );
}
