import { LanguageCode, MonoColour, PaletteEntry } from '../constants';

/**
 * https://www.osakametro.co.jp/index.php
 */
const Osaka: PaletteEntry[] = [
    {
        id: 'm',
        name: {
            [LanguageCode.English]: 'Midosuji Line (M)',
            ja: '御堂筋線',
            [LanguageCode.ChineseSimp]: '御堂筋线',
            [LanguageCode.ChineseTrad]: '御堂筋線',
        },
        colour: '#D94E41',
    },
    {
        id: 't',
        name: {
            [LanguageCode.English]: 'Tanimachi Line (T)',
            ja: '谷町線',
            [LanguageCode.ChineseSimp]: '谷町线',
            [LanguageCode.ChineseTrad]: '谷町線',
        },
        colour: '#AD37B2',
    },
    {
        id: 'y',
        name: {
            [LanguageCode.English]: 'Yotsubashi Line (Y)',
            ja: '四つ橋線',
            [LanguageCode.ChineseSimp]: '四桥线',
            [LanguageCode.ChineseTrad]: '四橋線',
        },
        colour: '#387DCE',
    },
    {
        id: 'c',
        name: {
            [LanguageCode.English]: 'Chuo Line (C)',
            ja: '中央線',
            [LanguageCode.ChineseSimp]: '中央线',
            [LanguageCode.ChineseTrad]: '中央線',
        },
        colour: '#00AC5A',
    },
    {
        id: 's',
        name: {
            [LanguageCode.English]: 'Sennichimae Line (S)',
            ja: '千日前線',
            [LanguageCode.ChineseSimp]: '千日前线',
            [LanguageCode.ChineseTrad]: '千日前線',
        },
        colour: '#F16FA8',
    },
    {
        id: 'k',
        name: {
            [LanguageCode.English]: 'Sakaisuji Line (K)',
            ja: '堺筋線',
            [LanguageCode.ChineseSimp]: '堺筋线',
            [LanguageCode.ChineseTrad]: '堺筋線',
        },
        colour: '#A25F41',
    },
    {
        id: 'n',
        name: {
            [LanguageCode.English]: 'Nagahori Tsurumi-ryokuchi Line (N)',
            ja: '長堀鶴見緑地線',
            [LanguageCode.ChineseSimp]: '长堀鹤见绿地线',
            [LanguageCode.ChineseTrad]: '長堀鶴見綠地線',
        },
        colour: '#B4D93F',
        fg: MonoColour.black,
    },
    {
        id: 'i',
        name: {
            [LanguageCode.English]: 'Imazatosuji Line (I)',
            ja: '今里筋線',
            [LanguageCode.ChineseSimp]: '今里筋线',
            [LanguageCode.ChineseTrad]: '今里筋線',
        },
        colour: '#FF972D',
        fg: MonoColour.black,
    },
    {
        id: 'p',
        name: {
            [LanguageCode.English]: 'New Tram (P)',
            ja: 'ニュートラム',
            [LanguageCode.ChineseSimp]: '新电车',
            [LanguageCode.ChineseTrad]: '新電車',
        },
        colour: '#00B2DB',
    },
    {
        id: 'brt1',
        name: {
            [LanguageCode.English]: 'BRT 1',
            ja: '長居ルート（BRT 1）',
        },
        colour: '#F39800',
    },
    {
        id: 'brt2',
        name: {
            [LanguageCode.English]: 'BRT 2',
            ja: 'あべの橋ルート（BRT 2）',
        },
        colour: '#EA5514',
    },
];

export default Osaka;
