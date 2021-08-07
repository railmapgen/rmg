import {
    BranchStyle,
    CanvasType,
    Direction,
    Facilities,
    InterchangeInfo,
    Name,
    Note,
    PanelTypeGZMTR,
    PanelTypeShmetro,
    RMGParam,
    Services,
    ShortDirection,
    StationDict,
    StationInfo,
    Theme,
} from '../../constants/constants';
import { Dispatch } from 'redux';
import { RootState } from '../index';

export const SET_FULL_PARAM = 'SET_FULL_PARAM';

// layout
export const SET_SVG_HEIGHT = 'SET_SVG_HEIGHT';
export const SET_SVG_WIDTH = 'SET_SVG_WIDTH';
export const SET_Y_PERCENTAGE = 'SET_Y_PERCENTAGE';
export const SET_BRANCH_SPACING = 'SET_BRANCH_SPACING';
export const SET_PADDING_PERCENTAGE = 'SET_PADDING_PERCENTAGE';
export const SET_DIRECTION_INDICATOR_X = 'SET_DIRECTION_INDICATOR_X';
export const SET_DIRECTION_INDICATOR_Y = 'SET_DIRECTION_INDICATOR_Y';

// design
export const SET_THEME = 'SET_THEME';
export const SET_LINE_NAME = 'SET_LINE_NAME';
export const SET_DIRECTION = 'SET_DIRECTION';
export const SET_PLATFORM = 'SET_PLATFORM';
export const SET_LINE_NUM = 'SET_LINE_NUM';
export const SET_PSD_NUM = 'SET_PSD_NUM';
export const SET_PANEL_TYPE = 'SET_PANEL_TYPE';
export const SET_NOTES = 'SET_NOTES';
export const SET_NAME_POSITION = 'SET_NAME_POSITION';
export const SET_CUSTOMISED_MTR_DESTINATION = 'SET_CUSTOMISED_MTR_DESTINATION';

// stations
export const SET_CURRENT_STATION = 'SET_CURRENT_STATION';
export const SET_STATION = 'SET_STATION';
export const SET_STATIONS_BULK = 'SET_STATIONS_BULK';

export interface setFullParamAction {
    type: typeof SET_FULL_PARAM;
    fullParam: RMGParam;
}

export interface setSvgHeightAction {
    type: typeof SET_SVG_HEIGHT;
    svgHeight: number;
}

export interface setSvgWidthAction {
    type: typeof SET_SVG_WIDTH;
    svgWidth: number;
    canvas: CanvasType;
}

export interface setYPercentageAction {
    type: typeof SET_Y_PERCENTAGE;
    yPercentage: number;
}

export interface setBranchSpacingAction {
    type: typeof SET_BRANCH_SPACING;
    branchSpacing: number;
}

export interface setPaddingPercentageAction {
    type: typeof SET_PADDING_PERCENTAGE;
    paddingPercentage: number;
}

export interface setDirectionIndicatorXAction {
    type: typeof SET_DIRECTION_INDICATOR_X;
    directionIndicatorX: number;
}

export interface setDirectionIndicatorYAction {
    type: typeof SET_DIRECTION_INDICATOR_Y;
    directionIndicatorY: number;
}

export interface setThemeAction {
    type: typeof SET_THEME;
    theme: Theme;
}

export interface setLineNameAction {
    type: typeof SET_LINE_NAME;
    lineName: Name;
}

export interface setDirectionAction {
    type: typeof SET_DIRECTION;
    direction: ShortDirection;
}

export interface setPlatformAction {
    type: typeof SET_PLATFORM;
    platform: string | false;
}

export interface setLineNumAction {
    type: typeof SET_LINE_NUM;
    lineNum: string;
}

export interface setPsdNumAction {
    type: typeof SET_PSD_NUM;
    psdNum: string;
}

export interface setPanelTypeAction {
    type: typeof SET_PANEL_TYPE;
    panelType: PanelTypeGZMTR | PanelTypeShmetro;
}

export interface setNotesAction {
    type: typeof SET_NOTES;
    notes: Note[];
}

export interface setNamePositionAction {
    type: typeof SET_NAME_POSITION;
    namePosition: RMGParam['namePosMTR'];
}

export interface setCustomisedMtrDestinationAction {
    type: typeof SET_CUSTOMISED_MTR_DESTINATION;
    customisedMtrDestination: RMGParam['customiseMTRDest'];
}

export interface setCurrentStationAction {
    type: typeof SET_CURRENT_STATION;
    currentStation: string;
}

export interface setStationAction {
    type: typeof SET_STATION;
    stationId: string;
    station: StationInfo;
}

export interface setStationsBulkAction {
    type: typeof SET_STATIONS_BULK;
    stations: StationDict;
}

