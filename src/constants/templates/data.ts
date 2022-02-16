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
        {
            filename: 'sh3',
            name: {
                en: 'Coline',
                'zh-Hans': '共线',
                'zh-Hant': '共綫',
            },
        },
    ],

    bjsubway: [
        {
            filename: 'bj1',
            name: {
                en: 'Line 1 by AnDanJuneUnderline',
                'zh-Hans': '1号线 来自 AnDanJuneUnderline',
                'zh-Hant': '1號線 來自 AnDanJuneUnderline',
            },
        },
        {
            filename: 'bj4',
            name: {
                en: 'Line 4 by AnDanJuneUnderline',
                'zh-Hans': '4号线 来自 AnDanJuneUnderline',
                'zh-Hant': '4號線 來自 AnDanJuneUnderline',
            },
        },
        {
            filename: 'bj5',
            name: {
                en: 'Line 5 by AnDanJuneUnderline',
                'zh-Hans': '5号线 来自 AnDanJuneUnderline',
                'zh-Hant': '5號線 來自 AnDanJuneUnderline',
            },
        },
        {
            filename: 'bj6',
            name: {
                en: 'Line 6 by AnDanJuneUnderline',
                'zh-Hans': '6号线 来自 AnDanJuneUnderline',
                'zh-Hant': '6號線 來自 AnDanJuneUnderline',
            },
        },
        {
            filename: 'bj7',
            name: {
                en: 'Line 7 by AnDanJuneUnderline',
                'zh-Hans': '7号线 来自 AnDanJuneUnderline',
                'zh-Hant': '7號線 來自 AnDanJuneUnderline',
            },
        },
        {
            filename: 'bj9',
            name: {
                en: 'Line 9 by AnDanJuneUnderline',
                'zh-Hans': '9号线 来自 AnDanJuneUnderline',
                'zh-Hant': '9號線 來自 AnDanJuneUnderline',
            },
        },
        {
            filename: 'bj13',
            name: {
                en: 'Line 13 by AnDanJuneUnderline',
                'zh-Hans': '13号线 来自 AnDanJuneUnderline',
                'zh-Hant': '13號線 來自 AnDanJuneUnderline',
            },
        },
        {
            filename: 'bj14',
            name: {
                en: 'Line 14 by Jay20081229',
                'zh-Hans': '14号线 来自 Jay20081229',
                'zh-Hant': '14號線 來自 Jay20081229',
            },
        },
        {
            filename: 'yzl',
            name: {
                en: 'Yizhuang Line by AnDanJuneUnderline',
                'zh-Hans': '亦庄线 来自 AnDanJuneUnderline',
                'zh-Hant': '亦莊線 來自 AnDanJuneUnderline',
            },
        },
        {
            filename: 't1l',
            name: {
                en: 'Yizhuang T1 Line by AnDanJuneUnderline',
                'zh-Hans': '亦庄T1线 来自 AnDanJuneUnderline',
                'zh-Hant': '亦莊T1線 來自 AnDanJuneUnderline',
            },
        },
    ],

    fmetro: [
        {
            filename: 'fs2',
            name: {
                en: 'Line 2 by Dingdong2334',
                'zh-Hans': '2号线 来自 Dingdong2334',
                'zh-Hant': '2號線 來自 Dingdong2334',
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
            filename: 'gz13',
            name: {
                en: 'Line 13 by Dingdong2334',
                'zh-Hans': '13号线 来自 Dingdong2334',
                'zh-Hant': '13號線 來自 Dingdong2334',
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
            filename: 'gz18',
            name: {
                en: 'Line 18 by Dingdong2334',
                'zh-Hans': '18号线 来自 Dingdong2334',
                'zh-Hant': '18號線 來自 Dingdong2334',
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
        {
            filename: 'apm',
            name: {
                en: 'APM Line by Dingdong2334',
                'zh-Hans': 'APM线 来自 Dingdong2334',
                'zh-Hant': 'APM線 來自 Dingdong2334',
            },
        },
        {
            filename: 'thz1',
            name: {
                en: 'Haizhu Tram Line 1',
                'zh-Hans': '海珠有轨1号线 来自 clearng-kly',
                'zh-Hant': '海珠有軌1號線 來自 clearng-kly',
            },
        },
        {
            filename: 'thp1',
            name: {
                en: 'Huangpu Tram Line 1',
                'zh-Hans': '黄埔有轨1号线 来自 clearng-kly',
                'zh-Hant': '黃埔有軌1號線 來自 clearng-kly',
            },
        },
    ],

    kmrailtransit: [
        {
            filename: 'km1',
            name: {
                en: 'Line 1',
                'zh-Hans': '1号线',
                'zh-Hant': '1號線',
            },
        },
        {
            filename: 'km2',
            name: {
                en: 'Line 2',
                'zh-Hans': '2号线',
                'zh-Hant': '2號線',
            },
        },
        {
            filename: 'km3',
            name: {
                en: 'Line 3',
                'zh-Hans': '3号线',
                'zh-Hant': '3號線',
            },
        },
        {
            filename: 'km4',
            name: {
                en: 'Line 4',
                'zh-Hans': '4号线',
                'zh-Hant': '4號線',
            },
        },
        {
            filename: 'km5',
            name: {
                en: 'Line 5',
                'zh-Hans': '5号线',
                'zh-Hant': '5號線',
            },
        },
        {
            filename: 'km6',
            name: {
                en: 'Line 6',
                'zh-Hans': '6号线',
                'zh-Hant': '6號線',
            },
        },
    ],

    kvtransit: [
        {
            filename: 'klMonorail',
            name: {
                en: 'KL Monorail',
                ms: 'KL Monorail',
                'zh-Hans': '吉隆坡单轨',
                'zh-Hant': '吉隆坡單軌',
            },
        },
        {
            filename: 'lrtAmpang',
            name: {
                en: 'Ampang Line',
                ms: 'Laluan Ampang',
                'zh-Hans': '安邦线',
                'zh-Hant': '安邦線',
            },
        },
        {
            filename: 'lrtKelanaJaya',
            name: {
                en: 'Kelana Jaya Line',
                ms: 'Laluan Kelana Jaya',
                'zh-Hans': '格拉那再也线',
                'zh-Hant': '格拉那再也線',
            },
        },
        {
            filename: 'lrtSriPataling',
            name: {
                en: 'Sri Pataling Line',
                ms: 'Laluan Sri Pataling',
                'zh-Hans': '大城堡线',
                'zh-Hant': '大城堡線',
            },
        },
        {
            filename: 'mrtKajang',
            name: {
                en: 'Kajang Line',
                ms: 'Laluan Kajang',
                'zh-Hans': '加影线',
                'zh-Hant': '加影線',
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

    njmetro: [
        {
            filename: 'nj1',
            name: {
                en: 'Line 1 by linchen1965',
                'zh-Hans': '1号线 来自 linchen1965',
                'zh-Hant': '1號線 來自 linchen1965',
            },
        },
        {
            filename: 'nj2',
            name: {
                en: 'Line 2 by linchen1965',
                'zh-Hans': '2号线 来自 linchen1965',
                'zh-Hant': '2號線 來自 linchen1965',
            },
        },
        {
            filename: 'nj3',
            name: {
                en: 'Line 3 by linchen1965',
                'zh-Hans': '3号线 来自 linchen1965',
                'zh-Hant': '3號線 來自 linchen1965',
            },
        },
        {
            filename: 'nj4',
            name: {
                en: 'Line 4 by linchen1965',
                'zh-Hans': '4号线 来自 linchen1965',
                'zh-Hant': '4號線 來自 linchen1965',
            },
        },
        {
            filename: 'nj10',
            name: {
                en: 'Line 10 by linchen1965',
                'zh-Hans': '10号线 来自 linchen1965',
                'zh-Hant': '10號線 來自 linchen1965',
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
                en: 'Line 2',
                'zh-Hans': '2号线',
                'zh-Hant': '2號線',
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
            filename: 'sh9',
            name: {
                en: 'Line 9',
                'zh-Hans': '9号线',
                'zh-Hant': '9號線',
            },
        },
        {
            filename: 'sh10',
            name: {
                en: 'Line 10',
                'zh-Hans': '10号线',
                'zh-Hant': '10號線',
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
            filename: 'sh12',
            name: {
                en: 'Line 12 by Andy1782010',
                'zh-Hans': '12号线 来自 Andy1782010',
                'zh-Hant': '12號線 來自 Andy1782010',
            },
        },
        {
            filename: 'sh13',
            name: {
                en: 'Line 13 by Andy1782010',
                'zh-Hans': '13号线 来自 Andy1782010',
                'zh-Hant': '13號線 來自 Andy1782010',
            },
        },
        {
            filename: 'sh14',
            name: {
                en: 'Line 14',
                'zh-Hans': '14号线',
                'zh-Hant': '14號線',
            },
        },
        {
            filename: 'sh15',
            name: {
                en: 'Line 15 by Thomastzc',
                'zh-Hans': '15号线 来自 Thomastzc',
                'zh-Hant': '15號線 來自 Thomastzc',
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
        {
            filename: 'sh17',
            name: {
                en: 'Line 17 by Thomastzc',
                'zh-Hans': '17号线 来自 Thomastzc',
                'zh-Hant': '17號線 來自 Thomastzc',
            },
        },
        {
            filename: 'sh18',
            name: {
                en: 'Line 18 by Tianxiu11111',
                'zh-Hans': '18号线 来自 Tianxiu11111',
                'zh-Hant': '18號線 來自 Tianxiu11111',
            },
        },
    ],

    saopaulometro: [
        {
            filename: 'sp1',
            name: {
                en: 'Line 1',
                pt: 'Linha 1',
                'zh-Hans': '1号线',
                'zh-Hant': '1號線',
            },
        },
        {
            filename: 'sp2',
            name: {
                en: 'Line 2',
                pt: 'Linha 2',
                'zh-Hans': '2号线',
                'zh-Hant': '2號線',
            },
        },
        {
            filename: 'sp3',
            name: {
                en: 'Line 3',
                pt: 'Linha 3',
                'zh-Hans': '3号线',
                'zh-Hant': '3號線',
            },
        },
        {
            filename: 'sp4',
            name: {
                en: 'Line 4',
                pt: 'Linha 4',
                'zh-Hans': '4号线',
                'zh-Hant': '4號線',
            },
        },
        {
            filename: 'sp5',
            name: {
                en: 'Line 5',
                pt: 'Linha 5',
                'zh-Hans': '5号线',
                'zh-Hant': '5號線',
            },
        },
        {
            filename: 'sp7',
            name: {
                en: 'Line 7',
                pt: 'Linha 7',
                'zh-Hans': '7号线',
                'zh-Hant': '7號線',
            },
        },
        {
            filename: 'sp8',
            name: {
                en: 'Line 8',
                pt: 'Linha 8',
                'zh-Hans': '8号线',
                'zh-Hant': '8號線',
            },
        },
        {
            filename: 'sp9',
            name: {
                en: 'Line 9',
                pt: 'Linha 9',
                'zh-Hans': '9号线',
                'zh-Hant': '9號線',
            },
        },
        {
            filename: 'sp10',
            name: {
                en: 'Line 10',
                pt: 'Linha 10',
                'zh-Hans': '10号线',
                'zh-Hant': '10號線',
            },
        },
        {
            filename: 'sp11',
            name: {
                en: 'Line 11',
                pt: 'Linha 11',
                'zh-Hans': '11号线',
                'zh-Hant': '11號線',
            },
        },
        {
            filename: 'sp12',
            name: {
                en: 'Line 12',
                pt: 'Linha 12',
                'zh-Hans': '12号线',
                'zh-Hant': '12號線',
            },
        },
        {
            filename: 'sp13',
            name: {
                en: 'Line 13',
                pt: 'Linha 13',
                'zh-Hans': '13号线',
                'zh-Hant': '13號線',
            },
        },
        {
            filename: 'sp15',
            name: {
                en: 'Line 15',
                pt: 'Linha 15',
                'zh-Hans': '15号线',
                'zh-Hant': '15號線',
            },
        },
    ],

    szmetro: [
        {
            filename: 'sz1',
            name: {
                en: 'Line 1',
                'zh-Hans': '1号线',
                'zh-Hant': '1號線',
            },
        },
        {
            filename: 'sz3',
            name: {
                en: 'Line 3',
                'zh-Hans': '3号线',
                'zh-Hant': '3號線',
            },
        },
        {
            filename: 'sz4',
            name: {
                en: 'Line 4',
                'zh-Hans': '4号线',
                'zh-Hant': '4號線',
            },
        },
    ],

    zzmetro: [
        {
            filename: 'zz1',
            name: {
                en: 'Line 1',
                'zh-Hans': '1号线',
                'zh-Hant': '1號線',
            },
        },
        {
            filename: 'zz3',
            name: {
                en: 'Line 3',
                'zh-Hans': '3号线',
                'zh-Hant': '3號線',
            },
        },
        {
            filename: 'zz4',
            name: {
                en: 'Line 4',
                'zh-Hans': '4号线',
                'zh-Hant': '4號線',
            },
        },
        {
            filename: 'zz6',
            name: {
                en: 'Line 6',
                'zh-Hans': '6号线',
                'zh-Hant': '6號線',
            },
        },
        {
            filename: 'zz14',
            name: {
                en: 'Line 14',
                'zh-Hans': '14号线',
                'zh-Hant': '14號線',
            },
        },
    ],
};
