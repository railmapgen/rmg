import { LanguageCode, PaletteEntry } from '../constants';

/**
 * Wikipedia: https://en.wikipedia.org/wiki/Baku_Metro
 * Offical website: http://www.metro.gov.az/en/about/downloads
*/
const Baku: PaletteEntry[] = [
    {
        id: 'red',
        name: {
            [LanguageCode.English]: 'Red Line',
            [LanguageCode.Azerbaijani]: 'Qırmızı xətt',
            [LanguageCode.ChineseSimp]: '红线',
            [LanguageCode.ChineseTrad]: '紅線',
        },
        colour: '#EE1D23',
    },
    {
        id: 'yellow',
        name: {
            [LanguageCode.English]: 'Yellow Line',
            [LanguageCode.Azerbaijani]: 'Sarı xətt',
            [LanguageCode.ChineseSimp]: '黄线',
            [LanguageCode.ChineseTrad]: '黃線',
        },
        colour: '#FAED00',
    },
    {
        id: 'blue',
        name: {
            [LanguageCode.English]: 'Blue Line',
            [LanguageCode.Azerbaijani]: 'Mavi xətt',
            [LanguageCode.ChineseSimp]: '蓝线',
            [LanguageCode.ChineseTrad]: '藍線',
        },
        colour: '#2487C0',
    },
    {
        id: 'purple',
        name: {
            [LanguageCode.English]: 'Purple Line',
            [LanguageCode.Azerbaijani]: 'Bənövşəyi xətt',
            [LanguageCode.ChineseSimp]: '紫线',
            [LanguageCode.ChineseTrad]: '紫線',
        },
        colour: '#8E187E',
    },
    {
        id: 'green',
        name: {
            [LanguageCode.English]: 'Green Line',
            [LanguageCode.Azerbaijani]: 'Yaşıl xətt',
            [LanguageCode.ChineseSimp]: '绿线',
            [LanguageCode.ChineseTrad]: '綠線',
        },
        colour: '#00AB5D',
    },
    {
        id: 'greensep',
        name: {
            [LanguageCode.English]: 'Separated part of Green line',
            [LanguageCode.Azerbaijani]: 'Yaşıl xəttin ayrılmış hissəsi',
            [LanguageCode.ChineseSimp]: '绿线分离线',
            [LanguageCode.ChineseTrad]: '綠線分離線',
        },
        colour: '#9BCA3B',
    },
];

export default Baku;
