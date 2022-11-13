import React, { useEffect, useState } from 'react';
import AppView from './app-view';
import { useRootDispatch, useRootSelector } from '../../redux';
import ParamSelectorView from '../param-selector-view';
import { readParam } from '../../redux/app/action';
import { useToast } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import useRootSearchParams from '../../hooks/use-root-search-params';

export default function AppRouter() {
    const { t } = useTranslation();
    const dispatch = useRootDispatch();

    const { paramConfig } = useRootSelector(state => state.app);
    const [searchParams, setSearchParams] = useRootSearchParams();
    const paramId = searchParams.get('project');

    const [isLoaded, setIsLoaded] = useState(false);

    const toast = useToast();

    useEffect(() => {
        console.log('searchParam: project=' + paramId);
        if (paramId) {
            // clear existing toast to avoid duplicate messages
            toast.closeAll();

            if (paramId === paramConfig?.id) {
                console.log('AppRouter:: Store param ID matches URL param ID. Rendering app view...');
                setIsLoaded(true);
            } else {
                console.log(`AppRouter:: Loading app view for param (ID=${paramId})...`);
                const result = dispatch(readParam(paramId));
                if (result) {
                    setIsLoaded(true);
                } else {
                    console.log(`AppRouter:: Failed to read param (ID=${paramId}). Rendering param selector view...`);
                    toast({
                        description: t('Project selected is invalid or corrupted.'),
                        status: 'error',
                        duration: 10000,
                        isClosable: true,
                    });
                    setSearchParams({});
                }
            }
        } else {
            console.log('AppRouter:: No URL param ID provided. Rendering param selector view...');
            setIsLoaded(false);
        }
    }, [paramId]);

    return isLoaded ? <AppView /> : <ParamSelectorView />;
}
