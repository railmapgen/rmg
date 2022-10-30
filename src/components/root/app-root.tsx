import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Flex } from '@chakra-ui/react';
import { RmgLoader, RmgPage, RmgWindow } from '@railmapgen/rmg-components';
import { useRootDispatch, useRootSelector } from '../../redux';
import { setGlobalAlert } from '../../redux/app/app-slice';
import SvgRouter from '../../svgs/svg-router';
import SidePanel from '../side-panel/side-panel';
import PageHeader from '../page-header/page-header';
import WindowHeader from './window-header';
import GridTabs from '../ag-grid/grid-tabs';
import GlobalAlerts from './global-alerts';

export default function AppRoot() {
    const { t } = useTranslation();
    const dispatch = useRootDispatch();

    const isLoading = useRootSelector(state => state.app.isLoading);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            dispatch(
                setGlobalAlert({
                    status: 'info',
                    message: t('rmpPromotion'),
                    linkedApp: 'rmp',
                })
            );
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, []);

    return (
        <RmgWindow>
            {isLoading && <RmgLoader isIndeterminate={isLoading < 0} value={isLoading >= 0 ? isLoading : undefined} />}
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
