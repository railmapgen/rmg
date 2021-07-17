import { Translation } from "./constants";

export enum CityCode {
    Barcelona = 'barcelona',
    Beijing = 'beijing',
    Changsha = 'changsha',
    Chengdu = 'chengdu',
    Chongqing = 'chongqing',
    Dongguan = 'dongguan',
    Edinburgh = 'edinburgh',
    Foshan = 'foshan',
    Glasgow = 'glasgow',
    Guangzhou = 'guangzhou',
    Hangzhou = 'hangzhou',
    HongKong = 'hongkong',
    Kansai = 'kansai',
    Kaohsiung = 'kaohsiung',
    London = 'london',
    Macao = 'macao',
    Madrid = 'madrid',
    Nanjing = 'nanjing',
    NewTaipei = 'newtaipei',
    Osaka = 'osaka',
    Oslo = 'oslo',
    Paris = 'paris',
    Qingdao = 'qingdao',
    SanFrancisco = 'sanfrancisco',
    Seoul = 'seoul',
    Shanghai = 'shanghai',
    Shenzhen = 'shenzhen',
    Singapore = 'singapore',
    Stockholm = 'stockholm',
    Taipei = 'taipei',
    Tianjin = 'tianjin',
    Tokyo = 'tokyo',
    Toronto = 'toronto',
    TyneAndWear = 'tyneandwear',
    Xian = 'xian',
    Other = 'other',
}

interface CityEntry {
    id: CityCode;
    /**
     * ISO 3166-1 alpha-2 country code. (For cities in Britain, append BS 6879 subdivision code. )
     */
    country: string;
    /**
     * Key-value pairs of multi-lingual names of the city.
     */
    name: Translation;
}

