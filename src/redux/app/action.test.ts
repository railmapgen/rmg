import rootReducer from '../index';
import { createMockAppStore } from '../../setupTests';
import { LocalStorageKey, RmgStyle } from '../../constants/constants';
import { initParam } from '../param/util';
import { LanguageCode } from '@railmapgen/rmg-translate';
import { readParam } from './action';

const realStore = rootReducer.getState();
const mockStore = createMockAppStore({ ...realStore });

describe('AppAction', () => {
    describe('AppAction - readParam', () => {
        const generateParam = (id: string) => {
            const rmgParam = initParam(RmgStyle.MTR, LanguageCode.ChineseTrad);
            rmgParam.line_num = id;
            return rmgParam;
        };

        const setup = () => {
            const rmgParam = generateParam('test-id');
            window.localStorage.setItem(LocalStorageKey.PARAM_BY_ID + 'test-id', JSON.stringify(rmgParam));
        };

        afterEach(() => {
            mockStore.clearActions();
            window.localStorage.clear();
        });

        it('Can read param from localStorage and save to store', () => {
            setup();
            mockStore.dispatch(readParam('test-id', LanguageCode.English));

            const actions = mockStore.getActions();
            expect(actions).toContainEqual({ type: 'app/setCurrentParamId', payload: 'test-id' });
            expect(actions).toContainEqual({
                type: 'SET_FULL_PARAM',
                fullParam: expect.objectContaining({ line_num: 'test-id' }),
            });
        });

        it('Can generate new param if param in localStorage is invalid', () => {
            window.localStorage.setItem(LocalStorageKey.PARAM_BY_ID + 'test-id', 'invalid');
            mockStore.dispatch(readParam('test-id', LanguageCode.English));

            const actions = mockStore.getActions();
            expect(actions).toContainEqual({ type: 'app/setCurrentParamId', payload: 'test-id' });
            expect(actions).toContainEqual({
                type: 'SET_FULL_PARAM',
                fullParam: expect.not.objectContaining({ line_num: 'test-id' }),
            });
        });

        it('Can generate new param if param not found in localStorage', () => {
            mockStore.dispatch(readParam('test-id', LanguageCode.English));

            const actions = mockStore.getActions();
            expect(actions).toContainEqual({ type: 'app/setCurrentParamId', payload: 'test-id' });
            expect(actions).toContainEqual({
                type: 'SET_FULL_PARAM',
                fullParam: expect.not.objectContaining({ line_num: 'test-id' }),
            });
        });
    });
});
