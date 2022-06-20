import rootReducer from '../index';
import appReducer, { closeGlobalAlert, selectCanvas, setGlobalAlert, zoomToScale } from './app-slice';
import { createMockAppStore } from '../../setupTests';
import { CanvasType } from '../../constants/constants';

const realStore = rootReducer.getState();
const mockStore = createMockAppStore({ ...realStore });

const windowSpy = jest.spyOn(window, 'window', 'get');
const mockEmptyPromise = jest.fn().mockResolvedValue(void 0);

describe('AppSlice', () => {
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
        expect(actions).toContainEqual({ type: 'app/setCanvasScale', payload: 1.1 });
    });

    it('Can set canvas and write to localStorage as expected', async () => {
        await mockStore.dispatch(selectCanvas(CanvasType.RailMap));

        expect(mockEmptyPromise).toBeCalledTimes(1);
        expect(mockEmptyPromise).toBeCalledWith('rmgCanvas', CanvasType.RailMap);

        const actions = mockStore.getActions();
        expect(actions).toHaveLength(1);
        expect(actions).toContainEqual({ type: 'app/setCanvasToShow', payload: 'railmap' });
    });

    describe('AppSlice - global alerts', () => {
        const initialState = {
            ...realStore.app,
            globalAlerts: {
                info: {
                    message: 'Test info message',
                    url: 'https://example.com',
                },
            },
        };

        it('Can add new type of alert', () => {
            const nextState = appReducer(
                initialState,
                setGlobalAlert({ status: 'warning', message: 'Test warning message' })
            );
            expect(nextState.globalAlerts).toEqual({ info: expect.any(Object), warning: expect.any(Object) });
        });

        it('Can override existing type of alert', () => {
            const nextState = appReducer(
                initialState,
                setGlobalAlert({ status: 'info', message: 'Test updated info message' })
            );
            expect(nextState.globalAlerts).toEqual({ info: { message: 'Test updated info message' } });
        });

        it('Can close alert as expected', () => {
            const nextState = appReducer(initialState, closeGlobalAlert('info'));
            expect(nextState.globalAlerts).not.toHaveProperty('info');
        });
    });
});
