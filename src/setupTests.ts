import createMockStore from 'redux-mock-store';
import { BranchStyle, LocalStorageKey, RmgStyle, StationDict } from './constants/constants';
import rootReducer, { RootState } from './redux';
import { getDefaultMiddleware, ThunkDispatch } from '@reduxjs/toolkit';
import { initParam } from './redux/param/util';
import { LanguageCode } from '@railmapgen/rmg-translate';
import infoJson from '../info.json';

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

class BroadcastChannel {
    postMessage() {}

    onmessage() {}
}

global.BroadcastChannel = BroadcastChannel as any;

const originalFetch = global.fetch;
global.fetch = (...args) => {
    if (args[0].toString().includes('/info.json')) {
        return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve(infoJson),
        }) as any;
    } else {
        return originalFetch(...args);
    }
};

export const createParamInLocalStorage = (id: string) => {
    const rmgParam = initParam(RmgStyle.MTR, LanguageCode.English);
    rmgParam.line_num = id;
    window.localStorage.setItem(LocalStorageKey.PARAM_BY_ID + id, JSON.stringify(rmgParam));
};
