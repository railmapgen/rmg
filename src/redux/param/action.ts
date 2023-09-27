import {
    BranchStyle,
    CanvasType,
    ColineInfo,
    Direction,
    ExtendedInterchangeInfo,
    Facilities,
    Name,
    Note,
    PanelTypeGZMTR,
    PanelTypeShmetro,
    RMGParam,
    RmgStyle,
    Services,
    ShortDirection,
    StationDict,
    StationInfo,
} from '../../constants/constants';
import { RootDispatch, RootState } from '../index';
import { triggerHelpersUpdate } from '../helper/action';
import { Theme } from '@railmapgen/rmg-palette-resources';

export const SET_FULL_PARAM = 'SET_FULL_PARAM';

// file
export const SET_STYLE = 'SET_STYLE';

// layout
export const SET_SVG_HEIGHT = 'SET_SVG_HEIGHT';
export const SET_SVG_WIDTH = 'SET_SVG_WIDTH';
export const SET_Y_PERCENTAGE = 'SET_Y_PERCENTAGE';
export const SET_BRANCH_SPACING_PCT = 'SET_BRANCH_SPACING_PCT';
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
export const SET_LOOP = 'SET_LOOP';
export const SET_LOOP_INFO = 'SET_LOOP_INFO';

// stations
export const SET_CURRENT_STATION = 'SET_CURRENT_STATION';
export const SET_STATION = 'SET_STATION';
export const SET_STATIONS_BULK = 'SET_STATIONS_BULK';

// coline
export const SET_COLINE_BULK = 'SET_COLINE_BULK';

export interface setFullParamAction {
    type: typeof SET_FULL_PARAM;
    fullParam: RMGParam;
}

