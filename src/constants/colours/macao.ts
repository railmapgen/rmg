import { LanguageCode, PaletteEntry } from '../constants';

const Macao: PaletteEntry[] = [
    {
        id: 'taipa',
        name: {
            [LanguageCode.English]: 'Taipa Line',
            pt: 'Linha da Taipa',
            [LanguageCode.ChineseSimp]: '氹仔线',
            [LanguageCode.ChineseTrad]: '氹仔線',
        },
        colour: '#A4D65E',
    },
    {
        id: 'peninsula',
        name: {
            [LanguageCode.English]: 'Linha da Península de Macau',
            [LanguageCode.ChineseSimp]: '澳门线',
            [LanguageCode.ChineseTrad]: '澳門線',
        },
        colour: '#FF0000',
    },
    {
        id: '2afase',
        name: {
            [LanguageCode.English]: '2.a Fase',
            [LanguageCode.ChineseSimp]: '第二期',
            [LanguageCode.ChineseTrad]: '第二期',
        },
        colour: '#00BFFF',
    },
    {
        id: 'seacpaivan',
        name: {
            [LanguageCode.English]: 'Linha Seac Pai Van',
            [LanguageCode.ChineseSimp]: '石排湾线',
            [LanguageCode.ChineseTrad]: '石排灣線',
        },
        colour: '#8CE600',
    },
    {
        id: 'hengqin',
        name: {
            [LanguageCode.English]: 'Linha de Extensão da Ilha de Hengqin',
            [LanguageCode.ChineseSimp]: '横琴延伸线',
            [LanguageCode.ChineseTrad]: '橫琴延伸線',
        },
        colour: '#FFA500',
    },
    {
        id: 'leste',
        name: {
            [LanguageCode.English]: 'Linha Leste',
            [LanguageCode.ChineseSimp]: '澳氹东线',
            [LanguageCode.ChineseTrad]: '澳氹東線',
        },
        colour: '#F400A1',
    },
    {
        id: 'hmz',
        name: {
            [LanguageCode.English]: 'Linha da Ponte HMZ',
            [LanguageCode.ChineseSimp]: '港珠澳大桥线',
            [LanguageCode.ChineseTrad]: '港珠澳大橋線',
        },
        colour: '#8A2BE2',
    },
];

export default Macao;
