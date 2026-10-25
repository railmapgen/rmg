// 测试：验证项目管理工具所覆盖的通用工具行为。
import { getParamRegistry, loadParamRegistry } from './param-manager-utils';
import { LocalStorageKey } from '../constants/constants';
import { createParamInLocalStorage } from '../setupTests';
import rmgRuntime from '@railmapgen/rmg-runtime';

describe('ParamMgrUtils', async () => {
    await rmgRuntime.ready();

    describe('ParamMgrUtils - loadParamRegistry', () => {
        afterEach(() => {
            rmgRuntime.storage.clear();
        });

        it('Can reset param registry if not found in localStorage', () => {
            const result = loadParamRegistry();
            expect(result).toHaveLength(0);
        });

        it('Can load param registry from localStorage as expected', () => {
            rmgRuntime.storage.set(
                LocalStorageKey.PARAM_CONFIG_BY_ID + 'test-id',
                JSON.stringify({ lastModified: Date.now() })
            );
            const result = loadParamRegistry();
            expect(result).toHaveLength(1);
            expect(result).toContainEqual({ id: 'test-id', lastModified: expect.any(Number) });
        });
    });

    describe('ParamMgrUtils - getParamRegistry', () => {
        afterEach(() => {
            rmgRuntime.storage.clear();
        });

        it('Can sync loaded param registry with actual param stored in localStorage as expected', () => {
            // 01：保留，02：移除，03：新增

            createParamInLocalStorage('test-01');
            createParamInLocalStorage('test-03');
            rmgRuntime.storage.set(
                LocalStorageKey.PARAM_CONFIG_BY_ID + 'test-01',
                JSON.stringify({ lastModified: Date.now() })
            );
            rmgRuntime.storage.set(
                LocalStorageKey.PARAM_CONFIG_BY_ID + 'test-02',
                JSON.stringify({ lastModified: Date.now() })
            );

            // 获取实际项目清单
            const result = getParamRegistry();
            expect(result).toHaveLength(2);
            expect(result).toContainEqual(expect.objectContaining({ id: 'test-01' }));
            expect(result).toContainEqual(expect.objectContaining({ id: 'test-03' }));

            // 从 localStorage 移除无效项目配置
            expect(rmgRuntime.storage.get(LocalStorageKey.PARAM_CONFIG_BY_ID + 'test-02')).toBeNull();
        });
    });
});
