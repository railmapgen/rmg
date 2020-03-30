import React, { createContext } from 'react';

interface ICanvasContext {
    rmgStyle: ProvidedStyles;
    canvasAvailable: ProvidedCanvas[];
    setCanvasAvailable: React.Dispatch<React.SetStateAction<ProvidedCanvas[]>>;
    canvasToShown: ProvidedCanvas | 'all';
    setCanvasToShown: React.Dispatch<React.SetStateAction<ProvidedCanvas | 'all'>>;
    canvasScale: number;
    setCanvasScale: React.Dispatch<React.SetStateAction<number>>;
}

interface IParamContext {
    param: RMGParam;
    dispatch: React.Dispatch<ReducerAction>;
    branches: string[][];
    routes: string[][];
    deps: string;
    tpo: string[];
}

export const CanvasContext = createContext<ICanvasContext>({} as ICanvasContext);
export const ParamContext = createContext<IParamContext>({} as IParamContext);

type ReducerAction =
    | { type: 'GLOBAL'; data: RMGParam }
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
          targetId: ProvidedCanvas;
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
      }
    | {
          type: 'SET_PLATFORM';
          platform: string;
      }
    | {
          type: 'SET_TEXT_STAGGER';
          checked: boolean;
      }
    | {
          type: 'SET_TEXT_FLIP';
      }
    | {
          type: 'SET_DEST_LEGACY';
          isLegacy: boolean;
      }
    | {
          type: 'SET_TERMINAL_OVERRIDE';
          terminal: Name | false;
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
          variant: PanelTypeGZMTR;
      }
    | {
          type: 'ADD_NOTE_GZMTR';
      }
    | {
          type: 'REMOVE_NOTE_GZMTR';
          idx: number;
      }
    | {
          type: 'UPDATE_NOTE_GZMTR';
          idx: number;
          note: Note;
      }
    | {
          type: 'SET_CURRENT_STATION';
          stnId: string;
      }
    | {
          type: 'REVERSE_STATIONS';
      }
    | {
          type: 'UPDATE_STATION_NAME';
          stnId: string;
          name: Name;
      }
    | {
          type: 'UPDATE_STATION_SECONDARY_NAME';
          stnId: string;
          name: false | Name;
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
          type: 'UPDATE_STATION_INTERCHANGE_INFO';
          stnId: string;
          setIdx: number;
          intIdx: number;
          info: InterchangeInfo;
      }
    | {
          type: 'UPDATE_STATION_OSI_NAME';
          stnId: string;
          name: Name;
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
          type: 'UPDATE_STATION_FACILITY';
          stnId: string;
          facility: '' | 'airport' | 'hsr' | 'disney';
      }
    | {
          type: 'UPDATE_STATION_SERVICES';
          stnId: string;
          serviceId: 'local' | 'express';
          isChecked: boolean;
      }
    | {
          type: 'UPDATE_STATION_LIST';
          stnList: StationDict;
      };

