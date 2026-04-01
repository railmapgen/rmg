import { useRootSelector } from '../../redux';
import SvgRouter from '../../svgs/svg-router';
import SidePanel from '../side-panel/side-panel';
import PageHeader from '../page-header/page-header';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getParamConfig } from '../../util/param-manager-utils';
import useRootSearchParams from '../../hooks/use-root-search-params';
import { updateTitle } from '../../util/metadata-utils';
import { RMPage, RMPageBody } from '@railmapgen/mantine-components';
import { LoadingOverlay, Progress } from '@mantine/core';

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
            {isLoading &&
                (isLoading >= 0 ? (
                    <LoadingOverlay
                        visible
                        loaderProps={{
                            children: (
                                <Progress value={isLoading} striped animated style={{ width: '50vw', maxWidth: 320 }} />
                            ),
                        }}
                    />
                ) : (
                    <LoadingOverlay visible />
                ))}
            <PageHeader />

            <RMPageBody>
                <SvgRouter />
                <SidePanel />
            </RMPageBody>

            <canvas style={{ display: 'none' }} />
        </RMPage>
    );
}
