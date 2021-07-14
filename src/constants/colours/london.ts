import { LanguageCode, PaletteEntry } from '../constants';

const London: PaletteEntry[] = [
    {
        id: 'bakerloo',
        name: {
            [LanguageCode.English]: 'Bakerloo Line',
            [LanguageCode.ChineseSimp]: '贝克卢线',
            'zh-HK': '必嘉老綫',
        },
        colour: '#B26300',
    },
    {
        id: 'central',
        name: {
            [LanguageCode.English]: 'Central Line',
            [LanguageCode.ChineseSimp]: '中央线',
            'zh-HK': '中央綫',
        },
        colour: '#DC241F',
    },
    {
        id: 'circle',
        name: {
            [LanguageCode.English]: 'Circle Line',
            'zh-HK': '環綫',
        },
        colour: '#FFD329',
    },
    {
        id: 'district',
        name: {
            [LanguageCode.English]: 'District Line',
        },
        colour: '#007D32',
    },
    {
        id: 'hsmithcity',
        name: {
            [LanguageCode.English]: 'Hammersmith & City Line',
            'zh-HK': '咸默史密夫及城市綫',
        },
        colour: '#F4A9BE',
    },
    {
        id: 'jubilee',
        name: {
            [LanguageCode.English]: 'Jubilee Line',
            [LanguageCode.ChineseSimp]: '银禧线',
            'zh-HK': '銀禧綫',
        },
        colour: '#A1A5A7',
    },
    {
        id: 'metropolitan',
        name: {
            [LanguageCode.English]: 'Metropolitan Line',
            [LanguageCode.ChineseSimp]: '大都会线',
            'zh-HK': '大都會綫',
        },
        colour: '#9B0058',
    },
    {
        id: 'northern',
        name: {
            [LanguageCode.English]: 'Northern Line',
        },
        colour: '#000000',
    },
    {
        id: 'piccadily',
        name: {
            [LanguageCode.English]: 'Piccadily Line',
        },
        colour: '#0019A8',
    },
    {
        id: 'victoria',
        name: {
            [LanguageCode.English]: 'Victoria Line',
            [LanguageCode.ChineseSimp]: '维多利亚线',
            'zh-HK': '維多利亞綫',
        },
        colour: '#0098D8',
    },
    {
        id: 'waterloocity',
        name: {
            [LanguageCode.English]: 'Waterloo & City Line',
            [LanguageCode.ChineseSimp]: '滑铁卢及城市线',
            'zh-HK': '窩打老及城市綫',
        },
        colour: '#93CEBA',
    },
    {
        id: 'dlr',
        name: {
            [LanguageCode.English]: 'Docklands Light Railway',
        },
        colour: '#00AFAD',
    },
    {
        id: 'elizabeth',
        name: {
            [LanguageCode.English]: 'Elizabeth Line',
            'zh-HK': '伊利沙伯綫',
        },
        colour: '#9364CC',
    },
    {
        id: 'tfl',
        name: {
            [LanguageCode.English]: 'TfL Rail',
        },
        colour: '#0019A8',
    },
    {
        id: 'overground',
        name: {
            [LanguageCode.English]: 'London Overground',
        },
        colour: '#EF7B10',
    },
    {
        id: 'trams',
        name: {
            [LanguageCode.English]: 'London Trams',
        },
        colour: '#00BD19',
    },
    {
        id: 'emirates',
        name: {
            [LanguageCode.English]: 'Emirates Air Line',
        },
        colour: '#DC241F',
    },
];

export default London;
