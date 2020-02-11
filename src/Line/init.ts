import { updateParam, getParams } from '../utils';
import { MDCDialog } from '@material/dialog';
import { RMGLine } from './Line';

const getLineClass = async (style: string) => {
    switch (style) {
        case 'mtr':
            return Promise.resolve(RMGLine);
        // lazy loading
        case 'gzmtr':
            return import(/* webpackChunkName: "LineGZ" */ './LineGZ')
                .then(({ RMGLineGZ }) => RMGLineGZ);
        case 'shmetro':
            return import(/* webpackChunkName: "LineSH" */ './LineSH')
                .then(({ RMGLineSH }) => RMGLineSH);
        // any other styles
    }
}

export default function () {
    
const loadLine = async (param) => {
    let lineClass = await getLineClass(window.urlParams.get('style'));
    window.myLine = await new lineClass(param);
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

