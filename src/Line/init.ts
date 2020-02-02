import { updateParam, getParams } from '../utils';
import { MDCDialog } from '@material/dialog';
import { RMGLine } from './Line';
// import any other styles
import { RMGLineGZ } from './LineGZ';

// declare global {
//     interface Window {
//         myLine?: RMGLine;
//     }
// }

export default function () {
    
const loadLine = (param) => {
    let lineClass = (style => {switch (style) {
        case 'mtr':
            return RMGLine;
        case 'gzmtr':
            return RMGLineGZ;
        // any other styles
    }})(window.urlParams.get('style'));
    window.myLine = new lineClass(param);
    lineClass.initSVG(window.myLine);
}

if (localStorage.rmgParam != null) {
    try {
        updateParam();
        loadLine(getParams());
    } catch (err) {
        let initErrDiag = MDCDialog.attachTo($('#init_err_diag')[0]);
        $('#init_err_diag')
            .find('#err_stack')
            .html(err + '<br>' + err.stack.replace(/\n/g, '<br>'));
        initErrDiag.open();
        console.error(err);
    }
} else {
    $.getJSON(`templates/blank.json`, data => {
        localStorage.rmgParam = JSON.stringify(data);
        updateParam();
        loadLine(getParams());
    });
}
    
}

