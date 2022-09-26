import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Flex } from '@chakra-ui/react';
import { RmgPage, RmgWindow } from '@railmapgen/rmg-components';
import { useRootDispatch } from '../redux';
import { setGlobalAlert } from '../redux/app/app-slice';
import SvgRouter from '../svgs/svg-router';
import SidePanel from './side-panel/side-panel';
import PageHeader from './page-header/page-header';
import WindowHeader from './root/window-header';
import GridTabs from './ag-grid/grid-tabs';
import LoadingModal from './modal/loading-modal';
import GlobalAlerts from './root/global-alerts';

export default function AppRoot() {
    const { t } = useTranslation();
    const dispatch = useRootDispatch();

    React.useEffect(() => {
        setTimeout(() => {
            dispatch(
                setGlobalAlert({
                    status: 'info',
                    message: t('rmpPromotion'),
                    url: 'rmp',
                    linkedApp: true,
                })
            );
        }, 1000);
    }, []);

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
