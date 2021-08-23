import { LanguageCode, MonoColour, PaletteEntry } from '../constants';

/**
 * JR West (Kansai area): https://www.westjr.co.jp/global/tc/timetable/#routemaps
 */
const Kansai: PaletteEntry[] = [
    {
        id: 'a',
        name: {
            [LanguageCode.English]:
                'Hokuriku Line/Biwako Line/JR Kyōto Line/JR Kōbe Line (Tōkaidō Line)/San-yō Line/Akō Line (A)',
            ja: '北陸線・琵琶湖線・ＪＲ京都線・ＪＲ神戸線（東海道線）・・山陽線・赤穂線',
            [LanguageCode.ChineseSimp]: '北陆线/琵琶湖线/JR京都线/JR神户线/山阳线/赤穗线',
            [LanguageCode.ChineseTrad]: '北陸線/琵琶湖線/JR京都線/JR神戶線/山陽線/赤穗線',
        },
        colour: '#0070ad',
    },
    {
        id: 'b',
        name: {
            [LanguageCode.English]: 'Kosei Line (B)',
            ja: '湖西線',
            [LanguageCode.ChineseSimp]: '湖西线',
            [LanguageCode.ChineseTrad]: '湖西線',
        },
        colour: '#00a9d2',
    },
    {
        id: 'c',
        name: {
            [LanguageCode.English]: 'Kusatsu Line (C)',
            ja: '草津線',
            [LanguageCode.ChineseSimp]: '草津线',
            [LanguageCode.ChineseTrad]: '草津線',
        },
        colour: '#61a74c',
    },
    {
        id: 'd',
        name: {
            [LanguageCode.English]: 'Nara Line (D)',
            ja: '奈良線',
            [LanguageCode.ChineseSimp]: '奈良线',
            [LanguageCode.ChineseTrad]: '奈良線',
        },
        colour: '#ac7434',
    },
    {
        id: 'e',
        name: {
            [LanguageCode.English]: 'Sagano Line/San-in Line (E)',
            ja: '嵯峨野線・山陰線',
            [LanguageCode.ChineseSimp]: '嵯峨野线/山阴线',
            [LanguageCode.ChineseTrad]: '嵯峨野線/山陰線',
        },
        colour: '#707daf',
    },
    {
        id: 'f',
        name: {
            [LanguageCode.English]: 'Ōsaka Higashi Line (F)',
            ja: 'おおさか東線',
            [LanguageCode.ChineseSimp]: '大阪东线',
            [LanguageCode.ChineseTrad]: '大阪東線',
        },
        colour: '#456d84',
    },
    {
        id: 'g',
        name: {
            [LanguageCode.English]: 'JR Takarazuka Line/Fukuchiyama Line (G)',
            ja: 'ＪＲ宝塚線・福知山線',
            [LanguageCode.ChineseSimp]: 'JR宝冢线/福知山线',
            [LanguageCode.ChineseTrad]: 'JR寶塚線/福知山線',
        },
        colour: '#f6bd26',
        fg: MonoColour.black,
    },
    {
        id: 'h',
        name: {
            [LanguageCode.English]: 'JR Tōzai Line/Gakkentoshi Line (Katamachi Line) (H)',
            ja: 'ＪＲ東西線・学研都市線（片町線）',
            [LanguageCode.ChineseSimp]: 'JR东西线/学研都市线',
            [LanguageCode.ChineseTrad]: 'JR東西線/學研都市線',
        },
        colour: '#dd397c',
    },
    {
        id: 'i',
        name: {
            [LanguageCode.English]: 'Kakogawa Line (I)',
            ja: '加古川線',
            [LanguageCode.ChineseSimp]: '加古川线',
            [LanguageCode.ChineseTrad]: '加古川線',
        },
        colour: '#00a480',
    },
    {
        id: 'j',
        name: {
            [LanguageCode.English]: 'Bantan Line (J)',
            ja: '播但線',
            [LanguageCode.ChineseSimp]: '播但线',
            [LanguageCode.ChineseTrad]: '播但線',
        },
        colour: '#9c294e',
    },
    {
        id: 'k',
        name: {
            [LanguageCode.English]: 'Kishin Line (K)',
            ja: '姫新線',
            [LanguageCode.ChineseSimp]: '姬新线',
            [LanguageCode.ChineseTrad]: '姬新線',
        },
        colour: '#dd4731',
    },
    {
        id: 'l',
        name: {
            [LanguageCode.English]: 'Maizuru Line (L)',
            ja: '舞鶴線',
            [LanguageCode.ChineseSimp]: '舞鹤线',
            [LanguageCode.ChineseTrad]: '舞鶴線',
        },
        colour: '#ec962c',
        fg: MonoColour.black,
    },
    {
        id: 'o',
        name: {
            [LanguageCode.English]: 'Ōsaka Loop Line (O)',
            ja: '大阪環状線',
            [LanguageCode.ChineseSimp]: '大阪环状线',
            [LanguageCode.ChineseTrad]: '大阪環狀線',
        },
        colour: '#db394A',
    },
    {
        id: 'p',
        name: {
            [LanguageCode.English]: 'JR Yumesaki Line (Sakurajima Line) (P)',
            ja: 'ＪＲゆめ咲線（桜島線）',
            [LanguageCode.ChineseSimp]: 'JR梦咲线',
            [LanguageCode.ChineseTrad]: 'JR夢咲線',
        },
        colour: '#24387e',
    },
    {
        id: 'q',
        name: {
            [LanguageCode.English]: 'Yamatoji Line (Q)',
            ja: '大和路線',
            [LanguageCode.ChineseSimp]: '大和路线',
            [LanguageCode.ChineseTrad]: '大和路線',
        },
        colour: '#00a26d',
    },
    {
        id: 'r',
        name: {
            [LanguageCode.English]: 'Hanwa Line (R)',
            ja: '阪和線',
            [LanguageCode.ChineseSimp]: '阪和线',
            [LanguageCode.ChineseTrad]: '阪和線',
        },
        colour: '#ec962c',
        fg: MonoColour.black,
    },
    {
        id: 's',
        name: {
            [LanguageCode.English]: 'Kansai-airport Line (S)',
            ja: '関西空港線',
            [LanguageCode.ChineseSimp]: '关西机场线',
            [LanguageCode.ChineseTrad]: '關西機場線',
        },
        colour: '#0070ad',
    },
    {
        id: 't',
        name: {
            [LanguageCode.English]: 'Wakayama Line (T)',
            ja: '和歌山線',
            [LanguageCode.ChineseSimp]: '和歌山线',
            [LanguageCode.ChineseTrad]: '和歌山線',
        },
        colour: '#eb9bae',
        fg: MonoColour.black,
    },
    {
        id: 'u',
        name: {
            [LanguageCode.English]: 'Man-yō Mahoroba Line (Sakurai Line) (U)',
            ja: '万葉まほろば線（桜井線）',
            [LanguageCode.ChineseSimp]: '万叶MAHOROBA线',
            [LanguageCode.ChineseTrad]: '萬葉MAHOROBA線',
        },
        colour: '#bc2634',
    },
    {
        id: 'v',
        name: {
            [LanguageCode.English]: 'Kansai Line (V)',
            ja: '関西線',
            [LanguageCode.ChineseSimp]: '关西线',
            [LanguageCode.ChineseTrad]: '關西線',
        },
        colour: '#4b3f85',
    },
    {
        id: 'w',
        name: {
            [LanguageCode.English]: 'Kinokuni Line (Kisei Line) (W)',
            ja: 'きのくに線（紀勢線）',
            [LanguageCode.ChineseSimp]: '纪国线',
            [LanguageCode.ChineseTrad]: '紀國線',
        },
        colour: '#00a6b0',
    },
];

export default Kansai;
