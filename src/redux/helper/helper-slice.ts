import { createSlice, current, PayloadAction } from '@reduxjs/toolkit';
import { StationDict } from '../../constants/constants';
import { getBranches, getRoutes, getTpo } from './graph-theory-util';

const getDependenciesString = (stationList: StationDict) =>
    Object.entries(stationList)
        .map(
            ([stationId, stationInfo]) =>
                stationId +
                stationInfo.parents.toString() +
                stationInfo.children.toString() +
                JSON.stringify(stationInfo.branch)
        )
        .join('');

interface HelperState {
    depsStr: string;
    branches: string[][];
    routes: string[][];
    tpo: string[];
}

const initialState: HelperState = { depsStr: '', branches: [], routes: [], tpo: [] };

const helperSlice = createSlice({
    name: 'helper',
    initialState,
    reducers: {
        updateHelper: (state, action: PayloadAction<StationDict>) => {
            const nextDeps = getDependenciesString(action.payload);
            if (current(state).depsStr !== nextDeps) {
                state.depsStr = nextDeps;

                console.log('Re-calculating routes...');
                state.routes = getRoutes(action.payload);

                console.log('Re-calculating branches...');
                const nextBranches = getBranches(action.payload);
                if (current(state).branches.toString() !== nextBranches.toString()) {
                    state.branches = nextBranches;

                    console.log('Re-calculating topology ordering...');
                    state.tpo = getTpo(nextBranches);
                }
            }
        },
    },
    extraReducers: builder => {
        builder.addMatcher(
            action => {
                // console.log(action.type);
                return action.type === 'param/setStations';
            },
            () => {
                // console.log('helper reducer')
            }
        );
    },
});

export const { updateHelper } = helperSlice.actions;

const helperReducer = helperSlice.reducer;
export default helperReducer;
