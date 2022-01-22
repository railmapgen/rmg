import { LanguageCode, Translation } from './constants';

export enum CompanyCode {
    basic = 'basic',
    bjsubway = 'bjsubway',
    gzmtr = 'gzmtr',
    kvtransit = 'kvtransit',
    mlm = 'mlm',
    mtr = 'mtr',
    njmetro = 'njmetro',
    shmetro = 'shmetro',
    saopaulometro = 'saopaulometro',
    szmetro = 'szmetro',
    zzmetro = 'zzmetro',
}

interface CompanyEntry {
    id: CompanyCode;
    name: Translation;
}

export const companies: CompanyEntry[] = [
    {
        id: CompanyCode.basic,
        name: {
            [LanguageCode.English]: 'Basic',
            [LanguageCode.Chinese]: '基本',
        },
    },

    // Templates with styles supported
    {
        id: CompanyCode.mtr,
        name: {
            [LanguageCode.English]: 'MTR',
            [LanguageCode.ChineseSimp]: '港铁',
            [LanguageCode.ChineseTrad]: '港鐵',
        },
    },
    {
        id: CompanyCode.gzmtr,
        name: {
            [LanguageCode.English]: 'Guangzhou Metro',
            [LanguageCode.ChineseSimp]: '广州地铁',
            [LanguageCode.ChineseTrad]: '廣州地鐵',
        },
    },
    {
        id: CompanyCode.shmetro,
        name: {
            [LanguageCode.English]: 'Shanghai Metro',
            [LanguageCode.ChineseSimp]: '上海地铁',
            [LanguageCode.ChineseTrad]: '上海地鐵',
        },
    },

    // Third-party templates
    {
        id: CompanyCode.bjsubway,
        name: {
            [LanguageCode.English]: 'Beijing Subway',
            [LanguageCode.ChineseSimp]: '北京地铁',
            [LanguageCode.ChineseTrad]: '北京地鐵',
        },
    },
    {
        id: CompanyCode.kvtransit,
        name: {
            [LanguageCode.English]: 'Klang Valley Integrated Transit System',
            [LanguageCode.ChineseSimp]: '巴生谷综合运输系统',
            [LanguageCode.ChineseTrad]: '巴生谷綜合運輸系統',
        },
    },
    {
        id: CompanyCode.mlm,
        name: {
            [LanguageCode.English]: 'Macao LRT',
            [LanguageCode.Portuguese]: 'Metro Ligeiro de Macau',
            [LanguageCode.ChineseSimp]: '澳门轻轨',
            [LanguageCode.ChineseTrad]: '澳門輕軌',
        },
    },
    {
        id: CompanyCode.njmetro,
        name: {
            [LanguageCode.English]: 'Nanjing Metro',
            [LanguageCode.ChineseSimp]: '南京地铁',
            [LanguageCode.ChineseTrad]: '南京地鐵',
        },
    },
    {
        id: CompanyCode.saopaulometro,
        name: {
            en: 'São Paulo Metro',
            pt: 'Metrô de São Paulo',
            'zh-Hans': '圣保罗地铁',
            'zh-Hant': '聖保羅地鐵',
        },
    },
    {
        id: CompanyCode.szmetro,
        name: {
            [LanguageCode.English]: 'Shenzhen Metro',
            [LanguageCode.ChineseSimp]: '深圳地铁',
            [LanguageCode.ChineseTrad]: '深圳地鐵',
        },
    },
    {
        id: CompanyCode.zzmetro,
        name: {
            [LanguageCode.English]: 'Zhenzhou Metro',
            [LanguageCode.ChineseSimp]: '郑州地铁',
            [LanguageCode.ChineseTrad]: '鄭州地鐵',
        },
    },
];
