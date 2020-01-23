declare interface Window {
    urlParams?: URLSearchParams;
}

const getTransJSON = async(lang: string) => {
    let response = await fetch(`lang/${lang}.json`);
    var d = new Date();
    console.log(lang, d.toLocaleTimeString() + ':' + d.getMilliseconds());
    return response.ok ? response.json() as {} : {};
}

const pageLangFallback = (lang: string) => {
    if (lang !== 'en') {
        return [lang, 'en'];
    } else {
        return [lang];
    }
}

const translate1 = async(lang: string) => {
    var datas = pageLangFallback(lang).map(l => getTransJSON(l));
    for (let el of $('[trans-tag')) {
        let transStr: string;
        for await (let data of datas) {
            transStr = data[$(el).attr('trans-tag')];
            if (transStr) {break;}
        }
        $(el).text(transStr);
    }
}

translate1(window.urlParams.get('lang'));
$('html').attr('lang', window.urlParams.get('lang'));