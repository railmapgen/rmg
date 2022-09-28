import { CanvasType, LocalStorageKey, RMGParam, RmgStyle } from '../constants/constants';
import { setCanvasScale, setCanvasToShow } from './app/app-slice';
import { RootStore, startRootListening } from './index';
import { updateParam } from '../utils';
import { setFullParam } from './param/action';
import { LanguageCode } from '@railmapgen/rmg-translate';
import { initParam } from './param/util';

export const initParamStore = (store: RootStore) => {
    let paramToBeSaved: RMGParam = initParam(RmgStyle.MTR, LanguageCode.ChineseTrad);

    try {
        let contents = window.localStorage.getItem(LocalStorageKey.PARAM);
        if (contents === null) {
            contents = window.localStorage.getItem('rmgParam');
            window.localStorage.removeItem('rmgParam');
            window.localStorage.removeItem('rmgParamRedux');
        }

        if (contents) {
            paramToBeSaved = updateParam(JSON.parse(contents)) as RMGParam;
        } else {
            throw new Error('rmgParam does not exist in localStorage');
        }
    } catch (err) {
        console.warn('Error in reading rmgParam', err);
    } finally {
        window.localStorage.setItem(LocalStorageKey.PARAM, JSON.stringify(paramToBeSaved));
        store.dispatch(setFullParam(paramToBeSaved));
    }
};

export const initCanvasScale = (store: RootStore) => {
    try {
        let canvasScaleValue = window.localStorage.getItem(LocalStorageKey.CANVAS_SCALE);

        // migrate from old key
        if (canvasScaleValue == null) {
            const canvasScaleOldValue = window.localStorage.getItem('rmgScale');
            if (canvasScaleOldValue != null) {
                canvasScaleValue = canvasScaleOldValue;
                console.log('Migrating canvas scale from old key...');
                window.localStorage.setItem(LocalStorageKey.CANVAS_SCALE, canvasScaleValue);
                window.localStorage.removeItem('rmgScale');
            }
        }

        const canvasScale = Number(canvasScaleValue);
        if (canvasScale >= 0.1) {
            store.dispatch(setCanvasScale(canvasScale));
        }
    } catch (err) {
        console.warn('Error in reading canvas scale. Initiating as 1...', err);
        store.dispatch(setCanvasScale(1));
    }
};

export const initCanvasToShow = (store: RootStore) => {
    try {
        let canvasToShowValue = window.localStorage.getItem(LocalStorageKey.CANVAS_TO_SHOW);

        // migrate from old key
        if (canvasToShowValue == null) {
            const canvasToShowOldValue = window.localStorage.getItem('rmgCanvas');
            if (canvasToShowOldValue != null) {
                canvasToShowValue = canvasToShowOldValue;
                console.log('Migrating canvas to show from old key...');
                window.localStorage.setItem(LocalStorageKey.CANVAS_TO_SHOW, canvasToShowValue);
                window.localStorage.removeItem('rmgCanvas');
            }
        }

        if (canvasToShowValue !== null) {
            if (Object.values(CanvasType).includes(canvasToShowValue as any)) {
                store.dispatch(setCanvasToShow([canvasToShowValue as CanvasType]));
                return;
            }

            const canvasToShow = JSON.parse(canvasToShowValue);
            if (Array.isArray(canvasToShow)) {
                store.dispatch(setCanvasToShow(canvasToShow));
                return;
            }
        }
    } catch (err) {
        console.warn('Error in reading canvas to show. Initiating as all...', err);
    }
};

export const initStore = (store: RootStore) => {
    initParamStore(store);
    initCanvasScale(store);
    initCanvasToShow(store);

    startRootListening({
        predicate: (action, currentState, previousState) => {
            return currentState.app.canvasScale.toString() !== previousState.app.canvasScale.toString();
        },
        effect: (action, listenerApi) => {
            window.localStorage.setItem(
                LocalStorageKey.CANVAS_SCALE,
                listenerApi.getState().app.canvasScale.toString()
            );
        },
    });

    startRootListening({
        predicate: (action, currentState, previousState) => {
            return currentState.app.canvasToShow.toString() !== previousState.app.canvasToShow.toString();
        },
        effect: (action, listenerApi) => {
            window.localStorage.setItem(
                LocalStorageKey.CANVAS_TO_SHOW,
                JSON.stringify(listenerApi.getState().app.canvasToShow)
            );
        },
    });

    startRootListening({
        predicate: (action, currentState, previousState) => {
            return JSON.stringify(currentState.param) !== JSON.stringify(previousState.param);
        },
        effect: (action, listenerApi) => {
            window.localStorage.setItem(LocalStorageKey.PARAM, JSON.stringify(listenerApi.getState().param));
        },
    });
};
