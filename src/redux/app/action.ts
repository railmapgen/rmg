import { LanguageCode } from '@railmapgen/rmg-translate';
import { RootDispatch } from '../index';
import { LocalStorageKey, ParamConfig, RMGParam, RmgStyle } from '../../constants/constants';
import { updateParam } from '../../utils';
import { setFullParam } from '../param/action';
import { initParam } from '../param/util';
import { setParamConfig } from './app-slice';

export const readParam = (paramId: string, language: LanguageCode) => {
    return (dispatch: RootDispatch) => {
        try {
            const configStr = window.localStorage.getItem(LocalStorageKey.PARAM_CONFIG_BY_ID + paramId);
            if (configStr === null) {
                throw new Error(`Config for paramID=${paramId} does not exist in localStorage`);
            }
            const nextConfig: ParamConfig = { ...JSON.parse(configStr), id: paramId };
            dispatch(setParamConfig(nextConfig));
        } catch (err) {
            console.warn('Failed to parse param config.', err);
            console.log('Initiating new config for paramID=' + paramId);

            dispatch(setParamConfig({ id: paramId }));
        }

        try {
            const paramStr = window.localStorage.getItem(LocalStorageKey.PARAM_BY_ID + paramId);
            if (paramStr === null) {
                throw new Error(`Param ID=${paramId} does not exist in localStorage`);
            }
            const nextParam = updateParam(JSON.parse(paramStr)) as RMGParam;
            dispatch(setFullParam(nextParam));
        } catch (err) {
            console.warn('Failed to parse param.', err);
            // FIXME: show error preventing from opening app view
            console.log('Initiating new param for ID=' + paramId);

            const nextParam = initParam(RmgStyle.MTR, language);
            dispatch(setFullParam(nextParam));
        }
    };
};
