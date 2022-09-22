import 'core-js/actual';
import rmgRuntime from '@railmapgen/rmg-runtime';
import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import './index.css';
import './i18n/config';
import App from './App';
import { updateParam } from './utils';
import * as serviceWorker from './serviceWorker';
import { AllCanvas, CanvasType, RMGParam, RmgStyle } from './constants/constants';
import store from './redux';
import { setCanvasScale, setCanvasToShow, zoomToScale } from './redux/app/app-slice';
import { setFullParam } from './redux/param/action';
import { initParam } from './redux/param/util';
import { LanguageCode } from '@railmapgen/rmg-translate';

declare global {
    interface Window {
        gtag: any;
        rmgStore: any;
    }
}

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
        try {
            const contents = window.localStorage.getItem('rmgParam');
            if (contents) {
                const updatedParam = updateParam(JSON.parse(contents));
                window.localStorage.setItem('rmgParam', JSON.stringify(updatedParam));
                store.dispatch(setFullParam(updatedParam as RMGParam));
            } else {
                throw new Error('rmgParam does not exist in localStorage');
            }
        } catch (err) {
            console.warn('Error in reading rmgParam', err);

            const param = initParam(RmgStyle.MTR, LanguageCode.ChineseTrad);
            window.localStorage.setItem('rmgParam', JSON.stringify(param));
            store.dispatch(setFullParam(param));
        }
    })
    .then(async () => {
        // style being setup in SVG's router

        // setup canvas scale
        try {
            const canvasScaleString = window.localStorage.getItem('rmgScale');
            const canvasScale = Number(canvasScaleString);
            canvasScale >= 0.1 && store.dispatch(setCanvasScale(canvasScale));
        } catch (err) {
            console.warn('Error in reading rmgScale file', err);
            console.log('Initiating rmgScale as 1');
            await store.dispatch(zoomToScale(1));
        }

        // setup canvas to show
        try {
            const canvasToShow = window.localStorage.getItem('rmgCanvas') as CanvasType | typeof AllCanvas;
            store.dispatch(setCanvasToShow(canvasToShow ?? AllCanvas));
        } catch (err) {
            console.warn('Error in reading rmgCanvas file', err);
            console.log('Initiating rmgCanvas as "all"');
            window.localStorage.setItem('rmgCanvas', AllCanvas);
            store.dispatch(setCanvasToShow(AllCanvas));
        }

        window.rmgStore = store;
    })
    .then(() => {
        renderApp();
        rmgRuntime.injectCss();
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