export interface setStyleAction {
    type: typeof SET_STYLE;
    style: RmgStyle;
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

export interface setBranchSpacingPctAction {
    type: typeof SET_BRANCH_SPACING_PCT;
    branchSpacingPct: number;
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
    platform: string;
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
    notes?: Note[];
}

export interface setNamePositionAction {
    type: typeof SET_NAME_POSITION;
    namePosition: RMGParam['namePosMTR'];
}

export interface setCustomisedMtrDestinationAction {
    type: typeof SET_CUSTOMISED_MTR_DESTINATION;
    customisedMtrDestination: RMGParam['customiseMTRDest'];
}

export interface setLoopAction {
    type: typeof SET_LOOP;
    loop: RMGParam['loop'];
}

export interface setLoopInfoAction {
    type: typeof SET_LOOP_INFO;
    loop_info: RMGParam['loop_info'];
}

export interface setCurrentStationAction {
    type: typeof SET_CURRENT_STATION;
    currentStation: string;
    stn_list_keys: string[];
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

export interface setColineBulkAction {
    type: typeof SET_COLINE_BULK;
    coline: Record<string, ColineInfo>;
}

// export const setFullParam = (fullParam: RMGParam): setFullParamAction => {
//     return { type: SET_FULL_PARAM, fullParam };
// };

export const setFullParam = (fullParam: RMGParam) => {
    return (dispatch: RootDispatch) => {
        dispatch({ type: SET_FULL_PARAM, fullParam });
        dispatch(triggerHelpersUpdate());
    };
};

export const setSvgHeight = (svgHeight: number): setSvgHeightAction => {
    return { type: SET_SVG_HEIGHT, svgHeight };
};

export const setSvgWidth = (svgWidth: number, canvas: CanvasType): setSvgWidthAction => {
    return { type: SET_SVG_WIDTH, svgWidth, canvas };
};

export const setStyle = (style: RmgStyle): setStyleAction => {
    return { type: SET_STYLE, style };
};

export const setYPercentage = (yPercentage: number): setYPercentageAction => {
    return { type: SET_Y_PERCENTAGE, yPercentage };
};

export const setBranchSpacingPct = (branchSpacingPct: number): setBranchSpacingPctAction => {
    return { type: SET_BRANCH_SPACING_PCT, branchSpacingPct };
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

export const setPlatform = (platform: string): setPlatformAction => {
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

const setNotes = (notes?: Note[]): setNotesAction => {
    return { type: SET_NOTES, notes };
};

export const addNote = () => {
    return (dispatch: RootDispatch, getState: () => RootState) => {
        const notes = getState().param.notesGZMTR;
        dispatch(setNotes((notes || []).concat([['', '', 10, 10, false]])));
    };
};

export const updateNote = (index: number, updatedNote: Note) => {
    return (dispatch: RootDispatch, getState: () => RootState) => {
        const notes = getState().param.notesGZMTR;
        dispatch(setNotes(notes?.map((originalNote, idx) => (idx === index ? updatedNote : originalNote))));
    };
};

export const removeNote = (index: number) => {
    return (dispatch: RootDispatch, getState: () => RootState) => {
        const notes = getState().param.notesGZMTR;
        dispatch(setNotes(notes?.filter((_, idx) => idx !== index)));
    };
};

const setNamePosition = (namePosition: RMGParam['namePosMTR']): setNamePositionAction => {
    return { type: SET_NAME_POSITION, namePosition };
};

export const staggerStationNames = (isStagger: boolean) => {
    return (dispatch: RootDispatch, getState: () => RootState) => {
        const namePosition = getState().param.namePosMTR;
        dispatch(setNamePosition({ ...namePosition, isStagger }));
    };
};

export const flipStationNames = () => {
    return (dispatch: RootDispatch, getState: () => RootState) => {
        const namePosition = getState().param.namePosMTR;
        dispatch(setNamePosition({ ...namePosition, isFlip: !namePosition.isFlip }));
    };
};

const setCustomisedMtrDestination = (
    customisedMtrDestination: RMGParam['customiseMTRDest']
): setCustomisedMtrDestinationAction => {
    return { type: SET_CUSTOMISED_MTR_DESTINATION, customisedMtrDestination };
};

export const setLoop = (loop: RMGParam['loop']) => {
    return (dispatch: RootDispatch) => {
        // reset these factors to a non-breaking state as split_loop_stns might fail in the blank template
        dispatch(setLoopInfo({ bank: true, left_and_right_factor: 0, bottom_factor: 1 }));
        dispatch({ type: SET_LOOP, loop });
    };
};

const setLoopInfo = (loop_info: RMGParam['loop_info']): setLoopInfoAction => {
    return { type: SET_LOOP_INFO, loop_info };
};

export const setLoopBank = (bank: RMGParam['loop_info']['bank']) => {
    return (dispatch: RootDispatch, getState: () => RootState) => {
        const loop_info = getState().param.loop_info;
        dispatch(setLoopInfo({ ...loop_info, bank: bank }));
    };
};

export const setLoopLeftAndRightFactor = (left_and_right_factor: RMGParam['loop_info']['left_and_right_factor']) => {
    return (dispatch: RootDispatch, getState: () => RootState) => {
        const loop_info = getState().param.loop_info;
        dispatch(setLoopInfo({ ...loop_info, left_and_right_factor: left_and_right_factor }));
    };
};

export const setLoopBottomFactor = (bottom_factor: RMGParam['loop_info']['bottom_factor']) => {
    return (dispatch: RootDispatch, getState: () => RootState) => {
        const loop_info = getState().param.loop_info;
        dispatch(setLoopInfo({ ...loop_info, bottom_factor: bottom_factor }));
    };
};

export const toggleLineNameBeforeDestination = (isShow: boolean) => {
    return (dispatch: RootDispatch, getState: () => RootState) => {
        const customisedMtrDestination = getState().param.customiseMTRDest;
        dispatch(setCustomisedMtrDestination({ ...customisedMtrDestination, isLegacy: isShow }));
    };
};

export const customiseDestinationName = (customisedName: Name | false) => {
    return (dispatch: RootDispatch, getState: () => RootState) => {
        const customisedMtrDestination = getState().param.customiseMTRDest;
        dispatch(setCustomisedMtrDestination({ ...customisedMtrDestination, terminal: customisedName }));
    };
};

/**
 * Set the current station from `currentStation`.
 * @param currentStation The station id which we want to set.
 * @returns A promise that we can do something after svg elements are completely updated in `downloadSvg` of `PreviewDialog`.
 */
export const setCurrentStation = (currentStation: string) => {
    return (dispatch: RootDispatch) => {
        dispatch({ type: SET_CURRENT_STATION, currentStation });
    };
};

export const setStation = (stationId: string, station: StationInfo) => {
    return (dispatch: RootDispatch) => {
        dispatch({ type: SET_STATION, stationId, station });
        dispatch(triggerHelpersUpdate());
    };
};

// export const setStationsBulk = (stations: StationDict): setStationsBulkAction => {
//     return { type: SET_STATIONS_BULK, stations };
// };

export const setStationsBulk = (stations: StationDict) => {
    return (dispatch: RootDispatch) => {
        dispatch({ type: SET_STATIONS_BULK, stations });
        dispatch(triggerHelpersUpdate());
    };
};

export const setColineBulk = (coline: Record<string, ColineInfo>): setColineBulkAction => {
    return { type: SET_COLINE_BULK, coline };
};

/**
 * @param flipBranch Set as false if you want to rotate the line but keeping the topology ordering (TPO). Set as true if you want to flip branches and break the TPO (for SHMetro).
 */
export const reverseStations = (flipBranch = false) => {
    return (dispatch: RootDispatch, getState: () => RootState) => {
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
                                children: flipBranch ? stn_list.lineend.parents : stn_list.lineend.parents.toReversed(),
                                branch: { right: stn_list.lineend.branch?.left },
                            };
                        case 'lineend':
                            return {
                                ...stn_list.linestart,
                                parents: flipBranch
                                    ? stn_list.linestart.children
                                    : stn_list.linestart.children.toReversed(),
                                children: [],
                                branch: { left: stn_list.linestart.branch?.right },
                            };
                        default: {
                            const mappedParents = stn_list[id].children.map(id =>
                                id === 'linestart' ? 'lineend' : id === 'lineend' ? 'linestart' : id
                            );
                            const mappedChildren = stn_list[id].parents.map(id =>
                                id === 'linestart' ? 'lineend' : id === 'lineend' ? 'linestart' : id
                            );
                            return {
                                ...stn_list[id],
                                parents: flipBranch ? mappedParents : mappedParents.reverse(),
                                children: flipBranch ? mappedChildren : mappedChildren.reverse(),
                                branch: {
                                    left: stn_list[id].branch?.right,
                                    right: stn_list[id].branch?.left,
                                },
                            };
                        }
                    }
                })(stnId),
            }),
            {} as StationDict
        );
        dispatch(setStationsBulk(newStationList));
    };
};

