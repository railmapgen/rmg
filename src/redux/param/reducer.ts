import { CityCode } from '@railmapgen/rmg-palette-resources';
import { MonoColour, PanelTypeGZMTR, RMGParam, ShortDirection, RmgStyle } from '../../constants/constants';
import {
    SET_BRANCH_SPACING,
    SET_CURRENT_STATION,
    SET_CUSTOMISED_MTR_DESTINATION,
    SET_DIRECTION,
    SET_DIRECTION_INDICATOR_X,
    SET_DIRECTION_INDICATOR_Y,
    SET_FULL_PARAM,
    SET_LINE_NAME,
    SET_LINE_NUM,
    SET_NAME_POSITION,
    SET_NOTES,
    SET_PADDING_PERCENTAGE,
    SET_PANEL_TYPE,
    SET_PLATFORM,
    SET_PSD_NUM,
    SET_STATION,
    SET_STATIONS_BULK,
    SET_SVG_HEIGHT,
    SET_SVG_WIDTH,
    SET_THEME,
    SET_Y_PERCENTAGE,
    SET_STYLE,
    setBranchSpacingAction,
    setCurrentStationAction,
    setCustomisedMtrDestinationAction,
    setDirectionAction,
    setDirectionIndicatorXAction,
    setDirectionIndicatorYAction,
    setFullParamAction,
    setLineNameAction,
    setLineNumAction,
    setNamePositionAction,
    setNotesAction,
    setPaddingPercentageAction,
    setPanelTypeAction,
    setPlatformAction,
    setPsdNumAction,
    setStationAction,
    setStationsBulkAction,
    setSvgHeightAction,
    setSvgWidthAction,
    setThemeAction,
    setYPercentageAction,
    setStyleAction,
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
    branch_spacing: 10,
    direction: ShortDirection.left,
    platform_num: '1',
    theme: [CityCode.Hongkong, 'twl', '#E2231A', MonoColour.white],
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
    notesGZMTR: [],
    direction_gz_x: 0,
    direction_gz_y: 0,
};

export default function ParamReducer(
    state = initialState,
    action:
        | setFullParamAction
        | setStyleAction
        | setSvgHeightAction
        | setSvgWidthAction
        | setYPercentageAction
        | setBranchSpacingAction
        | setPaddingPercentageAction
        | setDirectionIndicatorXAction
        | setDirectionIndicatorYAction
        | setThemeAction
        | setLineNameAction
        | setDirectionAction
        | setPlatformAction
        | setLineNumAction
        | setPsdNumAction
        | setPanelTypeAction
        | setNotesAction
        | setNamePositionAction
        | setCustomisedMtrDestinationAction
        | setCurrentStationAction
        | setStationAction
        | setStationsBulkAction
) {
    switch (action.type) {
        case SET_FULL_PARAM:
            return action.fullParam;
        case SET_STYLE:
            state.style = action.style;
            break;
        case SET_SVG_HEIGHT:
            state.svg_height = action.svgHeight;
            break;
        case SET_SVG_WIDTH:
            state.svgWidth = { ...state.svgWidth, [action.canvas]: action.svgWidth };
            break;
        case SET_Y_PERCENTAGE:
            state.y_pc = action.yPercentage;
            break;
        case SET_BRANCH_SPACING:
            state.branch_spacing = action.branchSpacing;
            break;
        case SET_PADDING_PERCENTAGE:
            state.padding = action.paddingPercentage;
            break;
        case SET_DIRECTION_INDICATOR_X:
            state.direction_gz_x = action.directionIndicatorX;
            break;
        case SET_DIRECTION_INDICATOR_Y:
            state.direction_gz_y = action.directionIndicatorY;
            break;
        case SET_THEME:
            state.theme = action.theme;
            break;
        case SET_LINE_NAME:
            state.line_name = action.lineName;
            break;
        case SET_DIRECTION:
            state.direction = action.direction;
            break;
        case SET_PLATFORM:
            state.platform_num = action.platform;
            break;
        case SET_LINE_NUM:
            state.line_num = action.lineNum;
            break;
        case SET_PSD_NUM:
            state.psd_num = action.psdNum;
            break;
        case SET_PANEL_TYPE:
            state.info_panel_type = action.panelType;
            break;
        case SET_NOTES:
            state.notesGZMTR = action.notes;
            break;
        case SET_NAME_POSITION:
            state.namePosMTR = action.namePosition;
            break;
        case SET_CUSTOMISED_MTR_DESTINATION:
            state.customiseMTRDest = action.customisedMtrDestination;
            break;
        case SET_CURRENT_STATION:
            state.current_stn_idx = action.currentStation;
            break;
        case SET_STATION:
            state.stn_list = { ...state.stn_list, [action.stationId]: action.station };
            break;
        case SET_STATIONS_BULK:
            state.stn_list = action.stations;
            break;
        default:
            break;
    }
    return { ...state };
}
