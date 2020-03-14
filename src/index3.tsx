import * as $ from 'jquery';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import { updateParam } from './utils';

declare global {
    interface Window {
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
    default:
        window.urlParams.set('style', 'mtr');
}
history.pushState({ url: window.location.href }, null, '?' + window.urlParams.toString());

// load stylesheets on demand
$('head').append(
    ...['share', 'destination', 'runin', 'railmap'].map(tag => {
        return $('<link>', {
            rel: 'stylesheet',
            href: `styles/${tag}_${window.urlParams.get('style')}.css`,
            id: `css_${tag}`,
        });
    })
);

if (localStorage.rmgParam) {
    try {
        updateParam();
    } catch (err) {
        alert(err + 'Something error! Please start from a new canvas. ');
        console.error(err);
    }
    ReactDOM.render(<App />, $('#app')[0]);
} else {
    fetch('templates/blank.json')
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('rmgParam', JSON.stringify(data));
            updateParam();
        })
        .then(() => ReactDOM.render(<App />, $('#app')[0]));
}
