import { AllCanvas, CanvasType, LoadingStatus, RmgStyle, SidePanelMode } from '../../constants/constants';
import { AlertStatus } from '@chakra-ui/react';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
    globalAlerts: Partial<Record<AlertStatus, { message: string; url?: string; linkedApp: boolean }>>;
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

        setCanvasToShow: (state, action: PayloadAction<CanvasType | typeof AllCanvas>) => {
            state.canvasToShow = action.payload;
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

        /**
         * If linkedApp is true, alert will try to open link in the current domain.
         * E.g. linkedApp=true, url='/rmp' will open https://railmapgen.github.io/rmp/
         * If you want to open a url outside the domain, DO NOT set or pass FALSE to linkedApp.
         */
        setGlobalAlert: (
            state,
            action: PayloadAction<{ status: AlertStatus; message: string; url?: string; linkedApp?: boolean }>
        ) => {
            const { status, message, url, linkedApp = false } = action.payload;
            state.globalAlerts[status] = { message, url, linkedApp };
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
