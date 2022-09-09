import { BranchStyle, Direction, StationDict } from '../../constants/constants';
import {
    connect2MainLine,
    disconnectFromMainLine,
    getBranchType,
    getPossibleDirection,
    isStationValid2ConnectBranch,
} from './connect-disconnect-branch';
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
    afterEach(() => {
        mockStore.clearActions();
    });

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

    describe('ConnectDisconnectBranch - isStationValid2ConnectBranch', () => {
        it('Can determine type2 branch is not able to connect as expected', () => {
            const result = mockStore.dispatch(isStationValid2ConnectBranch('stn5', 1));
            expect(result).toBeFalsy();
        });

        it('Can reject invalid target station', () => {
            ['linestart', 'stn1', 'stn2', 'stn3', 'stn4', 'stn6', 'lineend'].forEach(stationId => {
                const result = mockStore.dispatch(isStationValid2ConnectBranch(stationId, 2));
                expect(result).toBeFalsy();
            });
        });

        it('Fail to reject invalid target station', () => {
            const result = mockStore.dispatch(isStationValid2ConnectBranch('stn5', 2));
            expect(result).toBeTruthy();
        });
    });

    describe('ConnectDisconnectBranch - connect to main line', () => {
        it('Can update station info as expected', () => {
            mockStore.dispatch(connect2MainLine('stn5', 2));
            const actions = mockStore.getActions();

            expect(actions).toContainEqual(expect.objectContaining({ type: 'SET_STATIONS_BULK' }));
            const newStationList = actions.find(action => action.type === 'SET_STATIONS_BULK').stations;
            expect(newStationList.stn5.parents).toStrictEqual(['stn6', 'stn4']);
            expect(newStationList.stn6.children).toStrictEqual(['stn5']);
            expect(newStationList.lineend.parents).toStrictEqual(['stn5']);

            const newBranches = getBranches(newStationList);
            expect(newBranches[2]).toStrictEqual(['stn4', 'stn6', 'stn5']);
        });
    });

    describe('ConnectDisconnectBranch - get possible direction', () => {
        it('Can get empty direction list when the branch type is not 2 as expected', () => {
            const result = mockStore.dispatch(getPossibleDirection(2));
            expect(result).toStrictEqual([]);
        });

        it('Can get direction list as expected', () => {
            const result = mockStore.dispatch(getPossibleDirection(1));
            expect(result).toStrictEqual([Direction.left]);
        });
    });

    describe('ConnectDisconnectBranch - disconnect to main line', () => {
        it('Can disconnect the left direction', () => {
            mockStore.dispatch(disconnectFromMainLine(Direction.left, 1));
            const actions = mockStore.getActions();

            expect(actions).toContainEqual(expect.objectContaining({ type: 'SET_STATIONS_BULK' }));
            const newStationList = actions.find(action => action.type === 'SET_STATIONS_BULK').stations;
            expect(newStationList.stn1.children).toStrictEqual(['stn2']);
            expect(newStationList.stn3.parents).toStrictEqual(['linestart']);
            expect(newStationList.linestart.children).toStrictEqual(['stn1', 'stn3']);

            const newBranches = getBranches(newStationList);
            expect(newBranches[1]).toStrictEqual(['linestart', 'stn3', 'stn4']);
        });
    });
});
