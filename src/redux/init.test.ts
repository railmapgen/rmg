import rootReducer from './index';
import { createMockAppStore } from '../setupTests';
import { initCanvasScale, initCanvasToShow, initParamStore } from './init';
import { initParam } from './param/util';
import { CanvasType, LocalStorageKey, RmgStyle } from '../constants/constants';
import { LanguageCode } from '@railmapgen/rmg-translate';

const realStore = rootReducer.getState();
const mockStore = createMockAppStore({ ...realStore });

const generateParam = (id: string) => {
    const rmgParam = initParam(RmgStyle.MTR, LanguageCode.ChineseTrad);
    rmgParam.line_num = id;
    return rmgParam;
};

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

    describe('ReduxInit - initParamStore - legacy param migration', () => {
        afterEach(() => {
            mockStore.clearActions();
            window.localStorage.clear();
        });

        it('Can read legacy rmgParam from localStorage as expected', () => {
            // stored in rmg__param key
            const rmgParam = generateParam('test-01');
            window.localStorage.setItem(LocalStorageKey.PARAM, JSON.stringify(rmgParam));
            initParamStore(mockStore);

            const actions = mockStore.getActions();
            expect(actions).toContainEqual({
                type: 'SET_FULL_PARAM',
                fullParam: expect.objectContaining({ line_num: 'test-01' }),
            });

            // assign new id and store in new key
            const currentParamId = actions.find(action => action.type === 'app/setCurrentParamId')?.payload;
            expect(currentParamId).toBeDefined();
            expect(window.localStorage.getItem(LocalStorageKey.PARAM_BY_ID + currentParamId)).toContain('test-01');

            // remove rmg__param key
            expect(window.localStorage.getItem(LocalStorageKey.PARAM)).toBeNull();
        });

        it('Can migrate legacy param from old localStorage key as expected', () => {
            // stored in rmgParam key
            const rmgParam = generateParam('test-02');
            window.localStorage.setItem('rmgParam', JSON.stringify(rmgParam));

            initParamStore(mockStore);

            const actions = mockStore.getActions();
            expect(actions).toContainEqual({
                type: 'SET_FULL_PARAM',
                fullParam: expect.objectContaining({ line_num: 'test-02' }),
            });

            // assign new id and store in new key
            const currentParamId = actions.find(action => action.type === 'app/setCurrentParamId')?.payload;
            expect(currentParamId).toBeDefined();
            expect(window.localStorage.getItem(LocalStorageKey.PARAM_BY_ID + currentParamId)).toContain('test-02');

            // remove rmgParam and rmgParamRedux keys
            expect(window.localStorage.getItem('rmgParam')).toBeNull();
            expect(window.localStorage.getItem('rmgParamRedux')).toBeNull();
        });

        it('Can generate new param if legacy param in localStorage is invalid', () => {
            window.localStorage.setItem(LocalStorageKey.PARAM, 'invalid');
            initParamStore(mockStore);

            const actions = mockStore.getActions();
            expect(actions).toContainEqual({
                type: 'SET_FULL_PARAM',
                fullParam: expect.any(Object),
            });

            // save to localStorage with new key
            const currentParamId = actions.find(action => action.type === 'app/setCurrentParamId')?.payload;
            expect(currentParamId).toBeDefined();
            expect(window.localStorage.getItem(LocalStorageKey.PARAM_BY_ID + currentParamId)).not.toBeNull();
            expect(window.localStorage.getItem(LocalStorageKey.PARAM_BY_ID + currentParamId)).not.toContain('invalid');

            // remove rmg__param key
            expect(window.localStorage.getItem(LocalStorageKey.PARAM)).toBeNull();
        });
    });

    describe('ReduxInit - initParamStore - param by id', () => {
        const setup = () => {
            const rmgParam1 = generateParam('test-11');
            const rmgParam2 = generateParam('test-12');

            window.localStorage.setItem(LocalStorageKey.PARAM_BY_ID + 'test-11', JSON.stringify(rmgParam1));
            window.localStorage.setItem(LocalStorageKey.PARAM_BY_ID + 'test-12', JSON.stringify(rmgParam2));
        };

        afterEach(() => {
            mockStore.clearActions();
            window.localStorage.clear();
        });

        it('Can read first param as expected', () => {
            setup();

            initParamStore(mockStore);

            const actions = mockStore.getActions();
            expect(actions).toContainEqual({
                type: 'SET_FULL_PARAM',
                fullParam: expect.objectContaining({ line_num: 'test-11' }),
            });
            expect(actions).toContainEqual({
                type: 'app/setCurrentParamId',
                payload: 'test-11',
            });
        });

        it('Can generate new param for first param if it is invalid', () => {
            window.localStorage.setItem(LocalStorageKey.PARAM_BY_ID + 'test-10', 'invalid');
            setup();

            initParamStore(mockStore);

            const actions = mockStore.getActions();
            expect(actions).toContainEqual({
                type: 'SET_FULL_PARAM',
                fullParam: expect.any(Object),
            });
            expect(actions).toContainEqual({
                type: 'app/setCurrentParamId',
                payload: 'test-10',
            });

            // update rmg__param:test-13 key
            expect(window.localStorage.getItem(LocalStorageKey.PARAM_BY_ID + 'test-10')).not.toBe('invalid');
            expect(window.localStorage.getItem(LocalStorageKey.PARAM_BY_ID + 'test-10')).not.toBeNull();
        });

        it('Can generate new param if no param found in localStorage', () => {
            initParamStore(mockStore);

            const actions = mockStore.getActions();
            expect(actions).toContainEqual({
                type: 'SET_FULL_PARAM',
                fullParam: expect.any(Object),
            });

            // save to localStorage with new key
            const currentParamId = actions.find(action => action.type === 'app/setCurrentParamId')?.payload;
            expect(currentParamId).toBeDefined();
            expect(window.localStorage.getItem(LocalStorageKey.PARAM_BY_ID + currentParamId)).not.toBeNull();
        });
    });
});
