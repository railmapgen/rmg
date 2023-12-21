import { createParamInLocalStorage, createTestStore } from '../../setupTests';
import rmgRuntime from '@railmapgen/rmg-runtime';
import { RootStore } from '../index';
import { LocalStorageKey } from '../../constants/constants';
import { readParam } from './action';
import { vi } from 'vitest';
import * as paramUpdaterUtils from '../../util/param-updater-utils';

let mockStore: RootStore;

const updateThemesSpy = vi.spyOn(paramUpdaterUtils, 'updateThemes');

describe('AppAction', () => {
    beforeAll(async () => {
        await rmgRuntime.ready();
    });

    describe('AppAction - readParam', () => {
        beforeEach(() => {
            mockStore = createTestStore();
            window.localStorage.clear();
            updateThemesSpy.mockImplementation(param => Promise.resolve(param));
        });

        it('Can read param from localStorage and save to store', async () => {
            createParamInLocalStorage('test-id');

            const result = await mockStore.dispatch(readParam('test-id'));
            expect(result).toBeTruthy();

            expect(mockStore.getState().app.paramConfig).toEqual({ id: 'test-id' });
            expect(mockStore.getState().param.line_num).toBe('test-id');
        });

        it('Can read param config and param from localStorage and save to store', async () => {
            const now = new Date().getTime();
            createParamInLocalStorage('test-id');
            rmgRuntime.storage.set(
                LocalStorageKey.PARAM_CONFIG_BY_ID + 'test-id',
                JSON.stringify({
                    lastModified: now,
                    name: 'My Masterpiece',
                })
            );

            const result = await mockStore.dispatch(readParam('test-id'));
            expect(result).toBeTruthy();

            expect(mockStore.getState().app.paramConfig).toEqual({
                id: 'test-id',
                lastModified: now,
                name: 'My Masterpiece',
            });
            expect(mockStore.getState().param.line_num).toBe('test-id');
        });

        it('Can return false if param in localStorage is invalid', async () => {
            rmgRuntime.storage.set(LocalStorageKey.PARAM_BY_ID + 'test-id', 'invalid');

            const result = await mockStore.dispatch(readParam('test-id'));
            expect(result).toBeFalsy();

            expect(mockStore.getState().app.paramConfig).toBeUndefined();
        });

        it('Can return false if param not found in localStorage', async () => {
            const result = await mockStore.dispatch(readParam('test-id'));
            expect(result).toBeFalsy();

            expect(mockStore.getState().app.paramConfig).toBeUndefined();
        });
    });
});
