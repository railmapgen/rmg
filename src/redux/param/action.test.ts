import rootReducer, { RootState } from '../index';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
    addNote,
    customiseDestinationName,
    flipStationNames,
    removeNote,
    SET_CUSTOMISED_MTR_DESTINATION,
    SET_NAME_POSITION,
    SET_NOTES,
    setCustomisedMtrDestinationAction,
    setNamePositionAction,
    setNotesAction,
    staggerStationNames,
    toggleLineNameBeforeDestination,
    updateNote,
} from './action';
import { Name, Note } from '../../constants/constants';

const realStore = rootReducer.getState();

const mockNote1: Note = ['Note 1 ZH', 'Note 1 EN', 10, 10, true];
const mockNote2: Note = ['Note 2 ZH', 'Note 2 EN', 20, 20, false];
const mockUpdatedNote: Note = ['Note 2 ZH Updated', 'Note 2 EN', 25, 25, false];

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
});
