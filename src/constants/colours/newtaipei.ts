import { LanguageCode, PaletteEntry } from '../constants';

const NewTaipei: PaletteEntry[] = [
    {
        id: 'lb',
        name: {
            [LanguageCode.English]: 'Sanying Line',
            [LanguageCode.ChineseSimp]: '三莺线',
            [LanguageCode.ChineseTrad]: '三鶯線',
        },
        colour: '#79bce8',
    },
    {
        id: 'v',
        name: {
            [LanguageCode.English]: 'Danhai LRT/Bali LRT (V)',
            [LanguageCode.ChineseSimp]: '淡海轻轨/八里轻轨',
            [LanguageCode.ChineseTrad]: '淡海輕軌/八里輕軌',
        },
        colour: '#e5554f',
    },
    {
        id: 'k',
        name: {
            [LanguageCode.English]: 'Ankeng LRT',
            [LanguageCode.ChineseSimp]: '安坑轻轨',
            [LanguageCode.ChineseTrad]: '安坑輕軌',
        },
        colour: '#c3b091',
    },
    {
        id: 's',
        name: {
            [LanguageCode.English]: 'Shenkeng LRT',
            [LanguageCode.ChineseSimp]: '深坑轻轨',
            [LanguageCode.ChineseTrad]: '深坑輕軌',
        },
        colour: '#cc7722',
    },
    {
        id: 'f',
        name: {
            [LanguageCode.English]: 'Wugu-Taishan LRT',
            [LanguageCode.ChineseSimp]: '五股泰山轻轨',
            [LanguageCode.ChineseTrad]: '五股泰山輕軌',
        },
        colour: '#e5007f',
    },
    {
        id: 'p',
        name: {
            [LanguageCode.English]: 'Taishan-Banqiao LRT',
            [LanguageCode.ChineseSimp]: '泰山板桥轻轨',
            [LanguageCode.ChineseTrad]: '泰山板橋輕軌',
        },
        colour: '#f6c2d8',
    },
];

export default NewTaipei;
