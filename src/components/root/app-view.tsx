import { Box, Flex } from '@chakra-ui/react';
import { RmgLoader, RmgPage } from '@railmapgen/rmg-components';
import { useRootSelector } from '../../redux';
import SvgRouter from '../../svgs/svg-router';
import SidePanel from '../side-panel/side-panel';
import PageHeader from '../page-header/page-header';
import GridTabs from '../ag-grid/grid-tabs';
import GlobalAlerts from './global-alerts';

export default function AppView() {
    const isLoading = useRootSelector(state => state.app.isLoading);

    return (
        <RmgPage>
            {isLoading && <RmgLoader isIndeterminate={isLoading < 0} value={isLoading >= 0 ? isLoading : undefined} />}
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

            <canvas style={{ display: 'none' }} />
        </RmgPage>
    );
}
