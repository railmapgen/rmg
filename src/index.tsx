import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import i18n from './i18n/config';
import App from './App';
import { updateParam } from './utils';
import * as serviceWorker from './serviceWorker';

import { AllCanvas, CanvasType, RMGParam } from './constants/constants';
import StorageService from './util/storage/storageService';
import getRmgStorage from './util/storage';
import store from './redux';
import { setCanvasScale, setCanvasToShow, zoomToScale } from './redux/app/action';
import { setFullParam } from './redux/param/action';
import autoSaveScheduler from './util/auto-save-scheduler';

declare global {
    interface Window {
        gtag: any;
        rmgStorage: StorageService;
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

const renderApp = () => {
    ReactDOM.render(<App />, document.getElementById('root'));
};

export const reRenderApp = (param: RMGParam) => {
    ReactDOM.unmountComponentAtNode(document.getElementById('root')!);
    window.history.pushState({}, '', process.env.PUBLIC_URL + '/' + param.style);
    store.dispatch(setFullParam(param));
    renderApp();
};

getRmgStorage()
    .then(async rmgStorage => {
        // setup storage and param
        await rmgStorage.init();
        try {
            const contents = await rmgStorage.readFile('rmgParam');

            const updatedParam = updateParam(JSON.parse(contents));
            await rmgStorage.writeFile('rmgParam', JSON.stringify(updatedParam));
        } catch (err) {
            console.warn('Error in reading rmgParam', err);
            const module = await import('./constants/templates/basic/blank');
            const updatedParam = updateParam(module.default);
            await rmgStorage.writeFile('rmgParam', JSON.stringify(updatedParam));
        } finally {
            window.rmgStorage = rmgStorage;
        }
    })
    .then(async () => {
        // init param store with localStorage
        const contents = await window.rmgStorage.readFile('rmgParam');
        store.dispatch(setFullParam(JSON.parse(contents)));
    })
    .then(async () => {
        // style being setup in SVG's router

        // setup canvas scale
        try {
            const canvasScaleString = await window.rmgStorage.readFile('rmgScale');
            const canvasScale = Number(canvasScaleString);
            canvasScale >= 0.1 && store.dispatch(setCanvasScale(canvasScale));
        } catch (err) {
            console.warn('Error in reading rmgScale file', err);
            console.log('Initiating rmgScale as 1');
            await store.dispatch(zoomToScale(1));
        }

        // setup canvas to show
        try {
            const canvasToShow = (await window.rmgStorage.readFile('rmgCanvas')) as CanvasType | typeof AllCanvas;
            store.dispatch(setCanvasToShow(canvasToShow));
        } catch (err) {
            console.warn('Error in reading rmgCanvas file', err);
            console.log('Initiating rmgCanvas as "all"');
            await window.rmgStorage.writeFile('rmgCanvas', AllCanvas);
            store.dispatch(setCanvasToShow(AllCanvas));
        }

        window.rmgStore = store;
    })
    .then(() => {
        let config = i18n;
    })
    .then(() => {
        renderApp();
    })
    .then(() => {
        autoSaveScheduler();
    })
    .catch(err => {
        document.querySelector('#root')!.innerHTML = `<div>
            Failed to load Rail Map Generator!
            <br />
            ${err.toString()}
            <br />
            Please contact us in 
            <a href='https://github.com/railmapgen/rmg' target='_blank' rel='noreferrer'>GitHub</a>.
        </div>`;
    });