export const paramReducer = (state: RMGParam, action: ReducerAction): RMGParam => {
    switch (action.type) {
        case 'GLOBAL':
            return action.data;
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
            return {
                ...state,
                svgWidth: {
                    ...state.svgWidth,
                    [action.targetId]: action.value,
                },
            };
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
                direction: state.direction === 'l' ? 'r' : 'l',
            };
        case 'SET_PLATFORM':
            return {
                ...state,
                platform_num: action.platform,
            };
        case 'SET_TEXT_STAGGER':
            return {
                ...state,
                namePosMTR: {
                    ...state.namePosMTR,
                    isStagger: action.checked,
                },
            };
        case 'SET_TEXT_FLIP':
            return {
                ...state,
                namePosMTR: {
                    ...state.namePosMTR,
                    isFlip: !state.namePosMTR.isFlip,
                },
            };
        case 'SET_DEST_LEGACY':
            return {
                ...state,
                customiseMTRDest: {
                    ...state.customiseMTRDest,
                    isLegacy: action.isLegacy,
                },
            };
        case 'SET_TERMINAL_OVERRIDE':
            return {
                ...state,
                customiseMTRDest: {
                    ...state.customiseMTRDest,
                    terminal: action.terminal,
                },
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
        case 'ADD_NOTE_GZMTR':
            return {
                ...state,
                notesGZMTR: state.notesGZMTR?.concat([['', '', 0, 0, false]]),
            };
        case 'REMOVE_NOTE_GZMTR':
            return {
                ...state,
                notesGZMTR: state.notesGZMTR?.filter((_, i) => i !== action.idx),
            };
        case 'UPDATE_NOTE_GZMTR':
            return {
                ...state,
                notesGZMTR: state.notesGZMTR?.map((note, i) => (i === action.idx ? action.note : note)),
            };
        case 'SET_CURRENT_STATION':
            return {
                ...state,
                current_stn_idx: action.stnId,
            };
        case 'REVERSE_STATIONS':
            return {
                ...state,
                stn_list: Object.keys(state.stn_list).reduce(
                    (acc, stnId) => ({
                        ...acc,
                        [stnId]: (id => {
                            switch (id) {
                                case 'linestart':
                                    return {
                                        ...state.stn_list.lineend,
                                        parents: [],
                                        children: state.stn_list.lineend.parents.slice().reverse(),
                                        branch: { left: [] as [], right: state.stn_list.lineend.branch.left },
                                    };
                                case 'lineend':
                                    return {
                                        ...state.stn_list.linestart,
                                        parents: state.stn_list.linestart.children.slice().reverse(),
                                        children: [],
                                        branch: { left: state.stn_list.linestart.branch.right, right: [] as [] },
                                    };
                                default:
                                    return {
                                        ...state.stn_list[id],
                                        parents: state.stn_list[id].children
                                            .map(id =>
                                                id === 'linestart' ? 'lineend' : id === 'lineend' ? 'linestart' : id
                                            )
                                            .reverse(),
                                        children: state.stn_list[id].parents
                                            .map(id =>
                                                id === 'linestart' ? 'lineend' : id === 'lineend' ? 'linestart' : id
                                            )
                                            .reverse(),
                                        branch: {
                                            left: state.stn_list[id].branch.right,
                                            right: state.stn_list[id].branch.left,
                                        },
                                    };
                            }
                        })(stnId),
                    }),
                    {} as StationDict
                ),
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
        case 'UPDATE_STATION_SECONDARY_NAME':
            return {
                ...state,
                stn_list: {
                    ...state.stn_list,
                    [action.stnId]: {
                        ...state.stn_list[action.stnId],
                        secondaryName: action.name,
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
        case 'UPDATE_STATION_INTERCHANGE_INFO':
            return {
                ...state,
                stn_list: {
                    ...state.stn_list,
                    [action.stnId]: {
                        ...state.stn_list[action.stnId],
                        transfer: {
                            ...state.stn_list[action.stnId].transfer,
                            info: state.stn_list[action.stnId].transfer?.info.map((infos, i) =>
                                i === action.setIdx
                                    ? infos.map((int, j) =>
                                          j === action.intIdx
                                              ? (([0, 1, 2, 3, 4, 5].map(k =>
                                                    action.info[k] === undefined ? int[k] : action.info[k]
                                                ) as unknown) as InterchangeInfo)
                                              : int
                                      )
                                    : infos
                            ),
                        },
                    },
                },
            };
        case 'UPDATE_STATION_OSI_NAME':
            return {
                ...state,
                stn_list: {
                    ...state.stn_list,
                    [action.stnId]: {
                        ...state.stn_list[action.stnId],
                        transfer: {
                            ...state.stn_list[action.stnId].transfer,
                            osi_names: [action.name],
                        },
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
        case 'UPDATE_STATION_FACILITY':
            return {
                ...state,
                stn_list: {
                    ...state.stn_list,
                    [action.stnId]: {
                        ...state.stn_list[action.stnId],
                        facility: action.facility,
                    },
                },
            };
        case 'UPDATE_STATION_SERVICES':
            return {
                ...state,
                stn_list: {
                    ...state.stn_list,
                    [action.stnId]: {
                        ...state.stn_list[action.stnId],
                        services: Array.from(
                            action.isChecked
                                ? new Set(state.stn_list[action.stnId].services).add(action.serviceId)
                                : state.stn_list[action.stnId].services.filter(s => s !== action.serviceId)
                        ),
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
