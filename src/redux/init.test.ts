import rmgRuntime from '@railmapgen/rmg-runtime';
import { RootStore } from './index';
import { createTestStore } from '../setupTests';
import { initCanvasScale, initCanvasToShow, paramUpdateTrigger } from './init';
import { CanvasType, LocalStorageKey, RMGParam, RmgStyle } from '../constants/constants';
import { initParam } from './param/util';
import { vi } from 'vitest';
import { getParam } from '../util/param-manager-utils';

let mockStore: RootStore;

describe('ReduxInit', () => {
    beforeAll(async () => {
        await rmgRuntime.ready();
    });

    describe('ReduxInit - initCanvasScale', () => {
        beforeEach(() => {
            mockStore = createTestStore();
            rmgRuntime.storage.clear();
        });

        it('Can read canvasScale from localStorage as expected', () => {
            rmgRuntime.storage.set(LocalStorageKey.CANVAS_SCALE, '0.5');
            initCanvasScale(mockStore);
            expect(mockStore.getState().app.canvasScale).toBe(0.5);
        });
    });

    describe('ReduxInit - initCanvasToShow', () => {
        beforeEach(() => {
            mockStore = createTestStore();
            rmgRuntime.storage.clear();
        });

        it('Can read canvasToShow from localStorage as expected', () => {
            rmgRuntime.storage.set(
                LocalStorageKey.CANVAS_TO_SHOW,
                JSON.stringify([CanvasType.Destination, CanvasType.RailMap])
            );
            initCanvasToShow(mockStore);
            expect(mockStore.getState().app.canvasToShow).toEqual(['destination', 'railmap']);
        });

        it('Can ignore invalid canvas from localStorage', () => {
            rmgRuntime.storage.set(LocalStorageKey.CANVAS_TO_SHOW, 'invalid');
            const prevAppState = mockStore.getState().app;
            initCanvasToShow(mockStore);
            expect(mockStore.getState().app).toEqual(prevAppState);
        });
    });

    describe('ReduxInit - paramUpdateTrigger', () => {
        const mockDispatch = vi.fn();
        const getMockParam = (id: string): RMGParam => {
            const mockParam = initParam(RmgStyle.MTR, 'en');
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
            expect(rmgRuntime.storage.get(LocalStorageKey.PARAM_BY_ID + 'test-id')).not.toEqual(
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

            // param and config in localStorage are updated
            const { config, param } = getParam('test-id');
            expect(param).toEqual(nextParam);

            expect(mockDispatch).toBeCalledTimes(1);
            expect(mockDispatch).lastCalledWith({ type: 'app/updateParamModifiedTime', payload: expect.any(Number) });

            const lastModified = mockDispatch.mock.calls[0][0].payload;
            expect(lastModified).toBeGreaterThan(now);
            expect(config).toEqual({ lastModified });
        });

        it('Do not update param config in localStorage if no changes in param', () => {
            const lastModified = Date.now() - 60 * 1000;
            const nextParam = getMockParam('test-id');
            rmgRuntime.storage.set(LocalStorageKey.PARAM_BY_ID + 'test-id', JSON.stringify(nextParam));
            rmgRuntime.storage.set(LocalStorageKey.PARAM_CONFIG_BY_ID + 'test-id', JSON.stringify({ lastModified }));

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

            // param and config in localStorage are unchanged
            const { config, param } = getParam('test-id');
            expect(param).toEqual(nextParam);
            expect(mockDispatch).toBeCalledTimes(0);
            expect(config).toEqual({ lastModified });
        });
    });

    it('Do not update param or param config in localStorage if no param selected', () => {
        // TODO: add unit test
    });
});