export const setFullParam = (fullParam: RMGParam): setFullParamAction => {
    return { type: SET_FULL_PARAM, fullParam };
};

export const setSvgHeight = (svgHeight: number): setSvgHeightAction => {
    return { type: SET_SVG_HEIGHT, svgHeight };
};

export const setSvgWidth = (svgWidth: number, canvas: CanvasType): setSvgWidthAction => {
    return { type: SET_SVG_WIDTH, svgWidth, canvas };
};

export const setYPercentage = (yPercentage: number): setYPercentageAction => {
    return { type: SET_Y_PERCENTAGE, yPercentage };
};

export const setBranchSpacing = (branchSpacing: number): setBranchSpacingAction => {
    return { type: SET_BRANCH_SPACING, branchSpacing };
};

export const setPaddingPercentage = (paddingPercentage: number): setPaddingPercentageAction => {
    return { type: SET_PADDING_PERCENTAGE, paddingPercentage };
};

export const setDirectionIndicatorX = (directionIndicatorX: number): setDirectionIndicatorXAction => {
    return { type: SET_DIRECTION_INDICATOR_X, directionIndicatorX };
};

export const setDirectionIndicatorY = (directionIndicatorY: number): setDirectionIndicatorYAction => {
    return { type: SET_DIRECTION_INDICATOR_Y, directionIndicatorY };
};

export const setTheme = (theme: Theme): setThemeAction => {
    return { type: SET_THEME, theme };
};

export const setLineName = (lineName: Name): setLineNameAction => {
    return { type: SET_LINE_NAME, lineName };
};

export const setDirection = (direction: ShortDirection): setDirectionAction => {
    return { type: SET_DIRECTION, direction };
};

export const setPlatform = (platform: string | false): setPlatformAction => {
    return { type: SET_PLATFORM, platform };
};

export const setLineNum = (lineNum: string): setLineNumAction => {
    return { type: SET_LINE_NUM, lineNum };
};

export const setPsdNum = (psdNum: string): setPsdNumAction => {
    return { type: SET_PSD_NUM, psdNum };
};

export const setPanelType = (panelType: PanelTypeShmetro | PanelTypeGZMTR): setPanelTypeAction => {
    return { type: SET_PANEL_TYPE, panelType };
};

const setNotes = (notes: Note[]): setNotesAction => {
    return { type: SET_NOTES, notes };
};

export const addNote = () => {
    return (dispatch: Dispatch, getState: () => RootState) => {
        const notes = getState().param.notesGZMTR;
        dispatch(setNotes(notes.concat([['', '', 0, 0, false]])));
    };
};

export const updateNote = (index: number, updatedNote: Note) => {
    return (dispatch: Dispatch, getState: () => RootState) => {
        const notes = getState().param.notesGZMTR;
        dispatch(setNotes(notes.map((originalNote, idx) => (idx === index ? updatedNote : originalNote))));
    };
};

export const removeNote = (index: number) => {
    return (dispatch: Dispatch, getState: () => RootState) => {
        const notes = getState().param.notesGZMTR;
        dispatch(setNotes(notes.filter((_, idx) => idx !== index)));
    };
};

const setNamePosition = (namePosition: RMGParam['namePosMTR']): setNamePositionAction => {
    return { type: SET_NAME_POSITION, namePosition };
};

export const staggerStationNames = (isStagger: boolean) => {
    return (dispatch: Dispatch, getState: () => RootState) => {
        const namePosition = getState().param.namePosMTR;
        dispatch(setNamePosition({ ...namePosition, isStagger }));
    };
};

export const flipStationNames = () => {
    return (dispatch: Dispatch, getState: () => RootState) => {
        const namePosition = getState().param.namePosMTR;
        dispatch(setNamePosition({ ...namePosition, isFlip: !namePosition.isFlip }));
    };
};

const setCustomisedMtrDestination = (
    customisedMtrDestination: RMGParam['customiseMTRDest']
): setCustomisedMtrDestinationAction => {
    return { type: SET_CUSTOMISED_MTR_DESTINATION, customisedMtrDestination };
};

export const toggleLineNameBeforeDestination = (isShow: boolean) => {
    return (dispatch: Dispatch, getState: () => RootState) => {
        const customisedMtrDestination = getState().param.customiseMTRDest;
        dispatch(setCustomisedMtrDestination({ ...customisedMtrDestination, isLegacy: isShow }));
    };
};

export const customiseDestinationName = (customisedName: Name | false) => {
    return (dispatch: Dispatch, getState: () => RootState) => {
        const customisedMtrDestination = getState().param.customiseMTRDest;
        dispatch(setCustomisedMtrDestination({ ...customisedMtrDestination, terminal: customisedName }));
    };
};

