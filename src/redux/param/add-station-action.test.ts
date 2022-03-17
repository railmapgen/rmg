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
        children: ['stn1', 'stn4'],
        branch: { left: [], right: [BranchStyle.through, 'stn4'] },
    },
    stn1: {
        parents: ['linestart'],
        children: ['stn2'],
        branch: { left: [], right: [] },
    },
    stn2: {
        parents: ['stn1', 'stn4'],
        children: ['stn3'],
        branch: { left: [BranchStyle.through, 'stn4'], right: [] },
    },
    stn3: {
        parents: ['stn2'],
        children: ['lineend'],
        branch: { left: [], right: [] },
    },
    stn4: {
        parents: ['linestart'],
        children: ['stn2'],
        branch: { left: [], right: [] },
    },
    lineend: {
        parents: ['stn3'],
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
    it('Can', () => {
        /**
         *      v
         * stn1 - stn2 - stn3
         *        /
         *   stn4
         */
        mockStore.dispatch(addStation('0', 'stn1', 'stn2'));

        const actions = mockStore.getActions();
        expect(actions).toContainEqual(expect.objectContaining({ type: SET_STATIONS_BULK }));

        const newStationList = actions.find(action => action.type === SET_STATIONS_BULK).stations;
        expect(newStationList.stn1.children).toEqual(['testId']);
        expect(newStationList.stn2.parents).toEqual(['testId', 'stn4']);
        expect(newStationList.testId.parents).toEqual(['stn1']);
        expect(newStationList.testId.children).toEqual(['stn2']);
    });
});
