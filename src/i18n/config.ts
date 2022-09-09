import rmgRuntime from '@railmapgen/rmg-runtime';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import RmgTranslate, { LanguageCode, Translation } from '@railmapgen/rmg-translate';
import enTranslation from './translations/en.json';
import zhHansTranslation from './translations/zh-Hans.json';
import zhHantTranslation from './translations/zh-Hant.json';

const resources = new RmgTranslate.Builder()
    .withResource('en', enTranslation)
    .withResource('zh-Hans', zhHansTranslation)
    .withResource('zh-Hant', zhHantTranslation)
    .build();

i18n.use(initReactI18next)
    .init({
        lng: rmgRuntime.getLanguage(),
        fallbackLng: {
            [LanguageCode.ChineseCN]: [LanguageCode.ChineseSimp, LanguageCode.English],
            [LanguageCode.ChineseHK]: [LanguageCode.ChineseTrad, LanguageCode.English],
            [LanguageCode.ChineseTW]: [LanguageCode.ChineseTrad, LanguageCode.English],

            [LanguageCode.ChineseTrad]: [LanguageCode.ChineseHK, LanguageCode.ChineseTW, LanguageCode.English],

            default: [LanguageCode.English],
        },
        resources,
    })
    .then(() => {
        document.documentElement.lang = i18n.language;
    });

export default i18n;

export const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language).then();
    document.documentElement.lang = language;
};
rmgRuntime.onLanguageChange(handleLanguageChange);

export const translateText = (translation: Translation): string => {
    return (
        i18n.languages.map(lang => translation[lang as LanguageCode]).find(name => name !== undefined) ??
        translation[LanguageCode.English] ??
        '(Translation Error)'
    );
};
