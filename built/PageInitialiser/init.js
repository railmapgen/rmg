import * as initLayout from './layout.js';
import * as initDesign from './design.js';
import * as initStations from './stations.js';
import * as initInfo from './info.js';
let firstInit = [false, true, true, true, true];
$('#panels .mdc-tab-bar')[0].MDCTabBar.listen('MDCTabBar:activated', event => {
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
        $('#panel_layout .mdc-slider').each((_, el) => el.MDCSlider.layout());
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
        initStations.common();
        firstInit[3] = false;
    }
    if (event.detail.index == 4 && firstInit[4]) {
        initInfo.common();
        firstInit[4] = false;
    }
});
