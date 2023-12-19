import { StationDict } from '../../constants/constants';
import helperReducer, { updateHelper } from './helper-slice';
import rootReducer from '../index';

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

describe('HelperSlice', () => {
    const initialState = { ...realStore.helper };

    it('Can initialise helpers as expected', () => {
        const nextState = helperReducer(initialState, updateHelper(mockStationList));

        expect(nextState.depsStr).not.toBe('');
        expect(nextState.branches).toEqual([['linestart', 'test', 'lineend']]);
        expect(nextState.routes).toEqual([['linestart', 'test', 'lineend']]);
        expect(nextState.tpo).toEqual(['test']);
    });
});
