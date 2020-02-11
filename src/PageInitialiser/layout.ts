import { getParams } from '../utils';
import { RMGLineGZ } from '../Line/LineGZ';
import { MDCTextField } from '@material/textfield';
import { MDCSlider } from '@material/slider';
import { RMGLine } from '../Line/Line';
import { MDCRipple } from '@material/ripple';

declare global {
    interface Window {
        myLine?: RMGLine;
        sliders?: MDCSlider[];
    }
}

export function common() {
    // mdc instances
    const [svgDestWidthTextField, svgWidthTextField] = 
        ['#svg_dest_width', '#svg_width'].map(selector => MDCTextField.attachTo($(selector)[0]));

    const [branchSpacingSlider, yPcSlider, paddingSlider] = 
        ['#branch_spacing', '#y_pc', '#padding'].map(selector => MDCSlider.attachTo($(selector)[0]));
    window.sliders.push(branchSpacingSlider, yPcSlider, paddingSlider);
    $('#panel_layout .mdc-list li').map((_,el) => new MDCRipple(el));

    // init values
    Promise.resolve(getParams())
        .then(param => {
            svgDestWidthTextField.value = param.svg_dest_width.toString();
            svgWidthTextField.value = param.svg_width.toString();
            yPcSlider.value = param.y_pc;
            branchSpacingSlider.value = param.branch_spacing;
            paddingSlider.value = param.padding;
        });

    // add event listeners
    ($(svgDestWidthTextField.root_).find('input') as JQuery<HTMLInputElement>)
        .on('input', event => window.myLine.svgDestWidth = Number(event.target.value));

    ($(svgWidthTextField.root_).find('input') as JQuery<HTMLInputElement>)
        .on('input', event => window.myLine.svgWidth = Number(event.target.value));

    branchSpacingSlider.listen('MDCSlider:input', () => {
        window.myLine.branchSpacing = Number(branchSpacingSlider.value);
    });

    yPcSlider.listen('MDCSlider:input', () => {
        window.myLine.yPc = Number(yPcSlider.value);
    });

    paddingSlider.listen('MDCSlider:input', () => {
        window.myLine.padding = Number(paddingSlider.value);
    });    
}

export function gzmtr() {
    // mdc instances
    const [directionGZXSlider, directionGZYSlider] =
        ['#direction_gz_x', '#direction_gz_y']
            .map(selector => MDCSlider.attachTo($(selector)[0]));
    window.sliders.push(directionGZXSlider, directionGZYSlider);

    // init values
    Promise.resolve(getParams())
        .then(param => {
            directionGZXSlider.value = param.direction_gz_x;
            directionGZYSlider.value = param.direction_gz_y;
        });
    
    // add event listeners
    directionGZXSlider.listen('MDCSlider:input', () => {
        (<RMGLineGZ>window.myLine).directionGZX = Number(directionGZXSlider.value);
    });

    directionGZYSlider.listen('MDCSlider:input', () => {
        (<RMGLineGZ>window.myLine).directionGZY = Number(directionGZYSlider.value);
    });
}