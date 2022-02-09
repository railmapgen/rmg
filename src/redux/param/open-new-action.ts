import { AppDispatch, RootState } from '../index';
import { updateParam } from '../../utils';
import { AllCanvas, canvasConfig, RMGParam } from '../../constants/constants';
import { selectCanvas } from '../app/action';
import { reRenderApp } from '../../index';

export const openFromNewParam = (param: Record<string, any>) => {
    return async (dispatch: AppDispatch, getState: () => RootState) => {
        const updatedParam = updateParam(param) as RMGParam;
        await window.rmgStorage.writeFile('rmgParam', JSON.stringify(updatedParam));

        // reset to AllCanvas if the current canvas is not supported in the new style
        const canvasToShow = getState().app.canvasToShow;
        const canvas = canvasConfig[updatedParam.style].some(c => c === canvasToShow) ? canvasToShow : AllCanvas;
        await dispatch(selectCanvas(canvas));
        reRenderApp(updatedParam);
    };
};
