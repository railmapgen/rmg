import { CanvasType, ParamConfig, RmgStyle, SidePanelMode } from '../../constants/constants';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Theme } from '@railmapgen/rmg-palette-resources';

interface AppState {
    rmgStyle: RmgStyle;

    /** keep only 1 param config in redux store to
     *  avoid semantic error in multi-instance mode
     */
    paramConfig?: ParamConfig;
    canvasScale: number;
    canvasToShow: CanvasType[];
    sidePanelMode: SidePanelMode;
    selectedStation: string;
    selectedColine?: number;
    selectedBranch: number;
    isShareTrackEnabled?: string[]; // for main line only, store the selections
    isLoading?: number; // undefined: not loading, -1: loading, 0-100: progress
    paletteAppClipInput?: Theme;
    paletteAppClipOutput?: Theme;
}

const initialState: AppState = {
    rmgStyle: RmgStyle.MTR,
    paramConfig: undefined,
    canvasScale: 1,
    canvasToShow: Object.values(CanvasType),
    sidePanelMode: SidePanelMode.CLOSE,
    selectedStation: 'linestart',
    selectedColine: undefined,
    selectedBranch: 0,
    isShareTrackEnabled: undefined,
    isLoading: undefined,
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setParamConfig: (state, action: PayloadAction<ParamConfig | undefined>) => {
            state.paramConfig = action.payload;
        },

        // to be called in ListenerMiddleware only
        updateParamModifiedTime: (state, action: PayloadAction<number>) => {
            if (state.paramConfig) {
                state.paramConfig.lastModified = action.payload;
            }
        },

        setCanvasScale: (state, action: PayloadAction<number>) => {
            state.canvasScale = action.payload;
        },

        setCanvasToShow: (state, action: PayloadAction<CanvasType[]>) => {
            state.canvasToShow = action.payload;
        },

        addCanvasToShow: (state, action: PayloadAction<CanvasType>) => {
            if (!state.canvasToShow.includes(action.payload)) {
                state.canvasToShow.push(action.payload);
            }
        },

        removeCanvasToShow: (state, action: PayloadAction<CanvasType>) => {
            const index = state.canvasToShow.indexOf(action.payload);
            if (index >= 0) {
                state.canvasToShow.splice(index, 1);
            }
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

        startLoading: state => {
            state.isLoading = -1;
        },

        setLoadingProgress: (state, action: PayloadAction<number>) => {
            state.isLoading = action.payload;
        },

        stopLoading: state => {
            state.isLoading = undefined;
        },

        openPaletteAppClip: (state, action: PayloadAction<Theme>) => {
            state.paletteAppClipInput = action.payload;
            state.paletteAppClipOutput = undefined;
        },

        closePaletteAppClip: state => {
            state.paletteAppClipInput = undefined;
        },

        onPaletteAppClipEmit: (state, action: PayloadAction<Theme>) => {
            state.paletteAppClipOutput = action.payload;
            state.paletteAppClipInput = undefined;
        },
    },
});

export const {
    setParamConfig,
    updateParamModifiedTime,
    setCanvasScale,
    setCanvasToShow,
    addCanvasToShow,
    removeCanvasToShow,
    setSidePanelMode,
    setSelectedStation,
    setSelectedColine,
    setSelectedBranch,
    setIsShareTrackEnabled,
    startLoading,
    setLoadingProgress,
    stopLoading,
    openPaletteAppClip,
    closePaletteAppClip,
    onPaletteAppClipEmit,
} = appSlice.actions;

const appReducer = appSlice.reducer;
export default appReducer;
