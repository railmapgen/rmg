import { updateParam, getParams } from '../utils';
import { MDCDialog } from '@material/dialog';
import { Pids } from '../Pids/Pids';

declare global {
    interface Window {
        myPids?: Pids;
    }
}

const getLineClass = async (style: string) => {
    switch (style) {
        case 'mtr':
            return import(/* webpackChunkName: "LineHK" */ './LineHK')
            .then(({ RMGLineHK }) => RMGLineHK);
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

    // init Pids
    window.myPids = new Pids(window.myLine);
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

