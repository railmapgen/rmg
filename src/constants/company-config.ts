import { LanguageCode, Translation } from './constants';

export enum CompanyCode {
    basic = 'basic',
    bjsubway = 'bjsubway',
    gzmtr = 'gzmtr',
    mlm = 'mlm',
    mtr = 'mtr',
    shmetro = 'shmetro',
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
    {
        id: CompanyCode.bjsubway,
        name: {
            [LanguageCode.English]: 'Beijing Subway',
            [LanguageCode.ChineseSimp]: '北京地铁',
            [LanguageCode.ChineseTrad]: '北京地鐵',
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
        id: CompanyCode.mlm,
        name: {
            [LanguageCode.English]: 'Macao LRT',
            [LanguageCode.Portuguese]: 'Metro Ligeiro de Macau',
            [LanguageCode.ChineseSimp]: '澳门轻轨',
            [LanguageCode.ChineseTrad]: '澳門輕軌',
        },
    },
    {
        id: CompanyCode.mtr,
        name: {
            [LanguageCode.English]: 'MTR',
            [LanguageCode.ChineseSimp]: '港铁',
            [LanguageCode.ChineseTrad]: '港鐵',
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
];
