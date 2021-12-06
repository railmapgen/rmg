import { AllCanvas, CanvasType, LoadingStatus, SidePanelMode } from '../../constants/constants';
import { Dispatch } from 'redux';
import { RootState } from '../index';

export const SET_CANVAS_SCALE = 'SET_CANVAS_SCALE';
export const SET_CANVAS_SCALE_STATUS = 'SET_CANVAS_SCALE_STATUS';
export const SET_CANVAS_TO_SHOW = 'SET_CANVAS_TO_SHOW';
export const SET_CANVAS_TO_SHOW_STATUS = 'SET_CANVAS_TO_SHOW_STATUS';
export const SET_SIDE_PANEL_MODE = 'SET_SIDE_PANEL_MODE';
export const SET_SELECTED_STATION = 'SET_SELECTED_STATION';

export interface setCanvasScaleAction {
    type: typeof SET_CANVAS_SCALE;
    canvasScale: number;
}

export interface setCanvasScaleStatusAction {
    type: typeof SET_CANVAS_SCALE_STATUS;
    canvasScaleStatus: LoadingStatus;
}

export interface setCanvasToShowAction {
    type: typeof SET_CANVAS_TO_SHOW;
    canvasToShow: CanvasType | typeof AllCanvas;
}

export interface setCanvasToShowStatusAction {
    type: typeof SET_CANVAS_TO_SHOW_STATUS;
    canvasToShowStatus: LoadingStatus;
}

export interface setSidePanelModeAction {
    type: typeof SET_SIDE_PANEL_MODE;
    sidePanelMode: SidePanelMode;
}

export interface setSelectedStationAction {
    type: typeof SET_SELECTED_STATION;
    selectedStation: string;
}

export const setCanvasScale = (canvasScale: number) => {
    return { type: SET_CANVAS_SCALE, canvasScale } as setCanvasScaleAction;
};

const setCanvasScaleStatus = (canvasScaleStatus: LoadingStatus) => {
    return { type: SET_CANVAS_SCALE_STATUS, canvasScaleStatus } as setCanvasScaleStatusAction;
};

export const zoomIn = () => {
    return async (dispatch: Dispatch, getState: () => RootState) => {
        dispatch(setCanvasScaleStatus(LoadingStatus.loading));
        try {
            const newScale = Number((getState().app.canvasScale + 0.1).toFixed(1));
            dispatch(setCanvasScale(newScale));
            await window.rmgStorage.writeFile('rmgScale', newScale.toString());
            dispatch(setCanvasScaleStatus(LoadingStatus.loaded));
        } catch (err) {
            dispatch(setCanvasScaleStatus(LoadingStatus.failed));
        }
    };
};

export const zoomOut = () => {
    return async (dispatch: Dispatch, getState: () => RootState) => {
        dispatch(setCanvasScaleStatus(LoadingStatus.loading));
        try {
            const { canvasScale } = getState().app;
            const newScale =
                Number(canvasScale.toFixed(1)) <= 0.1
                    ? Number(canvasScale.toFixed(1))
                    : Number((canvasScale - 0.1).toFixed(1));
            dispatch(setCanvasScale(newScale));
            await window.rmgStorage.writeFile('rmgScale', newScale.toString());
            dispatch(setCanvasScaleStatus(LoadingStatus.loaded));
        } catch (err) {
            dispatch(setCanvasScaleStatus(LoadingStatus.failed));
        }
    };
};

export const setCanvasToShow = (canvasToShow: CanvasType | typeof AllCanvas) => {
    return { type: SET_CANVAS_TO_SHOW, canvasToShow } as setCanvasToShowAction;
};

const setCanvasToShowStatus = (canvasToShowStatus: LoadingStatus) => {
    return { type: SET_CANVAS_TO_SHOW_STATUS, canvasToShowStatus } as setCanvasToShowStatusAction;
};

export const selectCanvas = (canvas: CanvasType | typeof AllCanvas) => {
    return async (dispatch: Dispatch) => {
        dispatch(setCanvasToShowStatus(LoadingStatus.loading));
        try {
            dispatch(setCanvasToShow(canvas));
            await window.rmgStorage.writeFile('rmgCanvas', canvas);
            dispatch(setCanvasToShowStatus(LoadingStatus.loaded));
        } catch (err) {
            dispatch(setCanvasToShowStatus(LoadingStatus.failed));
        }
    };
};

export const setSidePanelMode = (sidePanelMode: SidePanelMode): setSidePanelModeAction => {
    return { type: SET_SIDE_PANEL_MODE, sidePanelMode };
};

export const setSelectedStation = (selectedStation: string): setSelectedStationAction => {
    return { type: SET_SELECTED_STATION, selectedStation };
};
