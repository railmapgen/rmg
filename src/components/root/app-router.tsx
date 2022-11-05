import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AppView from './app-view';
import { useRootDispatch, useRootSelector } from '../../redux';
import rmgRuntime, { RmgEnv } from '@railmapgen/rmg-runtime';
import { LanguageCode } from '@railmapgen/rmg-translate';
import ParamSelectorView from '../param-selector-view';
import { readParam } from '../../redux/app/action';
import { getParamMap } from '../../util/param-manager-utils';
import { nanoid } from 'nanoid';

export default function AppRouter() {
    const dispatch = useRootDispatch();

    const { paramConfig } = useRootSelector(state => state.app);
    const [searchParams, setSearchParams] = useSearchParams();
    const paramId = searchParams.get('project');

    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        console.log('searchParam: project=' + paramId);
        if (paramId) {
            if (paramId === paramConfig?.id) {
                console.log('AppRouter:: Store param ID matches URL param ID. Rendering app view...');
                setIsLoaded(true);
            } else {
                if (rmgRuntime.getEnv() === RmgEnv.PRD) {
                    const paramMap = getParamMap();
                    const paramIds = Object.keys(paramMap);
                    if (paramIds.length && !paramIds.includes(paramId)) {
                        console.warn(
                            'AppRouter:: URL param ID does not exist in localStorage. Reset to first param in localStorage in PRD env.'
                        );
                        const paramMap = getParamMap();
                        setSearchParams({ project: Object.keys(paramMap)[0] });
                        return;
                    }
                }

                console.log(`AppRouter:: Reading param (ID=${paramId}) from localStorage`);
                dispatch(readParam(paramId, rmgRuntime.getLanguage() as LanguageCode));
                setIsLoaded(true);
            }
        } else {
            if (rmgRuntime.getEnv() === RmgEnv.PRD) {
                console.log('AppRouter:: Redirect to first param in localStorage in PRD env');
                const paramMap = getParamMap();
                setSearchParams({ project: Object.keys(paramMap)[0] ?? nanoid() });
            } else {
                console.log('AppRouter:: No URL param ID provided. Rendering param selector view...');
            }
        }
    }, [paramId]);

    return isLoaded ? <AppView /> : <ParamSelectorView />;
}
