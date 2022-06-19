import { AllCanvas, CanvasType, LoadingStatus, SidePanelMode } from '../../constants/constants';
import { Dispatch } from 'redux';
import { RootDispatch, RootState } from '../index';
import { AlertStatus } from '@chakra-ui/react';
import { AppState } from './reducer';

// canvas
export const SET_CANVAS_SCALE = 'SET_CANVAS_SCALE';
export const SET_CANVAS_TO_SHOW = 'SET_CANVAS_TO_SHOW';
export const SET_CANVAS_TO_SHOW_STATUS = 'SET_CANVAS_TO_SHOW_STATUS';

// side panel
export const SET_SIDE_PANEL_MODE = 'SET_SIDE_PANEL_MODE';
export const SET_SELECTED_STATION = 'SET_SELECTED_STATION';
export const SET_SELECTED_COLINE = 'SET_SELECTED_COLINE';
export const SET_SELECTED_BRANCH = 'SET_SELECTED_BRANCH';
export const SET_IS_SHARE_TRACK_ENABLED = 'SET_IS_SHARE_TRACK_ENABLED';

// global
export const SET_GLOBAL_ALERTS = 'SET_GLOBAL_ALERTS';
export const SET_IS_LOADING = 'SET_IS_LOADING';

export interface setCanvasScaleAction {
    type: typeof SET_CANVAS_SCALE;
    canvasScale: number;
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

export interface setSelectedColineAction {
    type: typeof SET_SELECTED_COLINE;
    selectedColine: number;
}

export interface setSelectedBranchAction {
    type: typeof SET_SELECTED_BRANCH;
    selectedBranch: number;
}

export interface setIsShareTrackEnabledAction {
    type: typeof SET_IS_SHARE_TRACK_ENABLED;
    isShareTrackEnabled?: string[];
}

export interface setGlobalAlertsAction {
    type: typeof SET_GLOBAL_ALERTS;
    globalAlerts: AppState['globalAlerts'];
}

export interface setIsLoadingAction {
    type: typeof SET_IS_LOADING;
    isLoading: boolean;
}

export const setCanvasScale = (canvasScale: number) => {
    return { type: SET_CANVAS_SCALE, canvasScale } as setCanvasScaleAction;
};

export const zoomToScale = (scale: number) => {
    return async (dispatch: RootDispatch) => {
        try {
            dispatch(setCanvasScale(scale));
            await window.rmgStorage.writeFile('rmgScale', scale.toString());
        } catch (err) {
            console.log('AppAction.zoomToScale():: Failed to write scale to localStorage', err);
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

export const setSelectedColine = (selectedColine: number): setSelectedColineAction => {
    return { type: SET_SELECTED_COLINE, selectedColine };
};

export const setSelectedBranch = (selectedBranch: number): setSelectedBranchAction => {
    return { type: SET_SELECTED_BRANCH, selectedBranch };
};

export const setIsShareTrackEnabled = (isShareTrackEnabled?: string[]): setIsShareTrackEnabledAction => {
    return { type: SET_IS_SHARE_TRACK_ENABLED, isShareTrackEnabled };
};

const setGlobalAlerts = (globalAlerts: AppState['globalAlerts']): setGlobalAlertsAction => {
    return { type: SET_GLOBAL_ALERTS, globalAlerts };
};

export const setGlobalAlert = (status: AlertStatus, message: string, url?: string) => {
    return (dispatch: RootDispatch, getState: () => RootState) => {
        const globalAlerts = getState().app.globalAlerts;
        dispatch(
            setGlobalAlerts({
                ...globalAlerts,
                [status]: { message, url },
            })
        );
    };
};

export const closeGlobalAlert = (status: AlertStatus) => {
    return (dispatch: RootDispatch, getState: () => RootState) => {
        const { [status]: _, ...otherAlerts } = getState().app.globalAlerts;
        dispatch(setGlobalAlerts(otherAlerts));
    };
};

export const setIsLoading = (isLoading: boolean): setIsLoadingAction => {
    return { type: SET_IS_LOADING, isLoading };
};
