import rootReducer from '../index';
import {
    addInterchange,
    addNote,
    addStationService,
    autoNumbering,
    customiseDestinationName,
    flipStationNames,
    removeInterchange,
    removeNote,
    removeStationService,
    reverseStations,
    SET_CUSTOMISED_MTR_DESTINATION,
    SET_NAME_POSITION,
    SET_NOTES,
    SET_STATION,
    SET_STATIONS_BULK,
    SET_STYLE,
    setCustomisedMtrDestinationAction,
    setFullParam,
    setNamePositionAction,
    setNotesAction,
    setStation,
    setStationAction,
    setStationsBulk,
    setStyle,
    staggerStationNames,
    toggleLineNameBeforeDestination,
    updateInterchange,
    updateNote,
    updateStationOsiName,
} from './action';
import {
    BranchStyle,
    ExtendedInterchangeInfo,
    Name,
    Note,
    RMGParam,
    RmgStyle,
    Services,
    StationDict,
    StationInfo,
} from '../../constants/constants';
import { MonoColour } from '@railmapgen/rmg-palette-resources';
import { SET_DEPS_STR } from '../helper/action';
import { createMockAppStore, mockSimpleStationList } from '../../setupTests';
import { getBranches } from '../helper/graph-theory-util';

const realStore = rootReducer.getState();

const mockNote1: Note = ['Note 1 ZH', 'Note 1 EN', 10, 10, true];
const mockNote2: Note = ['Note 2 ZH', 'Note 2 EN', 20, 20, false];
const mockUpdatedNote: Note = ['Note 2 ZH Updated', 'Note 2 EN', 25, 25, false];
const mockInterchange1: ExtendedInterchangeInfo = {
    theme: ['hongkong', 'twl', '#000000', MonoColour.white],
    name: ['Int 1 ZH', 'Int 1 EN'],
};
const mockInterchange2: ExtendedInterchangeInfo = {
    theme: ['guangzhou', 'gz1', '#FFFFFF', MonoColour.black],
    name: ['Int 2 ZH', 'Int 2 EN'],
};
const mockUpdatedThemeInterchange: ExtendedInterchangeInfo = {
    theme: ['london', 'bakerloo', '#AAAAAA', MonoColour.white],
    name: ['碧嘉老綫', 'Bakerloo Line'],
};

const mockStationList = {
    linestart: {
        parents: [],
        children: ['test'],
        branch: { left: [], right: [] },
        transfer: {},
    },
    test: {
        parents: ['linestart'],
        children: ['lineend'],
        branch: { left: [], right: [] },
        transfer: {},
    },
    lineend: {
        parents: ['test'],
        children: [],
        branch: { left: [], right: [] },
        transfer: {},
    },
} as any as StationDict;

