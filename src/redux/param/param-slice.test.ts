import rootReducer, { RootStore } from '../index';
import paramReducer, {
    addNote,
    customiseDestinationName,
    flipStationNames,
    ParamState,
    removeNote,
    staggerStationNames,
    toggleLineNameBeforeDestination,
    updateNote,
} from './param-slice';
import {
    BranchStyle,
    ExtendedInterchangeInfo,
    Name,
    Note,
    RmgStyle,
    Services,
    StationDict,
} from '../../constants/constants';
import { MonoColour } from '@railmapgen/rmg-palette-resources';
import { createTestStore, mockSimpleStationList } from '../../setupTests';
import { getBranches } from '../helper/graph-theory-util';
import {
    addInterchange,
    addStationService,
    autoNumbering,
    removeInterchange,
    removeStationService,
    reverseStations,
    rotateStations,
    setFullParam,
    setStationsBulk,
    updateInterchange,
    updateStationOsiName,
} from './action';
import { initParam } from './util';

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
        transfer: {},
    },
    test: {
        parents: ['linestart'],
        children: ['lineend'],
        transfer: {},
    },
    lineend: {
        parents: ['test'],
        children: [],
        transfer: {},
    },
} as any as StationDict;

describe('ParamSlice', () => {
    it('Can trigger helpers to update when setting stations', () => {
        const nextParam = initParam(RmgStyle.GZMTR, 'zh-Hans');

        {
            const mockStore = createTestStore();
            const prevDeps = mockStore.getState().helper;
            mockStore.dispatch(setFullParam(nextParam));
            expect(mockStore.getState().helper.depsStr).not.toEqual(prevDeps);
        }

        {
            const mockStore = createTestStore();
            const prevDeps = mockStore.getState().helper;
            mockStore.dispatch(setStationsBulk(nextParam.stn_list));
            expect(mockStore.getState().helper.depsStr).not.toEqual(prevDeps);
        }

        // mockStore.dispatch(setStation('test-id', {} as StationInfo));
        // actions = mockStore.getActions();
        // expect(actions).toHaveLength(2);
        // expect(actions.find(action => action.type === 'helper/updateHelper')).toBeDefined();
    });

    it('Can add empty note as expected', () => {
        const nextState = paramReducer(realStore.param, addNote());
        expect(nextState.notesGZMTR).toHaveLength(1);
        expect(nextState.notesGZMTR).toContainEqual(['', '', 10, 10, false]); // default value
    });

    it('Can add empty note to existing note list as expected', () => {
        const initialState = {
            ...realStore.param,
            notesGZMTR: [mockNote1],
        };
        const nextState = paramReducer(initialState, addNote());
        expect(nextState.notesGZMTR).toHaveLength(2);
        expect(nextState.notesGZMTR?.[0]).toEqual(mockNote1);
        expect(nextState.notesGZMTR?.[1]).toEqual(['', '', 10, 10, false]); // add to end of list
    });

    it('Can update note as expected', () => {
        const initialState = {
            ...realStore.param,
            notesGZMTR: [mockNote1, mockNote2],
        };
        const nextState = paramReducer(initialState, updateNote({ index: 1, note: mockUpdatedNote }));
        expect(nextState.notesGZMTR).toHaveLength(2);
        expect(nextState.notesGZMTR?.[0]).toEqual(mockNote1);
        expect(nextState.notesGZMTR?.[1]).toEqual(mockUpdatedNote);
    });

    it('Can delete note as expected', () => {
        const initialState = {
            ...realStore.param,
            notesGZMTR: [mockNote1, mockNote2],
        };
        const nextState = paramReducer(initialState, removeNote(0));
        expect(nextState.notesGZMTR).toHaveLength(1);
        expect(nextState.notesGZMTR).toContainEqual(mockNote2);
    });

    it('Can disable station name staggering', () => {
        const initialState = {
            ...realStore.param,
            namePosMTR: {
                isStagger: true,
                isFlip: true,
            },
        };
        const nextState = paramReducer(initialState, staggerStationNames(false));
        expect(nextState.namePosMTR.isStagger).toBeFalsy();
        expect(nextState.namePosMTR.isFlip).toBeTruthy();
    });

    it('Can flip station names', () => {
        const initialState = {
            ...realStore.param,
            namePosMTR: {
                isStagger: true,
                isFlip: true,
            },
        };
        const nextState = paramReducer(initialState, flipStationNames());
        expect(nextState.namePosMTR.isStagger).toBeTruthy();
        expect(nextState.namePosMTR.isFlip).toBeFalsy();
    });

    it('Can flip station names with flip', () => {
        const initialState = {
            ...realStore.param,
            namePosMTR: {
                isStagger: true,
                isFlip: true,
            },
        };
        const nextState = paramReducer(initialState, flipStationNames(false));
        expect(nextState.namePosMTR.isStagger).toBeTruthy();
        expect(nextState.namePosMTR.isFlip).toBeFalsy();
    });

    it('Can toggle on line name before destination', () => {
        const initialState: ParamState = {
            ...realStore.param,
            customiseMTRDest: {
                isLegacy: false,
                terminal: false,
            },
        };
        const nextState = paramReducer(initialState, toggleLineNameBeforeDestination(true));
        expect(nextState.customiseMTRDest.isLegacy).toBeTruthy();
        expect(nextState.customiseMTRDest.terminal).toBeFalsy();
    });

    it('Can customise destination name', () => {
        const initialState: ParamState = {
            ...realStore.param,
            customiseMTRDest: {
                isLegacy: false,
                terminal: false,
            },
        };
        const mockCustomisedDestinationName: Name = ['Dest ZH', 'Dest EN'];
        const nextState = paramReducer(initialState, customiseDestinationName(mockCustomisedDestinationName));
        expect(nextState.customiseMTRDest.terminal).toEqual(mockCustomisedDestinationName);
        expect(nextState.customiseMTRDest.isLegacy).toBeFalsy();
    });

    describe('ParamAction - Reverse stations', () => {
        let mockStore: RootStore;

        beforeEach(() => {
            mockStore = createTestStore({ param: { ...realStore.param, stn_list: mockSimpleStationList } });
        });

        it('Can reverse stations as expected', () => {
            mockStore.dispatch(reverseStations());

            const updatedStationList = mockStore.getState().param.stn_list;
            expect(updatedStationList).toBeDefined();

            const linestartInfo = updatedStationList.linestart;
            expect(linestartInfo).toBeDefined();
            expect(linestartInfo.parents).toHaveLength(0);
            expect(linestartInfo.children).toEqual(['stn4', 'stn2']); // reverse lineend's parents
            expect(linestartInfo.branch?.left).toBeUndefined();
            expect(linestartInfo.branch?.right).toEqual([BranchStyle.through, 'stn4']); // lineend's left branch

            const stn0Info = updatedStationList.stn0;
            expect(stn0Info).toBeDefined();
            expect(stn0Info.parents).toEqual(['stn1']);
            expect(stn0Info.children).toEqual(['lineend']);
            expect(stn0Info.branch?.left).toBeUndefined();
            expect(stn0Info.branch?.right).toBeUndefined();

            const stn1Info = updatedStationList.stn1;
            expect(stn1Info).toBeDefined();
            expect(stn1Info.parents).toEqual(['stn3', 'stn2']); // reverse self children
            expect(stn1Info.children).toEqual(['stn0']); // reverse self parent and swap linestart and lineend
            expect(stn1Info.branch?.left).toEqual([BranchStyle.through, 'stn3']); // self right branch
            expect(stn1Info.branch?.right).toBeUndefined();

            const stn2Info = updatedStationList.stn2;
            expect(stn2Info).toBeDefined();
            expect(stn2Info.parents).toEqual(['linestart']);
            expect(stn2Info.children).toEqual(['stn1']); // swap parents and children and swap linestart and lineend
            expect(stn2Info.branch?.left).toBeUndefined();
            expect(stn2Info.branch?.right).toBeUndefined();

            const stn3Info = updatedStationList.stn3;
            expect(stn3Info).toBeDefined();
            expect(stn3Info.parents).toEqual(['stn4']);
            expect(stn3Info.children).toEqual(['stn1']);
            expect(stn3Info.branch?.left).toBeUndefined();
            expect(stn3Info.branch?.right).toBeUndefined();

            const stn4Info = updatedStationList.stn4;
            expect(stn4Info).toBeDefined();
            expect(stn4Info.parents).toEqual(['linestart']);
            expect(stn4Info.children).toEqual(['stn3']);
            expect(stn4Info.branch?.left).toBeUndefined();
            expect(stn4Info.branch?.right).toBeUndefined();

            const lineendInfo = updatedStationList.lineend;
            expect(lineendInfo).toBeDefined();
            expect(lineendInfo.parents).toEqual(['stn0']);
            expect(lineendInfo.children).toHaveLength(0);
            expect(lineendInfo.branch?.left).toBeUndefined();
            expect(lineendInfo.branch?.right).toBeUndefined();
        });

        it('Can flip stations as expected - SHMetro', () => {
            mockStore.dispatch(reverseStations(true));

            const updatedStationList = mockStore.getState().param.stn_list;
            expect(updatedStationList).toBeDefined();

            const linestartInfo = updatedStationList.linestart;
            expect(linestartInfo).toBeDefined();
            expect(linestartInfo.parents).toHaveLength(0);
            expect(linestartInfo.children).toEqual(['stn2', 'stn4']); // lineend's parents not reversed
            expect(linestartInfo.branch?.left).toBeUndefined();
            expect(linestartInfo.branch?.right).toEqual([BranchStyle.through, 'stn4']); // lineend's left branch

            const stn1Info = updatedStationList.stn1;
            expect(stn1Info).toBeDefined();
            expect(stn1Info.parents).toEqual(['stn2', 'stn3']); // self children not reversed
            expect(stn1Info.children).toEqual(['stn0']);
            expect(stn1Info.branch?.left).toEqual([BranchStyle.through, 'stn3']);
            expect(stn1Info.branch?.right).toBeUndefined();
        });
    });

    it('Can add interchange info to OSI set for station without any interchange as expected', () => {
        const mockStore = createTestStore({
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

        const stationTransferGroups = mockStore.getState().param.stn_list.test.transfer.groups;
        expect(stationTransferGroups).toHaveLength(2); // empty within-station, and osi with 1 info
        expect(stationTransferGroups[0].lines).toHaveLength(0); // concat with length 0 array to info, to avoid error while stringify JSON
        expect(stationTransferGroups[1].lines).toHaveLength(1);
        expect(stationTransferGroups[1].lines).toContainEqual(mockInterchange1);
    });

    it('Can add interchange info to within-station set for station with 1 within-station interchange as expected', () => {
        const mockStore = createTestStore({
            param: {
                ...realStore.param,
                stn_list: {
                    ...mockStationList,
                    test: { ...mockStationList.test, transfer: { groups: [{ lines: [mockInterchange1] }] } as any },
                },
            },
        });
        mockStore.dispatch(addInterchange('test', 0, mockInterchange2));

        const stationTransferGroups = mockStore.getState().param.stn_list.test.transfer.groups;
        expect(stationTransferGroups).toHaveLength(1); // 2 within-station
        expect(stationTransferGroups[0].lines).toHaveLength(2);
        expect(stationTransferGroups[0].lines).toEqual([mockInterchange1, mockInterchange2]);
    });

    it('Can add OSI name for station as expected', () => {
        const mockStore = createTestStore({
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

        const stationTransferGroups = mockStore.getState().param.stn_list.test.transfer.groups;
        expect(stationTransferGroups[0].name).toBeUndefined();
        expect(stationTransferGroups[1].name).toBeUndefined();
        expect(stationTransferGroups[2].name).toEqual(['Name ZH', 'Name EN']);
    });

    it('Cannot add OSI name for group out of bound', () => {
        const mockStore = createTestStore({
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
        const prevState = mockStore.getState().param;

        mockStore.dispatch(updateStationOsiName('test', 1, ['Name ZH', 'Name EN']));
        expect(mockStore.getState().param).toEqual(prevState);
    });

    it('Can remove interchange info as expected', () => {
        const mockStore = createTestStore({
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

        const stationTransferGroups = mockStore.getState().param.stn_list.test.transfer.groups;
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
        const mockStore = createTestStore({
            param: { ...realStore.param, stn_list: mockStationList },
        });
        const prevState = mockStore.getState().param;

        mockStore.dispatch(removeInterchange('test', 0, 1));
        expect(mockStore.getState().param).toEqual(prevState);
    });

    it('Can update interchange info as expected', () => {
        const mockStore = createTestStore({
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

        const stationTransferGroups = mockStore.getState().param.stn_list.test.transfer.groups;
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
        const mockStore = createTestStore({
            param: {
                ...realStore.param,
                stn_list: {
                    ...mockStationList,
                    test: { ...mockStationList.test, services: [Services.local] },
                },
            },
        });

        mockStore.dispatch(addStationService('test', Services.express));
        const servicesAfterAdding = mockStore.getState().param.stn_list.test.services;
        expect(servicesAfterAdding).toHaveLength(2);
        expect(servicesAfterAdding).toContain(Services.express);

        mockStore.dispatch(removeStationService('test', Services.local));
        const servicesAfterRemoving = mockStore.getState().param.stn_list.test.services;
        expect(servicesAfterRemoving).toHaveLength(1);
        expect(servicesAfterRemoving).not.toContain(Services.local);
    });

    it('Cannot add service to station if exists', () => {
        const mockStationList = {
            test: { services: [Services.local] },
        } as any as StationDict;
        const mockStore = createTestStore({
            param: { ...realStore.param, stn_list: mockStationList },
        });
        mockStore.dispatch(addStationService('test', Services.local));

        const services = mockStore.getState().param.stn_list.test.services;
        expect(services).toEqual([Services.local]);
    });

    it('Cannot remove service from station if not exists', () => {
        const mockStationList = {
            test: { services: [Services.local] },
        } as any as StationDict;
        const mockStore = createTestStore({
            param: { ...realStore.param, stn_list: mockStationList },
        });
        mockStore.dispatch(removeStationService('test', Services.express));

        const services = mockStore.getState().param.stn_list.test.services;
        expect(services).toEqual([Services.local]);
    });

    describe('ParamAction - Auto numbering', () => {
        const branches = getBranches(mockSimpleStationList);
        let mockStore: RootStore;

        beforeEach(() => {
            mockStore = createTestStore({
                param: {
                    ...realStore.param,
                    stn_list: mockSimpleStationList,
                },
                helper: {
                    ...realStore.helper,
                    branches: branches,
                },
            });
        });

        it('Can number main line in ascending order as expected', () => {
            mockStore.dispatch(autoNumbering(0, 1, 2, 'asc'));

            const nextStationList = mockStore.getState().param.stn_list;
            expect(nextStationList.linestart.num).toBeUndefined();
            expect(nextStationList.stn0.num).toBe('01');
            expect(nextStationList.stn1.num).toBe('02');
            expect(nextStationList.stn2.num).toBe('03');
            expect(nextStationList.lineend.num).toBeUndefined();
        });

        it('Can number branch in descending order as expected', () => {
            mockStore.dispatch(autoNumbering(1, 10, 2, 'desc'));

            const nextStationList = mockStore.getState().param.stn_list;
            expect(nextStationList.stn1.num).toBeUndefined();
            expect(nextStationList.stn3.num).toBe('10');
            expect(nextStationList.stn4.num).toBe('09');
            expect(nextStationList.lineend.num).toBeUndefined();
        });
    });

    describe('ParamAction - rotate stations', () => {
        const branches = getBranches(mockSimpleStationList);
        let mockStore: RootStore;

        beforeEach(() => {
            mockStore = createTestStore({
                param: {
                    ...realStore.param,
                    stn_list: mockSimpleStationList,
                },
                helper: {
                    ...realStore.helper,
                    branches: branches,
                },
            });
        });

        it('sanity', () => {
            const branches = mockStore.getState().helper.branches;
            expect(branches[0]).toEqual(['linestart', 'stn0', 'stn1', 'stn2', 'lineend']);
            expect(branches[1]).toEqual(['stn1', 'stn3', 'stn4', 'lineend']);
        });

        it('Can rotate stations anticlockwise by one station', () => {
            {
                mockStore.dispatch(rotateStations(false));
                const branches = mockStore.getState().helper.branches;
                expect(branches[0]).toEqual(['linestart', 'stn2', 'stn0', 'stn1', 'lineend']);
                expect(branches[1]).toEqual(['stn1', 'stn3', 'stn4', 'lineend']);
            }
            {
                mockStore.dispatch(rotateStations(false));
                const branches = mockStore.getState().helper.branches;
                expect(branches[0]).toEqual(['linestart', 'stn1', 'stn2', 'stn0', 'lineend']);
                expect(branches[1]).toEqual(['stn1', 'stn3', 'stn4', 'lineend']);
            }
            {
                mockStore.dispatch(rotateStations(false));
                const branches = mockStore.getState().helper.branches;
                expect(branches[0]).toEqual(['linestart', 'stn0', 'stn1', 'stn2', 'lineend']);
                expect(branches[1]).toEqual(['stn1', 'stn3', 'stn4', 'lineend']);
            }
        });

        it('Can rotate stations clockwise by one station', () => {
            {
                mockStore.dispatch(rotateStations(true));
                const branches = mockStore.getState().helper.branches;
                expect(branches[0]).toEqual(['linestart', 'stn1', 'stn2', 'stn0', 'lineend']);
                expect(branches[1]).toEqual(['stn1', 'stn3', 'stn4', 'lineend']);
            }
            {
                mockStore.dispatch(rotateStations(true));
                const branches = mockStore.getState().helper.branches;
                expect(branches[0]).toEqual(['linestart', 'stn2', 'stn0', 'stn1', 'lineend']);
                expect(branches[1]).toEqual(['stn1', 'stn3', 'stn4', 'lineend']);
            }
            {
                mockStore.dispatch(rotateStations(true));
                const branches = mockStore.getState().helper.branches;
                expect(branches[0]).toEqual(['linestart', 'stn0', 'stn1', 'stn2', 'lineend']);
                expect(branches[1]).toEqual(['stn1', 'stn3', 'stn4', 'lineend']);
            }
        });
    });
});
