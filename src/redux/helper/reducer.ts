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
            state.depsStr = action.depsStr;
            break;
        case SET_BRANCHES:
            state.branches = action.branches;
            break;
        case SET_ROUTES:
            state.routes = action.routes;
            break;
        case SET_TPO:
            state.tpo = action.tpo;
            break;
        default:
            break;
    }

    return { ...state };
}
