import { CityCode } from '../../constants/city-config';
import { MonoColour, PanelTypeGZMTR, RMGParam, ShortDirection } from '../../constants/constants';
import { SET_FULL_PARAM, setFullParamAction } from "./action";

const initialState: RMGParam = {
    svgWidth: {
        destination: 100,
        runin: 100,
        railmap: 100,
    },
    svg_height: 100,
    y_pc: 50,
    padding: 10,
    branch_spacing: 10,
    direction: ShortDirection.left,
    platform_num: '1',
    theme: [CityCode.HongKong, 'twl', '#E2231A', MonoColour.white],
    line_name: ['線', 'line'],
    current_stn_idx: '',
    stn_list: {},
    namePosMTR: {
        isStagger: true,
        isFlip: true,
    },
    customiseMTRDest: {
        isLegacy: true,
        terminal: false,
    },
    line_num: '1',
    psd_num: '1',
    info_panel_type: PanelTypeGZMTR.gz1,
    notesGZMTR: [],
    direction_gz_x: 0,
    direction_gz_y: 0,
};

export default function ParamReducer(state = initialState, action: setFullParamAction) {
    switch (action.type) {
        case SET_FULL_PARAM:
            return action.fullParam;
        default:
            break;
    }
    return { ...state };
}
