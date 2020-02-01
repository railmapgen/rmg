import { getParams } from '../utils.js';
export function common() {
    // mdc instances
    const [svgDestWidthTextField, svgWidthTextField] = ['#svg_dest_width', '#svg_width'].map(selector => $(selector)[0].MDCTextField);
    const [branchSpacingSlider, yPcSlider, paddingSlider] = ['#branch_spacing', '#y_pc', '#padding'].map(selector => $(selector)[0].MDCSlider);
    // init values
    Promise.resolve(getParams())
        .then(param => {
        svgDestWidthTextField.value = param.svg_dest_width;
        svgWidthTextField.value = param.svg_width;
        yPcSlider.value = param.y_pc;
        branchSpacingSlider.value = param.branch_spacing;
        paddingSlider.value = param.padding;
    });
    // add event listeners
    $(svgDestWidthTextField.root_).find('input')
        .on('input', event => window.myLine.svgDestWidth = Number(event.target.value));
    $(svgWidthTextField.root_).find('input')
        .on('input', event => window.myLine.svgWidth = Number(event.target.value));
    branchSpacingSlider.listen('MDCSlider:input', event => {
        window.myLine.branchSpacing = event.target.MDCSlider.value;
    });
    yPcSlider.listen('MDCSlider:input', event => {
        window.myLine.yPc = Number(event.target.MDCSlider.value);
    });
    paddingSlider.listen('MDCSlider:input', event => {
        window.myLine.padding = event.target.MDCSlider.value;
    });
}
export function gzmtr() {
    // mdc instances
    const [directionGZXSlider, directionGZYSlider] = ['#direction_gz_x', '#direction_gz_y']
        .map(selector => $(selector)[0].MDCSlider);
    // init values
    Promise.resolve(getParams())
        .then(param => {
        directionGZXSlider.value = param.direction_gz_x;
        directionGZYSlider.value = param.direction_gz_y;
    });
    // add event listeners
    directionGZXSlider.listen('MDCSlider:input', event => {
        window.myLine.directionGZX = Number(event.target.MDCSlider.value);
    });
    directionGZYSlider.listen('MDCSlider:input', event => {
        window.myLine.directionGZY = Number(event.target.MDCSlider.value);
    });
}
