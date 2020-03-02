import * as $ from 'jquery';
import { RMGLine } from './Line/Line';
import initLine from './Line/init';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
// import Notes from './SVG';

declare global {
    interface Window {
        myLine?: RMGLine;
        urlParams?: URLSearchParams;
        gtag: any;
        // test3: any;
    }
}

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
$('#toggle > span.material-icons').on('touchend', ()=> $('#toggle').toggleClass('show'));
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
initLine();

ReactDOM.render(
    <App />, 
    $('#panels')[0]
);

// ReactDOM.render(
//     <Notes />, 
//     $('g#notes')[0]
// );