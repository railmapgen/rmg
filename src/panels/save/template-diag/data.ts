export const companies: { id: string; name: { [lang: string]: string } }[] = [
    {
        id: 'basic',
        name: {
            en: 'Basic',
            zh: '基本',
        },
    },
    {
        id: 'gzmtr',
        name: {
            en: 'Guangzhou Metro',
            'zh-Hans': '广州地铁',
            'zh-Hant': '廣州地鐵',
        },
    },
    {
        id: 'mlm',
        name: {
            en: 'Macao LRT',
            pt: 'Metro Ligeiro de Macau',
            'zh-Hans': '澳门轻轨',
            'zh-Hant': '澳門輕軌',
        },
    },
    {
        id: 'mtr',
        name: {
            en: 'MTR',
            'zh-Hans': '港铁',
            'zh-Hant': '港鐵',
        },
    },
];

export const templateList: { [comp: string]: { filename: string; desc: { [lang: string]: string } }[] } = {
    basic: [
        {
            filename: 'blank',
            desc: {
                en: 'Blank',
                zh: '空白',
            },
        },
        {
            filename: 'default',
            desc: {
                en: 'Default',
                'zh-Hans': '默认',
                'zh-Hant': '預設',
            },
        },
    ],

    gzmtr: [
        {
            filename: 'gz1',
            desc: {
                en: 'Line 1',
                'zh-Hans': '1号线',
                'zh-Hant': '1號線',
            },
        },
        {
            filename: 'gz2',
            desc: {
                en: 'Line 2',
                'zh-Hans': '2号线',
                'zh-Hant': '2號線',
            },
        },
        {
            filename: 'gz3',
            desc: {
                en: 'Line 3',
                'zh-Hans': '3号线',
                'zh-Hant': '3號線',
            },
        },
        {
            filename: 'gz4',
            desc: {
                en: 'Line 4',
                'zh-Hans': '4号线',
                'zh-Hant': '4號線',
            },
        },
        {
            filename: 'gz5',
            desc: {
                en: 'Line 5',
                'zh-Hans': '5号线',
                'zh-Hant': '5號線',
            },
        },
        {
            filename: 'gz6',
            desc: {
                en: 'Line 6',
                'zh-Hans': '6号线',
                'zh-Hant': '6號線',
            },
        },
        {
            filename: 'gz7',
            desc: {
                en: 'Line 7',
                'zh-Hans': '7号线',
                'zh-Hant': '7號線',
            },
        },
        {
            filename: 'gz8',
            desc: {
                en: 'Line 8',
                'zh-Hans': '8号线',
                'zh-Hant': '8號線',
            },
        },
        {
            filename: 'gz9',
            desc: {
                en: 'Line 9',
                'zh-Hans': '9号线',
                'zh-Hant': '9號線',
            },
        },
        {
            filename: 'gz14',
            desc: {
                en: 'Line 14',
                'zh-Hans': '14号线',
                'zh-Hant': '14號線',
            },
        },
        {
            filename: 'gz21',
            desc: {
                en: 'Line 21',
                'zh-Hans': '21号线',
                'zh-Hant': '21號線',
            },
        },
        {
            filename: 'gf',
            desc: {
                en: 'Guangfo Line',
                'zh-Hans': '广佛线',
                'zh-Hant': '廣佛線',
            },
        },
    ],

    mlm: [
        {
            filename: 'taipa',
            desc: {
                en: 'Taipa Line',
                pt: 'Linha Taipa',
                'zh-Hans': '氹仔线',
                'zh-Hant': '氹仔線',
            },
        },
    ],

    mtr: [
        {
            filename: 'twl',
            desc: {
                en: 'Tsuen Wan Line',
                'zh-Hans': '荃湾线',
                'zh-Hant': '荃灣綫',
            },
        },
        {
            filename: 'ktl',
            desc: {
                en: 'Kwun Tong Line',
                'zh-Hans': '观塘线',
                'zh-Hant': '觀塘綫',
            },
        },
        {
            filename: 'isl',
            desc: {
                en: 'Island Line',
                'zh-Hans': '港岛线',
                'zh-Hant': '港島綫',
            },
        },
        {
            filename: 'tkl',
            desc: {
                en: 'Tseung Kwan O Line',
                'zh-Hans': '将军澳线',
                'zh-Hant': '將軍澳綫',
            },
        },
        {
            filename: 'sile',
            desc: {
                en: 'South Island Line',
                'zh-Hans': '南港岛线',
                'zh-Hant': '南港島綫',
            },
        },
        {
            filename: 'ael',
            desc: {
                en: 'Airport Express',
                'zh-Hans': '机场快线',
                'zh-Hant': '機場快綫',
            },
        },
        {
            filename: 'eal',
            desc: {
                en: 'East Rail Line',
                'zh-Hans': '东铁线',
                'zh-Hant': '東鐵綫',
            },
        },
        {
            filename: 'wrl',
            desc: {
                en: 'West Rail Line',
                'zh-Hans': '西铁线',
                'zh-Hant': '西鐵綫',
            },
        },
        {
            filename: 'mol',
            desc: {
                en: 'Tuen Ma Line Phase 1',
                'zh-Hans': '屯马线一期',
                'zh-Hant': '屯馬綫一期',
            },
        },
    ],
};
