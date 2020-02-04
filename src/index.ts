import * as initSave from './PageInitialiser/save';
import * as $ from 'jquery';
import { RMGLine } from './Line/Line';
import initLine from './Line/init';
import initPanels from './PageInitialiser/init';

declare global {
    interface Window {
        myLine?: RMGLine;
    }
}

window.myLine = null;
$(`[${window.urlParams.get('style')}-specific]`).show();
// autoInit();
initSave.common();

initLine();
initPanels();