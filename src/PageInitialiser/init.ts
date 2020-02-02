import * as initLayout from './layout';
import * as initDesign from './design';
import * as initStations from './stations';
import * as initInfo from './info';
import { MDCTabBar } from '@material/tab-bar';
import { MDCSlider } from '@material/slider';

export default function () {
    
let firstInit = [false, true, true, true, true];

MDCTabBar.attachTo($('#panels .mdc-tab-bar')[0]).listen('MDCTabBar:activated', (event: any) => {
    $('.panel--active').removeClass('panel--active');
    $('.panel').eq(event.detail.index).addClass('panel--active');

    if (event.detail.index == 1 && firstInit[1]) {
        initLayout.common();
        if (window.urlParams.get('style') === 'gzmtr') {
            initLayout.gzmtr();
        }
        firstInit[1] = false;
    }
    if (event.detail.index === 1) {
        $('#panel_layout .mdc-slider').each((_,el) => MDCSlider.attachTo(el).layout());
    }
    if (event.detail.index == 2 && firstInit[2]) {
        initDesign.common();
        switch (window.urlParams.get('style')) {
            case 'mtr':
                initDesign.mtr();
                break;
            case 'gzmtr':
                initDesign.gzmtr();
                break;
        }
        firstInit[2] = false;
    }
    if (event.detail.index == 3 && firstInit[3]) {
        console.log('init again');
        initStations.common();
        firstInit[3] = false;
    }
    if (event.detail.index == 4 && firstInit[4]) {
        initInfo.common();
        firstInit[4] = false;
    }
});

}

