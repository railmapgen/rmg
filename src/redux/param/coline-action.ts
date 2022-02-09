import { AppDispatch, RootState } from '../index';
import { InterchangeInfo } from '../../constants/constants';
import { setColineBulk } from './action';
import { setSelectedColine } from '../app/action';

export const getPossibleStnIdsFromMainLine = (branches: string[][]) => [
    branches[0][1], // skip linestart
    branches[0][branches[0].length - 2], // skip lineend
    ...branches[0].filter(stnId =>
        // for every station in the main line, find if it branches out at this station
        branches
            .slice(1)
            // branches after the first/main line may not have linestart or lineend
            .map(branch => branch.filter(stnId => !['linestart', 'lineend'].includes(stnId)))
            // only stations at both ends need to be taken into consideration
            .map(branch => [branch[0], branch[branch.length - 1]])
            .flat()
            .includes(stnId)
    ),
];

export const getPossibleStnIdsFromBranchLine = (branches: string[][]) =>
    branches
        .slice(1)
        .map(branch => branch.filter(stnId => !['linestart', 'lineend'].includes(stnId)))
        .map(branch => [branch[0], branch[branch.length - 1]]);

/**
 *  Checks on vaild from and to. Currently we accept coline if it:
    1. Start from either ends of the mainline or branch stations and
       terminate at either ends of the mainline or branch stations.
    2. Start from the one end of the branch line and
       terminate at the other end of the same branch line.

 * @param branches branches from helper
 * @param from station id from
 * @param to station id to
 */
export const checkColineValidity = (branches: string[][], from: string, to: string) => {
    if (from === to) {
        throw new Error('addColine():: failed for same stnId');
    }
    // calculate if coline is in the main line
    const colineInMainLine = getPossibleStnIdsFromMainLine(branches).filter(stnId => [from, to].includes(stnId));
    // calculate if coline is in one branch line
    const colineInBranches = getPossibleStnIdsFromBranchLine(branches).filter(terminals =>
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

export const addColine = (from: string, to: string, colors: InterchangeInfo[], display: boolean = true) => {
    return (dispatch: AppDispatch, getState: () => RootState) => {
        const colineInfo = getState().param.coline;
        const branches = getState().helper.branches;
        checkColineValidity(branches, from, to);

        dispatch(setColineBulk([...colineInfo, { from: from, to: to, colors: colors, display: display }]));
    };
};

export const updateColine = (colineIndex: number, from: string, to: string) => {
    return (dispatch: AppDispatch, getState: () => RootState) => {
        const colineInfo = getState().param.coline;

        if (colineInfo.length > colineIndex) {
            const branches = getState().helper.branches;
            checkColineValidity(branches, from, to);

            const newColineInfo = colineInfo.map((set, setIdx) =>
                setIdx === colineIndex ? { from: from, to: to, colors: set.colors, display: set.display } : set
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

            // reset to 0 to make index is always valid
            dispatch(setSelectedColine(0));
        }
    };
};

// FIXME: remove this debug proxy
declare const window: any;
window.addColine = addColine;
window.removeColine = removeColine;
// window.rmgStore.dispatch(window.removeColine(2))
// let t = ['shanghai', 'sh4', '#5F259F', '#fff', '4号线', 'Line 4']
// window.rmgStore.dispatch(window.addColine('s9tt', 'l1mz', [t]))
