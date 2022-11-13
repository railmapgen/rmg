import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AppView from './app-view';
import { useRootDispatch, useRootSelector } from '../../redux';
import rmgRuntime from '@railmapgen/rmg-runtime';
import { LanguageCode } from '@railmapgen/rmg-translate';
import ParamSelectorView from '../param-selector-view';
import { readParam } from '../../redux/app/action';

export default function AppRouter() {
    const dispatch = useRootDispatch();

    const { paramConfig } = useRootSelector(state => state.app);
    const [searchParams] = useSearchParams();
    const paramId = searchParams.get('project');

    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        console.log('searchParam: project=' + paramId);
        if (paramId) {
            if (paramId === paramConfig?.id) {
                console.log('AppRouter:: Store param ID matches URL param ID. Rendering app view...');
                setIsLoaded(true);
            } else {
                console.log(`AppRouter:: Reading param (ID=${paramId}) from localStorage`);
                dispatch(readParam(paramId, rmgRuntime.getLanguage() as LanguageCode));
                setIsLoaded(true);
            }
        } else {
            console.log('AppRouter:: No URL param ID provided. Rendering param selector view...');
            setIsLoaded(false);
        }
    }, [paramId]);

    return isLoaded ? <AppView /> : <ParamSelectorView />;
}
