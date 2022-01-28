import { AllCanvas, CanvasType, LoadingStatus, RmgStyle } from '../../constants/constants';
import {
    SET_CANVAS_SCALE,
    SET_CANVAS_SCALE_STATUS,
    SET_CANVAS_TO_SHOW,
    SET_CANVAS_TO_SHOW_STATUS,
    setCanvasScaleAction,
    setCanvasScaleStatusAction,
    setCanvasToShowAction,
    setCanvasToShowStatusAction,
} from './action';

interface AppState {
    rmgStyle: RmgStyle;
    canvasScale: number;
    canvasScaleStatus: LoadingStatus;
    canvasToShow: CanvasType | typeof AllCanvas;
    canvasToShowStatus: LoadingStatus;
}

const initialState: AppState = {
    rmgStyle: RmgStyle.MTR,
    canvasScale: 1,
    canvasScaleStatus: LoadingStatus.init,
    canvasToShow: AllCanvas,
    canvasToShowStatus: LoadingStatus.init,
};

export default function AppReducer(
    state = initialState,
    action: setCanvasScaleAction | setCanvasScaleStatusAction | setCanvasToShowAction | setCanvasToShowStatusAction
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
        default:
            break;
    }

    return { ...state };
}
