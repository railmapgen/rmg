import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-xhr-backend';

i18n
    .use(Backend)
    .use(initReactI18next)
    .init({
        fallbackLng: {
            'zh-CN': ['zh-Hans'],
            'zh-Hant': ['zh-HK'], 
            'zh-HK': ['en'],
            'zh-TW': ['zh-HK'],
            default: ['en'],
        },
        lng: window.urlParams.get('lang'),
        // debug: true,
        backend: {
            // for all available options read the backend's repository readme file
            loadPath: './locale/{{lng}}.json'
        },
    
        interpolation: {
          escapeValue: false, // not needed for react as it escapes by default
        }
    });    