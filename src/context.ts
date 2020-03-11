import * as React from 'react';
import { RMGParam, Name, StationTransfer, BranchInfo, StationInfo } from './types';
import { RMGLineGZ } from './Line/LineGZ';

export const ParamContext = React.createContext<{ 
    param: RMGParam, 
    dispatch: React.Dispatch<ReducerAction>, 
    branches: string[][], 
    routes: string[][]
}>(null);

type ReducerAction = {
    type: 'ANY';
    key: string;
    data: any;
} | {
    type: 'SET_HEIGHT';
    value: number;
} | {
    type: 'SET_WIDTH';
    targetId: 'destination' | 'railmap';
    value: number;
} | {
    type: 'SET_Y';
    value: number;
} | {
    type: 'SET_BRANCH_SPACING';
    value: number;
} | {
    type: 'SET_PADDING';
    value: number;
} | {
    type: 'SET_DIRECTION_GZ_X';
    value: number;
} | {
    type: 'SET_DIRECTION_GZ_Y';
    value: number;
} | {
    type: 'UPDATE_STATION_NAME';
    stnId: string;
    name: Name;
} | {
    type: 'UPDATE_STATION_NUM';
    stnId: string;
    num: string;
} | {
    type: 'UPDATE_STATION_TRANSFER';
    stnId: string;
    transfer: StationTransfer;
} | {
    type: 'UPDATE_STATION_TICK_DIREC';
    stnId: string;
    direction: 'l' | 'r'
} | {
    type: 'UPDATE_STATION_PAID_AREA';
    stnId: string;
    isPaid: boolean;
} | {
    type: 'UPDATE_STATION_BRANCH_TYPE';
    stnId: string,
    direction: 'left' | 'right',
    branchType: 'through' | 'nonthrough',
} | {
    type: 'UPDATE_STATION_BRANCH_FIRST';
    branches: [
        {
            stnId: string;
            direction: 'left' | 'right';
            first: string;
        },
        {
            stnId: string;
            direction: 'left' | 'right';
            first: string;
        }
    ];
} | {
    type: 'UPDATE_STATION_BRANCH_POS';
    left: string;
    right: string;
} | {
    type: 'UPDATE_STATION_LIST';
    stnList: { [stnId: string]: StationInfo };
}

export const paramReducer = (state: RMGParam, action: ReducerAction): RMGParam => {
    switch (action.type) {
        case 'ANY':
            return {
                ...state,
                [action.key]: action.data,
            };
        case 'SET_HEIGHT':
            // window.myLine.svgHeight = action.value;
            return {
                ...state,
                svg_height: action.value,
            };
        case 'SET_WIDTH':
            if (action.targetId === 'destination') {
                // window.myLine.svgDestWidth = action.value;
                return {
                    ...state,
                    svg_dest_width: action.value,
                };
            } else {
                // window.myLine.svgWidth = action.value;
                return {
                    ...state,
                    svg_width: action.value,
                };
            }
        case 'SET_Y':
            // window.myLine.yPc = action.value;
            return {
                ...state,
                y_pc: action.value,
            };
        case 'SET_BRANCH_SPACING':
            // window.myLine.branchSpacing = action.value;
            return {
                ...state,
                branch_spacing: action.value,
            };
        case 'SET_PADDING':
            // window.myLine.padding = action.value;
            return {
                ...state,
                padding: action.value,
            };
        case 'SET_DIRECTION_GZ_X':
            (window.myLine as RMGLineGZ).directionGZX = action.value;
            return {
                ...state,
                direction_gz_x: action.value,
            };
        case 'SET_DIRECTION_GZ_Y':
            (window.myLine as RMGLineGZ).directionGZY = action.value;
            return {
                ...state,
                direction_gz_y: action.value,
            };
        case 'UPDATE_STATION_NAME':
            window.myLine.updateStnName(action.stnId, action.name);
            return {
                ...state,
                stn_list: {
                    ...state.stn_list,
                    [action.stnId]: {
                        ...state.stn_list[action.stnId],
                        name: action.name,
                    },
                },
            };
        case 'UPDATE_STATION_NUM':
            (window.myLine as RMGLineGZ).updateStnNum(action.stnId, action.num);
            return {
                ...state,
                stn_list: {
                    ...state.stn_list,
                    [action.stnId]: {
                        ...state.stn_list[action.stnId],
                        num: action.num,
                    },
                },
            };
        case 'UPDATE_STATION_TRANSFER':
            return {
                ...state,
                stn_list: {
                    ...state.stn_list,
                    [action.stnId]: {
                        ...state.stn_list[action.stnId],
                        transfer: action.transfer,
                    },
                },
            };
        case 'UPDATE_STATION_TICK_DIREC':
            return {
                ...state,
                stn_list: {
                    ...state.stn_list,
                    [action.stnId]: {
                        ...state.stn_list[action.stnId],
                        transfer: {
                            ...state.stn_list[action.stnId].transfer,
                            tick_direc: action.direction,
                        },
                    },
                },
            };
        case 'UPDATE_STATION_PAID_AREA':
            return {
                ...state,
                stn_list: {
                    ...state.stn_list,
                    [action.stnId]: {
                        ...state.stn_list[action.stnId],
                        transfer: {
                            ...state.stn_list[action.stnId].transfer,
                            paid_area: action.isPaid,
                        },
                    },
                },
            };
        case 'UPDATE_STATION_BRANCH_TYPE':
            return {
                ...state,
                stn_list: {
                    ...state.stn_list,
                    [action.stnId]: {
                        ...state.stn_list[action.stnId],
                        branch: {
                            ...state.stn_list[action.stnId].branch,
                            [action.direction]: [
                                action.branchType,
                                state.stn_list[action.stnId].branch[action.direction][1]
                            ],
                        },
                    }
                }
            };
        case 'UPDATE_STATION_BRANCH_FIRST':
            return {
                ...state,
                stn_list: {
                    ...state.stn_list,
                    [action.branches[0].stnId]: {
                        ...state.stn_list[action.branches[0].stnId],
                        branch: {
                            ...state.stn_list[action.branches[0].stnId].branch,
                            [action.branches[0].direction]: [
                                state.stn_list[action.branches[0].stnId].branch[action.branches[0].direction][0],
                                action.branches[0].first,
                            ],
                        },
                    },
                    [action.branches[1].stnId]: {
                        ...state.stn_list[action.branches[1].stnId],
                        branch: {
                            ...state.stn_list[action.branches[1].stnId].branch,
                            [action.branches[1].direction]: [
                                state.stn_list[action.branches[1].stnId].branch[action.branches[1].direction][0],
                                action.branches[1].first,
                            ],
                        },
                    },
                },
            };
        case 'UPDATE_STATION_BRANCH_POS':
            return {
                ...state,
                stn_list: {
                    ...state.stn_list,
                    [action.left]: {
                        ...state.stn_list[action.left],
                        parents: state.stn_list[action.left].parents.slice().reverse(),
                    },
                    [action.right]: {
                        ...state.stn_list[action.right],
                        children: state.stn_list[action.right].children.slice().reverse(),
                    },
                },
            };
        case 'UPDATE_STATION_LIST':
            return {
                ...state,
                stn_list: action.stnList,
            };
        default:
            return state;
    }
};
