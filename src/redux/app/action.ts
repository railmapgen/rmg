import { RootDispatch } from '../index';
import { RMGParam } from '../../constants/constants';
import { updateParam, updateThemes } from '../../util/param-updater-utils';
import { setFullParam } from '../param/action';
import { setParamConfig } from './app-slice';
import { getParam } from '../../util/param-manager-utils';

export const readParam = (paramId: string) => {
    return async (dispatch: RootDispatch): Promise<boolean> => {
        try {
            const { config, param } = getParam(paramId);
            if (!param) {
                return false;
            }

            const nextParamConfig = { id: paramId, ...(config ?? {}) };
            const nextParam = updateParam(param) as RMGParam;
            try {
                const updatedParam = await updateThemes(nextParam);
                dispatch(setParamConfig(nextParamConfig));
                dispatch(setFullParam(updatedParam));
            } catch (e) {
                dispatch(setParamConfig(nextParamConfig));
                dispatch(setFullParam(nextParam));
            }
            return true;
        } catch (err) {
            console.warn('Failed to parse param.', err);
            return false;
        }
    };
};
