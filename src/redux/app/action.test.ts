import rootReducer from '../';
import {
    closeGlobalAlert,
    selectCanvas,
    SET_CANVAS_SCALE,
    SET_CANVAS_TO_SHOW,
    SET_CANVAS_TO_SHOW_STATUS,
    SET_GLOBAL_ALERTS,
    setGlobalAlert,
    zoomToScale,
} from './action';
import { CanvasType, LoadingStatus } from '../../constants/constants';
import { createMockAppStore } from '../../setupTests';

const realStore = rootReducer.getState();
const mockStore = createMockAppStore({ ...realStore });

const windowSpy = jest.spyOn(window, 'window', 'get');

const mockEmptyPromise = jest.fn().mockResolvedValue(void 0);

describe('AppActions', () => {
    beforeEach(() => {
        windowSpy.mockImplementation(
            () =>
                ({
                    rmgStorage: {
                        writeFile: mockEmptyPromise,
                    },
                } as any)
        );
    });

    afterEach(() => {
        mockStore.clearActions();
        jest.clearAllMocks();
    });

    it('Can set canvas scale and write to localStorage as expected', async () => {
        await mockStore.dispatch(zoomToScale(1.1));

        expect(mockEmptyPromise).toBeCalledTimes(1);
        expect(mockEmptyPromise).toBeCalledWith('rmgScale', '1.1');

        const actions = mockStore.getActions();
        expect(actions).toHaveLength(1);
        expect(actions.find(action => action.type === SET_CANVAS_SCALE && action.canvasScale === 1.1)).toBeDefined();
    });

    it('Can handle select canvas correctly', async () => {
        await mockStore.dispatch(selectCanvas(CanvasType.RailMap));

        expect(mockEmptyPromise).toBeCalledTimes(1);
        expect(mockEmptyPromise).toBeCalledWith('rmgCanvas', CanvasType.RailMap);

        const actions = mockStore.getActions();
        expect(actions).toHaveLength(3);
        expect(
            actions.find(
                action =>
                    action.type === SET_CANVAS_TO_SHOW_STATUS && action.canvasToShowStatus === LoadingStatus.loading
            )
        ).toBeDefined();
        expect(
            actions.find(action => action.type === SET_CANVAS_TO_SHOW && action.canvasToShow === CanvasType.RailMap)
        ).toBeDefined();
        expect(
            actions.find(
                action =>
                    action.type === SET_CANVAS_TO_SHOW_STATUS && action.canvasToShowStatus === LoadingStatus.loaded
            )
        ).toBeDefined();
    });

    describe('AppAction - global alerts', () => {
        const mockStore = createMockAppStore({
            ...realStore,
            app: {
                ...realStore.app,
                globalAlerts: {
                    info: {
                        message: 'Test info message',
                        url: 'https://example.com',
                    },
                },
            },
        });

        afterEach(() => {
            mockStore.clearActions();
        });

        it('Can add new type of alert', () => {
            mockStore.dispatch(setGlobalAlert('warning', 'Test warning message'));

            const actions = mockStore.getActions();
            expect(actions).toHaveLength(1);
            expect(actions).toContainEqual({
                type: SET_GLOBAL_ALERTS,
                globalAlerts: expect.objectContaining({ info: expect.any(Object), warning: expect.any(Object) }),
            });
        });

        it('Can override existing type of alert', () => {
            mockStore.dispatch(setGlobalAlert('info', 'Test updated info message'));

            const actions = mockStore.getActions();
            expect(actions).toHaveLength(1);
            expect(actions).toContainEqual({
                type: SET_GLOBAL_ALERTS,
                globalAlerts: expect.objectContaining({ info: { message: 'Test updated info message' } }),
            });
        });

        it('Can close alert as expected', () => {
            mockStore.dispatch(closeGlobalAlert('info'));

            const actions = mockStore.getActions();
            expect(actions).toHaveLength(1);
            expect(actions).toContainEqual({
                type: SET_GLOBAL_ALERTS,
                globalAlerts: {},
            });
        });
    });
});
