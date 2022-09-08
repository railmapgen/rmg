import { RootDispatch, RootState } from '../index';
import { updateParam } from '../../utils';
import { AllCanvas, canvasConfig, RMGParam, SidePanelMode } from '../../constants/constants';
import { selectCanvas, setSelectedStation, setSidePanelMode, stopLoading } from '../app/app-slice';
import { reRenderApp } from '../../index';

export const openFromNewParam = (param: Record<string, any>) => {
    return (dispatch: RootDispatch, getState: () => RootState) => {
        const updatedParam = updateParam(param) as RMGParam;
        window.localStorage.setItem('rmgParam', JSON.stringify(updatedParam));

        // close side panel, reset selection
        dispatch(setSidePanelMode(SidePanelMode.CLOSE));
        dispatch(setSelectedStation('linestart'));

        // reset to AllCanvas if the current canvas is not supported in the new style
        const canvasToShow = getState().app.canvasToShow;
        const canvas = canvasConfig[updatedParam.style].some(c => c === canvasToShow) ? canvasToShow : AllCanvas;
        dispatch(selectCanvas(canvas));
        reRenderApp(updatedParam);
        dispatch(stopLoading());
    };
};
