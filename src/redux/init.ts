import { CanvasType, LocalStorageKey } from '../constants/constants';
import { setCanvasScale, setCanvasToShow, updateParamModifiedTime } from './app/app-slice';
import { RootStore, startRootListening } from './index';
import { upgradeLegacyParam } from '../util/param-manager-utils';

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
        effect: (action, listenerApi) => {
            const { id } = listenerApi.getState().app.paramConfig ?? {};
            if (id) {
                // write param to localStorage
                console.log('ListenerMiddleware:: Writing param to localStorage, ID=' + id);
                const prevParamStr = window.localStorage.getItem(LocalStorageKey.PARAM_BY_ID + id);
                const nextParamStr = JSON.stringify(listenerApi.getState().param);
                window.localStorage.setItem(LocalStorageKey.PARAM_BY_ID + id, nextParamStr);

                // update lostModified in paramConfig
                if (prevParamStr !== nextParamStr) {
                    console.log('ListenerMiddleware:: Updating paramRegistry');
                    listenerApi.dispatch(updateParamModifiedTime());
                }
            }
        },
    });

    // listen to param registry change
    startRootListening({
        predicate: (action, currentState, previousState) => {
            return JSON.stringify(currentState.app.paramConfig) !== JSON.stringify(previousState.app.paramConfig);
        },
        effect: (action, listenApi) => {
            const { id, ...others } = listenApi.getState().app.paramConfig ?? {};
            if (id) {
                window.localStorage.setItem(LocalStorageKey.PARAM_CONFIG_BY_ID + id, JSON.stringify(others));
            }
        },
    });
};
