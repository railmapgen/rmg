import { RootDispatch } from '../index';
import { LocalStorageKey, ParamConfig, RMGParam } from '../../constants/constants';
import { updateParam } from '../../util/param-updater-utils';
import { setFullParam } from '../param/action';
import { setParamConfig } from './app-slice';

export const readParam = (paramId: string) => {
    return (dispatch: RootDispatch): boolean => {
        let nextParamConfig: ParamConfig = { id: paramId };
        const configStr = window.localStorage.getItem(LocalStorageKey.PARAM_CONFIG_BY_ID + paramId);
        if (configStr === null) {
            console.warn(`Config for paramID=${paramId} does not exist in localStorage`);
        } else {
            nextParamConfig = { ...nextParamConfig, ...JSON.parse(configStr) };
        }

        try {
            const paramStr = window.localStorage.getItem(LocalStorageKey.PARAM_BY_ID + paramId);
            if (paramStr === null) {
                console.warn(`Param ID=${paramId} does not exist in localStorage`);
                return false;
            } else {
                const nextParam = updateParam(JSON.parse(paramStr)) as RMGParam;
                dispatch(setParamConfig(nextParamConfig));
                dispatch(setFullParam(nextParam));
                return true;
            }
        } catch (err) {
            console.warn('Failed to parse param.', err);
            return false;
        }
    };
};
