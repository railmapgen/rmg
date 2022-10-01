import 'core-js/actual';
import rmgRuntime from '@railmapgen/rmg-runtime';
import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import './index.css';
import './i18n/config';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { CanvasType, Events, RMGParam } from './constants/constants';
import store from './redux';
import { setFullParam } from './redux/param/action';
import { initStore } from './redux/init';

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

// load empty stylesheet elements
document.head.append(
    ...['share', ...Object.values(CanvasType)].map(tag => {
        let link = document.createElement('link');
        link.rel = 'stylesheet';
        link.id = 'css_' + tag;
        return link;
    })
);

let root: Root;

const renderApp = () => {
    root = createRoot(document.getElementById('root') as HTMLDivElement);
    root.render(<App />);
};

export const reRenderApp = (param: RMGParam) => {
    root.unmount();
    window.history.pushState({}, '', process.env.PUBLIC_URL + '/' + param.style);
    store.dispatch(setFullParam(param));
    renderApp();
};

rmgRuntime
    .ready()
    .then(() => {
        initStore(store);
        renderApp();
        rmgRuntime.injectCss();
        rmgRuntime.event(Events.APP_LOAD, { isStandaloneWindow: rmgRuntime.isStandaloneWindow });
    })
    .catch(err => {
        document.querySelector('#root')!.innerHTML = `<div>
            Failed to load Rail Map Generator!
            <br />
            ${err.toString()}
            <br />
            Please contact us in 
            <a href="https://github.com/railmapgen/rmg" target="_blank" rel="noreferrer">GitHub</a>.
        </div>`;
    });
