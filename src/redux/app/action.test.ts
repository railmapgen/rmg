import rootReducer, { RootState } from '../';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
    selectCanvas,
    SET_CANVAS_SCALE,
    SET_CANVAS_SCALE_STATUS,
    SET_CANVAS_TO_SHOW,
    SET_CANVAS_TO_SHOW_STATUS,
    SET_RMG_STYLE,
    setRmgStyle,
    zoomIn,
    zoomOut,
} from './action';
import { CanvasType, LoadingStatus, RmgStyle } from '../../constants/constants';

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

    it('Can handle select canvas correctly', async () => {
        await mockStore.dispatch(selectCanvas(CanvasType.RailMap) as any);

        expect(mockEmptyPromise).toBeCalledTimes(1);
        expect(mockEmptyPromise).toBeCalledWith('rmgCanvas', CanvasType.RailMap);

        const actions = mockStore.getActions();
        expect(actions).toHaveLength(3);
        expect(
            actions.find(
                action =>
                    action.type === SET_CANVAS_TO_SHOW_STATUS && action.canvasToShowStatus === LoadingStatus.loading
            )
        ).toBeDefined();
        expect(
            actions.find(action => action.type === SET_CANVAS_TO_SHOW && action.canvasToShow === CanvasType.RailMap)
        ).toBeDefined();
        expect(
            actions.find(
                action =>
                    action.type === SET_CANVAS_TO_SHOW_STATUS && action.canvasToShowStatus === LoadingStatus.loaded
            )
        ).toBeDefined();
    });
});
