import { initLayoutPanel, initDesignPanel, initStationsPanel, initInfoPanel } from '../page_loader.js';
// var layoutPanelFirstInit = true;
// var designPanelFirstInit = true;
// var stationsPanelFirstInit = true;
// var testPanelFirstInit = true;
// // var branchesPanelFirstInit = true;
// var infoPanelFirstInit = true;

// declare global {
//     interface Window {
//         firstInit?: boolean[];
//     }
// }

let firstInit = [false, true, true, true, true];

$('#panels .mdc-tab-bar')[0].MDCTabBar.listen('MDCTabBar:activated', event => {
    $('.panel--active').removeClass('panel--active');
    $('.panel').eq(event.detail.index).addClass('panel--active');

    if (event.detail.index == 1 && firstInit[1]) {
        initLayoutPanel();
        firstInit[1] = false;
    }
    if (event.detail.index === 1) {
        $('#panel_layout .mdc-slider').each((_,el) => el.MDCSlider.layout());
    }
    if (event.detail.index == 2 && firstInit[2]) {
        initDesignPanel();
        firstInit[2] = false;
    }
    if (event.detail.index == 3 && firstInit[3]) {
        initStationsPanel();
        firstInit[3] = false;
    }
    if (event.detail.index == 4 && firstInit[4]) {
        initInfoPanel();
        firstInit[4] = false;
    }
});
