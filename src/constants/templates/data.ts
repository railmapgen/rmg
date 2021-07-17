import { Translation } from '../constants';
import { CompanyCode } from '../company-config';

export const templateList: Record<CompanyCode, { filename: string; name: Translation }[]> = {
    basic: [
        {
            filename: 'blank',
            name: {
                en: 'Blank',
                zh: '空白',
            },
        },
        {
            filename: 'default',
            name: {
                en: 'Default',
                'zh-Hans': '默认',
                'zh-Hant': '預設',
            },
        },
    ],

    gzmtr: [
        {
            filename: 'gz1',
            name: {
                en: 'Line 1',
                'zh-Hans': '1号线',
                'zh-Hant': '1號線',
            },
        },
        {
            filename: 'gz2',
            name: {
                en: 'Line 2',
                'zh-Hans': '2号线',
                'zh-Hant': '2號線',
            },
        },
        {
            filename: 'gz3',
            name: {
                en: 'Line 3',
                'zh-Hans': '3号线',
                'zh-Hant': '3號線',
            },
        },
        {
            filename: 'gz4',
            name: {
                en: 'Line 4',
                'zh-Hans': '4号线',
                'zh-Hant': '4號線',
            },
        },
        {
            filename: 'gz5',
            name: {
                en: 'Line 5',
                'zh-Hans': '5号线',
                'zh-Hant': '5號線',
            },
        },
        {
            filename: 'gz6',
            name: {
                en: 'Line 6',
                'zh-Hans': '6号线',
                'zh-Hant': '6號線',
            },
        },
        {
            filename: 'gz7',
            name: {
                en: 'Line 7',
                'zh-Hans': '7号线',
                'zh-Hant': '7號線',
            },
        },
        {
            filename: 'gz8',
            name: {
                en: 'Line 8',
                'zh-Hans': '8号线',
                'zh-Hant': '8號線',
            },
        },
        {
            filename: 'gz9',
            name: {
                en: 'Line 9',
                'zh-Hans': '9号线',
                'zh-Hant': '9號線',
            },
        },
        {
            filename: 'gz14',
            name: {
                en: 'Line 14',
                'zh-Hans': '14号线',
                'zh-Hant': '14號線',
            },
        },
        {
            filename: 'gz21',
            name: {
                en: 'Line 21',
                'zh-Hans': '21号线',
                'zh-Hant': '21號線',
            },
        },
        {
            filename: 'gf',
            name: {
                en: 'Guangfo Line',
                'zh-Hans': '广佛线',
                'zh-Hant': '廣佛線',
            },
        },
    ],

    mlm: [
        {
            filename: 'taipa',
            name: {
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
            name: {
                en: 'Tsuen Wan Line',
                'zh-Hans': '荃湾线',
                'zh-Hant': '荃灣綫',
            },
        },
        {
            filename: 'ktl',
            name: {
                en: 'Kwun Tong Line',
                'zh-Hans': '观塘线',
                'zh-Hant': '觀塘綫',
            },
        },
        {
            filename: 'isl',
            name: {
                en: 'Island Line',
                'zh-Hans': '港岛线',
                'zh-Hant': '港島綫',
            },
        },
        {
            filename: 'tkl',
            name: {
                en: 'Tseung Kwan O Line',
                'zh-Hans': '将军澳线',
                'zh-Hant': '將軍澳綫',
            },
        },
        {
            filename: 'sile',
            name: {
                en: 'South Island Line',
                'zh-Hans': '南港岛线',
                'zh-Hant': '南港島綫',
            },
        },
        {
            filename: 'eal',
            name: {
                en: 'East Rail Line',
                'zh-Hans': '东铁线',
                'zh-Hant': '東鐵綫',
            },
        },
        {
            filename: 'drl',
            name: {
                en: 'Disneyland Resort Line',
                'zh-Hans': '迪士尼线',
                'zh-Hant': '迪士尼綫',
            },
        },
        {
            filename: 'ael',
            name: {
                en: 'Airport Express',
                'zh-Hans': '机场快线',
                'zh-Hant': '機場快綫',
            },
        },
        {
            filename: 'tml',
            name: {
                en: 'Tuen Ma Line',
                'zh-Hans': '屯马线',
                'zh-Hant': '屯馬綫',
            },
        },
    ],

    shmetro: [
        {
            filename: 'sh1',
            name: {
                en: 'Line 1',
                'zh-Hans': '1号线',
                'zh-Hant': '1號線',
            },
        },
        {
            filename: 'sh2',
            name: {
                en: 'Line 2 by Tianxiu11111',
                'zh-Hans': '2号线 来自 Tianxiu11111',
                'zh-Hant': '2號線 來自 Tianxiu11111',
            },
        },
        {
            filename: 'sh5',
            name: {
                en: 'Line 5 by Tianxiu11111',
                'zh-Hans': '5号线 来自 Tianxiu11111',
                'zh-Hant': '5號線 來自 Tianxiu11111',
            },
        },
        {
            filename: 'sh6',
            name: {
                en: 'Line 6 by Thomastzc',
                'zh-Hans': '6号线 来自 Thomastzc',
                'zh-Hant': '6號線 來自 Thomastzc',
            },
        },
        {
            filename: 'sh7',
            name: {
                en: 'Line 7 by Thomastzc',
                'zh-Hans': '7号线 来自 Thomastzc',
                'zh-Hant': '7號線 來自 Thomastzc',
            },
        },
        {
            filename: 'sh8',
            name: {
                en: 'Line 8 by Thomastzc',
                'zh-Hans': '8号线 来自 Thomastzc',
                'zh-Hant': '8號線 來自 Thomastzc',
            },
        },
        {
            filename: 'sh11',
            name: {
                en: 'Line 11 by Tianxiu11111',
                'zh-Hans': '11号线 来自 Tianxiu11111',
                'zh-Hant': '11號線 來自 Tianxiu11111',
            },
        },
        {
            filename: 'sh16',
            name: {
                en: 'Line 16',
                'zh-Hans': '16号线',
                'zh-Hant': '16號線',
            },
        },
    ],
};
