import rootReducer, { RootState } from '../index';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { StationDict } from '../../constants/constants';
import { SET_BRANCHES, SET_DEPS_STR, SET_ROUTES, SET_TPO, triggerHelpersUpdate } from './action';

const realStore = rootReducer.getState();

const mockStationList = {
    linestart: {
        parents: [],
        children: ['test'],
        branch: { left: [], right: [] },
    },
    test: {
        parents: ['linestart'],
        children: ['lineend'],
        branch: { left: [], right: [] },
    },
    lineend: {
        parents: ['test'],
        children: [],
        branch: { left: [], right: [] },
    },
} as any as StationDict;

describe('Unit tests for helper actions', () => {
    it('Can initial helpers as expected', () => {
        const mockStore = configureStore<RootState>([thunk])({
            ...realStore,
            param: { ...realStore.param, stn_list: mockStationList },
        });
        mockStore.dispatch(triggerHelpersUpdate() as any);

        const actions = mockStore.getActions();
        expect(actions).toHaveLength(4);
        expect(actions.find(action => action.type === SET_DEPS_STR)).toBeDefined();
        expect(actions.find(action => action.type === SET_ROUTES)).toBeDefined();
        expect(actions.find(action => action.type === SET_BRANCHES)).toBeDefined();
        expect(actions.find(action => action.type === SET_TPO)).toBeDefined();
    });
});
