import { LanguageCode, PaletteEntry } from '../constants';

/**
 * Wikipedia: https://en.wikipedia.org/wiki/Xiamen_Metro
 * Offical website: https://www.xmgdjt.com.cn/Modules/ControlHtml/MetroOperation.aspx?SelectedTitle=%E7%AB%99%E7%82%B9%E7%BA%BF%E8%B7%AF
*/
const Xiamen: PaletteEntry[] = [
    {
        id: 'xm1',
        name: {
            [LanguageCode.English]: 'Line 1',
            [LanguageCode.ChineseSimp]: '1号线',
            [LanguageCode.ChineseTrad]: '1號線',
        },
        colour: '#E27326',
    },
    {
        id: 'xm2',
        name: {
            [LanguageCode.English]: 'Line 2',
            [LanguageCode.ChineseSimp]: '2号线',
            [LanguageCode.ChineseTrad]: '2號線',
        },
        colour: '#52AB43',
    },
    {
        id: 'xm3',
        name: {
            [LanguageCode.English]: 'Line 3',
            [LanguageCode.ChineseSimp]: '3号线',
            [LanguageCode.ChineseTrad]: '3號線',
        },
        colour: '#2EC6D6',
    },
    {
        id: 'xmb',
        name: {
            [LanguageCode.English]: 'BRT',
            [LanguageCode.ChineseSimp]: '快速公交',
            [LanguageCode.ChineseTrad]: '快速公交',
        },
        colour: '#00A5A6',
    },
];

export default Xiamen;