export const cityList: CityEntry[] = [
    {
        id: CityCode.Barcelona,
        country: 'ES',
        name: {
            en: 'Barcelona',
            'zh-Hans': '巴塞罗那',
            'zh-HK': '巴塞隆拿',
            'zh-TW': '巴塞隆納',
        },
    },
    {
        id: CityCode.Beijing,
        country: 'CN',
        name: {
            en: 'Beijing',
            zh: '北京',
        },
    },
    {
        id: CityCode.Changsha,
        country: 'CN',
        name: {
            en: 'Changsha',
            'zh-Hans': '长沙',
            'zh-Hant': '長沙',
        },
    },
    {
        id: CityCode.Chengdu,
        country: 'CN',
        name: {
            en: 'Chengdu',
            zh: '成都',
        },
    },
    {
        id: CityCode.Chongqing,
        country: 'CN',
        name: {
            en: 'Chongqing',
            'zh-Hans': '重庆',
            'zh-Hant': '重慶',
        },
    },
    {
        id: CityCode.Dongguan,
        country: 'CN',
        name: {
            en: 'Dongguan',
            'zh-Hans': '东莞',
            'zh-Hant': '東莞',
        },
    },
    {
        id: CityCode.Edinburgh,
        country: 'GBSCT',
        name: {
            en: 'Edinburgh',
            ga: 'Dùn Èideann',
            'zh-Hans': '爱丁堡',
            'zh-Hant': '愛丁堡',
        },
    },
    {
        id: CityCode.Foshan,
        country: 'CN',
        name: {
            en: 'Foshan',
            zh: '佛山',
        },
    },
    {
        id: CityCode.Glasgow,
        country: 'GBSCT',
        name: {
            en: 'Glasgow',
            ga: 'Glaschu',
            zh: '格拉斯哥',
        },
    },
    {
        id: CityCode.Guangzhou,
        country: 'CN',
        name: {
            en: 'Guangzhou',
            'zh-Hans': '广州',
            'zh-Hant': '廣州',
        },
    },
    {
        id: CityCode.Hangzhou,
        country: 'CN',
        name: {
            en: 'Hangzhou',
            zh: '杭州',
        },
    },
    {
        id: CityCode.HongKong,
        country: 'HK',
        name: {
            en: 'Hong Kong',
            zh: '香港',
        },
    },
    {
        id: CityCode.Kansai,
        country: 'JP',
        name: {
            en: 'Kansai Area',
            ja: '近畿地方',
            'zh-Hans': '近畿地方（关西地方）',
            'zh-Hant': '近畿地方（關西地方）',
        },
    },
    {
        id: CityCode.Kaohsiung,
        country: 'TW',
        name: {
            en: 'Kaohsiung',
            zh: '高雄',
        },
    },
    {
        id: CityCode.London,
        country: 'GBENG',
        name: {
            en: 'London',
            'zh-Hans': '伦敦',
            'zh-Hant': '倫敦',
        },
    },
    {
        id: CityCode.Macao,
        country: 'MO',
        name: {
            en: 'Macao',
            pt: 'Macau',
            'zh-Hans': '澳门',
            'zh-Hant': '澳門',
        },
    },
    {
        id: CityCode.Madrid,
        country: 'ES',
        name: {
            en: 'Madrid',
            'zh-Hans': '马德里',
            'zh-Hant': '馬德里',
        },
    },
    {
        id: CityCode.Nanjing,
        country: 'CN',
        name: {
            en: 'Nanjing',
            zh: '南京',
        },
    },
    {
        id: CityCode.NewTaipei,
        country: 'TW',
        name: {
            en: 'New Taipei',
            zh: '新北',
        },
    },
    {
        id: CityCode.Osaka,
        country: 'JP',
        name: {
            en: 'Osaka',
            ja: '大阪',
            zh: '大阪',
        },
    },
    {
        id: CityCode.Oslo,
        country: 'NO',
        name: {
            en: 'Oslo',
            'zh-Hans': '奥斯陆',
            'zh-Hant': '奧斯陸',
        },
    },
    {
        id: CityCode.Paris,
        country: 'FR',
        name: {
            en: 'Paris',
            zh: '巴黎',
        },
    },
    {
        id: CityCode.Qingdao,
        country: 'CN',
        name: {
            en: 'Qingdao',
            'zh-Hans': '青岛',
            'zh-Hant': '青島',
        },
    },
    {
        id: CityCode.SanFrancisco,
        country: 'US',
        name: {
            en: 'San Francisco',
            'zh-Hans': '旧金山',
            'zh-HK': '三藩市',
            'zh-TW': '舊金山',
        },
    },
    {
        id: CityCode.Seoul,
        country: 'KR',
        name: {
            en: 'Seoul (Metropolitan Area)',
            ko: '서울(수도권)',
            'zh-Hans': '首尔（首都圈）',
            'zh-Hant': '首爾（首都圈）',
        },
    },
    {
        id: CityCode.Shanghai,
        country: 'CN',
        name: {
            en: 'Shanghai',
            zh: '上海',
        },
    },
    {
        id: CityCode.Shenzhen,
        country: 'CN',
        name: {
            en: 'Shenzhen',
            zh: '深圳',
        },
    },
    {
        id: CityCode.Singapore,
        country: 'SG',
        name: {
            en: 'Singapore',
            zh: '新加坡',
        },
    },
    {
        id: CityCode.Stockholm,
        country: 'SE',
        name: {
            en: 'Stockholm',
            'zh-Hans': '斯德哥尔摩',
            'zh-Hant': '斯德哥爾摩',
        },
    },
    {
        id: CityCode.Taipei,
        country: 'TW',
        name: {
            en: 'Taipei',
            zh: '台北',
        },
    },
    {
        id: CityCode.Tianjin,
        country: 'CN',
        name: {
            en: 'Tianjin',
            zh: '天津',
        },
    },
    {
        id: CityCode.Tokyo,
        country: 'JP',
        name: {
            en: 'Tokyo (Greater Tokyo Area)',
            ja: '東京（首都圏）',
            'zh-Hans': '东京（首都圈）',
            'zh-Hant': '東京（首都圈）',
        },
    },
    {
        id: CityCode.Toronto,
        country: 'CA',
        name: {
            en: 'Toronto',
            'zh-Hans': '多伦多',
            'zh-Hant': '多倫多',
        },
    },
    {
        id: CityCode.TyneAndWear,
        country: 'GBENG',
        name: {
            en: 'Tyne and Wear',
            'zh-Hans': '泰恩-威尔',
            'zh-HK': '泰威',
            'zh-TW': '泰恩-威爾',
        },
    },
    {
        id: CityCode.Xian,
        country: 'CN',
        name: {
            en: "Xi'an",
            zh: '西安',
        },
    },
    {
        id: CityCode.Other,
        country: 'UN',
        name: {
            en: 'Customise',
            'zh-Hans': '自定义',
            'zh-Hant': '自訂',
        },
    },
];
