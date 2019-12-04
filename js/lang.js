'use strict';

function translate(lang) {
    $.getJSON(`lang/${lang}.json`, data => {
        $('[trans-tag]').each((_,val) => {
            var transStr = data[$(val).attr('trans-tag')];
            $(val).text(transStr);
        });
    });
}

translate(urlParams.get('lang'));