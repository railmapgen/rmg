import rootReducer from './index';
import { createMockAppStore } from '../setupTests';
import { initCanvasScale, initCanvasToShow, upgradeLegacyParam } from './init';
import { initParam } from './param/util';
import { CanvasType, LocalStorageKey, RmgStyle } from '../constants/constants';
import { LanguageCode } from '@railmapgen/rmg-translate';
import { getParamMap } from '../util/param-manager-utils';

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

    describe('ReduxInit - upgradeLegacyParam', () => {
        afterEach(() => {
            window.localStorage.clear();
        });

        it('Can migrate legacy param from localStorage as expected', () => {
            // stored in rmgParam key
            const rmgParam = generateParam('test-01');
            window.localStorage.setItem(LocalStorageKey.PARAM, JSON.stringify(rmgParam));

            upgradeLegacyParam();

            // assign new id and store in new key
            const paramMap = getParamMap();
            const paramIds = Object.keys(paramMap);
            expect(paramIds).toHaveLength(1);
            const currentParamId = paramIds[0];
            expect(window.localStorage.getItem(LocalStorageKey.PARAM_BY_ID + currentParamId)).toContain('test-01');

            // remove rmgParam and rmgParamRedux keys
            expect(window.localStorage.getItem(LocalStorageKey.PARAM)).toBeNull();
        });

        it('Can migrate legacy param from old localStorage key as expected', () => {
            // stored in rmgParam key
            const rmgParam = generateParam('test-02');
            window.localStorage.setItem('rmgParam', JSON.stringify(rmgParam));

            upgradeLegacyParam();

            // assign new id and store in new key
            const paramMap = getParamMap();
            const paramIds = Object.keys(paramMap);
            expect(paramIds).toHaveLength(1);
            const currentParamId = paramIds[0];
            expect(window.localStorage.getItem(LocalStorageKey.PARAM_BY_ID + currentParamId)).toContain('test-02');

            // remove rmgParam and rmgParamRedux keys
            expect(window.localStorage.getItem('rmgParam')).toBeNull();
            expect(window.localStorage.getItem('rmgParamRedux')).toBeNull();
        });
    });
});
