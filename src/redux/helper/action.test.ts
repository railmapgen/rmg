import rootReducer, { RootState } from '../index';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { calcTpo, SET_TPO } from './action';

const realStore = rootReducer.getState();

describe('Unit tests for helper actions', () => {
    it('Can calculate tpo for line without branches as expected', () => {
        const mockBranches = [['linestart', '1', '2', 'lineend']];
        const mockStore = configureStore<RootState>([thunk])({
            ...realStore,
            helper: { ...realStore.helper, branches: mockBranches },
        });
        mockStore.dispatch(calcTpo() as any);

        const actions = mockStore.getActions();
        expect(actions).toHaveLength(1);
        expect(actions).toContainEqual({ type: SET_TPO, tpo: ['1', '2'] });
    });

    it('Can calculate tpo for line with branches as expected', () => {
        const mockBranches = [
            ['linestart', '1', '2', 'lineend'],
            ['linestart', '3', '2'],
            ['2', '4', 'lineend'],
        ];
        const mockStore = configureStore<RootState>([thunk])({
            ...realStore,
            helper: { ...realStore.helper, branches: mockBranches },
        });
        mockStore.dispatch(calcTpo() as any);

        const actions = mockStore.getActions();
        expect(actions).toHaveLength(1);
        expect(actions).toContainEqual({ type: SET_TPO, tpo: ['1', '3', '2', '4'] });
    });
});
