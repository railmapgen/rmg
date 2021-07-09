import { LanguageCode, MonoColour, PaletteEntry } from '../constants';

/**
 * https://www.lta.gov.sg/content/ltagov/en/getting_around/public_transport/rail_network.html
 */
const Singapore: PaletteEntry[] = [
    {
        id: 'ewl',
        name: {
            [LanguageCode.English]: 'East-West Line',
            [LanguageCode.ChineseSimp]: '东西线',
            [LanguageCode.ChineseTrad]: '東西線',
        },
        colour: '#009739',
        pantone: '355-C',
    },
    {
        id: 'nsl',
        name: {
            [LanguageCode.English]: 'North-South Line',
            [LanguageCode.ChineseSimp]: '南北线',
            [LanguageCode.ChineseTrad]: '南北線',
        },
        colour: '#DA291C',
        pantone: '485-C',
    },
    {
        id: 'nel',
        name: {
            [LanguageCode.English]: 'North-East Line',
            [LanguageCode.ChineseSimp]: '东北线',
            [LanguageCode.ChineseTrad]: '東北線',
        },
        colour: '#9B26B6',
        pantone: '2592-C',
    },
    {
        id: 'ccl',
        name: {
            [LanguageCode.English]: 'Circle Line',
            [LanguageCode.ChineseSimp]: '环线',
            [LanguageCode.ChineseTrad]: '環線',
        },
        colour: '#FF9E1B',
        fg: MonoColour.black,
        pantone: '1375-C',
    },
    {
        id: 'dtl',
        name: {
            [LanguageCode.English]: 'Downtown Line',
            [LanguageCode.ChineseSimp]: '滨海市区线',
            [LanguageCode.ChineseTrad]: '濱海市區線',
        },
        colour: '#0057B7',
        pantone: '2935-C',
    },
    {
        id: 'tel',
        name: {
            [LanguageCode.English]: 'Thomson-East Coast Line',
            [LanguageCode.ChineseSimp]: '汤申-东海岸线',
            [LanguageCode.ChineseTrad]: '湯申-東海岸線',
        },
        colour: '#9B5A1A',
        pantone: '154-C',
    },
    {
        id: 'lrt',
        name: {
            [LanguageCode.English]: 'Light Rapid Transit (LRT)',
            [LanguageCode.ChineseSimp]: '轻轨',
            [LanguageCode.ChineseTrad]: '輕軌',
        },
        colour: '#708573',
        pantone: '5625-C',
    },
];

export default Singapore;
