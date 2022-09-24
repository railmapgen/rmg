import rootReducer from './index';
import { createMockAppStore } from '../setupTests';
import { initCanvasScale, initCanvasToShow } from './init';

const realStore = rootReducer.getState();
const mockStore = createMockAppStore({ ...realStore });

const windowSpy = jest.spyOn(window, 'window', 'get');
const mockGetItem = jest.fn();
const mockSetItem = jest.fn();
const mockRemoveItem = jest.fn();

describe('ReduxInit', () => {
    describe('ReduxInit - initCanvasScale', () => {
        beforeEach(() => {
            windowSpy.mockImplementation(
                () =>
                    ({
                        localStorage: {
                            getItem: mockGetItem,
                            setItem: mockSetItem,
                            removeItem: mockRemoveItem,
                        },
                    } as any)
            );
        });

        afterEach(() => {
            jest.clearAllMocks();
            mockStore.clearActions();
        });

        it('Can read canvasScale from localStorage as expected', () => {
            mockGetItem.mockImplementation(key => (key === 'rmg__canvasScale' ? '0.5' : null));

            initCanvasScale(mockStore);

            const actions = mockStore.getActions();
            expect(actions).toContainEqual({ type: 'app/setCanvasScale', payload: 0.5 });
        });

        it('Can migrate canvasScale from old localStorage key as expected', () => {
            mockGetItem.mockImplementation(key => (key === 'rmgScale' ? '0.5' : null));

            initCanvasScale(mockStore);

            const actions = mockStore.getActions();
            expect(actions).toContainEqual({ type: 'app/setCanvasScale', payload: 0.5 });

            // save to localStorage with new key
            expect(mockSetItem).lastCalledWith('rmg__canvasScale', '0.5');
            expect(mockRemoveItem).lastCalledWith('rmgScale');
        });
    });

    describe('ReduxInit - initCanvasToShow', () => {
        beforeEach(() => {
            windowSpy.mockImplementation(
                () =>
                    ({
                        localStorage: {
                            getItem: mockGetItem,
                            setItem: mockSetItem,
                            removeItem: mockRemoveItem,
                        },
                    } as any)
            );
        });

        afterEach(() => {
            jest.clearAllMocks();
            mockStore.clearActions();
        });

        it('Can read canvasToShow from localStorage as expected', () => {
            mockGetItem.mockImplementation(key => (key === 'rmg__canvasToShow' ? 'railmap' : null));

            initCanvasToShow(mockStore);

            const actions = mockStore.getActions();
            expect(actions).toContainEqual({ type: 'app/setCanvasToShow', payload: 'railmap' });
        });

        it('Can migrate canvasToShow from old localStorage key as expected', () => {
            mockGetItem.mockImplementation(key => (key === 'rmgCanvas' ? 'railmap' : null));

            initCanvasToShow(mockStore);

            const actions = mockStore.getActions();
            expect(actions).toContainEqual({ type: 'app/setCanvasToShow', payload: 'railmap' });

            // save to localStorage with new key
            expect(mockSetItem).lastCalledWith('rmg__canvasToShow', 'railmap');
            expect(mockRemoveItem).lastCalledWith('rmgCanvas');
        });

        it('Can ignore invalid canvas from localStorage', () => {
            mockGetItem.mockImplementation(key => (key === 'rmg__canvasToShow' ? 'invalid' : null));

            initCanvasToShow(mockStore);

            const actions = mockStore.getActions();
            expect(actions).toHaveLength(0);
        });
    });
});
