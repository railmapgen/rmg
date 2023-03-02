import rmgRuntime from '@railmapgen/rmg-runtime';
import { initReactI18next } from 'react-i18next';
import { defaultTranslation, LanguageCode, Translation } from '@railmapgen/rmg-translate';
import enTranslation from './translations/en.json';
import zhHansTranslation from './translations/zh-Hans.json';
import zhHantTranslation from './translations/zh-Hant.json';
import koTranslation from './translations/ko.json';

const i18n = new rmgRuntime.I18nBuilder()
    .use(initReactI18next)
    .withAppName('Rail Map Generator')
    .withLng(rmgRuntime.getLanguage())
    .withDefaultResource(defaultTranslation)
    .withResource('en', enTranslation)
    .withResource('zh-Hans', zhHansTranslation)
    .withResource('zh-Hant', zhHantTranslation)
    .withResource('ko', koTranslation)
    .build();

export default i18n;

export const translateText = (translation: Translation): string => {
    return (
        i18n.languages.map(lang => translation[lang as LanguageCode]).find(name => name !== undefined) ??
        translation.en ??
        '(Translation Error)'
    );
};
