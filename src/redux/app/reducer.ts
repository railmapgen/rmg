import { AllCanvas, CanvasType, LoadingStatus, RmgStyle, SidePanelMode } from '../../constants/constants';
import {
    SET_CANVAS_SCALE,
    SET_CANVAS_TO_SHOW,
    SET_CANVAS_TO_SHOW_STATUS,
    SET_GLOBAL_ALERTS,
    SET_IS_LOADING,
    SET_IS_SHARE_TRACK_ENABLED,
    SET_SELECTED_BRANCH,
    SET_SELECTED_COLINE,
    SET_SELECTED_STATION,
    SET_SIDE_PANEL_MODE,
    setCanvasScaleAction,
    setCanvasToShowAction,
    setCanvasToShowStatusAction,
    setGlobalAlertsAction,
    setIsLoadingAction,
    setIsShareTrackEnabledAction,
    setSelectedBranchAction,
    setSelectedColineAction,
    setSelectedStationAction,
    setSidePanelModeAction,
} from './action';
import { AlertStatus } from '@chakra-ui/react';

export interface AppState {
    rmgStyle: RmgStyle;
    canvasScale: number;
    canvasToShow: CanvasType | typeof AllCanvas;
    canvasToShowStatus: LoadingStatus;
    sidePanelMode: SidePanelMode;
    selectedStation: string;
    selectedColine?: number;
    selectedBranch: number;
    isShareTrackEnabled?: string[]; // for main line only, store the selections
    globalAlerts: {
        [s in AlertStatus]?: {
            message: string;
            url?: string;
        };
    };
    isLoading: boolean;
}

const initialState: AppState = {
    rmgStyle: RmgStyle.MTR,
    canvasScale: 1,
    canvasToShow: AllCanvas,
    canvasToShowStatus: LoadingStatus.init,
    sidePanelMode: SidePanelMode.CLOSE,
    selectedStation: 'linestart',
    selectedColine: undefined,
    selectedBranch: 0,
    isShareTrackEnabled: undefined,
    globalAlerts: {},
    isLoading: false,
};

export default function AppReducer(
    state = initialState,
    action:
        | setCanvasScaleAction
        | setCanvasToShowAction
        | setCanvasToShowStatusAction
        | setSidePanelModeAction
        | setSelectedStationAction
        | setSelectedColineAction
        | setSelectedBranchAction
        | setIsShareTrackEnabledAction
        | setGlobalAlertsAction
        | setIsLoadingAction
): AppState {
    switch (action.type) {
        case SET_CANVAS_SCALE:
            return { ...state, canvasScale: action.canvasScale };
        case SET_CANVAS_TO_SHOW:
            return { ...state, canvasToShow: action.canvasToShow };
        case SET_CANVAS_TO_SHOW_STATUS:
            return { ...state, canvasToShowStatus: action.canvasToShowStatus };
        case SET_SIDE_PANEL_MODE:
            return { ...state, sidePanelMode: action.sidePanelMode };
        case SET_SELECTED_STATION:
            return { ...state, selectedStation: action.selectedStation };
        case SET_SELECTED_COLINE:
            return { ...state, selectedColine: action.selectedColine };
        case SET_SELECTED_BRANCH:
            return { ...state, selectedBranch: action.selectedBranch };
        case SET_IS_SHARE_TRACK_ENABLED:
            return { ...state, isShareTrackEnabled: action.isShareTrackEnabled };
        case SET_GLOBAL_ALERTS:
            return { ...state, globalAlerts: action.globalAlerts };
        case SET_IS_LOADING:
            return { ...state, isLoading: action.isLoading };
        default:
            return state;
    }
}
