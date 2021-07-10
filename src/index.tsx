import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import './i18n';
import App from './App';
import { updateParam } from './utils';
import * as serviceWorker from './serviceWorker';

import { AllCanvas, CanvasType } from './constants/constants';
import StorageService from './util/storage/storageService';
import getRmgStorage from './util/storage';
import store from './redux';
import { Provider } from 'react-redux';
import { setCanvasScale, setCanvasToShow } from './redux/app/action';

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
    ReactDOM.render(
        // <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>,
        // </React.StrictMode>,
        document.getElementById('root')
    );
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
        // style being setup in SVG's router

        // setup canvas scale
        try {
            const canvasScaleString = await window.rmgStorage.readFile('rmgScale');
            const canvasScale = Number(canvasScaleString);
            canvasScale >= 0.1 && store.dispatch(setCanvasScale(canvasScale));
        } catch (err) {
            console.warn('Error in reading rmgScale file', err);
            console.log('Initiating rmgScale as 1');
            await window.rmgStorage.writeFile('rmgScale', '1');
            store.dispatch(setCanvasScale(1));
        }
        
        // setup canvas to show
        try {
            const canvasToShow = await window.rmgStorage.readFile('rmgCanvas') as CanvasType | typeof AllCanvas;
            store.dispatch(setCanvasToShow(canvasToShow));
        } catch(err) {
            console.warn('Error in reading rmgCanvas file', err);
            console.log('Initiating rmgCanvas as "all"');
            await window.rmgStorage.writeFile('rmgCanvas', AllCanvas);
            store.dispatch(setCanvasToShow(AllCanvas));
        }

        window.rmgStore = store;
    })
    .then(() => {
        renderApp();
    });
