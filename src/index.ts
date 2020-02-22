import * as initSave from './PageInitialiser/save';
import * as $ from 'jquery';
import { RMGLine } from './Line/Line';
import initLine from './Line/init';
import initPanels from './PageInitialiser/init';

declare global {
    interface Window {
        myLine?: RMGLine;
        urlParams?: URLSearchParams;
        gtag: any;
        // test3: any;
    }
}
// window.test3 = test3;
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
    ...['share', 'destination', 'runin', 'railmap']
        .map(tag => {
            return $('<link>', {
                rel: 'stylesheet', 
                href: `styles/${tag}_${window.urlParams.get('style')}.css`, 
                id: `css_${tag}`
            })
        })
);

// load canvas switcher
$('#toggle').on('mouseover', () => $('#toggle').addClass('show'));
$('#toggle').on('mouseout', () => $('#toggle').removeClass('show'));
$('#toggle span.material-icons').on('touchend', ()=> $('#toggle').toggleClass('show'));
$('#toggle li').each((i,el) => {
    $(el).on('click', () => {
        $('#svgs').scrollLeft(0);
        if (i < 3) {
            $('#svgs > div.show').removeClass('show');
            $('#svgs > div').eq(i).addClass('show');
            $('#toggle').removeClass('show');
        } else {
            $('#svgs > div').addClass('show');
        }
    });
});

window.myLine = null;
$(`[${window.urlParams.get('style')}-specific]`).show();
// autoInit();
initSave.common();

initLine();
initPanels();