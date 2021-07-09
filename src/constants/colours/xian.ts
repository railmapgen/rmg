import { LanguageCode, PaletteEntry } from '../constants';

/**
 * Line 1-6, 9: http://www.ditiezu.com/thread-668313-1-1.html.
 * Line 14: http://www.ditiezu.com/thread-668349-1-1.html.
 * Line 8, 11: https://zh.wikipedia.org/wiki/Template:西安地铁颜色.
 */
const Xian: PaletteEntry[] = [
    {
        id: 'xa1',
        name: {
            [LanguageCode.English]: 'Line 1',
            [LanguageCode.ChineseSimp]: '1号线',
            [LanguageCode.ChineseTrad]: '1號線',
        },
        colour: '#0077C8',
    },
    {
        id: 'xa2',
        name: {
            [LanguageCode.English]: 'Line 2',
            [LanguageCode.ChineseSimp]: '2号线',
            [LanguageCode.ChineseTrad]: '2號線',
        },
        colour: '#EF3340',
    },
    {
        id: 'xa3',
        name: {
            [LanguageCode.English]: 'Line 3',
            [LanguageCode.ChineseSimp]: '3号线',
            [LanguageCode.ChineseTrad]: '3號線',
        },
        colour: '#CE70CC',
    },
    {
        id: 'xa4',
        name: {
            [LanguageCode.English]: 'Line 4',
            [LanguageCode.ChineseSimp]: '4号线',
            [LanguageCode.ChineseTrad]: '4號線',
        },
        colour: '#2CCCD3',
    },
    {
        id: 'xa5',
        name: {
            [LanguageCode.English]: 'Line 5',
            [LanguageCode.ChineseSimp]: '5号线',
            [LanguageCode.ChineseTrad]: '5號線',
        },
        colour: '#A6E35F',
    },
    {
        id: 'xa6',
        name: {
            [LanguageCode.English]: 'Line 6',
            [LanguageCode.ChineseSimp]: '6号线',
            [LanguageCode.ChineseTrad]: '6號線',
        },
        colour: '#485CC7',
    },
    {
        id: 'xa8',
        name: {
            [LanguageCode.English]: 'Line 8',
            [LanguageCode.ChineseSimp]: '8号线',
            [LanguageCode.ChineseTrad]: '8號線',
        },
        colour: '#FFE400',
    },
    {
        id: 'xa9',
        name: {
            [LanguageCode.English]: 'Line 9',
            [LanguageCode.ChineseSimp]: '9号线',
            [LanguageCode.ChineseTrad]: '9號線',
        },
        colour: '#FF9E1B',
    },
    {
        id: 'xa11',
        name: {
            [LanguageCode.English]: 'Line 11',
            [LanguageCode.ChineseSimp]: '11号线',
            [LanguageCode.ChineseTrad]: '11號線',
        },
        colour: '#006400',
    },
    {
        id: 'xa14',
        name: {
            [LanguageCode.English]: 'Airport Intercity Railway/Line 14',
            [LanguageCode.ChineseSimp]: '机场城际/14号线',
            [LanguageCode.ChineseTrad]: '機場城際/14號線',
        },
        colour: '#00C1D4',
    },
];

export default Xian;
