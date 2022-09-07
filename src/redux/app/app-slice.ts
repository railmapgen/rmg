import { AllCanvas, CanvasType, LoadingStatus, RmgStyle, SidePanelMode } from '../../constants/constants';
import { AlertStatus } from '@chakra-ui/react';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootDispatch } from '../index';
import { Dispatch } from 'redux';

interface AppState {
    rmgStyle: RmgStyle;
    canvasScale: number;
    canvasToShow: CanvasType | typeof AllCanvas;
    canvasToShowStatus: LoadingStatus;
    sidePanelMode: SidePanelMode;
    selectedStation: string;
    selectedColine?: number;
    selectedBranch: number;
    isShareTrackEnabled?: string[]; // for main line only, store the selections
    globalAlerts: Partial<Record<AlertStatus, { message: string; url?: string }>>;
    isLoading?: number; // undefined: not loading, -1: loading, 0-100: progress
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
    isLoading: undefined,
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setCanvasScale: (state, action: PayloadAction<number>) => {
            state.canvasScale = action.payload;
        },

        zoomToScale: (state, action: PayloadAction<number>) => {
            const scale = action.payload;
            state.canvasScale = scale;
            window.localStorage.setItem('rmgScale', scale.toString());
        },

        setCanvasToShow: (state, action: PayloadAction<CanvasType | typeof AllCanvas>) => {
            state.canvasToShow = action.payload;
        },

        selectCanvas: (state, action: PayloadAction<CanvasType | typeof AllCanvas>) => {
            const canvas = action.payload;
            state.canvasToShow = canvas;
            window.localStorage.setItem('rmgCanvas', canvas);
        },

        setSidePanelMode: (state, action: PayloadAction<SidePanelMode>) => {
            state.sidePanelMode = action.payload;
        },

        setSelectedStation: (state, action: PayloadAction<string>) => {
            state.selectedStation = action.payload;
        },

        setSelectedColine: (state, action: PayloadAction<number>) => {
            state.selectedColine = action.payload;
        },

        setSelectedBranch: (state, action: PayloadAction<number>) => {
            state.selectedBranch = action.payload;
        },

        setIsShareTrackEnabled: (state, action: PayloadAction<string[] | undefined>) => {
            state.isShareTrackEnabled = action.payload;
        },

        setGlobalAlert: (state, action: PayloadAction<{ status: AlertStatus; message: string; url?: string }>) => {
            const { status, message, url } = action.payload;
            state.globalAlerts[status] = { message, url };
        },

        closeGlobalAlert: (state, action: PayloadAction<AlertStatus>) => {
            delete state.globalAlerts[action.payload];
        },

        startLoading: state => {
            state.isLoading = -1;
        },

        setLoadingProgress: (state, action: PayloadAction<number>) => {
            state.isLoading = action.payload;
        },

        stopLoading: state => {
            state.isLoading = undefined;
        },
    },
});

export const zoomToScale = (scale: number) => {
    return (dispatch: RootDispatch) => {
        dispatch(setCanvasScale(scale));
        window.localStorage.setItem('rmgScale', scale.toString());
    };
};

export const selectCanvas = (canvas: CanvasType | typeof AllCanvas) => {
    return (dispatch: Dispatch) => {
        dispatch(setCanvasToShow(canvas));
        window.localStorage.setItem('rmgCanvas', canvas);
    };
};

export const {
    setCanvasScale,
    setCanvasToShow,
    setSidePanelMode,
    setSelectedStation,
    setSelectedColine,
    setSelectedBranch,
    setIsShareTrackEnabled,
    setGlobalAlert,
    closeGlobalAlert,
    startLoading,
    setLoadingProgress,
    stopLoading,
} = appSlice.actions;

const appReducer = appSlice.reducer;
export default appReducer;