export const updateStationName = (stationId: string, name: Name) => {
    return (dispatch: RootDispatch, getState: () => RootState) => {
        const stationInfo = getState().param.stn_list[stationId];
        dispatch(setStation(stationId, { ...stationInfo, name }));
    };
};

export const updateStationSecondaryName = (stationId: string, secondaryName?: Name) => {
    return (dispatch: RootDispatch, getState: () => RootState) => {
        const stationInfo = getState().param.stn_list[stationId];
        dispatch(setStation(stationId, { ...stationInfo, secondaryName }));
    };
};

export const updateStationNum = (stationId: string, num: string) => {
    return (dispatch: RootDispatch, getState: () => RootState) => {
        const stationInfo = getState().param.stn_list[stationId];
        dispatch(setStation(stationId, { ...stationInfo, num }));
    };
};

/**
 *
 * @param stationId
 * @param setIndex - set 0: within-station interchange. set 1: Out of station(OSI) transfer. set 2: Out of system(OSysI) transfer
 * @param interchangeInfo
 */
export const addInterchange = (stationId: string, setIndex: number, interchangeInfo: ExtendedInterchangeInfo) => {
    return (dispatch: RootDispatch, getState: () => RootState) => {
        const stationInfo = getState().param.stn_list[stationId];

        const newTransferGroups = stationInfo.transfer.groups.map(group => ({ ...group }));
        if (newTransferGroups.length > setIndex) {
            newTransferGroups[setIndex] = {
                ...newTransferGroups[setIndex],
                lines: newTransferGroups[setIndex].lines.concat(interchangeInfo),
            };
        } else {
            for (let i = newTransferGroups.length; i < setIndex; i++) {
                newTransferGroups[i] = { lines: [] };
            }
            newTransferGroups[setIndex] = { lines: [interchangeInfo] };
        }

        dispatch(
            setStation(stationId, {
                ...stationInfo,
                transfer: {
                    ...stationInfo.transfer,
                    groups: [newTransferGroups[0], ...(newTransferGroups.slice(1) ?? [])],
                },
            })
        );
    };
};

export const removeInterchange = (stationId: string, groupIndex: number, interchangeIndex: number) => {
    return (dispatch: RootDispatch, getState: () => RootState) => {
        const stationInfo = getState().param.stn_list[stationId];

        if (
            stationInfo.transfer.groups.length > groupIndex &&
            stationInfo.transfer.groups[groupIndex].lines.length > interchangeIndex
        ) {
            const newTransferGroups = stationInfo.transfer.groups.map((group, groupIdx) =>
                groupIdx === groupIndex
                    ? {
                          ...group,
                          lines: group.lines.filter((_, intIdx) => intIdx !== interchangeIndex),
                      }
                    : group
            );
            dispatch(
                setStation(stationId, {
                    ...stationInfo,
                    transfer: {
                        ...stationInfo.transfer,
                        groups: [newTransferGroups[0], ...(newTransferGroups.slice(1) ?? [])],
                    },
                })
            );
        }
    };
};

