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
        break;
    default: window.urlParams.set('style', 'mtr');
}
history.pushState({url:window.location.href}, null, '?' + window.urlParams.toString());