import { BranchStyle, LocalStorageKey, RmgStyle, StationDict } from './constants/constants';
import { createStore } from './redux';
import { initParam } from './redux/param/util';
import infoJson from '../info.json';
import { MockBroadcastChannel } from './mock-broadcast-channel';
import { vi } from 'vitest';

export const createTestStore = createStore;

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
    },
    stn0: {
        parents: ['linestart'],
        children: ['stn1'],
    },
    stn1: {
        parents: ['stn0'],
        children: ['stn2', 'stn3'],
        branch: { right: [BranchStyle.through, 'stn3'] },
    },
    stn2: {
        parents: ['stn1'],
        children: ['lineend'],
    },
    stn3: {
        parents: ['stn1'],
        children: ['stn4'],
    },
    stn4: {
        parents: ['stn3'],
        children: ['lineend'],
    },
    lineend: {
        parents: ['stn2', 'stn4'],
        children: [],
        branch: { left: [BranchStyle.through, 'stn4'] },
    },
} as any;

vi.stubGlobal('BroadcastChannel', MockBroadcastChannel);

const originalFetch = global.fetch;
global.fetch = (...args) => {
    if (args[0].toString().includes('/info.json')) {
        return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve(infoJson),
        }) as any;
    } else if (args[0].toString().includes('other-company-config.json')) {
        return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve([]),
        }) as any;
    } else {
        console.warn('No mocked response for', args[0]);
        return originalFetch(...args);
    }
};

export const createParamInLocalStorage = (id: string) => {
    const rmgParam = initParam(RmgStyle.MTR, 'en');
    rmgParam.line_num = id;
    window.localStorage.setItem('rmg__' + LocalStorageKey.PARAM_BY_ID + id, JSON.stringify(rmgParam));
};
