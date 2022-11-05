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
    const registry: ParamConfig[] = [];
    iterateLocalStorage(
        key => key.startsWith(LocalStorageKey.PARAM_CONFIG_BY_ID),
        (key, value) => {
            const id = key.slice(LocalStorageKey.PARAM_CONFIG_BY_ID.length);
            if (value) {
                try {
                    const config = JSON.parse(value);
                    registry.push({ ...config, id });
                } catch (err) {
                    registry.push({ id });
                }
            } else {
                registry.push({ id });
            }
        }
    );

    console.log(
        'loadParamRegistry():: Found param config in localStorage',
        registry.map(config => config.id)
    );
    return registry;
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
    iterateLocalStorage(
        key => key.startsWith(LocalStorageKey.PARAM_BY_ID),
        key => {
            const paramId = key.slice(LocalStorageKey.PARAM_BY_ID.length);

            const loadedConfig = loadedParamRegistry.find(config => config.id === paramId);
            if (loadedConfig) {
                actualParamRegistry.push(loadedConfig);
            } else {
                actualParamRegistry.push({ id: paramId });
            }
        }
    );

    console.log(
        'getParamRegistry():: Actual param found in localStorage',
        actualParamRegistry.map(config => config.id)
    );
    return actualParamRegistry;
};

const iterateLocalStorage = (
    predicate: (key: string) => boolean,
    callback: (key: string, value: string | null) => void
): void => {
    let count = 0;
    while (count < window.localStorage.length) {
        const key = window.localStorage.key(count);
        if (key !== null && predicate(key)) {
            callback(key, window.localStorage.getItem(key));
        }
        count++;
    }
};
