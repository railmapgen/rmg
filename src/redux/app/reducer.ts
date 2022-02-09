import { AllCanvas, CanvasType, LoadingStatus, RmgStyle, SidePanelMode } from '../../constants/constants';
import {
    SET_CANVAS_SCALE,
    SET_CANVAS_SCALE_STATUS,
    SET_CANVAS_TO_SHOW,
    SET_CANVAS_TO_SHOW_STATUS,
    SET_GLOBAL_ALERT,
    SET_SELECTED_STATION,
    SET_SELECTED_COLINE,
    SET_SIDE_PANEL_MODE,
    setCanvasScaleAction,
    setCanvasScaleStatusAction,
    setCanvasToShowAction,
    setCanvasToShowStatusAction,
    setGlobalAlertAction,
    setSelectedStationAction,
    setSelectedColineAction,
    setSidePanelModeAction,
} from './action';
import { AlertProps } from '@chakra-ui/react';

interface AppState {
    rmgStyle: RmgStyle;
    canvasScale: number;
    canvasScaleStatus: LoadingStatus;
    canvasToShow: CanvasType | typeof AllCanvas;
    canvasToShowStatus: LoadingStatus;
    sidePanelMode: SidePanelMode;
    selectedStation: string;
    selectedColine: number;
    globalAlert?: {
        status: AlertProps['status'];
        message: string;
    };
}

const initialState: AppState = {
    rmgStyle: RmgStyle.MTR,
    canvasScale: 1,
    canvasScaleStatus: LoadingStatus.init,
    canvasToShow: AllCanvas,
    canvasToShowStatus: LoadingStatus.init,
    sidePanelMode: SidePanelMode.CLOSE,
    selectedStation: 'linestart',
    selectedColine: 0,
};

export default function AppReducer(
    state = initialState,
    action:
        | setCanvasScaleAction
        | setCanvasScaleStatusAction
        | setCanvasToShowAction
        | setCanvasToShowStatusAction
        | setSidePanelModeAction
        | setSelectedStationAction
        | setSelectedColineAction
        | setGlobalAlertAction
): AppState {
    switch (action.type) {
        case SET_CANVAS_SCALE:
            state.canvasScale = action.canvasScale;
            break;
        case SET_CANVAS_SCALE_STATUS:
            state.canvasScaleStatus = action.canvasScaleStatus;
            break;
        case SET_CANVAS_TO_SHOW:
            state.canvasToShow = action.canvasToShow;
            break;
        case SET_CANVAS_TO_SHOW_STATUS:
            state.canvasToShowStatus = action.canvasToShowStatus;
            break;
        case SET_SIDE_PANEL_MODE:
            state.sidePanelMode = action.sidePanelMode;
            break;
        case SET_SELECTED_STATION:
            state.selectedStation = action.selectedStation;
            break;
        case SET_SELECTED_COLINE:
            state.selectedColine = action.selectedColine;
            break;
        case SET_GLOBAL_ALERT:
            state.globalAlert = action.globalAlert;
            break;
        default:
            break;
    }

    return { ...state };
}
