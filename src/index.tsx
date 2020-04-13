import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import './i18n';
import App from './App';
import { updateParam } from './utils';
import * as serviceWorker from './serviceWorker';

declare global {
    interface Window {
        gtag: any;
    }
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

// load empty stylesheet elements
document.head.append(
    ...['share', 'destination', 'runin', 'railmap'].map(tag => {
        let link = document.createElement('link');
        link.rel = 'stylesheet';
        link.id = 'css_' + tag;
        return link;
    })
);

const renderApp = () => {
    ReactDOM.render(
        // <React.Suspense fallback="loading">
        <App />,
        // </React.Suspense>,
        document.querySelectorAll('div#root')[0]
    );
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
