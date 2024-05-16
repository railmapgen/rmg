import { Alert, AlertIcon, Box, Flex, Link, Text } from '@chakra-ui/react';
import { RmgLoader, RmgPage } from '@railmapgen/rmg-components';
import { useRootSelector } from '../../redux';
import SvgRouter from '../../svgs/svg-router';
import SidePanel from '../side-panel/side-panel';
import PageHeader from '../page-header/page-header';
import GridTabs from '../ag-grid/grid-tabs';
import GlobalAlerts from './global-alerts';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import rmgRuntime from '@railmapgen/rmg-runtime';
import { LocalStorageKey } from '../../constants/constants';
import { getParamConfig } from '../../util/param-manager-utils';
import useRootSearchParams from '../../hooks/use-root-search-params';
import { updateTitle } from '../../util/metadata-utils';

export default function AppView() {
    const { t } = useTranslation();

    const [searchParams] = useRootSearchParams();
    const urlParamId = searchParams.get('project');

    const isLoading = useRootSelector(state => state.app.isLoading);

    const [isShowRMTMessage, setIsShowRMTMessage] = useState(false);

    useEffect(() => {
        if (rmgRuntime.isStandaloneWindow() && !rmgRuntime.storage.get(LocalStorageKey.DO_NOT_SHOW_RMT_MSG)) {
            setIsShowRMTMessage(true);
        }

        if (urlParamId) {
            const paramConfig = getParamConfig(urlParamId);
            updateTitle(paramConfig?.name ?? t('Project') + ' ' + urlParamId);
        }
    }, []);

    return (
        <RmgPage>
            {isLoading && <RmgLoader isIndeterminate={isLoading < 0} value={isLoading >= 0 ? isLoading : undefined} />}
            <PageHeader />

            {isShowRMTMessage && (
                <Alert status="info" variant="solid" size="xs" pl={3} pr={1} py={1}>
                    <AlertIcon />
                    <Text sx={{ '& a, button': { fontWeight: 'bold', textDecoration: 'underline' } }}>
                        {t('Try out')}{' '}
                        <Link href="/?app=rmg" isExternal>
                            {t('Rail Map Toolkit')}
                        </Link>{' '}
                        {t('now and enjoy an even better rail map design experience!')}{' '}
                        <Link as="button" ml="auto" onClick={() => setIsShowRMTMessage(false)}>
                            {t('Close')}
                        </Link>
                        {' | '}
                        <Link
                            as="button"
                            onClick={() => {
                                setIsShowRMTMessage(false);
                                rmgRuntime.storage.set(LocalStorageKey.DO_NOT_SHOW_RMT_MSG, 'true');
                            }}
                        >
                            {t("Don't show me again")}
                        </Link>
                    </Text>
                </Alert>
            )}

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
