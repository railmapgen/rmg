import { AppDispatch, RootState } from '../index';
import { ColineInfo, InterchangeInfo, StationDict } from '../../constants/constants';
import { setColineBulk } from './action';
import { nanoid } from 'nanoid';

// Cartesian product of multiple arrays in JavaScript
// https://stackoverflow.com/questions/12303989/cartesian-product-of-multiple-arrays-in-javascript
// Equivalent typescript version
// https://gist.github.com/ssippe/1f92625532eef28be6974f898efb23ef?permalink_comment_id=3364149#gistcomment-3364149
function cartesian<T>(...allEntries: T[][]): T[][] {
    return allEntries.reduce<T[][]>(
        (results, entries) =>
            results
                .map(result => entries.map(entry => result.concat([entry])))
                .reduce((subResults, result) => subResults.concat(result), []),
        [[]]
    );
}

/**
 * Coline branch is also known as the lower branch.
 */
export const isColineBranch = (branch: string[], stnList: StationDict) =>
    stnList[branch[0]].children.indexOf(branch[1]) ? true : false;

export const getPossibleStnIdsFromMainLine = (branches: string[][], stnList: StationDict) => [
    branches[0][1], // skip linestart
    branches[0][branches[0].length - 2], // skip lineend
    ...branches[0].filter(stnId =>
        // for every station in the main line, find if it branches out at this station
        branches
            .slice(1)
            .filter(branch => isColineBranch(branch, stnList))
            // branches after the first/main line may not have linestart or lineend
            .map(branch => branch.filter(stnId => !['linestart', 'lineend'].includes(stnId)))
            // only stations at both ends need to be taken into consideration
            .map(branch => [branch[0], branch[branch.length - 1]])
            .flat()
            .includes(stnId)
    ),
];

export const getPossibleStnIdsFromBranchLine = (branches: string[][], stnList: StationDict) =>
    branches
        .slice(1)
        .filter(branch => isColineBranch(branch, stnList))
        .map(branch => branch.filter(stnId => !['linestart', 'lineend'].includes(stnId)))
        .map(branch => [branch[0], branch[branch.length - 1]]);

export const getPossibleCombinations = (branchIndex: number) => {
    return (dispatch: AppDispatch, getState: () => RootState): [string, string][] => {
        const branches = getState().helper.branches;

        if (branchIndex === 0) {
            const stnList = getState().param.stn_list;
            const possibleStnIdsFromMainLine = getPossibleStnIdsFromMainLine(branches, stnList);
            return cartesian(possibleStnIdsFromMainLine, possibleStnIdsFromMainLine).filter(
                val => val[0] !== val[1]
            ) as [string, string][];
        } else {
            const branch = branches[branchIndex];
            if (branch) {
                const b = branch.filter(id => !['linestart', 'lineend'].includes(id));
                return [[b[0], b.slice(-1)[0]]];
            } else {
                return [];
            }
        }
    };
};

/**
 * Calculate row span for displaying track sharing column in StationAgGrid
 * @param stationId id of station that begins to span rows
 * @param branchIndex index of branch that the grid is displaying
 */
export const getRowSpanForColine = (stationId: string, branchIndex: number) => {
    return (dispatch: AppDispatch, getState: () => RootState): [number, string | undefined] => {
        const coline = getState().param.coline;
        const branch = getState().helper.branches[branchIndex];

        for (let [clId, cl] of Object.entries(coline)) {
            if (cl.from === stationId && branch.includes(cl.to)) {
                const thisIndex = branch.indexOf(stationId);
                const thatIndex = branch.indexOf(cl.to);
                if (thatIndex > thisIndex) {
                    return [thatIndex - thisIndex + 1, clId];
                }
            } else if (cl.to === stationId && branch.includes(cl.to)) {
                const thisIndex = branch.indexOf(stationId);
                const thatIndex = branch.indexOf(cl.from);
                if (thatIndex > thisIndex) {
                    return [thatIndex - thisIndex + 1, clId];
                }
            }
        }
        return [0, undefined];
    };
};

/**
 * Verify station selections from table are consecutive, which is the prerequisite for track sharing.
 * @param selectedIds IDs of the selected stations (get by gridApi)
 * @param branchIndex
 */
export const verifyAreSelectionsConsecutive = (selectedIds: string[], branchIndex: number) => {
    return (dispatch: AppDispatch, getState: () => RootState): boolean => {
        const branch = getState().helper.branches[branchIndex];

        const from = selectedIds[0];
        const to = selectedIds.slice(-1)[0];

        const areConsecutiveSelections =
            branch.slice(branch.indexOf(from), branch.indexOf(to) + 1).toString() === selectedIds.toString();
        if (!areConsecutiveSelections) {
            console.log('verifyAreSelectionsConsecutive():: Selections are NOT consecutive');
            return false;
        } else {
            return true;
        }
    };
};

/**
 *  Checks the validity of from and to. Currently we accept coline if it:
 1. Start from either ends of the mainline or branch stations and
 terminate at either ends of the mainline or branch stations.
 2. Start from the one end of the branch line and
 terminate at the other end of the same branch line.

 * @param from station id from
 * @param to station id to
 */
