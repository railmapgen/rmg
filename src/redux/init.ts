import { CanvasType, LocalStorageKey } from '../constants/constants';
import { setCanvasScale, setCanvasToShow, updateParamModifiedTime } from './app/app-slice';
import { RootDispatch, RootState, RootStore, startRootListening } from './index';
import { upgradeLegacyParam } from '../util/param-manager-utils';
import { AnyAction, ListenerEffect } from '@reduxjs/toolkit';

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
    upgradeLegacyParam();
    initCanvasScale(store);
    initCanvasToShow(store);

    // listen to canvas scale change
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

    // listen to canvas to show change
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

    // listen to current param change - update lastModifiedTime in paramRegistry and update param in localStorage
    startRootListening({
        predicate: (action, currentState, previousState) => {
            return JSON.stringify(currentState.param) !== JSON.stringify(previousState.param);
        },
        effect: paramUpdateTrigger,
    });
};

export const paramUpdateTrigger: ListenerEffect<AnyAction, RootState, RootDispatch> = (action, listenerApi) => {
    const { id, ...others } = listenerApi.getState().app.paramConfig ?? {};
    if (id) {
        // write param to localStorage
        const prevParamStr = window.localStorage.getItem(LocalStorageKey.PARAM_BY_ID + id);
        const nextParamStr = JSON.stringify(listenerApi.getState().param);

        // update lostModified in paramConfig only if param localStorage value is actually updated
        if (prevParamStr !== nextParamStr) {
            console.log('ListenerMiddleware:: Writing param and paramConfig to localStorage, ID=' + id);

            window.localStorage.setItem(LocalStorageKey.PARAM_BY_ID + id, nextParamStr);

            const now = Date.now();
            listenerApi.dispatch(updateParamModifiedTime(now));
            window.localStorage.setItem(
                LocalStorageKey.PARAM_CONFIG_BY_ID + id,
                JSON.stringify({
                    ...others,
                    lastModified: now,
                })
            );
        } else {
            console.log('ListenerMiddleware:: Do not write to localStorage as no changes in param, ID=' + id);
        }
    }
};
