import rootReducer, { RootState } from '../';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { SET_CANVAS_SCALE, SET_CANVAS_SCALE_STATUS, SET_RMG_STYLE, setRmgStyle, zoomIn, zoomOut } from "./action";
import { LoadingStatus, RmgStyle } from '../../constants/constants';

const realStore = rootReducer.getState();
const mockStore = configureStore<RootState>([thunk])({ ...realStore });

const windowSpy = jest.spyOn(window, 'window', 'get');

const mockEmptyPromise = jest.fn().mockResolvedValue(void 0);

describe('Tests for app actions', () => {
    beforeEach(() => {
        windowSpy.mockImplementation(
            () =>
                ({
                    rmgStorage: {
                        writeFile: mockEmptyPromise,
                    },
                } as any)
        );
    });

    afterEach(() => {
        mockStore.clearActions();
        jest.clearAllMocks();
    });

    it('Can set rmgStyle to expected style', () => {
        mockStore.dispatch(setRmgStyle(RmgStyle.GZMTR));

        const actions = mockStore.getActions();
        expect(actions).toHaveLength(1);
        expect(
            actions.find(action => action.type === SET_RMG_STYLE && action.rmgStyle === RmgStyle.GZMTR)
        ).toBeDefined();
    });

    it('Can handle zoom in action correctly', async () => {
        const expectedZoomedInScale = 1.1;

        await mockStore.dispatch(zoomIn() as any);

        expect(mockEmptyPromise).toBeCalledTimes(1);
        expect(mockEmptyPromise).toBeCalledWith('rmgScale', expectedZoomedInScale.toString());

        const actions = mockStore.getActions();
        expect(actions).toHaveLength(3);
        expect(
            actions.find(
                action => action.type === SET_CANVAS_SCALE_STATUS && action.canvasScaleStatus === LoadingStatus.loading
            )
        ).toBeDefined();
        expect(
            actions.find(action => action.type === SET_CANVAS_SCALE && action.canvasScale === expectedZoomedInScale)
        ).toBeDefined();
        expect(
            actions.find(
                action => action.type === SET_CANVAS_SCALE_STATUS && action.canvasScaleStatus === LoadingStatus.loaded
            )
        ).toBeDefined();
    });

    it('Can handle zoom out action correctly', async () => {
        const expectedZoomedInScale = 0.9;

        await mockStore.dispatch(zoomOut() as any);

        expect(mockEmptyPromise).toBeCalledTimes(1);
        expect(mockEmptyPromise).toBeCalledWith('rmgScale', expectedZoomedInScale.toString());

        const actions = mockStore.getActions();
        expect(actions).toHaveLength(3);
        expect(
            actions.find(action => action.type === SET_CANVAS_SCALE && action.canvasScale === expectedZoomedInScale)
        ).toBeDefined();
    });
});
