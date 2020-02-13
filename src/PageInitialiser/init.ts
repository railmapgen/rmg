import { MDCTabBar } from '@material/tab-bar';
import { MDCSlider } from '@material/slider';

export default function () {
    
let firstInit = [false, true, true, true, true];
window.sliders = [] as MDCSlider[];

MDCTabBar.attachTo($('#panels .mdc-tab-bar')[0]).listen('MDCTabBar:activated', (event: CustomEvent) => {
    $('.panel--active').removeClass('panel--active');
    $('.panel').eq(event.detail.index).addClass('panel--active');

    if (event.detail.index == 1 && firstInit[1]) {
        import(/* webpackChunkName: "initLayout" */ './layout')
            .then(module => {
                module.common();
                if (window.urlParams.get('style') === 'gzmtr') {
                    module.gzmtr();
                }
                firstInit[1] = false;
            });
    }
    if (event.detail.index === 1) {
        window.sliders.forEach(slider => slider.layout());
    }
    if (event.detail.index == 2 && firstInit[2]) {
        import(/* webpackChunkName: "initDesign" */ './design')
            .then(module => {
                module.common();
                switch (window.urlParams.get('style')) {
                    case 'mtr':
                        module.mtr();
                        break;
                    case 'gzmtr':
                        module.gzmtr();
                        break;
                }
                firstInit[2] = false;
            });
    }
    if (event.detail.index == 3 && firstInit[3]) {
        import(/* webpackChunkName: "initStations" */ './stations')
            .then(module => {
                module.common();
                firstInit[3] = false;
            });
    }
    if (event.detail.index == 4 && firstInit[4]) {
        import(/* webpackChunkName: "initInfo" */ './info')
            .then(module => {
                module.common();
                firstInit[4] = false;
            });
    }
});

}

