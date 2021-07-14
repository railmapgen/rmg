import { RMGParam } from '../../constants/constants';

export const SET_FULL_PARAM = 'SET_FULL_PARAM';

export interface setFullParamAction {
    type: typeof SET_FULL_PARAM;
    fullParam: RMGParam;
}

export const setFullParam = (fullParam: RMGParam) => {
    return { type: SET_FULL_PARAM, fullParam } as setFullParamAction;
};