export const checkColineValidity = (from: string, to: string) => {
    return (dispatch: AppDispatch, getState: () => RootState) => {
        const stnList = getState().param.stn_list;
        const branches = getState().helper.branches;

        if (from === to) {
            throw new Error('addColine():: failed for same stnId');
        }
        // calculate if coline is in the main line
        const colineInMainLine = getPossibleStnIdsFromMainLine(branches, stnList).filter(stnId =>
            [from, to].includes(stnId)
        );
        // calculate if coline is in one branch line
        const colineInBranches = getPossibleStnIdsFromBranchLine(branches, stnList).filter(terminals =>
            [from, to].every(stnId => terminals.includes(stnId))
        );
        // see if coline is in the main line
        if (colineInMainLine.length === 2 && colineInBranches.length > 0) {
            throw new Error(`addColine():: main check failed for ${from}, ${to}`);
        }
        // see if coline is in one branch line
        if (colineInMainLine.length !== 2 && colineInBranches.length !== 1) {
            throw new Error(`addColine():: branch check failed for ${from}, ${to}`);
        }
    };
};

export const findAllColinesInBranch = (branchIndex: number) => {
    return (dispatch: AppDispatch, getState: () => RootState) => {
        const coline = getState().param.coline;
        const branches = getState().helper.branches;
        const branch = branches[branchIndex];

        if (branch) {
            return Object.entries(coline).reduce<Record<string, ColineInfo>>((acc, cur) => {
                if (branch.includes(cur[1].from) && branch.includes(cur[1].to)) {
                    return { ...acc, [cur[0]]: cur[1] };
                } else {
                    return { ...acc };
                }
            }, {});
        } else {
            return {};
        }
    };
};

/**
 * Remove related coline when the deleteStn is the coline `from` or `to` station.
 */
export const removeInvalidColineOnRemoveStation = (deleteStnId: string) => {
    return (dispatch: AppDispatch, getState: () => RootState) => {
        const colineInfo = getState().param.coline;

        if (Object.keys(colineInfo).length === 0) return;

        const nextColine = Object.entries(colineInfo).reduce<Record<string, ColineInfo>>((acc, cur) => {
            if (cur[1].from !== deleteStnId && cur[1].to !== deleteStnId) {
                return { ...acc, [cur[0]]: cur[1] };
            } else {
                return { ...acc };
            }
        }, {});

        dispatch(setColineBulk(nextColine));
    };
};

export const addColine = (from: string, to: string, colors: InterchangeInfo[], display: boolean = true) => {
    return (dispatch: AppDispatch, getState: () => RootState) => {
        const colineInfo = getState().param.coline;

        dispatch(checkColineValidity(from, to));
        dispatch(
            setColineBulk({
                ...colineInfo,
                [nanoid(4)]: { from: from, to: to, colors: colors, display: display },
            })
        );
    };
};

export const updateColine = (colineId: string, from: string, to: string, display = true) => {
    return (dispatch: AppDispatch, getState: () => RootState) => {
        const colineInfo = getState().param.coline;

        if (colineId in colineInfo) {
            dispatch(checkColineValidity(from, to));

            const newColineInfo = {
                ...colineInfo,
                [colineId]: { ...colineInfo[colineId], from, to, display },
            };

            dispatch(setColineBulk(newColineInfo));
        }
    };
};

export const removeColine = (colineId: string) => {
    return (dispatch: AppDispatch, getState: () => RootState) => {
        const colineInfo = getState().param.coline;

        if (colineId in colineInfo) {
            const { [colineId]: _, ...nextColine } = colineInfo;
            dispatch(setColineBulk(nextColine));
        }
    };
};

/**
 *
 * @param colineId
 * @param interchangeInfo
 */
export const addColineColor = (colineId: string, interchangeInfo: InterchangeInfo) => {
    return (dispatch: AppDispatch, getState: () => RootState) => {
        const colineInfo = getState().param.coline;

        colineInfo[colineId].colors = [...colineInfo[colineId].colors, interchangeInfo];

        dispatch(setColineBulk(colineInfo));
    };
};

export const removeColineColor = (colineId: string, interchangeIndex: number) => {
    return (dispatch: AppDispatch, getState: () => RootState) => {
        const colineInfo = getState().param.coline;

        if (colineId in colineInfo && colineInfo[colineId].colors.length > interchangeIndex) {
            const nextColours = colineInfo[colineId].colors.filter((_, colineIdx) => colineIdx !== interchangeIndex);
            if (nextColours.length === 0) {
                // remove entire coline
                const { [colineId]: _, ...nextColine } = colineInfo;
                dispatch(setColineBulk(nextColine));
            } else {
                // update coline colour list
                const nextColine = {
                    ...colineInfo,
                    [colineId]: { ...colineInfo[colineId], colors: nextColours },
                };
                dispatch(setColineBulk(nextColine));
            }
        }
    };
};

export const updateColineColor = (colineId: string, interchangeIndex: number, interchangeInfo: InterchangeInfo) => {
    return (dispatch: AppDispatch, getState: () => RootState) => {
        const colineInfo = getState().param.coline;

        if (colineId in colineInfo && colineInfo[colineId].colors.length > interchangeIndex) {
            colineInfo[colineId].colors = colineInfo[colineId].colors.map((int, colineIdx) =>
                colineIdx === interchangeIndex
                    ? ([0, 1, 2, 3, 4, 5].map(i =>
                          interchangeInfo[i] === undefined ? int[i] : interchangeInfo[i]
                      ) as InterchangeInfo)
                    : int
            );

            dispatch(setColineBulk(colineInfo));
        }
    };
};

// DEBUG PROXY
// declare const window: any;
// window.addColine = addColine;
// window.updateColine = updateColine;
// window.removeColine = removeColine;
// window.rmgStore.dispatch(window.removeColine(2))
// let t = ['shanghai', 'sh4', '#5F259F', '#fff', '4号线', 'Line 4']
// window.rmgStore.dispatch(window.addColine('s9tt', 'l1mz', [t]))
