import { AllCanvas, CanvasType, LocalStorageKey } from '../constants/constants';
import { setCanvasScale, setCanvasToShow } from './app/app-slice';
import { RootStore, startRootListening } from './index';

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

        if ([...Object.values(CanvasType), AllCanvas].includes(canvasToShowValue as any)) {
            store.dispatch(setCanvasToShow(canvasToShowValue as CanvasType | typeof AllCanvas));
        }
    } catch (err) {
        console.warn('Error in reading canvas to show. Initiating as all...', err);
        store.dispatch(setCanvasToShow('all'));
    }
};

export const initStore = (store: RootStore) => {
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
                listenerApi.getState().app.canvasToShow.toString()
            );
        },
    });
};
