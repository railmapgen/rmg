import { getParams } from '../utils';
import { RMGLineGZ } from '../Line/LineGZ';
import { MDCTextField } from '@material/textfield';
import { MDCSlider } from '@material/slider';
import { RMGLine } from '../Line/Line';

declare global {
    interface Window {
        myLine?: RMGLine;
    }
}

export function common() {
    // mdc instances
    const [svgDestWidthTextField, svgWidthTextField] = 
        ['#svg_dest_width', '#svg_width'].map(selector => MDCTextField.attachTo($(selector)[0]));

    const [branchSpacingSlider, yPcSlider, paddingSlider] = 
        ['#branch_spacing', '#y_pc', '#padding'].map(selector => MDCSlider.attachTo($(selector)[0]));

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
    ($(svgDestWidthTextField.root_).find('input') as JQuery<HTMLInputElement>)
        .on('input', event => window.myLine.svgDestWidth = Number(event.target.value));

    ($(svgWidthTextField.root_).find('input') as JQuery<HTMLInputElement>)
        .on('input', event => window.myLine.svgWidth = Number(event.target.value));

    branchSpacingSlider.listen('MDCSlider:input', event => {
        window.myLine.branchSpacing = branchSpacingSlider.value;
    });

    yPcSlider.listen('MDCSlider:input', event => {
        window.myLine.yPc = Number(yPcSlider.value);
    });

    paddingSlider.listen('MDCSlider:input', event => {
        window.myLine.padding = paddingSlider.value;
    });    
}

export function gzmtr() {
    // mdc instances
    const [directionGZXSlider, directionGZYSlider] =
        ['#direction_gz_x', '#direction_gz_y']
            .map(selector => MDCSlider.attachTo($(selector)[0]));

    // init values
    Promise.resolve(getParams())
        .then(param => {
            directionGZXSlider.value = param.direction_gz_x;
            directionGZYSlider.value = param.direction_gz_y;
        });
    
    // add event listeners
    directionGZXSlider.listen('MDCSlider:input', event => {
        (<RMGLineGZ>window.myLine).directionGZX = Number(directionGZXSlider.value);
    });

    directionGZYSlider.listen('MDCSlider:input', event => {
        (<RMGLineGZ>window.myLine).directionGZY = Number(directionGZYSlider.value);
    });
}