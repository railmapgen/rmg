import { useEffect, useState } from 'react';
import AppView from './app-view';
import { useRootDispatch, useRootSelector } from '../../redux';
import ParamSelectorView from '../param-selector-view';
import { readParam } from '../../redux/app/action';
import { useToast } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import useRootSearchParams from '../../hooks/use-root-search-params';
import { downloadParam } from '../../util/param-manager-utils';
import { logger } from '@railmapgen/rmg-runtime';

export default function AppRouter() {
    const { t } = useTranslation();
    const dispatch = useRootDispatch();

    const { paramConfig } = useRootSelector(state => state.app);
    const [searchParams, setSearchParams] = useRootSearchParams();
    const paramId = searchParams.get('project');
    const externalUrl = searchParams.get('external');

    const [isLoaded, setIsLoaded] = useState(false);
    const [downloading, setDownloading] = useState<string>();

    const toast = useToast();

    useEffect(() => {
        logger.info(`searchParam: project=${paramId}, external=${externalUrl}`);
        if (paramId && externalUrl) {
            logger.warn('<AppRouter/>, Both param ID and external URL are provided. External URL will be ignored.');
            setSearchParams({ project: paramId });
        } else if (paramId) {
            // clear existing toast to avoid duplicate messages
            toast.closeAll();

            if (paramId === paramConfig?.id) {
                logger.info('<AppRouter/>, Store param ID matches URL param ID. Rendering app view...');
                setIsLoaded(true);
            } else {
                logger.info(`<AppRouter/>, Loading app view for param (ID=${paramId})...`);
                dispatch(readParam(paramId)).then(result => {
                    if (result) {
                        setIsLoaded(true);
                    } else {
                        logger.info(
                            `<AppRouter/>, Failed to read param (ID=${paramId}). Rendering param selector view...`
                        );
                        toast({
                            description: t('Project selected is invalid or corrupted.'),
                            status: 'error',
                            duration: 10000,
                            isClosable: true,
                        });
                        setSearchParams({});
                    }
                });
            }
        } else if (externalUrl) {
            logger.info('<AppRouter/>, External project URl is provided. Downloading project...');
            const url = decodeURIComponent(externalUrl);
            setDownloading(url);
            downloadParam(url).then(id => {
                if (id) {
                    setSearchParams({ project: id });
                } else {
                    logger.info(`<AppRouter/>, Failed to download param from ${url}. Rendering param selector view...`);
                    toast({
                        description: t('External URL cannot be opened.'),
                        status: 'error',
                        duration: 10000,
                        isClosable: true,
                    });
                    setSearchParams({});
                }
                setDownloading(undefined);
            });
        } else {
            logger.info('<AppRouter/>, No URL param ID or external URL provided. Rendering param selector view...');
            setIsLoaded(false);
        }
    }, [paramId, externalUrl]);

    return isLoaded ? <AppView /> : <ParamSelectorView downloading={downloading} />;
}
