import { BranchStyle, StationDict } from '../../constants/constants';
import { createMockStoreWithMockStations } from '../../setupTests';
import { getBranchType } from './connect-disconnect-branch';
import rootReducer from '../index';
import { getBranches } from '../helper/graph-theory-util';
import { createMockAppStore } from '../../setupTests';

/**
 *                      stn6
 *                    /
 * stn1 - stn2 - stn4 - stn5
 *       \     /
 *        stn3
 */
const mockStationList = {
    linestart: {
        parents: [],
        children: ['stn1'],
        branch: { left: [], right: [] },
    },
    stn1: {
        parents: ['linestart'],
        children: ['stn2', 'stn3'],
        branch: { left: [], right: [BranchStyle.through, 'stn3'] },
    },
    stn2: {
        parents: ['stn1'],
        children: ['stn4'],
        branch: { left: [], right: [] },
    },
    stn3: {
        parents: ['stn1'],
        children: ['stn4'],
        branch: { left: [], right: [] },
    },
    stn4: {
        parents: ['stn2', 'stn3'],
        children: ['stn6', 'stn5'],
        branch: { left: [BranchStyle.through, 'stn3'], right: [BranchStyle.through, 'stn6'] },
    },
    stn5: {
        parents: ['stn4'],
        children: ['lineend'],
        branch: { left: [], right: [] },
    },
    stn6: {
        parents: ['stn4'],
        children: ['lineend'],
        branch: { left: [], right: [] },
    },
    lineend: {
        parents: ['stn6', 'stn5'],
        children: [],
        branch: { left: [BranchStyle.through, 'stn6'], right: [] },
    },
} as any as StationDict;

const branches = getBranches(mockStationList);

const realStore = rootReducer.getState();
const mockStore = createMockAppStore({
    ...realStore,
    param: {
        ...realStore.param,
        stn_list: mockStationList,
    },
    helper: {
        ...realStore.helper,
        branches,
    },
});

describe('ConnectDisconnectBranch', () => {
    describe('ConnectDisconnectBranch - get branch type', () => {
        it('Can determine branch type 1 as expected', () => {
            const result = mockStore.dispatch(getBranchType(2));
            expect(result).toBe(1);
        });

        it('Can determine branch type 2 as expected', () => {
            const result = mockStore.dispatch(getBranchType(1));
            expect(result).toBe(2);
        });
    });
});
