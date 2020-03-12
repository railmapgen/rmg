import * as React from 'react';
import { RMGParam, Name, StationTransfer, BranchInfo, StationInfo } from './types';
import { RMGLineGZ } from './Line/LineGZ';

export const ParamContext = React.createContext<{
    param: RMGParam;
    dispatch: React.Dispatch<ReducerAction>;
    branches: string[][];
    routes: string[][];
}>(null);

type ReducerAction =
    | {
          type: 'ANY';
          key: string;
          data: any;
      }
    | {
          type: 'SET_HEIGHT';
          value: number;
      }
    | {
          type: 'SET_WIDTH';
          targetId: 'destination' | 'railmap';
          value: number;
      }
    | {
          type: 'SET_Y';
          value: number;
      }
    | {
          type: 'SET_BRANCH_SPACING';
          value: number;
      }
    | {
          type: 'SET_PADDING';
          value: number;
      }
    | {
          type: 'SET_DIRECTION_GZ_X';
          value: number;
      }
    | {
          type: 'SET_DIRECTION_GZ_Y';
          value: number;
      }
    | {
          type: 'SET_LINE_NAME';
          name: Name;
      }
    | {
          type: 'SET_THEME';
          theme: [string, string, string, '#fff' | '#000'];
      }
    | {
          type: 'SET_DIRECTION';
          direction: 'l' | 'r';
      }
    | {
          type: 'SET_PLATFORM';
          platform: string;
      }
    | {
          type: 'SET_TEXT_FLIP';
      }
    | {
          type: 'SET_DEST_LEGACY';
          isLegacy: boolean;
      }
    | {
          type: 'SET_LINE_NUM';
          num: string;
      }
    | {
          type: 'SET_PSD_NUM';
          num: string;
      }
    | {
          type: 'SET_PANEL_TYPE';
          variant: 'gz1' | 'gz28' | 'gz3' | 'gz1421' | 'gzgf';
      }
    | {
          type: 'UPDATE_STATION_NAME';
          stnId: string;
          name: Name;
      }
    | {
          type: 'UPDATE_STATION_NUM';
          stnId: string;
          num: string;
      }
    | {
          type: 'UPDATE_STATION_TRANSFER';
          stnId: string;
          transfer: StationTransfer;
      }
    | {
          type: 'UPDATE_STATION_TICK_DIREC';
          stnId: string;
          direction: 'l' | 'r';
      }
    | {
          type: 'UPDATE_STATION_PAID_AREA';
          stnId: string;
          isPaid: boolean;
      }
    | {
          type: 'UPDATE_STATION_BRANCH_TYPE';
          stnId: string;
          direction: 'left' | 'right';
          branchType: 'through' | 'nonthrough';
      }
    | {
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
      }
    | {
          type: 'UPDATE_STATION_BRANCH_POS';
          left: string;
          right: string;
      }
    | {
          type: 'UPDATE_STATION_LIST';
          stnList: { [stnId: string]: StationInfo };
      };

export const paramReducer = (state: RMGParam, action: ReducerAction): RMGParam => {
    switch (action.type) {
        case 'ANY':
            return {
                ...state,
                [action.key]: action.data,
            };
        case 'SET_HEIGHT':
            return {
                ...state,
                svg_height: action.value,
            };
        case 'SET_WIDTH':
            if (action.targetId === 'destination') {
                return {
                    ...state,
                    svg_dest_width: action.value,
                };
            } else {
                return {
                    ...state,
                    svg_width: action.value,
                };
            }
        case 'SET_Y':
            return {
                ...state,
                y_pc: action.value,
            };
        case 'SET_BRANCH_SPACING':
            return {
                ...state,
                branch_spacing: action.value,
            };
        case 'SET_PADDING':
            return {
                ...state,
                padding: action.value,
            };
        case 'SET_DIRECTION_GZ_X':
            return {
                ...state,
                direction_gz_x: action.value,
            };
        case 'SET_DIRECTION_GZ_Y':
            return {
                ...state,
                direction_gz_y: action.value,
            };
        case 'SET_LINE_NAME':
            return {
                ...state,
                line_name: action.name,
            };
        case 'SET_THEME':
            return {
                ...state,
                theme: action.theme,
            };
        case 'SET_DIRECTION':
            return {
                ...state,
                direction: action.direction,
            };
        case 'SET_PLATFORM':
            return {
                ...state,
                platform_num: action.platform,
            };
        case 'SET_TEXT_FLIP':
            return {
                ...state,
                txt_flip: !state.txt_flip,
            };
        case 'SET_DEST_LEGACY':
            return {
                ...state,
                dest_legacy: action.isLegacy,
            };
        case 'SET_LINE_NUM':
            return {
                ...state,
                line_num: action.num,
            };
        case 'SET_PSD_NUM':
            return {
                ...state,
                psd_num: action.num,
            };
        case 'SET_PANEL_TYPE':
            return {
                ...state,
                info_panel_type: action.variant,
            };
        case 'UPDATE_STATION_NAME':
            // window.myLine.updateStnName(action.stnId, action.name);
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
            // (window.myLine as RMGLineGZ).updateStnNum(action.stnId, action.num);
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
                                state.stn_list[action.stnId].branch[action.direction][1],
                            ],
                        },
                    },
                },
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
