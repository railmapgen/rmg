import rootReducer, { RootState } from '../index';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
    addInterchange,
    addNote,
    addStationService,
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
    setCustomisedMtrDestinationAction,
    setNamePositionAction,
    setNotesAction,
    setStationAction,
    staggerStationNames,
    toggleLineNameBeforeDestination,
    updateInterchange,
    updateNote,
    updateStationOsiName,
} from './action';
import { BranchStyle, InterchangeInfo, MonoColour, Name, Note, Services, StationDict } from '../../constants/constants';
import { CityCode } from '../../constants/city-config';

const realStore = rootReducer.getState();

const mockNote1: Note = ['Note 1 ZH', 'Note 1 EN', 10, 10, true];
const mockNote2: Note = ['Note 2 ZH', 'Note 2 EN', 20, 20, false];
const mockUpdatedNote: Note = ['Note 2 ZH Updated', 'Note 2 EN', 25, 25, false];
const mockInterchange1: InterchangeInfo = [
    CityCode.HongKong,
    'twl',
    '#000000',
    MonoColour.white,
    'Int 1 ZH',
    'Int 1 EN',
];
const mockInterchange2: InterchangeInfo = [
    CityCode.Guangzhou,
    'gz1',
    '#FFFFFF',
    MonoColour.black,
    'Int 2 ZH',
    'Int 2 EN',
];
const mockUpdatedThemeInterchange = [CityCode.London, 'bakerloo', '#AAAAAA', MonoColour.white].concat(Array(2));

