import rootReducer from '../index';
import { createMockAppStore } from '../../setupTests';
import { SET_CANVAS_TO_SHOW } from '../app/action';
import { reRenderApp } from '../../index';

jest.mock('../../index', () => ({
    reRenderApp: jest.fn(),
}));

const realStore = rootReducer.getState();
const mockStore = createMockAppStore(realStore);

// TODO: add unit test
describe('Unit tests for OpenNewAction', () => {
    it('Dummy test', () => {
        expect(1+1).toBe(2)
        // // save uploaded param and canvas to show to local storage
        // expect(window.rmgStorage.writeFile).toBeCalledTimes(2);
        // expect(window.rmgStorage.writeFile).toBeCalledWith('rmgParam', expect.any(String));
        // expect(window.rmgStorage.writeFile).toBeCalledWith('rmgCanvas', expect.any(String));
        //
        // // reset canvas in redux
        // const actions = mockStore.getActions();
        // expect(actions).toContainEqual(expect.objectContaining({ type: SET_CANVAS_TO_SHOW }));
        //
        // // rerender app
        // expect(reRenderApp).toBeCalledTimes(1);
    })
})