import rootReducer from './index';
import { createMockAppStore } from '../setupTests';
import { initCanvasScale, initCanvasToShow } from './init';
import { CanvasType, LocalStorageKey } from '../constants/constants';

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
});
