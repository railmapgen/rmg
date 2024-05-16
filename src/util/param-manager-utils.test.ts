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
            // 01: keep, 02: remove, 03: add

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

            // get actual param registry
            const result = getParamRegistry();
            expect(result).toHaveLength(2);
            expect(result).toContainEqual(expect.objectContaining({ id: 'test-01' }));
            expect(result).toContainEqual(expect.objectContaining({ id: 'test-03' }));

            // remove invalid param config from localStorage
            expect(rmgRuntime.storage.get(LocalStorageKey.PARAM_CONFIG_BY_ID + 'test-02')).toBeNull();
        });
    });
});