export const updateInterchange = (
    stationId: string,
    groupIndex: number,
    interchangeIndex: number,
    interchangeInfo: ExtendedInterchangeInfo
) => {
    return (dispatch: RootDispatch, getState: () => RootState) => {
        const stationInfo = getState().param.stn_list[stationId];

        if (
            stationInfo.transfer.groups.length > groupIndex &&
            stationInfo.transfer.groups[groupIndex].lines.length > interchangeIndex
        ) {
            const newTransferGroups = stationInfo.transfer.groups.map((group, groupIdx) =>
                groupIdx === groupIndex
                    ? {
                          ...group,
                          lines: group.lines.map((line, lineIdx) =>
                              lineIdx === interchangeIndex ? interchangeInfo : line
                          ),
                      }
                    : group
            );
            dispatch(
                setStation(stationId, {
                    ...stationInfo,
                    transfer: {
                        ...stationInfo.transfer,
                        groups: [newTransferGroups[0], ...(newTransferGroups.slice(1) ?? [])],
                    },
                })
            );
        }
    };
};

export const updateStationOsiName = (stationId: string, groupIndex: number, osiName: Name) => {
    return (dispatch: RootDispatch, getState: () => RootState) => {
        const stationInfo = getState().param.stn_list[stationId];

        const newTransferGroups = stationInfo.transfer.groups.map(group => ({ ...group }));
        if (newTransferGroups.length > groupIndex) {
            newTransferGroups[groupIndex] = { ...newTransferGroups[groupIndex], name: osiName };
            dispatch(
                setStation(stationId, {
                    ...stationInfo,
                    transfer: {
                        ...stationInfo.transfer,
                        groups: [newTransferGroups[0], ...(newTransferGroups.slice(1) ?? [])],
                    },
                })
            );
        }
    };
};

