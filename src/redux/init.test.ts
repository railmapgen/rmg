import rootReducer from './index';
import { createMockAppStore } from '../setupTests';
import { initCanvasScale, initCanvasToShow, paramUpdateTrigger } from './init';
import { CanvasType, LocalStorageKey, RMGParam, RmgStyle } from '../constants/constants';
import { initParam } from './param/util';
import { LanguageCode } from '@railmapgen/rmg-translate';
import { vi } from 'vitest';

const realStore = rootReducer.getState();
const mockStore = createMockAppStore({ ...realStore });

describe('ReduxInit', () => {
    describe('ReduxInit - initCanvasScale', () => {
        afterEach(() => {
            mockStore.clearActions();
            window.localStorage.clear();
        });

        it('Can read canvasScale from localStorage as expected', () => {
            window.localStorage.setItem(LocalStorageKey.CANVAS_SCALE, '0.5');
            initCanvasScale(mockStore);

            const actions = mockStore.getActions();
            expect(actions).toContainEqual({ type: 'app/setCanvasScale', payload: 0.5 });
        });

        it('Can migrate canvasScale from old localStorage key as expected', () => {
            window.localStorage.setItem('rmgScale', '0.5');
            initCanvasScale(mockStore);

            const actions = mockStore.getActions();
            expect(actions).toContainEqual({ type: 'app/setCanvasScale', payload: 0.5 });

            // save to localStorage with new key
            expect(window.localStorage.getItem(LocalStorageKey.CANVAS_SCALE)).toBe('0.5');
            expect(window.localStorage.getItem('rmgScale')).toBeNull();
        });
    });

    describe('ReduxInit - initCanvasToShow', () => {
        afterEach(() => {
            mockStore.clearActions();
            window.localStorage.clear();
        });

        it('Can read canvasToShow from localStorage as expected', () => {
            window.localStorage.setItem(
                LocalStorageKey.CANVAS_TO_SHOW,
                JSON.stringify([CanvasType.Destination, CanvasType.RailMap])
            );
            initCanvasToShow(mockStore);

            const actions = mockStore.getActions();
            expect(actions).toContainEqual({ type: 'app/setCanvasToShow', payload: ['destination', 'railmap'] });
        });

        it('Can migrate canvasToShow from old localStorage key as expected', () => {
            window.localStorage.setItem('rmgCanvas', 'railmap');
            initCanvasToShow(mockStore);

            const actions = mockStore.getActions();
            expect(actions).toContainEqual({ type: 'app/setCanvasToShow', payload: ['railmap'] });

            // save to localStorage with new key
            expect(window.localStorage.getItem(LocalStorageKey.CANVAS_TO_SHOW)).toBe('railmap');
            expect(window.localStorage.getItem('rmgCanvas')).toBeNull();
        });

        it('Can ignore invalid canvas from localStorage', () => {
            window.localStorage.setItem(LocalStorageKey.CANVAS_TO_SHOW, 'invalid');
            initCanvasToShow(mockStore);

            const actions = mockStore.getActions();
            expect(actions).toHaveLength(0);
        });

        it('Can parse string type canvasToShow from localStorage key as expected', () => {
            window.localStorage.setItem(LocalStorageKey.CANVAS_TO_SHOW, 'railmap');
            initCanvasToShow(mockStore);

            const actions = mockStore.getActions();
            expect(actions).toContainEqual({ type: 'app/setCanvasToShow', payload: ['railmap'] });
        });
    });

    describe('ReduxInit - paramUpdateTrigger', () => {
        const mockDispatch = vi.fn();
        const getMockParam = (id: string): RMGParam => {
            const mockParam = initParam(RmgStyle.MTR, LanguageCode.English);
            mockParam.line_num = id;
            return mockParam;
        };

        afterEach(() => {
            window.localStorage.clear();
            vi.clearAllMocks();
        });

        it('Can update param and param config in localStorage as expected', () => {
            const now = Date.now();
            const nextParam = getMockParam('test-id');

            // current param in localStorage is outdated
            expect(window.localStorage.getItem(LocalStorageKey.PARAM_BY_ID + 'test-id')).not.toEqual(
                JSON.stringify(nextParam)
            );

            // receive changes in param redux store
            const mockListenerApi = {
                getState: () => ({
                    app: {
                        paramConfig: { id: 'test-id', lastModified: now },
                    },
                    param: nextParam,
                }),
                dispatch: mockDispatch,
            } as any;
            paramUpdateTrigger({ type: 'MOCK_ACTION' }, mockListenerApi);

            // param in localStorage is updated
            expect(window.localStorage.getItem(LocalStorageKey.PARAM_BY_ID + 'test-id')).toEqual(
                JSON.stringify(nextParam)
            );

            // param config in redux and localStorage are updated
            expect(mockDispatch).toBeCalledTimes(1);
            expect(mockDispatch).lastCalledWith({ type: 'app/updateParamModifiedTime', payload: expect.any(Number) });

            const lastModified = mockDispatch.mock.calls[0][0].payload;
            expect(lastModified).toBeGreaterThan(now);
            expect(window.localStorage.getItem(LocalStorageKey.PARAM_CONFIG_BY_ID + 'test-id')).toBe(
                JSON.stringify({ lastModified })
            );
        });

        it('Do not update param config in localStorage if no changes in param', () => {
            const lastModified = Date.now() - 60 * 1000;
            const nextParam = getMockParam('test-id');
            window.localStorage.setItem(LocalStorageKey.PARAM_BY_ID + 'test-id', JSON.stringify(nextParam));
            window.localStorage.setItem(
                LocalStorageKey.PARAM_CONFIG_BY_ID + 'test-id',
                JSON.stringify({ lastModified })
            );

            // receive null change in param redux store
            const mockListenerApi = {
                getState: () => ({
                    app: {
                        paramConfig: { id: 'test-id', lastModified },
                    },
                    param: nextParam,
                }),
                dispatch: mockDispatch,
            } as any;
            paramUpdateTrigger({ type: 'MOCK_ACTION' }, mockListenerApi);

            // param in localStorage is unchanged
            expect(window.localStorage.getItem(LocalStorageKey.PARAM_BY_ID + 'test-id')).toEqual(
                JSON.stringify(nextParam)
            );

            // param config in redux and localStorage are unchanged
            expect(mockDispatch).toBeCalledTimes(0);
            expect(window.localStorage.getItem(LocalStorageKey.PARAM_CONFIG_BY_ID + 'test-id')).toEqual(
                JSON.stringify({ lastModified })
            );
        });
    });

    it('Do not update param or param config in localStorage if no param selected', () => {
        // TODO: add unit test
    });
});
