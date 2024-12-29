import {
    BranchStyle,
    Direction,
    ExtendedInterchangeInfo,
    Facilities,
    Name,
    RMGParam,
    Services,
    ShortDirection,
    StationDict,
    StationInfo,
} from '../../constants/constants';
import { RootDispatch, RootState } from '../index';
import * as paramSlice from './param-slice';
import { updateHelper } from '../helper/helper-slice';
import { LanguageCode } from '@railmapgen/rmg-translate';

export const setFullParam = (fullParam: RMGParam) => {
    return (dispatch: RootDispatch) => {
        dispatch(paramSlice.setFullParam(fullParam));
        dispatch(updateHelper(fullParam.stn_list));
    };
};

export const setStation = (stationId: string, station: StationInfo) => {
    return (dispatch: RootDispatch, getState: () => RootState) => {
        const { stn_list } = getState().param;
        const nextStationList = {
            ...stn_list,
            [stationId]: station,
        };
        dispatch(setStationsBulk(nextStationList));
        // console.log('set bulk done');
    };
};

export const setStationsBulk = (stations: StationDict) => {
    return (dispatch: RootDispatch) => {
        dispatch(paramSlice.setStations(stations));
        dispatch(updateHelper(stations));
    };
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

export const updateStationName = (stationId: string, lang: LanguageCode, value: string) => {
    return (dispatch: RootDispatch, getState: () => RootState) => {
        const stationInfo = getState().param.stn_list[stationId];
        dispatch(
            setStation(stationId, {
                ...stationInfo,
                localisedName: { ...stationInfo.localisedName, [lang]: value },
            })
        );
    };
};

export const toggleStationSecondaryName = (stationId: string, flag: boolean) => {
    return (dispatch: RootDispatch, getState: () => RootState) => {
        const { localisedSecondaryName, ...stationInfo } = getState().param.stn_list[stationId];
        if (flag) {
            dispatch(setStation(stationId, { ...stationInfo, localisedSecondaryName: {} }));
        } else {
            dispatch(setStation(stationId, stationInfo));
        }
    };
};

export const updateStationSecondaryName = (stationId: string, lang: LanguageCode, value: string) => {
    return (dispatch: RootDispatch, getState: () => RootState) => {
        const stationInfo = getState().param.stn_list[stationId];
        dispatch(
            setStation(stationId, {
                ...stationInfo,
                localisedSecondaryName: { ...stationInfo.localisedSecondaryName, [lang]: value },
            })
        );
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
                lines: (newTransferGroups[setIndex].lines ?? []).concat(interchangeInfo),
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
            (stationInfo.transfer.groups[groupIndex].lines?.length || 0) > interchangeIndex
        ) {
            const newTransferGroups = stationInfo.transfer.groups.map((group, groupIdx) =>
                groupIdx === groupIndex
                    ? {
                          ...group,
                          lines: group.lines?.filter((_, intIdx) => intIdx !== interchangeIndex),
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
            (stationInfo.transfer.groups[groupIndex].lines?.length || 0) > interchangeIndex
        ) {
            const newTransferGroups = stationInfo.transfer.groups.map((group, groupIdx) =>
                groupIdx === groupIndex
                    ? {
                          ...group,
                          lines: group.lines?.map((line, lineIdx) =>
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
            if (branchStartId) dispatch(flipStationBranchPositionLegacy(stationId, branchStartId));
        } else {
            const branchEndId = branches
                .slice(1)
                .find(branch => branch[0] === stationId)
                ?.slice(-1)?.[0];
            if (branchEndId) dispatch(flipStationBranchPositionLegacy(branchEndId, stationId));
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

        const stationList = structuredClone(getState().param.stn_list);
        Object.values(stationList).forEach(stnInfo => {
            stnInfo.int_padding = int_padding;
        });

        dispatch(setStationsBulk(stationList));
    };
};

export const updateStationCharacterSpacing = (stationId: string, character_spacing: number) => {
    return (dispatch: RootDispatch, getState: () => RootState) => {
        const stationInfo = getState().param.stn_list[stationId];

        dispatch(setStation(stationId, { ...stationInfo, character_spacing }));
    };
};

export const updateStationCharacterSpacingToAll = (stationId: string) => {
    return (dispatch: RootDispatch, getState: () => RootState) => {
        const stationInfo = getState().param.stn_list[stationId];
        const character_spacing = stationInfo.character_spacing;

        const stationList = structuredClone(getState().param.stn_list);
        Object.values(stationList).forEach(stnInfo => {
            stnInfo.character_spacing = character_spacing;
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