export const setCurrentStation = (currentStation: string): setCurrentStationAction => {
    return { type: SET_CURRENT_STATION, currentStation };
};

const setStation = (stationId: string, station: StationInfo): setStationAction => {
    return { type: SET_STATION, stationId, station };
};

export const setStationsBulk = (stations: StationDict): setStationsBulkAction => {
    return { type: SET_STATIONS_BULK, stations };
};

export const reverseStations = () => {
    return (dispatch: Dispatch, getState: () => RootState) => {
        const { stn_list } = getState().param;
        const newStationList = Object.keys(stn_list).reduce(
            (acc, stnId) => ({
                ...acc,
                [stnId]: (id => {
                    switch (id) {
                        case 'linestart':
                            return {
                                ...stn_list.lineend,
                                parents: [],
                                children: stn_list.lineend.parents.slice().reverse(),
                                branch: { left: [] as [], right: stn_list.lineend.branch.left },
                            };
                        case 'lineend':
                            return {
                                ...stn_list.linestart,
                                parents: stn_list.linestart.children.slice().reverse(),
                                children: [],
                                branch: { left: stn_list.linestart.branch.right, right: [] as [] },
                            };
                        default:
                            return {
                                ...stn_list[id],
                                parents: stn_list[id].children
                                    .map(id => (id === 'linestart' ? 'lineend' : id === 'lineend' ? 'linestart' : id))
                                    .reverse(),
                                children: stn_list[id].parents
                                    .map(id => (id === 'linestart' ? 'lineend' : id === 'lineend' ? 'linestart' : id))
                                    .reverse(),
                                branch: {
                                    left: stn_list[id].branch.right,
                                    right: stn_list[id].branch.left,
                                },
                            };
                    }
                })(stnId),
            }),
            {} as StationDict
        );
        dispatch(setStationsBulk(newStationList));
    };
};

export const updateStationName = (stationId: string, name: Name) => {
    return (dispatch: Dispatch, getState: () => RootState) => {
        const stationInfo = getState().param.stn_list[stationId];
        dispatch(setStation(stationId, { ...stationInfo, name }));
    };
};

export const updateStationSecondaryName = (stationId: string, secondaryName: Name | false) => {
    return (dispatch: Dispatch, getState: () => RootState) => {
        const stationInfo = getState().param.stn_list[stationId];
        dispatch(setStation(stationId, { ...stationInfo, secondaryName }));
    };
};

export const updateStationNum = (stationId: string, num: string) => {
    return (dispatch: Dispatch, getState: () => RootState) => {
        const stationInfo = getState().param.stn_list[stationId];
        dispatch(setStation(stationId, { ...stationInfo, num }));
    };
};

/**
 *
 * @param stationId
 * @param setIndex - set 0: within-station interchange. set 1: OSI 1, etc
 * @param interchangeInfo
 */
export const addInterchange = (stationId: string, setIndex: number, interchangeInfo: InterchangeInfo) => {
    return (dispatch: Dispatch, getState: () => RootState) => {
        const stationInfo = getState().param.stn_list[stationId];

        const newTransferInfo = stationInfo.transfer.info.map(i => i.slice());
        if (newTransferInfo.length > setIndex) {
            newTransferInfo[setIndex].push(interchangeInfo);
        } else {
            newTransferInfo[setIndex] = [interchangeInfo];
        }

        dispatch(
            setStation(stationId, { ...stationInfo, transfer: { ...stationInfo.transfer, info: newTransferInfo } })
        );
    };
};

export const removeInterchange = (stationId: string, setIndex: number, interchangeIndex: number) => {
    return (dispatch: Dispatch, getState: () => RootState) => {
        const stationInfo = getState().param.stn_list[stationId];

        if (
            stationInfo.transfer.info.length > setIndex &&
            stationInfo.transfer.info[setIndex].length > interchangeIndex
        ) {
            const newTransferInfo = stationInfo.transfer.info.map((set, setIdx) =>
                setIdx === setIndex ? set.filter((_, intIdx) => intIdx !== interchangeIndex) : set
            );
            dispatch(
                setStation(stationId, { ...stationInfo, transfer: { ...stationInfo.transfer, info: newTransferInfo } })
            );
        }
    };
};

