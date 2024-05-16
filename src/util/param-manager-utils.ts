import { LocalStorageKey, ParamConfig } from '../constants/constants';
import { nanoid } from 'nanoid';
import rmgRuntime, { logger } from '@railmapgen/rmg-runtime';

export const loadParamRegistry = (): ParamConfig[] => {
    const prefix = `${rmgRuntime.getAppName()}__${LocalStorageKey.PARAM_CONFIG_BY_ID}`;
    const registry: ParamConfig[] = Object.entries(rmgRuntime.storage.getAll())
        .filter(([key]) => key.startsWith(prefix))
        .map(([key, value]) => {
            const id = key.slice(prefix.length);
            if (value) {
                try {
                    return { ...JSON.parse(value), id };
                } catch (err) {
                    return { id };
                }
            } else {
                return { id };
            }
        });

    logger.info(
        'loadParamRegistry(), Found param config in localStorage',
        registry.map(config => config.id)
    );
    return registry;
};

export const getParamRegistry = (): ParamConfig[] => {
    // load all paramConfig from localStorage
    const loadedParamRegistry = loadParamRegistry();

    // sync paramRegistry with actual localStorage param items
    const prefix = `${rmgRuntime.getAppName()}__${LocalStorageKey.PARAM_BY_ID}`;
    const actualParamRegistry: ParamConfig[] = Object.keys(rmgRuntime.storage.getAll())
        .filter(key => key.startsWith(prefix))
        .map(key => {
            const paramId = key.slice(prefix.length);
            return loadedParamRegistry.find(config => config.id === paramId) ?? { id: paramId };
        });

    logger.info(
        'getParamRegistry(), Actual param found in localStorage',
        actualParamRegistry.map(config => config.id)
    );

    // remove invalid paramConfig from localStorage
    loadedParamRegistry
        .filter(config => actualParamRegistry.every(c => c.id !== config.id))
        .forEach(config => rmgRuntime.storage.remove(LocalStorageKey.PARAM_CONFIG_BY_ID + config.id));

    return actualParamRegistry;
};

export const getParamConfig = (id: string): ParamConfig | undefined => {
    const configStr = rmgRuntime.storage.get(LocalStorageKey.PARAM_CONFIG_BY_ID + id);
    return configStr ? JSON.parse(configStr) : configStr;
};

export const getParam = (id: string): { param: any; config?: ParamConfig } => {
    const paramStr = rmgRuntime.storage.get(LocalStorageKey.PARAM_BY_ID + id);
    return {
        param: paramStr ? JSON.parse(paramStr) : paramStr,
        config: getParamConfig(id),
    };
};

/**
 * @param param Accept any param string and save to localStorage. It will not be validated until opening it.
 * @param name Project name stored in paramConfig in localStorage.
 * @return ID assigned
 */
export const insertParam = (param: string, name?: string): string => {
    const id = nanoid();
    rmgRuntime.storage.set(LocalStorageKey.PARAM_BY_ID + id, param);
    rmgRuntime.storage.set(
        LocalStorageKey.PARAM_CONFIG_BY_ID + id,
        JSON.stringify({
            name,
            lastModified: Date.now(),
        })
    );
    return id;
};

export const downloadParam = async (url: string): Promise<string | null> => {
    const name = url.split('/').at(-1);
    try {
        const res = await fetch(url);
        if (res.ok) {
            const param = await res.text();
            return insertParam(param, name);
        } else {
            logger.warn('Failed to download param');
            return null;
        }
    } catch (err) {
        logger.warn('Failed to download param.', err);
        return null;
    }
};
