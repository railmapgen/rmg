// 项目存储工具：维护浏览器中的项目清单、参数读取和下载写入。
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
                } catch {
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
    // 从 localStorage 加载全部项目配置
    const loadedParamRegistry = loadParamRegistry();

    // 用实际存储项同步项目清单
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

    // 从 localStorage 移除无效项目配置
    loadedParamRegistry
        .filter(config => actualParamRegistry.every(c => c.id !== config.id))
        .forEach(config => rmgRuntime.storage.remove(LocalStorageKey.PARAM_CONFIG_BY_ID + config.id));

    return actualParamRegistry;
};

export const getParamConfig = (id: string): ParamConfig | undefined => {
    const configStr = rmgRuntime.storage.get(LocalStorageKey.PARAM_CONFIG_BY_ID + id);
    return configStr ? JSON.parse(configStr) : undefined;
};

export const getParam = (id: string): { param: any; config?: ParamConfig } => {
    const paramStr = rmgRuntime.storage.get(LocalStorageKey.PARAM_BY_ID + id);
    return {
        param: paramStr ? JSON.parse(paramStr) : paramStr,
        config: getParamConfig(id),
    };
};

/**
 * @param param 接受任意参数字符串并写入 localStorage，直到打开项目时才校验
 * @param name 写入 localStorage 项目配置中的名称
 * @return 分配的项目 ID
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