export const updateInterchange = (
    stationId: string,
    setIndex: number,
    interchangeIndex: number,
    interchangeInfo: InterchangeInfo
) => {
    return (dispatch: Dispatch, getState: () => RootState) => {
        const stationInfo = getState().param.stn_list[stationId];

        if (
            stationInfo.transfer.info.length > setIndex &&
            stationInfo.transfer.info[setIndex].length > interchangeIndex
        ) {
            const newTransferInfo = stationInfo.transfer.info.map((set, setIdx) =>
                setIdx === setIndex
                    ? set.map((int, intIdx) =>
                          intIdx === interchangeIndex
                              ? ([0, 1, 2, 3, 4, 5].map(i =>
                                    interchangeInfo[i] === undefined ? int[i] : interchangeInfo[i]
                                ) as InterchangeInfo)
                              : int
                      )
                    : set
            );
            dispatch(
                setStation(stationId, { ...stationInfo, transfer: { ...stationInfo.transfer, info: newTransferInfo } })
            );
        }
    };
};

export const updateStationOsiName = (stationId: string, osiName: Name) => {
    return (dispatch: Dispatch, getState: () => RootState) => {
        const stationInfo = getState().param.stn_list[stationId];
        dispatch(
            setStation(stationId, {
                ...stationInfo,
                transfer: { ...stationInfo.transfer, osi_names: [osiName] },
            })
        );
    };
};

export const updateStationTickDirection = (stationId: string, tickDirection: ShortDirection) => {
    return (dispatch: Dispatch, getState: () => RootState) => {
        const stationInfo = getState().param.stn_list[stationId];
        dispatch(
            setStation(stationId, {
                ...stationInfo,
                transfer: { ...stationInfo.transfer, tick_direc: tickDirection },
            })
        );
    };
};

export const updateStationPaidArea = (stationId: string, isPaidArea: boolean) => {
    return (dispatch: Dispatch, getState: () => RootState) => {
        const stationInfo = getState().param.stn_list[stationId];
        dispatch(
            setStation(stationId, {
                ...stationInfo,
                transfer: { ...stationInfo.transfer, paid_area: isPaidArea },
            })
        );
    };
};

export const updateStationBranchType = (stationId: string, direction: Direction, branchStyle: BranchStyle) => {
    return (dispatch: Dispatch, getState: () => RootState) => {
        const stationInfo = getState().param.stn_list[stationId];
        dispatch(
            setStation(stationId, {
                ...stationInfo,
                branch: { ...stationInfo.branch, [direction]: [branchStyle, stationInfo.branch[direction][1]] },
            })
        );
    };
};

export type UpdateStationBranchFirstStationArgType = { stnId: string; direction: Direction; first: string };

// FIXME
export const updateStationBranchFirstStation = (
    branches: [UpdateStationBranchFirstStationArgType, UpdateStationBranchFirstStationArgType]
) => {
    return (dispatch: Dispatch, getState: () => RootState) => {
        const { stn_list } = getState().param;
        dispatch(
            setStationsBulk({
                ...stn_list,
                [branches[0].stnId]: {
                    ...stn_list[branches[0].stnId],
                    branch: {
                        ...stn_list[branches[0].stnId].branch,
                        [branches[0].direction]: [
                            stn_list[branches[0].stnId].branch[branches[0].direction][0],
                            branches[0].first,
                        ],
                    },
                },
                [branches[1].stnId]: {
                    ...stn_list[branches[1].stnId],
                    branch: {
                        ...stn_list[branches[1].stnId].branch,
                        [branches[1].direction]: [
                            stn_list[branches[1].stnId].branch[branches[1].direction][0],
                            branches[1].first,
                        ],
                    },
                },
            })
        );
    };
};

export const flipStationBranchPosition = (left: string, right: string) => {
    return (dispatch: Dispatch, getState: () => RootState) => {
        const { stn_list } = getState().param;
        dispatch(
            setStationsBulk({
                ...stn_list,
                [left]: { ...stn_list[left], parents: stn_list[left].parents.slice().reverse() },
                [right]: { ...stn_list[right], children: stn_list[right].children.slice().reverse() },
            })
        );
    };
};

export const updateStationFacility = (stationId: string, facility: Facilities) => {
    return (dispatch: Dispatch, getState: () => RootState) => {
        const stationInfo = getState().param.stn_list[stationId];
        dispatch(setStation(stationId, { ...stationInfo, facility }));
    };
};

export const addStationService = (stationId: string, service: Services) => {
    return (dispatch: Dispatch, getState: () => RootState) => {
        const stationInfo = getState().param.stn_list[stationId];

        if (!stationInfo.services.includes(service)) {
            dispatch(setStation(stationId, { ...stationInfo, services: stationInfo.services.concat(service) }));
        }
    };
};

export const removeStationService = (stationId: string, service: Services) => {
    return (dispatch: Dispatch, getState: () => RootState) => {
        const stationInfo = getState().param.stn_list[stationId];

        if (stationInfo.services.includes(service)) {
            dispatch(
                setStation(stationId, {
                    ...stationInfo,
                    services: stationInfo.services.filter(s => s !== service),
                })
            );
        }
    };
};
