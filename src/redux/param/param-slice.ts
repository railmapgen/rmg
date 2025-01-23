import {
    CanvasType,
    ColineInfo,
    Name,
    Note,
    PanelTypeGZMTR,
    PanelTypeShmetro,
    RMGParam,
    RmgStyle,
    ShortDirection,
    StationDict,
    StationInfo,
} from '../../constants/constants';
import { initParam } from './util';
import { createSlice, current, PayloadAction } from '@reduxjs/toolkit';
import { Theme } from '@railmapgen/rmg-palette-resources';

export type ParamState = RMGParam;

const getInitialState = (): ParamState => initParam(RmgStyle.MTR, 'en');

const paramSlice = createSlice({
    name: 'param',
    initialState: getInitialState(),
    reducers: {
        setSvgHeight: (state, action: PayloadAction<number>) => {
            state.svg_height = action.payload;
        },

        setSvgWidth: (state, action: PayloadAction<{ width: number; canvas: CanvasType }>) => {
            const { width, canvas } = action.payload;
            state.svgWidth[canvas] = width;
        },

        setStyle: (state, action: PayloadAction<RmgStyle>) => {
            state.style = action.payload;
        },

        setYPercentage: (state, action: PayloadAction<number>) => {
            state.y_pc = action.payload;
        },

        setBranchSpacingPct: (state, action: PayloadAction<number>) => {
            state.branchSpacingPct = action.payload;
        },

        setPaddingPercentage: (state, action: PayloadAction<number>) => {
            state.padding = action.payload;
        },

        setDirectionIndicatorX: (state, action: PayloadAction<number>) => {
            state.direction_gz_x = action.payload;
        },

        setDirectionIndicatorY: (state, action: PayloadAction<number>) => {
            state.direction_gz_y = action.payload;
        },

        setTheme: (state, action: PayloadAction<Theme>) => {
            state.theme = action.payload;
        },

        setLineName: (state, action: PayloadAction<Name>) => {
            state.line_name = action.payload;
        },

        setDirection: (state, action: PayloadAction<ShortDirection>) => {
            state.direction = action.payload;
        },

        setPlatform: (state, action: PayloadAction<string>) => {
            state.platform_num = action.payload;
        },

        setLineNum: (state, action: PayloadAction<string>) => {
            state.line_num = action.payload;
        },

        setSpanLineNum: (state, action: PayloadAction<boolean>) => {
            state.spanLineNum = action.payload;
        },

        setPsdNum: (state, action: PayloadAction<string>) => {
            state.psd_num = action.payload;
        },

        setPanelType: (state, action: PayloadAction<PanelTypeGZMTR | PanelTypeShmetro>) => {
            state.info_panel_type = action.payload;
        },

        addNote: state => {
            state.notesGZMTR = (state.notesGZMTR || []).concat([['', '', 10, 10, false]]);
        },

        updateNote: (state, action: PayloadAction<{ index: number; note: Note }>) => {
            if (state.notesGZMTR) {
                const { index, note } = action.payload;
                state.notesGZMTR[index] = note;
            }
        },

        removeNote: (state, action: PayloadAction<number>) => {
            if (state.notesGZMTR) {
                state.notesGZMTR.splice(action.payload, 1);
            }
        },

        staggerStationNames: (state, action: PayloadAction<boolean>) => {
            state.namePosMTR.isStagger = action.payload;
        },

        flipStationNames: (state, action: PayloadAction<boolean | undefined>) => {
            if (action.payload === undefined) {
                state.namePosMTR.isFlip = !current(state).namePosMTR.isFlip;
            } else {
                state.namePosMTR.isFlip = action.payload;
            }
        },

        toggleLineNameBeforeDestination: (state, action: PayloadAction<boolean>) => {
            state.customiseMTRDest.isLegacy = action.payload;
        },

        customiseDestinationName: (state, action: PayloadAction<Name | false>) => {
            state.customiseMTRDest.terminal = action.payload;
        },

        setLoop: (state, action: PayloadAction<boolean>) => {
            state.loop_info = { bank: true, left_and_right_factor: 0, bottom_factor: 1 };
            state.loop = action.payload;
        },

        setLoopBank: (state, action: PayloadAction<boolean>) => {
            state.loop_info.bank = action.payload;
        },

        setLoopLeftAndRightFactor: (state, action: PayloadAction<number>) => {
            state.loop_info.left_and_right_factor = action.payload;
        },

        setLoopBottomFactor: (state, action: PayloadAction<number>) => {
            state.loop_info.bottom_factor = action.payload;
        },

        setLoopMidpointStation: (state, action: PayloadAction<string>) => {
            state.loop_info.midpoint_station = action.payload;
        },

        setLoopClockwise: (state, action: PayloadAction<boolean>) => {
            state.loop_info.clockwise = action.payload;
        },

        setCurrentStation: (state, action: PayloadAction<string>) => {
            state.current_stn_idx = action.payload;
        },

        setStation: (state, action: PayloadAction<{ id: string; station: StationInfo }>) => {
            state.stn_list[action.payload.id] = action.payload.station;
        },

        setStations: (state, action: PayloadAction<StationDict>) => {
            state.stn_list = action.payload;
        },

        setColine: (state, action: PayloadAction<Record<string, ColineInfo>>) => {
            state.coline = action.payload;
        },

        setFullParam: (state, action: PayloadAction<RMGParam>) => action.payload,
    },
});

export const {
    setSvgHeight,
    setSvgWidth,
    setStyle,
    setYPercentage,
    setBranchSpacingPct,
    setPaddingPercentage,
    setDirectionIndicatorX,
    setDirectionIndicatorY,
    setTheme,
    setLineName,
    setDirection,
    setPlatform,
    setLineNum,
    setSpanLineNum,
    setPsdNum,
    setPanelType,
    addNote,
    updateNote,
    removeNote,
    staggerStationNames,
    flipStationNames,
    toggleLineNameBeforeDestination,
    customiseDestinationName,
    setLoop,
    setLoopBank,
    setLoopLeftAndRightFactor,
    setLoopBottomFactor,
    setLoopMidpointStation,
    setLoopClockwise,
    setCurrentStation,
    setStation,
    setStations,
    setColine,
    setFullParam,
} = paramSlice.actions;

const paramReducer = paramSlice.reducer;
export default paramReducer;
