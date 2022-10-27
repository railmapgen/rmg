import { CanvasType, LocalStorageKey, RMGParam, RmgStyle } from '../constants/constants';
import { setCanvasScale, setCanvasToShow } from './app/app-slice';
import { RootStore, startRootListening } from './index';
import { updateParam } from '../utils';
import { setFullParam } from './param/action';
import { LanguageCode } from '@railmapgen/rmg-translate';
import { initParam } from './param/util';
import { nanoid } from 'nanoid';

const getLegacyParam = (): string | null => {
    let contents = window.localStorage.getItem(LocalStorageKey.PARAM);
    if (contents === null) {
        contents = window.localStorage.getItem('rmgParam');
        window.localStorage.removeItem('rmgParam');
        window.localStorage.removeItem('rmgParamRedux');
    }
    return contents;
};

const getParamMap = (): Record<string, string> => {
    const paramMap: Record<string, string> = {};

    let count = 0;
    while (count < window.localStorage.length) {
        const key = window.localStorage.key(count);
        if (key?.startsWith(LocalStorageKey.PARAM_BY_ID)) {
            const paramStr = window.localStorage.getItem(key);
            if (paramStr !== null) {
                paramMap[key.slice(LocalStorageKey.PARAM_BY_ID.length)] = paramStr;
            }
        }
        count++;
    }

    return paramMap;
};

export const initParamStore = (store: RootStore) => {
    let paramToBeSaved: RMGParam = initParam(RmgStyle.MTR, LanguageCode.ChineseTrad);
    let currentParamId: string | undefined = undefined;

    try {
        // get all param
        const paramMap = getParamMap();
        console.log('initParamStore():: Param with ID in localStorage:', Object.keys(paramMap));

        // check if exist param going to migrate
        const legacyParam = getLegacyParam();
        if (legacyParam !== null) {
            const paramId = nanoid();
            console.log('initParamStore():: Found legacy param in localStorage. Assigning ID with', paramId);
            window.localStorage.setItem(LocalStorageKey.CURRENT_PARAM_ID, paramId);

            paramMap[paramId] = legacyParam;
            window.localStorage.setItem(LocalStorageKey.PARAM_BY_ID + paramId, legacyParam);
            window.localStorage.removeItem(LocalStorageKey.PARAM);
        }

        // check if current param id valid
        currentParamId = window.localStorage.getItem(LocalStorageKey.CURRENT_PARAM_ID) ?? Object.keys(paramMap)[0];
        // if current param id invalid, reset to first id of paramMap
        if (currentParamId && !(currentParamId in paramMap)) {
            console.warn('initParamStore():: Current param ID defined in localStorage is invalid. Resetting...');
            currentParamId = Object.keys(paramMap)[0];
            window.localStorage.setItem(LocalStorageKey.CURRENT_PARAM_ID, currentParamId);
        }
        // if current param id is undefined, generate a new id with new param
        if (!currentParamId) {
            currentParamId = nanoid();
            console.log(
                'initParamStore():: Current param ID is undefined. Assigning new param with ID',
                currentParamId
            );
            window.localStorage.setItem(LocalStorageKey.CURRENT_PARAM_ID, currentParamId);

            paramMap[currentParamId] = JSON.stringify(paramToBeSaved);
            window.localStorage.setItem(LocalStorageKey.PARAM_BY_ID + currentParamId, JSON.stringify(paramToBeSaved));
        }

        // update param
        let paramStr = paramMap[currentParamId];
        if (paramStr) {
            paramToBeSaved = updateParam(JSON.parse(paramStr)) as RMGParam;
            window.localStorage.setItem(LocalStorageKey.PARAM_BY_ID + currentParamId, JSON.stringify(paramToBeSaved));
        } else {
            throw new Error('rmgParam does not exist in localStorage');
        }
    } catch (err) {
        console.warn('initParamStore():: Error in reading rmgParam', err);

        if (!currentParamId) {
            currentParamId = nanoid();
        }
        console.log('initParamStore():: Use param with ID', currentParamId);
        window.localStorage.setItem(LocalStorageKey.CURRENT_PARAM_ID, currentParamId);
        window.localStorage.setItem(LocalStorageKey.PARAM_BY_ID + currentParamId, JSON.stringify(paramToBeSaved));
    } finally {
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
