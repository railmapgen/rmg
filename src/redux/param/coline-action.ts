import { AppDispatch, RootState } from '../index';
import { ColineInfo, InterchangeInfo, SidePanelMode, StationDict } from '../../constants/constants';
import { setColineBulk } from './action';
import { setSelectedColine, setSidePanelMode } from '../app/action';

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

/**
 * Calculate row span for displaying track sharing column in StationAgGrid
 * @param stationId id of station that begins to span rows
 * @param branchIndex index of branch that the grid is displaying
 */
export const getRowSpanForColine = (stationId: string, branchIndex: number) => {
    return (dispatch: AppDispatch, getState: () => RootState): [number, ColineInfo | undefined] => {
        const coline = getState().param.coline;
        const branch = getState().helper.branches[branchIndex];

        for (let cl of coline) {
            if (cl.from === stationId && branch.includes(cl.to)) {
                const thisIndex = branch.indexOf(stationId);
                const thatIndex = branch.indexOf(cl.to);
                if (thatIndex > thisIndex) {
                    return [thatIndex - thisIndex + 1, cl];
                }
            } else if (cl.to === stationId && branch.includes(cl.to)) {
                const thisIndex = branch.indexOf(stationId);
                const thatIndex = branch.indexOf(cl.from);
                if (thatIndex > thisIndex) {
                    return [thatIndex - thisIndex + 1, cl];
                }
            }
        }
        return [0, undefined];
    };
};

/**
 *  Checks the validity of from and to. Currently we accept coline if it:
 1. Start from either ends of the mainline or branch stations and
 terminate at either ends of the mainline or branch stations.
 2. Start from the one end of the branch line and
 terminate at the other end of the same branch line.

 * @param branches branches from helper
 * @param from station id from
 * @param to station id to
 */
export const checkColineValidity = (branches: string[][], from: string, to: string, stnList: StationDict) => {
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
        throw new Error('addColine():: failed');
    }
    // see if coline is in one branch line
    if (colineInMainLine.length !== 2 && colineInBranches.length !== 1) {
        throw new Error('addColine():: failed');
    }
};

/**
 * Remove related coline when the deleteStn is the coline `from` or `to` station.
 */
export const removeInvalidColineOnRemoveStation = (deleteStnId: string) => {
    return (dispatch: AppDispatch, getState: () => RootState) => {
        const colineInfo = getState().param.coline;

        if (colineInfo.length === 0) return;

        dispatch(setColineBulk(colineInfo.filter(co => co.from !== deleteStnId && co.to !== deleteStnId)));
    };
};

export const addColine = (from: string, to: string, colors: InterchangeInfo[], display: boolean = true) => {
    return (dispatch: AppDispatch, getState: () => RootState) => {
        const colineInfo = getState().param.coline;
        const branches = getState().helper.branches;
        const stnList = getState().param.stn_list;

        checkColineValidity(branches, from, to, stnList);

        dispatch(setColineBulk([...colineInfo, { from: from, to: to, colors: colors, display: display }]));
    };
};

export const updateColine = (colineIndex: number, from: string, to: string, display = true) => {
    return (dispatch: AppDispatch, getState: () => RootState) => {
        const colineInfo = getState().param.coline;
        const stnList = getState().param.stn_list;

        if (colineInfo.length > colineIndex) {
            const branches = getState().helper.branches;
            checkColineValidity(branches, from, to, stnList);

            const newColineInfo = colineInfo.map((set, setIdx) =>
                setIdx === colineIndex ? { from: from, to: to, colors: set.colors, display: display } : set
            );
            dispatch(setColineBulk(newColineInfo));
        }
    };
};

export const removeColine = (colineIndex: number) => {
    return (dispatch: AppDispatch, getState: () => RootState) => {
        const colineInfo = getState().param.coline;

        if (colineInfo.length > colineIndex) {
            dispatch(setColineBulk(colineInfo.filter((_, idx) => colineIndex !== idx)));

            if (getState().app.selectedColine === colineIndex) {
                if (colineInfo.length === 0) {
                    dispatch(setSidePanelMode(SidePanelMode.CLOSE));
                } else {
                    dispatch(setSelectedColine(0));
                }
            }
        }
    };
};

/**
 *
 * @param colineIndex
 * @param interchangeInfo
 */
export const addColineColor = (colineIndex: number, interchangeInfo: InterchangeInfo) => {
    return (dispatch: AppDispatch, getState: () => RootState) => {
        const colineInfo = getState().param.coline;

        colineInfo[colineIndex].colors = [...colineInfo[colineIndex].colors, interchangeInfo];

        dispatch(setColineBulk(colineInfo));
    };
};

export const removeColineColor = (colineIndex: number, interchangeIndex: number) => {
    return (dispatch: AppDispatch, getState: () => RootState) => {
        const colineInfo = getState().param.coline;

        if (colineInfo.length > colineIndex && colineInfo[colineIndex].colors.length > interchangeIndex) {
            colineInfo[colineIndex].colors = colineInfo[colineIndex].colors.filter(
                (_, colineIdx) => colineIdx !== interchangeIndex
            );

            dispatch(setColineBulk(colineInfo));
        }
    };
};

export const updateColineColor = (colineIndex: number, interchangeIndex: number, interchangeInfo: InterchangeInfo) => {
    return (dispatch: AppDispatch, getState: () => RootState) => {
        const colineInfo = getState().param.coline;

        if (colineInfo.length > colineIndex && colineInfo[colineIndex].colors.length > interchangeIndex) {
            colineInfo[colineIndex].colors = colineInfo[colineIndex].colors.map((int, colineIdx) =>
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
