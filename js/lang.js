'use strict';

async function translate(lang) {
    $.getJSON(`lang/${lang}.json`)
        .done(data => {
            $.getJSON('lang/en.json', dataFallback => {
                $('[trans-tag]').each((_,val) => {
                    var transStr = data[$(val).attr('trans-tag')] || dataFallback[$(val).attr('trans-tag')];
                    $(val).text(transStr);
                });
            });
        })
        .fail(
            $.getJSON('lang/en.json', dataFallback => {
                $('[trans-tag]').each((_,val) => {
                    var transStr = dataFallback[$(val).attr('trans-tag')];
                    $(val).text(transStr);
                });
            })
        );
}

const getTransJSON = async(lang) => {
    let response = await fetch(`lang/${lang}.json`);
    var d = new Date();
    console.log(lang, d.toLocaleTimeString() + ':' + d.getMilliseconds());
    return response.ok ? response.json() : {};
}

const pageLangFallback = lang => {
    if (lang !== 'en') {
        return [lang, 'en'];
    } else {
        return [lang];
    }
}

const translate1 = async(lang) => {
    var datas = pageLangFallback(lang).map(l => getTransJSON(l));
    $('[trans-tag]').each(async (idx,val) => {
        var transStr = '';
        for await (let data of datas) {
            transStr = data[$(val).attr('trans-tag')];
            if (transStr) {break;}
        }
        $(val).text(transStr);
    });
}

translate1(window.urlParams.get('lang'));
$('html').attr('lang', window.urlParams.get('lang'));