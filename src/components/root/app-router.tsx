import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AppView from './app-view';
import { useRootDispatch, useRootSelector } from '../../redux';
import rmgRuntime from '@railmapgen/rmg-runtime';
import { LanguageCode } from '@railmapgen/rmg-translate';
import ParamSelectorView from './param-selector-view';
import { readParam } from '../../redux/app/action';

export default function AppRouter() {
    const dispatch = useRootDispatch();

    const { currentParamId } = useRootSelector(state => state.app);
    const [searchParams] = useSearchParams();
    const paramId = searchParams.get('project');

    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        console.log('searchParam: project=' + paramId);
        if (paramId) {
            if (paramId === currentParamId) {
                setIsLoaded(true);
            } else {
                console.warn(
                    'AppRouter:: URL param ID does not match store param ID. Reading param with ID=' + paramId
                );
                dispatch(readParam(paramId, rmgRuntime.getLanguage() as LanguageCode));
                setIsLoaded(true);
            }
        } else {
            console.log('AppRouter:: Render param selector');
        }
    }, [paramId]);

    return isLoaded ? <AppView /> : <ParamSelectorView />;
}
