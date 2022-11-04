import { LocalStorageKey, ParamConfig } from '../constants/constants';
import { nanoid } from 'nanoid';

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

export const loadParamRegistry = (): ParamConfig[] => {
    const paramRegistryStr = window.localStorage.getItem(LocalStorageKey.PARAM_REGISTRY);
    if (paramRegistryStr !== null) {
        try {
            const paramRegistry = JSON.parse(paramRegistryStr);
            if (Array.isArray(paramRegistry)) {
                console.log(
                    'loadParamRegistry():: Read param registry from localStorage. Size=' + paramRegistry.length
                );
                return paramRegistry;
            } else {
                throw new Error('Invalid format of param registry');
            }
        } catch (err) {
            console.warn('loadParamRegistry():: Failed to parse param registry. Resetting to empty list...', err);
            return [];
        }
    } else {
        console.log('loadParamRegistry():: Param registry not found in localStorage. Resetting to empty list...');
        return [];
    }
};

export const upgradeLegacyParam = () => {
    let contents = window.localStorage.getItem(LocalStorageKey.PARAM);
    if (contents === null) {
        contents = window.localStorage.getItem('rmgParam');
        window.localStorage.removeItem('rmgParam');
        window.localStorage.removeItem('rmgParamRedux');
    }

    if (contents !== null) {
        const paramId = nanoid();
        console.log('upgradeLegacyParam():: Found legacy param. Assigning ID:', paramId);
        window.localStorage.setItem(LocalStorageKey.PARAM_BY_ID + paramId, contents);
        window.localStorage.removeItem(LocalStorageKey.PARAM);
    }
};

export const getParamRegistry = (): ParamConfig[] => {
    const loadedParamRegistry = loadParamRegistry();

    // sync paramRegistry with localStorage items
    const actualParamRegistry: ParamConfig[] = [];
    let count = 0;
    while (count < window.localStorage.length) {
        const key = window.localStorage.key(count);
        if (key?.startsWith(LocalStorageKey.PARAM_BY_ID)) {
            const paramId = key.slice(LocalStorageKey.PARAM_BY_ID.length);

            const loadedConfig = loadedParamRegistry.find(config => config.id === paramId);
            if (loadedConfig) {
                actualParamRegistry.push(loadedConfig);
            } else {
                actualParamRegistry.push({ id: paramId });
            }
        }
        count++;
    }

    return actualParamRegistry;
};
