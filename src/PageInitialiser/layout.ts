import { getParams } from '../utils.js';
import { RMGLineGZ } from '../Line/LineGZ.js';

export function common() {
    Promise.resolve(getParams())
        .then(param => {
            $('#svg_dest_width')[0].MDCTextField.value = param.svg_dest_width;
            $('#svg_width')[0].MDCTextField.value = param.svg_width;
            $('#y_pc')[0].MDCSlider.value = param.y_pc;
            $('#branch_spacing')[0].MDCSlider.value = param.branch_spacing;
            $('#padding')[0].MDCSlider.value = param.padding;
        });

    $('#svg_dest_width > input').on('input', event => {
        window.myLine.svgDestWidth = Number(event.target.value);
    });

    $('#svg_width > input').on('input', event => {
        window.myLine.svgWidth = Number(event.target.value);
    });

    $('#branch_spacing')[0].MDCSlider.listen('MDCSlider:input', event => {
        window.myLine.branchSpacing = event.target.MDCSlider.value;
    });

    $('#y_pc')[0].MDCSlider.listen('MDCSlider:input', event => {
        window.myLine.yPc = Number(event.target.MDCSlider.value);
    });

    $('#padding')[0].MDCSlider.listen('MDCSlider:input', event => {
        window.myLine.padding = event.target.MDCSlider.value;
    });    
}

export function gzmtr() {
    Promise.resolve(getParams())
        .then(param => {
            $('#direction_gz_x')[0].MDCSlider.value = param.direction_gz_x;
            $('#direction_gz_y')[0].MDCSlider.value = param.direction_gz_y;
        });
    
    $('#direction_gz_x')[0].MDCSlider.listen('MDCSlider:input', event => {
        (<RMGLineGZ>window.myLine).directionGZX = Number(event.target.MDCSlider.value);
    });

    $('#direction_gz_y')[0].MDCSlider.listen('MDCSlider:input', event => {
        (<RMGLineGZ>window.myLine).directionGZY = Number(event.target.MDCSlider.value);
    });
}