export const updateStationTickDirection = (stationId: string, tickDirection: ShortDirection) => {
    return (dispatch: RootDispatch, getState: () => RootState) => {
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
    return (dispatch: RootDispatch, getState: () => RootState) => {
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
    return (dispatch: RootDispatch, getState: () => RootState) => {
        const stationInfo = getState().param.stn_list[stationId];
        dispatch(
            setStation(stationId, {
                ...stationInfo,
                branch: {
                    ...stationInfo.branch,
                    [direction]: stationInfo.branch?.[direction]?.with(0, branchStyle),
                },
            })
        );
    };
};

// TODO: replace with branch swapping in future change
export const updateStationBranchFirstStation = (stationId: string, direction: Direction, firstId: string) => {
    // update both end of the branch
    return (dispatch: RootDispatch, getState: () => RootState) => {
        const branches = getState().helper.branches;

        const arg = { stnId: stationId, direction, first: firstId };

        if (direction === Direction.left) {
            const branchStartId = branches.slice(1).find(branch => branch.slice(-1)[0] === stationId)?.[0];
            if (branchStartId) {
                const branchStartFirstId = branches[0][branches[0].indexOf(branchStartId) + 1];
                dispatch(
                    updateStationBranchFirstStationLegacy([
                        arg,
                        {
                            stnId: branchStartId,
                            direction: Direction.right,
                            first: branchStartFirstId,
                        },
                    ])
                );
            }
        } else {
            const branchEndId = branches
                .slice(1)
                .find(branch => branch[0] === stationId)
                ?.slice(-1)?.[0];
            if (branchEndId) {
                const branchEndFirstId = branches[0][branches[0].indexOf(branchEndId) - 1];
                dispatch(
                    updateStationBranchFirstStationLegacy([
                        arg,
                        {
                            stnId: branchEndId,
                            direction: Direction.left,
                            first: branchEndFirstId,
                        },
                    ])
                );
            }
        }
    };
};

export type UpdateStationBranchFirstStationLegacyArgType = { stnId: string; direction: Direction; first: string };

/**
 * @deprecated For V3 legacy support
 */
export const updateStationBranchFirstStationLegacy = (
    branches: [UpdateStationBranchFirstStationLegacyArgType, UpdateStationBranchFirstStationLegacyArgType]
) => {
    return (dispatch: RootDispatch, getState: () => RootState) => {
        const { stn_list } = getState().param;
        dispatch(
            setStationsBulk({
                ...stn_list,
                [branches[0].stnId]: {
                    ...stn_list[branches[0].stnId],
                    branch: {
                        ...stn_list[branches[0].stnId].branch,
                        [branches[0].direction]: stn_list[branches[0].stnId].branch?.[branches[0].direction]?.with(
                            1,
                            branches[0].first
                        ),
                    },
                },
                [branches[1].stnId]: {
                    ...stn_list[branches[1].stnId],
                    branch: {
                        ...stn_list[branches[1].stnId].branch,
                        [branches[1].direction]: stn_list[branches[1].stnId].branch?.[branches[1].direction]?.with(
                            1,
                            branches[1].first
                        ),
                    },
                },
            })
        );
    };
};

export const flipStationBranchPosition = (stationId: string, direction: Direction) => {
    // flip both end of the branch
    return (dispatch: RootDispatch, getState: () => RootState) => {
        const branches = getState().helper.branches;

        if (direction === Direction.left) {
            const branchStartId = branches.slice(1).find(branch => branch.slice(-1)[0] === stationId)?.[0];
            branchStartId && dispatch(flipStationBranchPositionLegacy(stationId, branchStartId));
        } else {
            const branchEndId = branches
                .slice(1)
                .find(branch => branch[0] === stationId)
                ?.slice(-1)?.[0];
            branchEndId && dispatch(flipStationBranchPositionLegacy(branchEndId, stationId));
        }
    };
};

/**
 * @deprecated For V3 legacy support
 */
export const flipStationBranchPositionLegacy = (left: string, right: string) => {
    return (dispatch: RootDispatch, getState: () => RootState) => {
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

export const updateStationFacility = (stationId: string, facility: Facilities | '') => {
    return (dispatch: RootDispatch, getState: () => RootState) => {
        const stationInfo = getState().param.stn_list[stationId];
        dispatch(setStation(stationId, { ...stationInfo, facility: facility || undefined }));
    };
};

export const updateStationServices = (stationId: string, services: Services[]) => {
    return (dispatch: RootDispatch, getState: () => RootState) => {
        const stationInfo = getState().param.stn_list[stationId];

        dispatch(setStation(stationId, { ...stationInfo, services }));
    };
};

export const addStationService = (stationId: string, service: Services) => {
    return (dispatch: RootDispatch, getState: () => RootState) => {
        const stationInfo = getState().param.stn_list[stationId];

        if (!stationInfo.services.includes(service)) {
            dispatch(setStation(stationId, { ...stationInfo, services: stationInfo.services.concat(service) }));
        }
    };
};

export const removeStationService = (stationId: string, service: Services) => {
    return (dispatch: RootDispatch, getState: () => RootState) => {
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

export const updateStationLoopPivot = (stationId: string, loop_pivot: boolean) => {
    return (dispatch: RootDispatch, getState: () => RootState) => {
        const stationInfo = getState().param.stn_list[stationId];

        dispatch(setStation(stationId, { ...stationInfo, loop_pivot }));
    };
};

export const updateStationOneLine = (stationId: string, one_line: boolean) => {
    return (dispatch: RootDispatch, getState: () => RootState) => {
        const stationInfo = getState().param.stn_list[stationId];

        dispatch(setStation(stationId, { ...stationInfo, one_line }));
    };
};

export const updateStationIntPadding = (stationId: string, int_padding: number) => {
    return (dispatch: RootDispatch, getState: () => RootState) => {
        const stationInfo = getState().param.stn_list[stationId];

        dispatch(setStation(stationId, { ...stationInfo, int_padding }));
    };
};

export const updateStationIntPaddingToAll = (stationId: string) => {
    return (dispatch: RootDispatch, getState: () => RootState) => {
        const stationInfo = getState().param.stn_list[stationId];
        const int_padding = stationInfo.int_padding;

        const stationList = JSON.parse(JSON.stringify(getState().param.stn_list)) as StationDict;
        Object.values(stationList).forEach(stnInfo => {
            stnInfo.int_padding = int_padding;
        });

        dispatch(setStationsBulk(stationList));
    };
};

export const autoNumbering = (branchIndex: number, from: number, maxLength = 2, sort: 'asc' | 'desc' = 'asc') => {
    return (dispatch: RootDispatch, getState: () => RootState) => {
        const stationList = getState().param.stn_list;
        const branches = getState().helper.branches;

        // not altering station code of linestart, lineend, branch out station
        const branch = branches[branchIndex]?.slice(1, -1);

        if (branch) {
            const nextStationList = branch.reduce((acc, cur, idx) => {
                return {
                    ...acc,
                    [cur]: {
                        ...stationList[cur],
                        num: (from + idx * (sort === 'desc' ? -1 : 1)).toString().padStart(maxLength, '0'),
                    },
                };
            }, stationList);

            dispatch(setStationsBulk(nextStationList));
        }
    };
};
