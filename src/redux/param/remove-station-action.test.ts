import { checkStationCouldBeRemoved, removeStation } from './remove-station-action';
import { createMockAppStore, createMockStoreWithMockStations } from '../../setupTests';
import { BranchStyle, StationDict } from '../../constants/constants';
import { SET_STATIONS_BULK } from './action';
import rootReducer from '../index';

describe('Unit tests for removeStation action', () => {
    it('Can reject if the station to be deleted is current station', () => {
        /**
         *         o
         * stn1 - stn2 - stn3
         *         ^
         */
        const mockStationList = {
            linestart: {
                parents: [],
                children: ['stn1'],
                branch: { left: [], right: [] },
            },
            stn1: {
                parents: ['linestart'],
                children: ['stn2'],
                branch: { left: [], right: [] },
            },
            stn2: {
                parents: ['stn1'],
                children: ['stn3'],
                branch: { left: [], right: [] },
            },
            stn3: {
                parents: ['stn2'],
                children: ['lineend'],
                branch: { left: [], right: [] },
            },
            lineend: {
                parents: ['stn2'],
                children: [],
                branch: { left: [], right: [] },
            },
        } as any as StationDict;

        const realStore = rootReducer.getState();
        const mockStore = createMockAppStore({
            ...realStore,
            param: {
                ...realStore.param,
                stn_list: mockStationList,
                current_stn_idx: 'stn2',
            },
        });

        const result = mockStore.dispatch(checkStationCouldBeRemoved('stn2'));
        expect(result).toBeFalsy();
        expect(mockStore.getActions()).toHaveLength(0);
    });

    it('Can reject if there are only 2 stations remaining', () => {
        /**
         * stn1 - stn2
         *  ^
         */
        const mockStationList = {
            linestart: {
                parents: [],
                children: ['stn1'],
                branch: { left: [], right: [] },
            },
            stn1: {
                parents: ['linestart'],
                children: ['stn2'],
                branch: { left: [], right: [] },
            },
            stn2: {
                parents: ['stn1'],
                children: ['lineend'],
                branch: { left: [], right: [] },
            },
            lineend: {
                parents: ['stn2'],
                children: [],
                branch: { left: [], right: [] },
            },
        } as any as StationDict;
        const mockStore = createMockStoreWithMockStations(mockStationList);

        const result = mockStore.dispatch(checkStationCouldBeRemoved('stn1'));
        expect(result).toBeFalsy();
        expect(mockStore.getActions()).toHaveLength(0);
    });

    it('Can reject if station has 2 parents and 2 children', () => {
        /**
         * stn1 - stn3 - stn4
         *      /  ^    \
         * stn2          stn5
         */
        const mockStationList = {
            linestart: {
                parents: [],
                children: ['stn1', 'stn2'],
                branch: { left: [], right: [BranchStyle.through, 'stn2'] },
            },
            stn1: {
                parents: ['linestart'],
                children: ['stn3'],
                branch: { left: [], right: [] },
            },
            stn2: {
                parents: ['linestart'],
                children: ['stn3'],
                branch: { left: [], right: [] },
            },
            stn3: {
                parents: ['stn1', 'stn2'],
                children: ['stn4', 'stn5'],
                branch: { left: [BranchStyle.through, 'stn2'], right: [BranchStyle.through, 'stn5'] },
            },
            stn4: {
                parents: ['stn3'],
                children: ['lineend'],
                branch: { left: [], right: [] },
            },
            stn5: {
                parents: ['stn3'],
                children: ['lineend'],
                branch: { left: [], right: [] },
            },
            lineend: {
                parents: ['stn4', 'stn5'],
                children: [],
                branch: { left: [BranchStyle.through, 'stn5'], right: [] },
            },
        } as any as StationDict;
        const mockStore = createMockStoreWithMockStations(mockStationList);

        const result = mockStore.dispatch(checkStationCouldBeRemoved('stn3'));
        expect(result).toBeFalsy();
        expect(mockStore.getActions()).toHaveLength(0);
    });

    it('Can reject if station is the only one without siblings', () => {
        /**
         * stn1 - stn2
         *  ^    \
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
                children: ['lineend'],
                branch: { left: [], right: [] },
            },
            stn3: {
                parents: ['stn1'],
                children: ['lineend'],
                branch: { left: [], right: [] },
            },
            lineend: {
                parents: ['stn2', 'stn3'],
                children: [],
                branch: { left: [BranchStyle.through, 'stn3'], right: [] },
            },
        } as any as StationDict;
        const mockStore = createMockStoreWithMockStations(mockStationList);

        const result = mockStore.dispatch(checkStationCouldBeRemoved('stn1'));
        expect(result).toBeFalsy();
        expect(mockStore.getActions()).toHaveLength(0);
    });

    it('Can remove station with 1 parent and 2 children as expected', () => {
        /**
         * stn1 - stn2 - stn3
         *         ^    \
         *               stn4
         */
        const mockStationList = {
            linestart: {
                parents: [],
                children: ['stn1'],
                branch: { left: [], right: [] },
            },
            stn1: {
                parents: ['linestart'],
                children: ['stn2'],
                branch: { left: [], right: [] },
            },
            stn2: {
                parents: ['stn1'],
                children: ['stn3', 'stn4'],
                branch: { left: [], right: [BranchStyle.through, 'stn4'] },
            },
            stn3: {
                parents: ['stn2'],
                children: ['lineend'],
                branch: { left: [], right: [] },
            },
            stn4: {
                parents: ['stn2'],
                children: ['lineend'],
                branch: { left: [], right: [] },
            },
            lineend: {
                parents: ['stn2', 'stn3'],
                children: [],
                branch: { left: [BranchStyle.through, 'stn4'], right: [] },
            },
        } as any as StationDict;
        const mockStore = createMockStoreWithMockStations(mockStationList);

        const validity = mockStore.dispatch(checkStationCouldBeRemoved('stn2'));
        expect(validity).toBeTruthy();

        mockStore.dispatch(removeStation('stn2'));

        const actions = mockStore.getActions();
        expect(actions).toContainEqual(expect.objectContaining({ type: SET_STATIONS_BULK }));

        const newStationList = actions.find(action => action.type === SET_STATIONS_BULK).stations;
        expect(newStationList.stn1.children).toEqual(['stn3', 'stn4']);
        expect(newStationList.stn1.branch.right).toEqual([BranchStyle.through, 'stn4']);
        expect(newStationList.stn3.parents).toEqual(['stn1']);
        expect(newStationList.stn4.parents).toEqual(['stn1']);
    });

    it('Can remove station with 2 parents and 1 child as expected', () => {
        /**
         * stn1 - stn3 - stn4
         *      /  ^
         * stn2
         */
        const mockStationList = {
            linestart: {
                parents: [],
                children: ['stn1', 'stn2'],
                branch: { left: [], right: [BranchStyle.through, 'stn2'] },
            },
            stn1: {
                parents: ['linestart'],
                children: ['stn3'],
                branch: { left: [], right: [] },
            },
            stn2: {
                parents: ['linestart'],
                children: ['stn3'],
                branch: { left: [], right: [] },
            },
            stn3: {
                parents: ['stn1', 'stn2'],
                children: ['stn4'],
                branch: { left: [BranchStyle.through, 'stn2'], right: [] },
            },
            stn4: {
                parents: ['stn3'],
                children: ['lineend'],
                branch: { left: [], right: [] },
            },
            lineend: {
                parents: ['stn3'],
                children: [],
                branch: { left: [], right: [] },
            },
        } as any as StationDict;
        const mockStore = createMockStoreWithMockStations(mockStationList);

        const validity = mockStore.dispatch(checkStationCouldBeRemoved('stn3'));
        expect(validity).toBeTruthy();

        mockStore.dispatch(removeStation('stn3'));

        const actions = mockStore.getActions();
        expect(actions).toContainEqual(expect.objectContaining({ type: SET_STATIONS_BULK }));

        const newStationList = actions.find(action => action.type === SET_STATIONS_BULK).stations;
        expect(newStationList.stn1.children).toEqual(['stn4']);
        expect(newStationList.stn2.children).toEqual(['stn4']);
        expect(newStationList.stn4.parents).toEqual(['stn1', 'stn2']);
        expect(newStationList.stn4.branch.left).toEqual([BranchStyle.through, 'stn2']);
    });

    it('Can remove entire branch if station is the last station on branch as expected', () => {
        /**
         * stn1 -     stn2    - stn3
         *       \      ^      /
         *        stn4 - stn5
         */
        const mockStationList = {
            linestart: {
                parents: [],
                children: ['stn1'],
                branch: { left: [], right: [] },
            },
            stn1: {
                parents: ['linestart'],
                children: ['stn2', 'stn4'],
                branch: { left: [], right: [BranchStyle.through, 'stn4'] },
            },
            stn2: {
                parents: ['stn1'],
                children: ['stn3'],
                branch: { left: [], right: [] },
            },
            stn3: {
                parents: ['stn2', 'stn5'],
                children: ['lineend'],
                branch: { left: [BranchStyle.through, 'stn5'], right: [] },
            },
            stn4: {
                parents: ['stn1'],
                children: ['stn5'],
                branch: { left: [], right: [] },
            },
            stn5: {
                parents: ['stn4'],
                children: ['stn3'],
                branch: { left: [], right: [] },
            },
            lineend: {
                parents: ['stn2', 'stn3'],
                children: [],
                branch: { left: [BranchStyle.through, 'stn3'], right: [] },
            },
        } as any as StationDict;
        const mockStore = createMockStoreWithMockStations(mockStationList);

        const validity = mockStore.dispatch(checkStationCouldBeRemoved('stn2'));
        expect(validity).toBeTruthy();

        mockStore.dispatch(removeStation('stn2'));

        const actions = mockStore.getActions();
        expect(actions).toContainEqual(expect.objectContaining({ type: SET_STATIONS_BULK }));

        const newStationList = actions.find(action => action.type === SET_STATIONS_BULK).stations;
        expect(newStationList.stn1.children).toEqual(['stn4']);
        expect(newStationList.stn1.branch.right).toHaveLength(0);
        expect(newStationList.stn3.parents).toEqual(['stn5']);
        expect(newStationList.stn3.branch.left).toHaveLength(0);
    });

    it('Can remove station with 1 parent and 1 child as expected', () => {
        /**
         * stn1 - stn2
         *       \
         *        stn3 - stn4
         *         ^
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
        } as any as StationDict;
        const mockStore = createMockStoreWithMockStations(mockStationList);

        const validity = mockStore.dispatch(checkStationCouldBeRemoved('stn3'));
        expect(validity).toBeTruthy();

        mockStore.dispatch(removeStation('stn3'));

        const actions = mockStore.getActions();
        expect(actions).toContainEqual(expect.objectContaining({ type: SET_STATIONS_BULK }));

        const newStationList = actions.find(action => action.type === SET_STATIONS_BULK).stations;
        expect(newStationList.stn1.children).toEqual(['stn2', 'stn4']);
        expect(newStationList.stn1.branch.right).toEqual([BranchStyle.through, 'stn4']);
        expect(newStationList.stn4.parents).toEqual(['stn1']);
    });
});
