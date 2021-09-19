import { AppDispatch, RootState } from '../index';
import { getBranches, getRoutes } from '../../methods';

export const SET_DEPS_STR = 'SET_DEPS_STR';
export const SET_BRANCHES = 'SET_BRANCHES';
export const SET_ROUTES = 'SET_ROUTES';
export const SET_TPO = 'SET_TPO';

export type setDepsStrAction = {
    type: typeof SET_DEPS_STR;
    depsStr: string;
};
export type setBranchesAction = {
    type: typeof SET_BRANCHES;
    branches: string[][];
};
export type setRoutesAction = {
    type: typeof SET_ROUTES;
    routes: string[][];
};
export type setTpoAction = {
    type: typeof SET_TPO;
    tpo: string[];
};

const setDepsStr = (depsStr: string): setDepsStrAction => {
    return { type: SET_DEPS_STR, depsStr };
};

const setBranches = (branches: string[][]): setBranchesAction => {
    return { type: SET_BRANCHES, branches };
};

const setRoutes = (routes: string[][]): setRoutesAction => {
    return { type: SET_ROUTES, routes };
};

const setTpo = (tpo: string[]): setTpoAction => {
    return { type: SET_TPO, tpo };
};

const calcAndGetDepsStr = () => {
    return (dispatch: AppDispatch, getState: () => RootState) => {
        const stnList = getState().param.stn_list;
        const nextDepsStr = Object.entries(stnList)
            .map(
                ([stationId, stationInfo]) =>
                    stationId +
                    stationInfo.parents.toString() +
                    stationInfo.children.toString() +
                    JSON.stringify(stationInfo.branch)
            )
            .join('');
        dispatch(setDepsStr(nextDepsStr));
        return nextDepsStr;
    };
};

const calcBranches = () => {
    return (dispatch: AppDispatch, getState: () => RootState) => {
        console.log('Re-calculating branches...');
        const stnList = getState().param.stn_list;
        const nextBranches = getBranches(stnList);
        dispatch(setBranches(nextBranches));
        return nextBranches;
    };
};

const calcRoutes = () => {
    return (dispatch: AppDispatch, getState: () => RootState) => {
        console.log('Re-calculating routes...');
        const stnList = getState().param.stn_list;
        dispatch(setRoutes(getRoutes(stnList)));
    };
};

/**
 * Calculate topology ordering for all stations by stacking all branches into an 1-dimension array
 */
export const calcTpo = () => {
    return (dispatch: AppDispatch, getState: () => RootState) => {
        console.log('Re-calculating topology ordering...');
        const branches = getState().helper.branches;
        if (branches.length === 1) {
            dispatch(setTpo(branches[0].slice(1, -1)));
        } else {
            const tpo = branches
                .reduce(
                    (acc, cur) => {
                        // insert the other branch before the rest of the main branch
                        let idx = acc.indexOf(cur[cur.length - 1]);
                        return [...acc.slice(0, idx), ...cur.slice(1), ...acc.slice(idx + 1)];
                    },
                    ['lineend']
                )
                .slice(0, -1);
            dispatch(setTpo(tpo));
        }
    };
};

export const triggerHelpersUpdate = () => {
    return (dispatch: AppDispatch, getState: () => RootState) => {
        const prevDepsStr = getState().helper.depsStr;
        const nextDepsStr = dispatch(calcAndGetDepsStr());
        if (prevDepsStr !== nextDepsStr) {
            dispatch(calcRoutes());

            const prevBranches = getState().helper.branches;
            const nextBranches = dispatch(calcBranches());
            if (prevBranches.toString() !== nextBranches.toString()) {
                dispatch(calcTpo());
            }
        }
    };
};
