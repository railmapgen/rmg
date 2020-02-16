import * as initSave from './PageInitialiser/save';
import * as $ from 'jquery';
import { RMGLine } from './Line/Line';
import initLine from './Line/init';
import initPanels from './PageInitialiser/init';
import { getParams } from './utils';

declare global {
    interface Window {
        myLine?: RMGLine;
        urlParams?: URLSearchParams;
        gtag: any;
    }
}

var requestLang = window.urlParams.get('lang') || localStorage.rmgLang || navigator.language.split('-').slice(0,2).join('-');
switch (requestLang.toLowerCase()) {
    case 'zh-cn':
    case 'zh-hans':
        window.urlParams.set('lang', 'zh-Hans');
        break;
    case 'zh':
    case 'zh-hk':
    case 'zh-tw':
        window.urlParams.set('lang', 'zh-HK');
        break;
    default: window.urlParams.set('lang', 'en');
}
// window.gtag('event', 'load', {
//     event_category: 'language', 
//     event_label: window.urlParams.get('lang'), 
//     non_interaction: true
// });

switch (window.urlParams.get('style')) {
    case 'mtr':
    case 'gzmtr':
    case 'shmetro':
        break;
    default: window.urlParams.set('style', 'mtr');
}
history.pushState({url:window.location.href}, null, '?' + window.urlParams.toString());

// load stylesheets on demand
$('head').append(
    ...['share', 'destination', 'railmap']
        .map(tag => {
            return $('<link>', {
                rel: 'stylesheet', 
                href: `styles/${tag}_${window.urlParams.get('style')}.css`, 
                id: `css_${tag}`
            })
        })
);

window.myLine = null;
$(`[${window.urlParams.get('style')}-specific]`).show();
// autoInit();
initSave.common();

initLine();
initPanels();