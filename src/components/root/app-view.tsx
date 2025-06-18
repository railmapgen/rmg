import { RmgLoader } from '@railmapgen/rmg-components';
import { useRootSelector } from '../../redux';
import SvgRouter from '../../svgs/svg-router';
import SidePanel from '../side-panel/side-panel';
import PageHeader from '../page-header/page-header';
import GlobalAlerts from './global-alerts';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getParamConfig } from '../../util/param-manager-utils';
import useRootSearchParams from '../../hooks/use-root-search-params';
import { updateTitle } from '../../util/metadata-utils';
import { RMPage, RMPageBody } from '@railmapgen/mantine-components';

export default function AppView() {
    const { t } = useTranslation();

    const [searchParams] = useRootSearchParams();
    const urlParamId = searchParams.get('project');

    const isLoading = useRootSelector(state => state.app.isLoading);

    useEffect(() => {
        if (urlParamId) {
            const paramConfig = getParamConfig(urlParamId);
            updateTitle(paramConfig?.name ?? t('Project') + ' ' + urlParamId);
        }
    }, []);

    return (
        <RMPage>
            {isLoading && <RmgLoader isIndeterminate={isLoading < 0} value={isLoading >= 0 ? isLoading : undefined} />}
            <PageHeader />

            <GlobalAlerts />
            <RMPageBody>
                <SvgRouter />
                <SidePanel />
            </RMPageBody>

            <canvas style={{ display: 'none' }} />
        </RMPage>
    );
}
