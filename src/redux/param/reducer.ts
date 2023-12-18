import { MonoColour } from '@railmapgen/rmg-palette-resources';
import { PanelTypeGZMTR, RMGParam, RmgStyle, ShortDirection } from '../../constants/constants';
import {
    SET_BRANCH_SPACING_PCT,
    SET_COLINE_BULK,
    SET_CURRENT_STATION,
    SET_CUSTOMISED_MTR_DESTINATION,
    SET_DIRECTION,
    SET_DIRECTION_INDICATOR_X,
    SET_DIRECTION_INDICATOR_Y,
    SET_FULL_PARAM,
    SET_LINE_NAME,
    SET_LINE_NUM,
    SET_LOOP,
    SET_LOOP_INFO,
    SET_NAME_POSITION,
    SET_NOTES,
    SET_PADDING_PERCENTAGE,
    SET_PANEL_TYPE,
    SET_PLATFORM,
    SET_PSD_NUM,
    SET_SPAN_LINE_NUM,
    SET_STATION,
    SET_STATIONS_BULK,
    SET_STYLE,
    SET_SVG_HEIGHT,
    SET_SVG_WIDTH,
    SET_THEME,
    SET_Y_PERCENTAGE,
    setBranchSpacingPctAction,
    setColineBulkAction,
    setCurrentStationAction,
    setCustomisedMtrDestinationAction,
    setDirectionAction,
    setDirectionIndicatorXAction,
    setDirectionIndicatorYAction,
    setFullParamAction,
    setLineNameAction,
    setLineNumAction,
    setLoopAction,
    setLoopInfoAction,
    setNamePositionAction,
    setNotesAction,
    setPaddingPercentageAction,
    setPanelTypeAction,
    setPlatformAction,
    setPsdNumAction,
    setSpanLineNumAction,
    setStationAction,
    setStationsBulkAction,
    setStyleAction,
    setSvgHeightAction,
    setSvgWidthAction,
    setThemeAction,
    setYPercentageAction,
} from './action';

const initialState: RMGParam = {
    svgWidth: {
        destination: 100,
        runin: 100,
        railmap: 100,
        indoor: 100,
    },
    svg_height: 100,
    style: RmgStyle.MTR,
    y_pc: 50,
    padding: 10,
    branchSpacingPct: 10,
    direction: ShortDirection.left,
    platform_num: '1',
    theme: ['hongkong', 'twl', '#E2231A', MonoColour.white],
    line_name: ['線', 'line'],
    current_stn_idx: '',
    stn_list: {},
    namePosMTR: {
        isStagger: true,
        isFlip: true,
    },
    customiseMTRDest: {
        isLegacy: false,
        terminal: false,
    },
    line_num: '1',
    psd_num: '1',
    info_panel_type: PanelTypeGZMTR.gz1,
    direction_gz_x: 0,
    direction_gz_y: 0,
    coline: {},
    loop: false,
    loop_info: {
        bank: true,
        left_and_right_factor: 1,
        bottom_factor: 1,
    },
};

export default function ParamReducer(
    state = initialState,
    action:
        | setFullParamAction
        | setStyleAction
        | setSvgHeightAction
        | setSvgWidthAction
        | setYPercentageAction
        | setBranchSpacingPctAction
        | setPaddingPercentageAction
        | setDirectionIndicatorXAction
        | setDirectionIndicatorYAction
        | setThemeAction
        | setLineNameAction
        | setDirectionAction
        | setPlatformAction
        | setLineNumAction
        | setSpanLineNumAction
        | setPsdNumAction
        | setPanelTypeAction
        | setNotesAction
        | setNamePositionAction
        | setCustomisedMtrDestinationAction
        | setCurrentStationAction
        | setStationAction
        | setStationsBulkAction
        | setColineBulkAction
        | setLoopAction
        | setLoopInfoAction
) {
    switch (action.type) {
        case SET_FULL_PARAM:
            return action.fullParam;
        case SET_STYLE:
            return { ...state, style: action.style };
        case SET_SVG_HEIGHT:
            return { ...state, svg_height: action.svgHeight };
        case SET_SVG_WIDTH:
            return { ...state, svgWidth: { ...state.svgWidth, [action.canvas]: action.svgWidth } };
        case SET_Y_PERCENTAGE:
            return { ...state, y_pc: action.yPercentage };
        case SET_BRANCH_SPACING_PCT:
            return { ...state, branchSpacingPct: action.branchSpacingPct };
        case SET_PADDING_PERCENTAGE:
            return { ...state, padding: action.paddingPercentage };
        case SET_DIRECTION_INDICATOR_X:
            return { ...state, direction_gz_x: action.directionIndicatorX };
        case SET_DIRECTION_INDICATOR_Y:
            return { ...state, direction_gz_y: action.directionIndicatorY };
        case SET_THEME:
            return { ...state, theme: action.theme };
        case SET_LINE_NAME:
            return { ...state, line_name: action.lineName };
        case SET_DIRECTION:
            return { ...state, direction: action.direction };
        case SET_PLATFORM:
            return { ...state, platform_num: action.platform };
        case SET_LINE_NUM:
            return { ...state, line_num: action.lineNum };
        case SET_SPAN_LINE_NUM:
            return { ...state, spanLineNum: action.spanLineNum };
        case SET_PSD_NUM:
            return { ...state, psd_num: action.psdNum };
        case SET_PANEL_TYPE:
            return { ...state, info_panel_type: action.panelType };
        case SET_NOTES:
            return { ...state, notesGZMTR: action.notes };
        case SET_NAME_POSITION:
            return { ...state, namePosMTR: action.namePosition };
        case SET_CUSTOMISED_MTR_DESTINATION:
            return { ...state, customiseMTRDest: action.customisedMtrDestination };
        case SET_CURRENT_STATION:
            return { ...state, current_stn_idx: action.currentStation };
        case SET_STATION:
            return { ...state, stn_list: { ...state.stn_list, [action.stationId]: action.station } };
        case SET_STATIONS_BULK:
            return { ...state, stn_list: action.stations };
        case SET_COLINE_BULK:
            return { ...state, coline: action.coline };
        case SET_LOOP:
            return { ...state, loop: action.loop };
        case SET_LOOP_INFO:
            return { ...state, loop_info: action.loop_info };
        default:
            return state;
    }
}
