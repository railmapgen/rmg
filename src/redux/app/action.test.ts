import rootReducer from '../';
import {
    selectCanvas,
    SET_CANVAS_SCALE,
    SET_CANVAS_SCALE_STATUS,
    SET_CANVAS_TO_SHOW,
    SET_CANVAS_TO_SHOW_STATUS,
    zoomIn,
    zoomOut,
} from './action';
import { CanvasType, LoadingStatus } from '../../constants/constants';
import { createMockAppStore } from '../../setupTests';

const realStore = rootReducer.getState();
const mockStore = createMockAppStore({ ...realStore });

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

    it('Can handle zoom in action correctly', async () => {
        const expectedZoomedInScale = 1.1;

        await mockStore.dispatch(zoomIn());

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

        await mockStore.dispatch(zoomOut());

        expect(mockEmptyPromise).toBeCalledTimes(1);
        expect(mockEmptyPromise).toBeCalledWith('rmgScale', expectedZoomedInScale.toString());

        const actions = mockStore.getActions();
        expect(actions).toHaveLength(3);
        expect(
            actions.find(action => action.type === SET_CANVAS_SCALE && action.canvasScale === expectedZoomedInScale)
        ).toBeDefined();
    });

    it('Can handle select canvas correctly', async () => {
        await mockStore.dispatch(selectCanvas(CanvasType.RailMap));

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
