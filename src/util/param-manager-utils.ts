import { LocalStorageKey } from '../constants/constants';

export const getParamMap = (): Record<string, string> => {
    const paramMap: Record<string, string> = {};

    let count = 0;
    while (count < window.localStorage.length) {
        const key = window.localStorage.key(count);
        if (key?.startsWith(LocalStorageKey.PARAM_BY_ID)) {
            const paramStr = window.localStorage.getItem(key);
            if (paramStr !== null) {
                const paramId = key.slice(LocalStorageKey.PARAM_BY_ID.length);
                if (paramId) {
                    paramMap[paramId] = paramStr;
                }
            }
        }
        count++;
    }

    return paramMap;
};
