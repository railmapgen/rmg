import {
    SET_BRANCHES,
    SET_DEPS_STR,
    SET_ROUTES,
    SET_TPO,
    setBranchesAction,
    setDepsStrAction,
    setRoutesAction,
    setTpoAction,
} from './action';

interface HelperState {
    depsStr: string;
    branches: string[][];
    routes: string[][];
    tpo: string[];
}

const initialState: HelperState = { depsStr: '', branches: [], routes: [], tpo: [] };

export default function HelperReducer(
    state = initialState,
    action: setDepsStrAction | setBranchesAction | setRoutesAction | setTpoAction
) {
    switch (action.type) {
        case SET_DEPS_STR:
            return { ...state, depsStr: action.depsStr };
        case SET_BRANCHES:
            return { ...state, branches: action.branches };
        case SET_ROUTES:
            return { ...state, routes: action.routes };
        case SET_TPO:
            return { ...state, tpo: action.tpo };
        default:
            return state;
    }
}
