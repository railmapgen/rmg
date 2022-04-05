import { addStation, getNewBranchAllowedEnds, verifyNewBranchEnds } from './add-station-action';
import { BranchStyle, StationDict } from '../../constants/constants';
import { getBranches } from '../helper/graph-theory-util';
import { createMockAppStore } from '../../setupTests';
import rootReducer from '../index';
import { SET_STATIONS_BULK } from './action';

jest.mock('nanoid', () => ({
    nanoid: () => 'testId',
}));

const mockStationList = {
    linestart: {
        parents: [],
        children: ['stn0'],
        branch: { left: [], right: [] },
    },
    stn0: {
        parents: ['linestart'],
        children: ['stn1', 'stn5'],
        branch: { left: [], right: [BranchStyle.through, 'stn5'] },
    },
    stn1: {
        parents: ['stn0'],
        children: ['stn2'],
        branch: { left: [], right: [] },
    },
    stn2: {
        parents: ['stn1', 'stn5'],
        children: ['stn3'],
        branch: { left: [BranchStyle.through, 'stn5'], right: [] },
    },
    stn3: {
        parents: ['stn2'],
        children: ['stn4'],
        branch: { left: [], right: [] },
    },
    stn4: {
        parents: ['stn3'],
        children: ['lineend'],
        branch: { left: [], right: [] },
    },
    stn5: {
        parents: ['stn0'],
        children: ['stn2'],
        branch: { left: [], right: [] },
    },
    lineend: {
        parents: ['stn4'],
        children: [],
        branch: { left: [], right: [] },
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

describe('Unit tests for addStation action', () => {
    afterEach(() => {
        mockStore.clearActions();
    });

    it('Can add station in main line as expected', () => {
        /**
         *             v
         * stn0 - stn1 - stn2 - stn3 - stn4
         *      \      /
         *        stn5
         */
        const result = mockStore.dispatch(addStation('0', 'stn1', 'stn2'));
        expect(result).toBeTruthy();

        const actions = mockStore.getActions();
        expect(actions).toContainEqual(expect.objectContaining({ type: SET_STATIONS_BULK }));

        const newStationList = actions.find(action => action.type === SET_STATIONS_BULK).stations;
        expect(newStationList.stn1.children).toEqual(['testId']);
        expect(newStationList.stn2.parents).toEqual(['testId', 'stn5']);
        expect(newStationList.stn2.branch.left[1]).toEqual('stn5');
        expect(newStationList.testId.parents).toEqual(['stn1']);
        expect(newStationList.testId.children).toEqual(['stn2']);
    });

    it('Can add station before branch ends as expected', () => {
        /**
         * stn0 - stn1 - stn2 - stn3 - stn4
         *      \      / <
         *        stn5
         */
        const result = mockStore.dispatch(addStation('1', 'stn5', 'stn2'));
        expect(result).toBeTruthy();

        const actions = mockStore.getActions();
        expect(actions).toContainEqual(expect.objectContaining({ type: SET_STATIONS_BULK }));

        const newStationList = actions.find(action => action.type === SET_STATIONS_BULK).stations;
        expect(newStationList.stn5.children).toEqual(['testId']);
        expect(newStationList.stn2.parents).toEqual(['stn1', 'testId']);
        expect(newStationList.stn2.branch.left[1]).toEqual('testId');
        expect(newStationList.testId.parents).toEqual(['stn5']);
        expect(newStationList.testId.children).toEqual(['stn2']);
    });

    it('Can add station after branch starts as expected', () => {
        /**
         * stn0 - stn1 - stn2 - stn3 - stn4
         *    > \      /
         *        stn5
         */
        const result = mockStore.dispatch(addStation('1', 'stn0', 'stn5'));
        expect(result).toBeTruthy();

        const actions = mockStore.getActions();
        expect(actions).toContainEqual(expect.objectContaining({ type: SET_STATIONS_BULK }));

        const newStationList = actions.find(action => action.type === SET_STATIONS_BULK).stations;
        expect(newStationList.stn0.children).toEqual(['stn1', 'testId']);
        expect(newStationList.stn0.branch.right[1]).toEqual('testId');
        expect(newStationList.stn5.parents).toEqual(['testId']);
        expect(newStationList.testId.parents).toEqual(['stn0']);
        expect(newStationList.testId.children).toEqual(['stn5']);
    });

    it('Can add station in new branch as expected', () => {
        /**
         *                        v
         *                    (testId)
         *                  /
         * stn0 - stn1 - stn2 - stn3 - stn4
         *      \      /
         *        stn5
         */
        const result = mockStore.dispatch(addStation('new', 'stn2', 'lineend', 'upper'));
        expect(result).toBeTruthy();

        const actions = mockStore.getActions();
        expect(actions).toContainEqual(expect.objectContaining({ type: SET_STATIONS_BULK }));

        const newStationList = actions.find(action => action.type === SET_STATIONS_BULK).stations;
        expect(newStationList.stn2.children).toEqual(['testId', 'stn3']);
        expect(newStationList.stn2.branch.right[1]).toEqual('testId');
        expect(newStationList.lineend.parents).toEqual(['testId', 'stn4']);
        expect(newStationList.lineend.branch.left[1]).toEqual('testId');
        expect(newStationList.testId.parents).toEqual(['stn2']);
        expect(newStationList.testId.children).toEqual(['lineend']);
    });

    it('Can find allowed ends for new branch as expected', () => {
        /**
         * stn0 - stn1 - stn2 - stn3 - stn4
         *      \      /
         *        stn5
         */
        const allowEnds = mockStore.dispatch(getNewBranchAllowedEnds());
        expect(allowEnds).toEqual(['linestart', 'stn0', 'stn2', 'stn3', 'stn4', 'lineend']);
    });

    it('Can reject incorrect ordering for new branch', () => {
        const result = mockStore.dispatch(verifyNewBranchEnds('stn4', 'stn2'));
        expect(result).toContain('ordering');
    });

    it('Can reject open jaw from last station', () => {
        const result = mockStore.dispatch(verifyNewBranchEnds('stn4', 'lineend'));
        expect(result).toContain('open jaw');
    });
});
