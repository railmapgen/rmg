import { addStation } from './add-station-action';
import { BranchStyle, StationDict } from '../../constants/constants';
import { getBranches } from '../helper/graph-theory-util';
import { createMockAppStore } from '../../setupTests';
import rootReducer from '../index';
import { SET_STATIONS_BULK } from './action';

jest.mock('./station-list-util', () => ({
    getRandomId: () => 'testId',
}));

const mockStationList = {
    linestart: {
        parents: [],
        children: ['stn1', 'stn5'],
        branch: { left: [], right: [BranchStyle.through, 'stn5'] },
    },
    stn1: {
        parents: ['linestart'],
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
        parents: ['linestart'],
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
         *      v
         * stn1 - stn2 - stn3
         *        /
         *   stn5
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

    it('Can add station in branch as expected', () => {
        /**
         * stn1 - stn2 - stn3
         *        / <
         *   stn5
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

    it('Can add station in new branch as expected', () => {
        /**
         *               v
         *            (testId)
         *          /
         * stn1 - stn2 - stn3 - stn4
         *        /
         *   stn5
         */
        const result = mockStore.dispatch(addStation('new', 'stn2', 'lineend', 'up'));
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
});
