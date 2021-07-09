import { LanguageCode, MonoColour, PaletteEntry } from '../constants';

const Toronto: PaletteEntry[] = [
    {
        id: 'l1',
        name: {
            [LanguageCode.English]: 'Line 1 Yonge-University',
            [LanguageCode.ChineseTrad]: '1號央街-大學線',
        },
        colour: '#F8C300',
        fg: MonoColour.black,
    },
    {
        id: 'l2',
        name: {
            [LanguageCode.English]: 'Line 2 Bloor-Danforth',
        },
        colour: '#00923F',
    },
    {
        id: 'l3',
        name: {
            [LanguageCode.English]: 'Line 3 Scarborough',
            [LanguageCode.ChineseTrad]: '3號士嘉堡輕鐵',
        },
        colour: '#0082C9',
    },
    {
        id: 'l4',
        name: {
            [LanguageCode.English]: 'Line 4 Sheppard',
            [LanguageCode.ChineseTrad]: '4號雪柏線',
        },
        colour: '#A21A68',
    },
    {
        id: 'l5',
        name: {
            [LanguageCode.English]: 'Line 5 Eglinton',
            [LanguageCode.ChineseTrad]: '5號艾靈頓輕鐵',
        },
        colour: '#E77817',
    },
    {
        id: 'selrt',
        name: {
            [LanguageCode.English]: 'Sheppard East Rapid Transit Line',
        },
        colour: '#969594',
    },
    {
        id: 'l6',
        name: {
            [LanguageCode.English]: 'Line 6 Finch West',
        },
        colour: '#8BCA98',
    },
    {
        id: 'ttc',
        name: {
            [LanguageCode.English]: 'Surface Routes',
        },
        colour: '#DA251D',
    },
];

export default Toronto;
