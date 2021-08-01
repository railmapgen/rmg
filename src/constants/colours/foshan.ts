import { LanguageCode, PaletteEntry } from '../constants';

// https://zh.wikipedia.org/wiki/Template:%E4%BD%9B%E5%B1%B1%E5%9C%B0%E9%93%81%E9%A2%9C%E8%89%B2
const Foshan: PaletteEntry[] = [
    {
        id: 'fs1',
        name: {
            [LanguageCode.English]: 'Guangfo Line (Line 1)',
            [LanguageCode.ChineseSimp]: '广佛线（1号线）',
            [LanguageCode.ChineseTrad]: '廣佛線（1號線）',
        },
        colour: '#C4D600',
    },
    {
        id: 'fs2',
        name: {
            [LanguageCode.English]: 'Line 2',
            [LanguageCode.ChineseSimp]: '2号线',
            [LanguageCode.ChineseTrad]: '2號線',
        },
        colour: '#DD0027',
    },
    {
        id: 'fs3',
        name: {
            [LanguageCode.English]: 'Line 3',
            [LanguageCode.ChineseSimp]: '3号线',
            [LanguageCode.ChineseTrad]: '3號線',
        },
        colour: '#4747C5',
    },
    {
        id: 'fs4',
        name: {
            [LanguageCode.English]: 'Line 4',
            [LanguageCode.ChineseSimp]: '4号线',
            [LanguageCode.ChineseTrad]: '4號線',
        },
        colour: '#FF00FF',
    },
    {
        id: 'fs6',
        name: {
            [LanguageCode.English]: 'Line 6',
            [LanguageCode.ChineseSimp]: '6号线',
            [LanguageCode.ChineseTrad]: '6號線',
        },
        colour: '#FFB81D',
    },
    {
        id: 'fs9',
        name: {
            [LanguageCode.English]: 'Line 9',
            [LanguageCode.ChineseSimp]: '9号线',
            [LanguageCode.ChineseTrad]: '9號線',
        },
        colour: '#A25EB5',
    },
    {
        id: 'fs11',
        name: {
            [LanguageCode.English]: 'Line 11',
            [LanguageCode.ChineseSimp]: '11号线',
            [LanguageCode.ChineseTrad]: '11號線',
        },
        colour: '#6600CC',
    },
    {
        id: 'fs13',
        name: {
            [LanguageCode.English]: 'Line 13',
            [LanguageCode.ChineseSimp]: '13号线',
            [LanguageCode.ChineseTrad]: '13號線',
        },
        colour: '#32B7EA',
    },
];

export default Foshan;
