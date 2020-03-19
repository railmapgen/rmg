import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import { updateParam } from './utils';
import { ProvidedCanvas } from './types';

declare global {
    interface Window {
        urlParams?: URLSearchParams;
        gtag: any;
    }
}

// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//         navigator.serviceWorker
//             .register('./service-worker.js')
//             .then(registration => {
//                 console.log('SW registered: ', registration);
//             })
//             .catch(registrationError => {
//                 console.log('SW registration failed: ', registrationError);
//             });
//     });
// }

switch (window.urlParams.get('style')) {
    case 'mtr':
    case 'gzmtr':
    case 'shmetro':
        break;
    default:
        window.urlParams.set('style', 'mtr');
}
history.pushState({ url: window.location.href }, null, '?' + window.urlParams.toString());

/**
 * @param style Style selected
 * @returns An ordered array of the provided canvases' id.
 */
const canvasAvailable = ((style): ProvidedCanvas[] => {
    switch (style) {
        case 'mtr':
            return ['destination', 'railmap'];
        case 'gzmtr':
            return ['runin', 'railmap'];
        case 'shmetro':
            return ['destination', 'runin', 'railmap'];
        default:
            return [];
    }
})(window.urlParams.get('style'));

// load stylesheets on demand
document.head.append(
    ...['share', ...canvasAvailable].map(tag => {
        let link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `styles/${tag}_${window.urlParams.get('style')}.css`;
        link.id = `css_${tag}`;
        return link;
    })
);

const renderApp = () => {
    ReactDOM.render(<App canvas={canvasAvailable} />, document.querySelectorAll('div#app')[0]);
};

if (localStorage.rmgParam) {
    try {
        updateParam();
    } catch (err) {
        alert(err + 'Something error! Please refresh to start from a new canvas. ');
        console.error(err);
        localStorage.removeItem('rmgParam');
    }
    renderApp();
} else {
    fetch('templates/blank.json')
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('rmgParam', JSON.stringify(data));
            updateParam();
        })
        .then(() => renderApp());
}
