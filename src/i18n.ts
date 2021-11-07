import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n.use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: {
            'zh-CN': ['zh-Hans', 'en'],
            'zh-Hant': ['zh-HK', 'en'],
            'zh-HK': ['zh-Hant', 'en'],
            'zh-TW': ['zh-HK', 'zh-Hant'],
            default: ['en'],
        },
        // debug: true,
        backend: {
            // for all available options read the backend's repository readme file
            loadPath: process.env.PUBLIC_URL + '/locale/{{lng}}.json',
        },

        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
    })
    .then(t => {
        document.title = t('title');
        document.documentElement.setAttribute('lang', i18n.language);
    });
