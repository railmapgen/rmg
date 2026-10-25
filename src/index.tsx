// 浏览器应用入口：初始化宿主运行时、Redux 和国际化后挂载 React 根节点。
import './index.css';
import rmgRuntime from '@railmapgen/rmg-runtime';
import { createRoot, Root } from 'react-dom/client';
import i18n from './i18n/config';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { CanvasType, Events } from './constants/constants';
import store from './redux';
import { initStore } from './redux/init';
import { StrictMode } from 'react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';

// 若需启用离线缓存，可将下方的 unregister() 改为 register()，但需注意缓存更新行为。
// Service Worker 说明：https://bit.ly/CRA-PWA
serviceWorker.unregister();

// 预创建空样式表元素，供画布按需加载共享样式
document.head.append(
    ...['share', ...Object.values(CanvasType)].map(tag => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.id = 'css_' + tag;
        return link;
    })
);

let root: Root;

const renderApp = () => {
    root = createRoot(document.getElementById('root') as HTMLDivElement);
    root.render(
        <StrictMode>
            <Provider store={store}>
                <I18nextProvider i18n={i18n}>
                    <App />
                </I18nextProvider>
            </Provider>
        </StrictMode>
    );
};

rmgRuntime
    .ready()
    .then(() => {
        initStore(store);
        renderApp();
        rmgRuntime.injectUITools();
        rmgRuntime.event(Events.APP_LOAD, { isStandaloneWindow: rmgRuntime.isStandaloneWindow });
    })
    .catch(err => {
        const root = document.querySelector('#root');
        if (root) {
            root.innerHTML = `<div>
                Failed to load Rail Map Generator!
                <br />
                ${err.toString()}
                <br />
                Please contact us in 
                <a href="https://github.com/railmapgen/rmg" target="_blank" rel="noreferrer">GitHub</a>.
            </div>`;
        }
    });
