import { LanguageCode, PaletteEntry } from '../constants';

const Dongguan: PaletteEntry[] = [
    {
        id: 'r1',
        name: {
            [LanguageCode.English]: 'Line 1',
            [LanguageCode.ChineseSimp]: '1号线',
            [LanguageCode.ChineseTrad]: '1號線',
        },
        colour: '#034EA2',
    },
    {
        id: 'r2',
        name: {
            [LanguageCode.English]: 'Line 2',
            [LanguageCode.ChineseSimp]: '2号线',
            [LanguageCode.ChineseTrad]: '2號線',
        },
        colour: '#ED1C24',
    },
    {
        id: 'r3',
        name: {
            [LanguageCode.English]: 'Line 3',
            [LanguageCode.ChineseSimp]: '3号线',
            [LanguageCode.ChineseTrad]: '3號線',
        },
        colour: '#FAA61A',
    },
    {
        id: 'r4',
        name: {
            [LanguageCode.English]: 'Line 4',
            [LanguageCode.ChineseSimp]: '4号线',
            [LanguageCode.ChineseTrad]: '4號線',
        },
        colour: '#00AB4E',
    },
];

export default Dongguan;