describe('Tests for param actions', () => {
    it('Can set rmgStyle to expected style', () => {
        const mockStore = createMockAppStore({ ...realStore });

        mockStore.dispatch(setStyle(RmgStyle.GZMTR));

        const actions = mockStore.getActions();
        expect(actions).toHaveLength(1);
        expect(actions.find(action => action.type === SET_STYLE && action.style === RmgStyle.GZMTR)).toBeDefined();
    });

    it('Can trigger helpers to update when setting stations', () => {
        let actions: any[];

        const mockStore = createMockAppStore({ ...realStore });
        mockStore.dispatch(setFullParam({} as RMGParam));
        actions = mockStore.getActions();
        expect(actions).toHaveLength(2);
        expect(actions.find(action => action.type === SET_DEPS_STR)).toBeDefined();

        mockStore.clearActions();

        mockStore.dispatch(setStation('test-id', {} as StationInfo));
        actions = mockStore.getActions();
        expect(actions).toHaveLength(2);
        expect(actions.find(action => action.type === SET_DEPS_STR)).toBeDefined();

        mockStore.clearActions();

        mockStore.dispatch(setStationsBulk({} as StationDict));
        actions = mockStore.getActions();
        expect(actions).toHaveLength(2);
        expect(actions.find(action => action.type === SET_DEPS_STR)).toBeDefined();
    });

    it('Can add empty note as expected', () => {
        const mockStore = createMockAppStore({ ...realStore });

        mockStore.dispatch(addNote());
        const actions = mockStore.getActions();
        expect(actions).toHaveLength(1);

        const action: setNotesAction = actions.find(action => action.type === SET_NOTES);
        expect(action).toBeDefined();
        expect(action.notes).toHaveLength(1);
        expect(action.notes).toContainEqual(['', '', 10, 10, false]); // default value
    });

    it('Can add empty note to existing note list as expected', () => {
        const mockStore = createMockAppStore({
            ...realStore,
            param: {
                ...realStore.param,
                notesGZMTR: [mockNote1],
            },
        });

        mockStore.dispatch(addNote());
        const actions = mockStore.getActions();
        expect(actions).toHaveLength(1);

        const action: setNotesAction = actions.find(action => action.type === SET_NOTES);
        expect(action).toBeDefined();
        expect(action.notes).toHaveLength(2);
        expect(action.notes?.[0]).toEqual(mockNote1);
        expect(action.notes?.[1]).toEqual(['', '', 10, 10, false]); // add to end of list
    });

    it('Can update note as expected', () => {
        const mockStore = createMockAppStore({
            ...realStore,
            param: {
                ...realStore.param,
                notesGZMTR: [mockNote1, mockNote2],
            },
        });

        mockStore.dispatch(updateNote(1, mockUpdatedNote));
        const actions = mockStore.getActions();
        expect(actions).toHaveLength(1);

        const action: setNotesAction = actions.find(action => action.type === SET_NOTES);
        expect(action).toBeDefined();
        expect(action.notes).toHaveLength(2);
        expect(action.notes?.[0]).toEqual(mockNote1);
        expect(action.notes?.[1]).toEqual(mockUpdatedNote);
    });

    it('Can delete note as expected', () => {
        const mockStore = createMockAppStore({
            ...realStore,
            param: {
                ...realStore.param,
                notesGZMTR: [mockNote1, mockNote2],
            },
        });

        mockStore.dispatch(removeNote(0));
        const actions = mockStore.getActions();
        expect(actions).toHaveLength(1);

        const action: setNotesAction = actions.find(action => action.type === SET_NOTES);
        expect(action).toBeDefined();
        expect(action.notes).toHaveLength(1);
        expect(action.notes).toContainEqual(mockNote2);
    });

    it('Can disable station name staggering', () => {
        const mockStore = createMockAppStore({
            ...realStore,
            param: {
                ...realStore.param,
                namePosMTR: {
                    isStagger: true,
                    isFlip: true,
                },
            },
        });

        mockStore.dispatch(staggerStationNames(false));
        const actions = mockStore.getActions();
        expect(actions).toHaveLength(1);

        const action: setNamePositionAction = actions.find(action => action.type === SET_NAME_POSITION);
        expect(action).toBeDefined();
        expect(action.namePosition.isStagger).toBeFalsy();
        expect(action.namePosition.isFlip).toBeTruthy();
    });

    it('Can flip station names', () => {
        const mockStore = createMockAppStore({
            ...realStore,
            param: {
                ...realStore.param,
                namePosMTR: {
                    isStagger: true,
                    isFlip: true,
                },
            },
        });

        mockStore.dispatch(flipStationNames());
        const actions = mockStore.getActions();
        expect(actions).toHaveLength(1);

        const action: setNamePositionAction = actions.find(action => action.type === SET_NAME_POSITION);
        expect(action).toBeDefined();
        expect(action.namePosition.isStagger).toBeTruthy();
        expect(action.namePosition.isFlip).toBeFalsy();
    });

    it('Can toggle on line name before destination', () => {
        const mockStore = createMockAppStore({
            ...realStore,
            param: {
                ...realStore.param,
                customiseMTRDest: {
                    isLegacy: false,
                    terminal: false,
                },
            },
        });

        mockStore.dispatch(toggleLineNameBeforeDestination(true));
        const actions = mockStore.getActions();
        expect(actions).toHaveLength(1);

        const action: setCustomisedMtrDestinationAction = actions.find(
            action => action.type === SET_CUSTOMISED_MTR_DESTINATION
        );
        expect(action).toBeDefined();
        expect(action.customisedMtrDestination.isLegacy).toBeTruthy();
        expect(action.customisedMtrDestination.terminal).toBeFalsy();
    });

    it('Can customise destination name', () => {
        const mockStore = createMockAppStore({
            ...realStore,
            param: {
                ...realStore.param,
                customiseMTRDest: {
                    isLegacy: false,
                    terminal: false,
                },
            },
        });
        const mockCustomisedDestinationName: Name = ['Dest ZH', 'Dest EN'];

        mockStore.dispatch(customiseDestinationName(mockCustomisedDestinationName));
        const actions = mockStore.getActions();
        expect(actions).toHaveLength(1);

        const action: setCustomisedMtrDestinationAction = actions.find(
            action => action.type === SET_CUSTOMISED_MTR_DESTINATION
        );
        expect(action).toBeDefined();
        expect(action.customisedMtrDestination.terminal).toEqual(mockCustomisedDestinationName);
        expect(action.customisedMtrDestination.isLegacy).toBeFalsy();
    });

    describe('ParamAction - Reverse stations', () => {
        const mockStore = createMockAppStore({
            ...realStore,
            param: {
                ...realStore.param,
                stn_list: mockSimpleStationList,
            },
        });

        afterEach(() => {
            mockStore.clearActions();
        });

        it('Can reverse stations as expected', () => {
            mockStore.dispatch(reverseStations());

            const actions = mockStore.getActions();
            // expect(actions).toHaveLength(1);
            expect(actions.find(action => action.type === SET_STATIONS_BULK)).toBeDefined();

            const updatedStationList = actions[0].stations;
            expect(updatedStationList).toBeDefined();

            const linestartInfo = updatedStationList.linestart;
            expect(linestartInfo).toBeDefined();
            expect(linestartInfo.parents).toHaveLength(0);
            expect(linestartInfo.children).toEqual(['stn4', 'stn2']); // reverse lineend's parents
            expect(linestartInfo.branch.left).toHaveLength(0);
            expect(linestartInfo.branch.right).toEqual([BranchStyle.through, 'stn4']); // lineend's left branch

            const stn0Info = updatedStationList.stn0;
            expect(stn0Info).toBeDefined();
            expect(stn0Info.parents).toEqual(['stn1']);
            expect(stn0Info.children).toEqual(['lineend']);
            expect(stn0Info.branch.left).toHaveLength(0);
            expect(stn0Info.branch.right).toHaveLength(0);

            const stn1Info = updatedStationList.stn1;
            expect(stn1Info).toBeDefined();
            expect(stn1Info.parents).toEqual(['stn3', 'stn2']); // reverse self children
            expect(stn1Info.children).toEqual(['stn0']); // reverse self parent and swap linestart and lineend
            expect(stn1Info.branch.left).toEqual([BranchStyle.through, 'stn3']); // self right branch
            expect(stn1Info.branch.right).toHaveLength(0);

            const stn2Info = updatedStationList.stn2;
            expect(stn2Info).toBeDefined();
            expect(stn2Info.parents).toEqual(['linestart']);
            expect(stn2Info.children).toEqual(['stn1']); // swap parents and children and swap linestart and lineend
            expect(stn2Info.branch.left).toHaveLength(0);
            expect(stn2Info.branch.right).toHaveLength(0);

            const stn3Info = updatedStationList.stn3;
            expect(stn3Info).toBeDefined();
            expect(stn3Info.parents).toEqual(['stn4']);
            expect(stn3Info.children).toEqual(['stn1']);
            expect(stn3Info.branch.left).toHaveLength(0);
            expect(stn3Info.branch.right).toHaveLength(0);

            const stn4Info = updatedStationList.stn4;
            expect(stn4Info).toBeDefined();
            expect(stn4Info.parents).toEqual(['linestart']);
            expect(stn4Info.children).toEqual(['stn3']);
            expect(stn4Info.branch.left).toHaveLength(0);
            expect(stn4Info.branch.right).toHaveLength(0);

            const lineendInfo = updatedStationList.lineend;
            expect(lineendInfo).toBeDefined();
            expect(lineendInfo.parents).toEqual(['stn0']);
            expect(lineendInfo.children).toHaveLength(0);
            expect(lineendInfo.branch.left).toHaveLength(0);
            expect(lineendInfo.branch.right).toHaveLength(0);
        });

        it('Can flip stations as expected - SHMetro', () => {
            mockStore.dispatch(reverseStations(true));

            const actions = mockStore.getActions();
            // expect(actions).toHaveLength(1);
            expect(actions.find(action => action.type === SET_STATIONS_BULK)).toBeDefined();

            const updatedStationList = actions[0].stations;
            expect(updatedStationList).toBeDefined();

            const linestartInfo = updatedStationList.linestart;
            expect(linestartInfo).toBeDefined();
            expect(linestartInfo.parents).toHaveLength(0);
            expect(linestartInfo.children).toEqual(['stn2', 'stn4']); // lineend's parents not reversed
            expect(linestartInfo.branch.left).toHaveLength(0);
            expect(linestartInfo.branch.right).toEqual([BranchStyle.through, 'stn4']); // lineend's left branch

            const stn1Info = updatedStationList.stn1;
            expect(stn1Info).toBeDefined();
            expect(stn1Info.parents).toEqual(['stn2', 'stn3']); // self children not reversed
            expect(stn1Info.children).toEqual(['stn0']);
            expect(stn1Info.branch.left).toEqual([BranchStyle.through, 'stn3']);
            expect(stn1Info.branch.right).toHaveLength(0);
        });
    });

    it('Can add interchange info to OSI set for station without any interchange as expected', () => {
        const mockStore = createMockAppStore({
            ...realStore,
            param: {
                ...realStore.param,
                stn_list: {
                    ...mockStationList,
                    test: {
                        ...mockStationList.test,
                        transfer: { ...mockStationList.test.transfer, groups: [{ lines: [] }] },
                    },
                },
            },
        });
        mockStore.dispatch(addInterchange('test', 1, mockInterchange1));

        const actions = mockStore.getActions();
        // expect(actions).toHaveLength(1);
        expect(actions.find(action => action.type === SET_STATION)).toBeDefined();

        const setStationAction: setStationAction = actions[0];
        const stationTransferGroups = setStationAction.station.transfer.groups;
        expect(stationTransferGroups).toHaveLength(2); // empty within-station, and osi with 1 info
        expect(stationTransferGroups[0].lines).toHaveLength(0); // concat with length 0 array to info, to avoid error while stringify JSON
        expect(stationTransferGroups[1].lines).toHaveLength(1);
        expect(stationTransferGroups[1].lines).toContainEqual(mockInterchange1);
    });

    it('Can add interchange info to within-station set for station with 1 within-station interchange as expected', () => {
        const mockStore = createMockAppStore({
            ...realStore,
            param: {
                ...realStore.param,
                stn_list: {
                    ...mockStationList,
                    test: { ...mockStationList.test, transfer: { groups: [{ lines: [mockInterchange1] }] } as any },
                },
            },
        });
        mockStore.dispatch(addInterchange('test', 0, mockInterchange2));

        const actions = mockStore.getActions();
        // expect(actions).toHaveLength(1);
        expect(actions.find(action => action.type === SET_STATION)).toBeDefined();

        const setStationAction: setStationAction = actions[0];
        const stationTransferGroups = setStationAction.station.transfer.groups;
        expect(stationTransferGroups).toHaveLength(1); // 2 within-station
        expect(stationTransferGroups[0].lines).toHaveLength(2);
        expect(stationTransferGroups[0].lines).toEqual([mockInterchange1, mockInterchange2]);
    });

    it('Can add OSI name for station as expected', () => {
        const mockStore = createMockAppStore({
            ...realStore,
            param: {
                ...realStore.param,
                stn_list: {
                    ...mockStationList,
                    test: {
                        ...mockStationList.test,
                        transfer: {
                            ...mockStationList.test.transfer,
                            groups: [{ lines: [] }, { lines: [] }, { lines: [] }],
                        },
                    },
                },
            },
        });
        mockStore.dispatch(updateStationOsiName('test', 2, ['Name ZH', 'Name EN']));

        const actions = mockStore.getActions();
        // expect(actions).toHaveLength(1);
        expect(actions.find(action => action.type === SET_STATION)).toBeDefined();

        const setStationAction: setStationAction = actions[0];
        const stationTransferGroups = setStationAction.station.transfer.groups;
        expect(stationTransferGroups[0].name).toBeUndefined();
        expect(stationTransferGroups[1].name).toBeUndefined();
        expect(stationTransferGroups[2].name).toEqual(['Name ZH', 'Name EN']);
    });

    it('Cannot add OSI name for group out of bound', () => {
        const mockStore = createMockAppStore({
            ...realStore,
            param: {
                ...realStore.param,
                stn_list: {
                    ...mockStationList,
                    test: {
                        ...mockStationList.test,
                        transfer: { ...mockStationList.test.transfer, groups: [{ lines: [] }] },
                    },
                },
            },
        });
        mockStore.dispatch(updateStationOsiName('test', 1, ['Name ZH', 'Name EN']));

        const actions = mockStore.getActions();
        expect(actions).toHaveLength(0);
        expect(actions.find(action => action.type === SET_STATION)).not.toBeDefined();
    });

    it('Can remove interchange info as expected', () => {
        const mockStore = createMockAppStore({
            ...realStore,
            param: {
                ...realStore.param,
                stn_list: {
                    ...mockStationList,
                    test: {
                        ...mockStationList.test,
                        transfer: {
                            ...mockStationList.test.transfer,
                            groups: [{ lines: [mockInterchange1, mockInterchange2] }],
                        },
                    },
                },
            },
        });
        mockStore.dispatch(removeInterchange('test', 0, 1));

        const actions = mockStore.getActions();
        // expect(actions).toHaveLength(1);
        expect(actions.find(action => action.type === SET_STATION)).toBeDefined();

        const setStationAction: setStationAction = actions[0];
        const stationTransferGroups = setStationAction.station.transfer.groups;
        expect(stationTransferGroups).toHaveLength(1);
        expect(stationTransferGroups[0].lines).toHaveLength(1);
        expect(stationTransferGroups[0].lines).toContainEqual(mockInterchange1);
    });

    it('Cannot remove interchange info if out of index', () => {
        const mockStationList = {
            test: {
                transfer: { groups: [{ lines: [mockInterchange1] }] },
            },
        } as any as StationDict;
        const mockStore = createMockAppStore({
            ...realStore,
            param: { ...realStore.param, stn_list: mockStationList },
        });
        mockStore.dispatch(removeInterchange('test', 0, 1));

        const actions = mockStore.getActions();
        expect(actions).toHaveLength(0);
    });

    it('Can update interchange info as expected', () => {
        const mockStore = createMockAppStore({
            ...realStore,
            param: {
                ...realStore.param,
                stn_list: {
                    ...mockStationList,
                    test: {
                        ...mockStationList.test,
                        transfer: { ...mockStationList.test.transfer, groups: [{ lines: [mockInterchange1] }] },
                    },
                },
            },
        });
        mockStore.dispatch(updateInterchange('test', 0, 0, mockUpdatedThemeInterchange));

        const actions = mockStore.getActions();
        // expect(actions).toHaveLength(1);
        expect(actions.find(action => action.type === SET_STATION)).toBeDefined();

        const setStationAction: setStationAction = actions[0];
        const stationTransferGroups = setStationAction.station.transfer.groups;
        expect(stationTransferGroups).toHaveLength(1);
        expect(stationTransferGroups[0].lines).toHaveLength(1);
        expect(stationTransferGroups[0].lines).toContainEqual(mockUpdatedThemeInterchange);
    });

    // TODO
    it('Can update first station of the branch of a station', () => {
        expect(1).toBe(1);
    });

    // TODO
    it('Can flip branch position of a station', () => {
        expect(1).toBe(1);
    });

    it('Can add/remove service to/from station as expected', () => {
        const mockStore = createMockAppStore({
            ...realStore,
            param: {
                ...realStore.param,
                stn_list: {
                    ...mockStationList,
                    test: { ...mockStationList.test, services: [Services.local] },
                },
            },
        });

        mockStore.dispatch(addStationService('test', Services.express));
        const addServiceActions = mockStore.getActions();
        // expect(addServiceActions).toHaveLength(1);
        const addServiceAction: setStationAction = addServiceActions[0];
        const servicesAfterAdding = addServiceAction.station.services;
        expect(servicesAfterAdding).toHaveLength(2);
        expect(servicesAfterAdding).toContain(Services.express);

        mockStore.clearActions();

        mockStore.dispatch(removeStationService('test', Services.local));
        const removeServiceActions = mockStore.getActions();
        // expect(removeServiceActions).toHaveLength(1);
        const removeServiceAction: setStationAction = removeServiceActions[0];
        const servicesAfterRemoving = removeServiceAction.station.services;
        expect(servicesAfterRemoving).toHaveLength(0);
        expect(servicesAfterRemoving).not.toContain(Services.local);
    });

    it('Cannot add service to station if exists', () => {
        const mockStationList = {
            test: { services: [Services.local] },
        } as any as StationDict;
        const mockStore = createMockAppStore({
            ...realStore,
            param: { ...realStore.param, stn_list: mockStationList },
        });
        mockStore.dispatch(addStationService('test', Services.local));

        const actions = mockStore.getActions();
        expect(actions).toHaveLength(0);
    });

    it('Cannot remove service from station if not exists', () => {
        const mockStationList = {
            test: { services: [Services.local] },
        } as any as StationDict;
        const mockStore = createMockAppStore({
            ...realStore,
            param: { ...realStore.param, stn_list: mockStationList },
        });
        mockStore.dispatch(removeStationService('test', Services.express));

        const actions = mockStore.getActions();
        expect(actions).toHaveLength(0);
    });

    describe('ParamAction - Auto numbering', () => {
        const branches = getBranches(mockSimpleStationList);
        const mockStore = createMockAppStore({
            ...realStore,
            param: {
                ...realStore.param,
                stn_list: mockSimpleStationList,
            },
            helper: {
                ...realStore.helper,
                branches: branches,
            },
        });

        afterEach(() => {
            mockStore.clearActions();
        });

        it('Can number main line in ascending order as expected', () => {
            mockStore.dispatch(autoNumbering(0, 1, 2, 'asc'));

            const actions = mockStore.getActions();
            expect(actions).toContainEqual(expect.objectContaining({ type: SET_STATIONS_BULK }));

            const nextStationList: StationDict = actions.find(action => action.type === SET_STATIONS_BULK).stations;

            expect(nextStationList.linestart.num).toBeUndefined();
            expect(nextStationList.stn0.num).toBe('01');
            expect(nextStationList.stn1.num).toBe('02');
            expect(nextStationList.stn2.num).toBe('03');
            expect(nextStationList.lineend.num).toBeUndefined();
        });

        it('Can number branch in descending order as expected', () => {
            mockStore.dispatch(autoNumbering(1, 10, 2, 'desc'));

            const actions = mockStore.getActions();
            expect(actions).toContainEqual(expect.objectContaining({ type: SET_STATIONS_BULK }));

            const nextStationList: StationDict = actions.find(action => action.type === SET_STATIONS_BULK).stations;

            expect(nextStationList.stn1.num).toBeUndefined();
            expect(nextStationList.stn3.num).toBe('10');
            expect(nextStationList.stn4.num).toBe('09');
            expect(nextStationList.lineend.num).toBeUndefined();
        });
    });
});
