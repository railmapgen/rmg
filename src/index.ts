import * as initSave from './PageInitialiser/save';
import * as $ from 'jquery';
import { RMGLine } from './Line/Line';
import initLine from './Line/init';
import initPanels from './PageInitialiser/init';

declare global {
    interface Window {
        myLine?: RMGLine;
    }
}

window.urlParams = new URLSearchParams(window.location.search);
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

switch (window.urlParams.get('style')) {
    case 'mtr':
    case 'gzmtr':
    case 'shmetro':
        break;
    default: window.urlParams.set('style', 'mtr');
}
history.pushState({url:window.location.href}, null, '?' + window.urlParams.toString());

window.myLine = null;
$(`[${window.urlParams.get('style')}-specific]`).show();
// autoInit();
initSave.common();

initLine();
initPanels();