describe('Tests for param actions', () => {
    it('Can add empty note as expected', () => {
        const mockStore = configureStore<RootState>([thunk])({ ...realStore });

        mockStore.dispatch(addNote() as any);
        const actions = mockStore.getActions();
        expect(actions).toHaveLength(1);

        const action: setNotesAction = actions.find(action => action.type === SET_NOTES);
        expect(action).toBeDefined();
        expect(action.notes).toHaveLength(1);
        expect(action.notes).toContainEqual(['', '', 0, 0, false]); // default value
    });

    it('Can add empty note to existing note list as expected', () => {
        const mockStore = configureStore<RootState>([thunk])({
            ...realStore,
            param: {
                ...realStore.param,
                notesGZMTR: [mockNote1],
            },
        });

        mockStore.dispatch(addNote() as any);
        const actions = mockStore.getActions();
        expect(actions).toHaveLength(1);

        const action: setNotesAction = actions.find(action => action.type === SET_NOTES);
        expect(action).toBeDefined();
        expect(action.notes).toHaveLength(2);
        expect(action.notes[0]).toEqual(mockNote1);
        expect(action.notes[1]).toEqual(['', '', 0, 0, false]); // add to end of list
    });

    it('Can update note as expected', () => {
        const mockStore = configureStore<RootState>([thunk])({
            ...realStore,
            param: {
                ...realStore.param,
                notesGZMTR: [mockNote1, mockNote2],
            },
        });

        mockStore.dispatch(updateNote(1, mockUpdatedNote) as any);
        const actions = mockStore.getActions();
        expect(actions).toHaveLength(1);

        const action: setNotesAction = actions.find(action => action.type === SET_NOTES);
        expect(action).toBeDefined();
        expect(action.notes).toHaveLength(2);
        expect(action.notes[0]).toEqual(mockNote1);
        expect(action.notes[1]).toEqual(mockUpdatedNote);
    });

    it('Can delete note as expected', () => {
        const mockStore = configureStore<RootState>([thunk])({
            ...realStore,
            param: {
                ...realStore.param,
                notesGZMTR: [mockNote1, mockNote2],
            },
        });

        mockStore.dispatch(removeNote(0) as any);
        const actions = mockStore.getActions();
        expect(actions).toHaveLength(1);

        const action: setNotesAction = actions.find(action => action.type === SET_NOTES);
        expect(action).toBeDefined();
        expect(action.notes).toHaveLength(1);
        expect(action.notes).toContainEqual(mockNote2);
    });

    it('Can disable station name staggering', () => {
        const mockStore = configureStore<RootState>([thunk])({
            ...realStore,
            param: {
                ...realStore.param,
                namePosMTR: {
                    isStagger: true,
                    isFlip: true,
                },
            },
        });

        mockStore.dispatch(staggerStationNames(false) as any);
        const actions = mockStore.getActions();
        expect(actions).toHaveLength(1);

        const action: setNamePositionAction = actions.find(action => action.type === SET_NAME_POSITION);
        expect(action).toBeDefined();
        expect(action.namePosition.isStagger).toBeFalsy();
        expect(action.namePosition.isFlip).toBeTruthy();
    });

    it('Can flip station names', () => {
        const mockStore = configureStore<RootState>([thunk])({
            ...realStore,
            param: {
                ...realStore.param,
                namePosMTR: {
                    isStagger: true,
                    isFlip: true,
                },
            },
        });

        mockStore.dispatch(flipStationNames() as any);
        const actions = mockStore.getActions();
        expect(actions).toHaveLength(1);

        const action: setNamePositionAction = actions.find(action => action.type === SET_NAME_POSITION);
        expect(action).toBeDefined();
        expect(action.namePosition.isStagger).toBeTruthy();
        expect(action.namePosition.isFlip).toBeFalsy();
    });

    it('Can toggle on line name before destination', () => {
        const mockStore = configureStore<RootState>([thunk])({
            ...realStore,
            param: {
                ...realStore.param,
                customiseMTRDest: {
                    isLegacy: false,
                    terminal: false,
                },
            },
        });

        mockStore.dispatch(toggleLineNameBeforeDestination(true) as any);
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
        const mockStore = configureStore<RootState>([thunk])({
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

        mockStore.dispatch(customiseDestinationName(mockCustomisedDestinationName) as any);
        const actions = mockStore.getActions();
        expect(actions).toHaveLength(1);

        const action: setCustomisedMtrDestinationAction = actions.find(
            action => action.type === SET_CUSTOMISED_MTR_DESTINATION
        );
        expect(action).toBeDefined();
        expect(action.customisedMtrDestination.terminal).toEqual(mockCustomisedDestinationName);
        expect(action.customisedMtrDestination.isLegacy).toBeFalsy();
    });

    it('Can reverse stations as expected', () => {
        /**
         * Before reversing:
         * stn1 - stn2 (main)
         *      \
         *        stn3 - stn4 (branch)
         *
         * After reversing:
         * (branch) stn4 - stn3
         *                      \
         *          (main) stn2 - stn1
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
                branch: { left: [], right: [BranchStyle.nonThrough, 'stn3'] },
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
                branch: { left: [BranchStyle.nonThrough, 'stn4'], right: [] },
            },
        } as any as StationDict;

        const mockStore = configureStore<RootState>([thunk])({
            ...realStore,
            param: {
                ...realStore.param,
                stn_list: mockStationList,
            },
        });
        mockStore.dispatch(reverseStations() as any);

        const actions = mockStore.getActions();
        expect(actions).toHaveLength(1);
        expect(actions.find(action => action.type === SET_STATIONS_BULK)).toBeDefined();

        const updatedStationList = actions[0].stations;
        expect(updatedStationList).toBeDefined();

        const linestartInfo = updatedStationList.linestart;
        expect(linestartInfo).toBeDefined();
        expect(linestartInfo.parents).toHaveLength(0);
        expect(linestartInfo.children).toEqual(['stn4', 'stn2']); // reverse lineend's parents
        expect(linestartInfo.branch.left).toHaveLength(0);
        expect(linestartInfo.branch.right).toEqual([BranchStyle.nonThrough, 'stn4']); // lineend's left branch

        const stn1Info = updatedStationList.stn1;
        expect(stn1Info).toBeDefined();
        expect(stn1Info.parents).toEqual(['stn3', 'stn2']); // reverse self children
        expect(stn1Info.children).toEqual(['lineend']); // reverse self parent and swap linestart and lineend
        expect(stn1Info.branch.left).toEqual([BranchStyle.nonThrough, 'stn3']); // self right branch
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
        expect(lineendInfo.parents).toEqual(['stn1']);
        expect(lineendInfo.children).toHaveLength(0);
        expect(lineendInfo.branch.left).toHaveLength(0);
        expect(lineendInfo.branch.right).toHaveLength(0);
    });

    it('Can add interchange info to OSI set for station without any interchange as expected', () => {
        const mockStationList = {
            test: { transfer: { info: [] } },
        } as any as StationDict;
        const mockStore = configureStore<RootState>([thunk])({
            ...realStore,
            param: { ...realStore.param, stn_list: mockStationList },
        });
        mockStore.dispatch(addInterchange('test', 1, mockInterchange1) as any);

        const actions = mockStore.getActions();
        expect(actions).toHaveLength(1);
        expect(actions.find(action => action.type === SET_STATION)).toBeDefined();

        const setStationAction: setStationAction = actions[0];
        const stationTransferInfo = setStationAction.station.transfer.info;
        expect(stationTransferInfo).toHaveLength(2); // empty within-station, and osi with 1 info
        expect(stationTransferInfo[0]).toHaveLength(0); // concat with length 0 array to info, to avoid error while stringify JSON
        expect(stationTransferInfo[1]).toHaveLength(1);
        expect(stationTransferInfo[1]).toContainEqual(mockInterchange1);
    });

    it('Can add interchange info to within-station set for station with 1 within-station interchange as expected', () => {
        const mockStationList = {
            test: {
                transfer: { info: [[mockInterchange1]] },
            },
        } as any as StationDict;
        const mockStore = configureStore<RootState>([thunk])({
            ...realStore,
            param: { ...realStore.param, stn_list: mockStationList },
        });
        mockStore.dispatch(addInterchange('test', 0, mockInterchange2) as any);

        const actions = mockStore.getActions();
        expect(actions).toHaveLength(1);
        expect(actions.find(action => action.type === SET_STATION)).toBeDefined();

        const setStationAction: setStationAction = actions[0];
        const stationTransferInfo = setStationAction.station.transfer.info;
        expect(stationTransferInfo).toHaveLength(1); // 2 within-station
        expect(stationTransferInfo[0]).toHaveLength(2);
        expect(stationTransferInfo[0]).toEqual([mockInterchange1, mockInterchange2]);
    });

    it('Can add OSI name for station as expected', () => {
        const mockStationList = {
            test: {
                transfer: { osi_names: [] },
            },
        } as any as StationDict;
        const mockStore = configureStore<RootState>([thunk])({
            ...realStore,
            param: { ...realStore.param, stn_list: mockStationList },
        });
        mockStore.dispatch(updateStationOsiName('test', 1, ['Name ZH', 'Name EN']) as any);

        const actions = mockStore.getActions();
        expect(actions).toHaveLength(1);
        expect(actions.find(action => action.type === SET_STATION)).toBeDefined();

        const setStationAction: setStationAction = actions[0];
        const stationOsiNames = setStationAction.station.transfer.osi_names;
        expect(stationOsiNames).toHaveLength(2);
        expect(stationOsiNames[0]).toEqual(['車站名', 'Stn Name']); // dummy name
        expect(stationOsiNames[1]).toEqual(['Name ZH', 'Name EN']);
    });

    it('Can remove interchange info as expected', () => {
        const mockStationList = {
            test: {
                transfer: { info: [[mockInterchange1, mockInterchange2]] },
            },
        } as any as StationDict;
        const mockStore = configureStore<RootState>([thunk])({
            ...realStore,
            param: { ...realStore.param, stn_list: mockStationList },
        });
        mockStore.dispatch(removeInterchange('test', 0, 1) as any);

        const actions = mockStore.getActions();
        expect(actions).toHaveLength(1);
        expect(actions.find(action => action.type === SET_STATION)).toBeDefined();

        const setStationAction: setStationAction = actions[0];
        const stationTransferInfo = setStationAction.station.transfer.info;
        expect(stationTransferInfo).toHaveLength(1);
        expect(stationTransferInfo[0]).toHaveLength(1);
        expect(stationTransferInfo[0]).toContainEqual(mockInterchange1);
    });

    it('Cannot remove interchange info if out of index', () => {
        const mockStationList = {
            test: {
                transfer: { info: [[mockInterchange1]] },
            },
        } as any as StationDict;
        const mockStore = configureStore<RootState>([thunk])({
            ...realStore,
            param: { ...realStore.param, stn_list: mockStationList },
        });
        mockStore.dispatch(removeInterchange('test', 0, 1) as any);

        const actions = mockStore.getActions();
        expect(actions).toHaveLength(0);
    });

    it('Can update interchange info as expected', () => {
        const mockStationList = {
            test: {
                transfer: { info: [[mockInterchange1]] },
            },
        } as any as StationDict;
        const mockStore = configureStore<RootState>([thunk])({
            ...realStore,
            param: { ...realStore.param, stn_list: mockStationList },
        });
        mockStore.dispatch(updateInterchange('test', 0, 0, mockUpdatedThemeInterchange as any) as any);

        const actions = mockStore.getActions();
        expect(actions).toHaveLength(1);
        expect(actions.find(action => action.type === SET_STATION)).toBeDefined();

        const setStationAction: setStationAction = actions[0];
        const stationTransferInfo = setStationAction.station.transfer.info;
        expect(stationTransferInfo).toHaveLength(1);
        expect(stationTransferInfo[0]).toHaveLength(1);
        expect(stationTransferInfo[0]).toContainEqual(
            mockUpdatedThemeInterchange.slice(0, 4).concat(mockInterchange1.slice(4))
        );
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
        const mockStationList = {
            test: { services: [Services.local] },
        } as any as StationDict;
        const mockStore = configureStore<RootState>([thunk])({
            ...realStore,
            param: { ...realStore.param, stn_list: mockStationList },
        });

        mockStore.dispatch(addStationService('test', Services.express) as any);
        const addServiceActions = mockStore.getActions();
        expect(addServiceActions).toHaveLength(1);
        const addServiceAction: setStationAction = addServiceActions[0];
        const servicesAfterAdding = addServiceAction.station.services;
        expect(servicesAfterAdding).toHaveLength(2);
        expect(servicesAfterAdding).toContain(Services.express);

        mockStore.clearActions();

        mockStore.dispatch(removeStationService('test', Services.local) as any);
        const removeServiceActions = mockStore.getActions();
        expect(removeServiceActions).toHaveLength(1);
        const removeServiceAction: setStationAction = removeServiceActions[0];
        const servicesAfterRemoving = removeServiceAction.station.services;
        expect(servicesAfterRemoving).toHaveLength(0);
        expect(servicesAfterRemoving).not.toContain(Services.local);
    });

    it('Cannot add service to station if exists', () => {
        const mockStationList = {
            test: { services: [Services.local] },
        } as any as StationDict;
        const mockStore = configureStore<RootState>([thunk])({
            ...realStore,
            param: { ...realStore.param, stn_list: mockStationList },
        });
        mockStore.dispatch(addStationService('test', Services.local) as any);

        const actions = mockStore.getActions();
        expect(actions).toHaveLength(0);
    });

    it('Cannot remove service from station if not exists', () => {
        const mockStationList = {
            test: { services: [Services.local] },
        } as any as StationDict;
        const mockStore = configureStore<RootState>([thunk])({
            ...realStore,
            param: { ...realStore.param, stn_list: mockStationList },
        });
        mockStore.dispatch(removeStationService('test', Services.express) as any);

        const actions = mockStore.getActions();
        expect(actions).toHaveLength(0);
    });
});
