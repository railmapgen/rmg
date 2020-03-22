import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import './i18n';
import App from './App';
import { updateParam } from './utils';
import * as serviceWorker from './serviceWorker';

declare global {
    interface Window {
        urlParams: URLSearchParams;
        gtag: any;
    }
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

switch (window.urlParams.get('style')) {
    case 'mtr':
    case 'gzmtr':
    case 'shmetro':
        break;
    default:
        window.urlParams.set('style', 'mtr');
}
window.history.pushState({ url: window.location.href }, '', '?' + window.urlParams.toString());

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
        link.href = process.env.PUBLIC_URL + `/styles/${tag}_${window.urlParams.get('style')}.css`;
        link.id = `css_${tag}`;
        return link;
    })
);

const renderApp = () => {
    ReactDOM.render(<App canvas={canvasAvailable} />, document.querySelectorAll('div#root')[0]);
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
    import('./panels/save/template-diag/templates/basic/blank')
        .then(module => {
            localStorage.setItem('rmgParam', JSON.stringify(module.default));
            updateParam();
        })
        .then(() => renderApp());
}
