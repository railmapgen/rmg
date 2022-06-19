import createMockStore from 'redux-mock-store';
import { BranchStyle, StationDict } from './constants/constants';
import rootReducer, { RootState } from './redux';
import { getDefaultMiddleware, ThunkDispatch } from '@reduxjs/toolkit';

// FIXME: any -> AnyAction?
type DispatchExts = ThunkDispatch<RootState, void, any>;
export const createMockAppStore = createMockStore<RootState, DispatchExts>(getDefaultMiddleware());

const realStore = rootReducer.getState();
export const createMockStoreWithMockStations = (stationList: StationDict) =>
    createMockAppStore({
        ...realStore,
        param: { ...realStore.param, stn_list: stationList },
    });

/**
 * Before reversing:
 * stn0 - stn1 - stn2 (main)
 *             \
 *              stn3 - stn4 (branch)
 *
 * After reversing:
 * (branch) stn4 - stn3
 *                      \
 *          (main) stn2 - stn1 - stn0
 */
export const mockSimpleStationList: StationDict = {
    linestart: {
        parents: [],
        children: ['stn0'],
        branch: { left: [], right: [] },
    },
    stn0: {
        parents: ['linestart'],
        children: ['stn1'],
        branch: { left: [], right: [] },
    },
    stn1: {
        parents: ['stn0'],
        children: ['stn2', 'stn3'],
        branch: { left: [], right: [BranchStyle.through, 'stn3'] },
    },
    stn2: {
        parents: ['stn1'],
        children: ['lineend'],
        branch: { left: [], right: [] },
    },
    stn3: {
        parents: ['stn1'],
        children: ['stn4'],
        branch: { left: [], right: [] },
    },
    stn4: {
        parents: ['stn3'],
        children: ['lineend'],
        branch: { left: [], right: [] },
    },
    lineend: {
        parents: ['stn2', 'stn4'],
        children: [],
        branch: { left: [BranchStyle.through, 'stn4'], right: [] },
    },
} as any;
