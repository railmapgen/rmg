import rootReducer from '../index';
import { createMockAppStore, createParamInLocalStorage } from '../../setupTests';
import { LocalStorageKey } from '../../constants/constants';
import { readParam } from './action';

const realStore = rootReducer.getState();
const mockStore = createMockAppStore({ ...realStore });

describe('AppAction', () => {
    describe('AppAction - readParam', () => {
        afterEach(() => {
            mockStore.clearActions();
            window.localStorage.clear();
        });

        it('Can read param from localStorage and save to store', () => {
            createParamInLocalStorage('test-id');

            const result = mockStore.dispatch(readParam('test-id'));
            expect(result).toBeTruthy();

            const actions = mockStore.getActions();
            expect(actions).toContainEqual({ type: 'app/setParamConfig', payload: { id: 'test-id' } });
            expect(actions).toContainEqual({
                type: 'SET_FULL_PARAM',
                fullParam: expect.objectContaining({ line_num: 'test-id' }),
            });
        });

        it('Can read param config and param from localStorage and save to store', () => {
            const now = new Date().getTime();
            createParamInLocalStorage('test-id');
            window.localStorage.setItem(
                LocalStorageKey.PARAM_CONFIG_BY_ID + 'test-id',
                JSON.stringify({
                    lastModified: now,
                    name: 'My Masterpiece',
                })
            );

            const result = mockStore.dispatch(readParam('test-id'));
            expect(result).toBeTruthy();

            const actions = mockStore.getActions();
            expect(actions).toContainEqual({
                type: 'app/setParamConfig',
                payload: { id: 'test-id', lastModified: now, name: 'My Masterpiece' },
            });
            expect(actions).toContainEqual({
                type: 'SET_FULL_PARAM',
                fullParam: expect.objectContaining({ line_num: 'test-id' }),
            });
        });

        it('Can return false if param in localStorage is invalid', () => {
            window.localStorage.setItem(LocalStorageKey.PARAM_BY_ID + 'test-id', 'invalid');

            const result = mockStore.dispatch(readParam('test-id'));
            expect(result).toBeFalsy();

            const actions = mockStore.getActions();
            expect(actions).toHaveLength(0);
        });

        it('Can return false if param not found in localStorage', () => {
            const result = mockStore.dispatch(readParam('test-id'));
            expect(result).toBeFalsy();

            const actions = mockStore.getActions();
            expect(actions).toHaveLength(0);
        });
    });
});
