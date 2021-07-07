import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import './i18n';
import App from './App';
import { updateParam } from './utils';
import * as serviceWorker from './serviceWorker';

import { ProvidedCanvases } from './constants/constants';
import StorageService from './util/storage/storageService';
import getRmgStorage from './util/storage';

declare global {
    interface Window {
        gtag: any;
        rmgStorage: StorageService;
    }
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

// load empty stylesheet elements
document.head.append(
    ...['share', ...ProvidedCanvases].map(tag => {
        let link = document.createElement('link');
        link.rel = 'stylesheet';
        link.id = 'css_' + tag;
        return link;
    })
);

const renderApp = () => {
    ReactDOM.render(
        // <React.StrictMode>
        <App />,
        // </React.StrictMode>,
        document.getElementById('root')
    );
};

getRmgStorage().then(rmgStorage => {
    rmgStorage.init().then(async () => {
        try {
            const contents = await rmgStorage.readFile('rmgParam');

            const updatedParam = updateParam(JSON.parse(contents));
            await rmgStorage.writeFile('rmgParam', JSON.stringify(updatedParam));
        } catch (err) {
            console.warn(err);
            const module = await import('./constants/templates/basic/blank');
            const updatedParam = updateParam(module.default);
            await rmgStorage.writeFile('rmgParam', JSON.stringify(updatedParam));
        } finally {
            window.rmgStorage = rmgStorage;
            renderApp();
        }
    });
});
