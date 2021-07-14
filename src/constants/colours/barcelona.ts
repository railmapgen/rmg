import { LanguageCode, MonoColour, PaletteEntry } from '../constants';

/**
 * All colours from https://www.tmb.cat/en/barcelona-transport/map
 * except R8: https://www.fgc.cat/en/fgc-network/
 */
const Barcelona: PaletteEntry[] = [
    {
        id: 'l1',
        name: {
            [LanguageCode.English]: 'Metro L1',
        },
        colour: '#DF3232',
    },
    {
        id: 'l2',
        name: {
            [LanguageCode.English]: 'Metro L2',
        },
        colour: '#983890',
    },
    {
        id: 'l3',
        name: {
            [LanguageCode.English]: 'Metro L3',
        },
        colour: '#0EAB4A',
    },
    {
        id: 'l4',
        name: {
            [LanguageCode.English]: 'Metro L4',
        },
        colour: '#FBC400',
        fg: MonoColour.black,
    },
    {
        id: 'l5',
        name: {
            [LanguageCode.English]: 'Metro L5',
        },
        colour: '#0075BF',
    },
    {
        id: 'l6',
        name: {
            [LanguageCode.English]: 'Metro L6',
        },
        colour: '#7481BE',
    },
    {
        id: 'l7',
        name: {
            [LanguageCode.English]: 'Metro L7',
        },
        colour: '#B76900',
    },
    {
        id: 'l8',
        name: {
            [LanguageCode.English]: 'Metro L8',
        },
        colour: '#E378AC',
    },
    {
        id: 'l9',
        name: {
            [LanguageCode.English]: 'Metro L9',
        },
        colour: '#F19400',
    },
    {
        id: 'l10',
        name: {
            [LanguageCode.English]: 'Metro L10',
        },
        colour: '#00A0E9',
    },
    {
        id: 'l11',
        name: {
            [LanguageCode.English]: 'Metro L11',
        },
        colour: '#AFD154',
        fg: MonoColour.black,
    },
    {
        id: 'l12',
        name: {
            [LanguageCode.English]: 'Metro L12',
        },
        colour: '#BBB3D8',
    },
    {
        id: 'montjuic',
        name: {
            ca: 'Funicular de Montjuïc',
            [LanguageCode.English]: 'Montjuïc Funicular',
        },
        colour: '#006E4D',
    },
    {
        id: 's1',
        name: {
            [LanguageCode.English]: 'FGC S1',
        },
        colour: '#F08300',
    },
    {
        id: 's2',
        name: {
            [LanguageCode.English]: 'FGC S2',
        },
        colour: '#7CBD27',
    },
    {
        id: 's3',
        name: {
            [LanguageCode.English]: 'FGC S3',
        },
        colour: '#468692',
    },
    {
        id: 's4',
        name: {
            [LanguageCode.English]: 'FGC S4',
        },
        colour: '#AD9000',
    },
    {
        id: 's5',
        name: {
            [LanguageCode.English]: 'FGC S5',
        },
        colour: '#4F8FCC',
    },
    {
        id: 's6',
        name: {
            [LanguageCode.English]: 'FGC S6',
        },
        colour: '#E61444',
    },
    {
        id: 's7',
        name: {
            [LanguageCode.English]: 'FGC S7',
        },
        colour: '#A42744',
    },
    {
        id: 's8',
        name: {
            [LanguageCode.English]: 'FGC S8',
        },
        colour: '#5AC2DF',
    },
    {
        id: 's9',
        name: {
            [LanguageCode.English]: 'FGC S9',
        },
        colour: '#E84760',
    },
    {
        id: 'r1',
        name: {
            [LanguageCode.English]: 'Rodalies R1',
        },
        colour: '#3895D3',
    },
    {
        id: 'r2',
        name: {
            [LanguageCode.English]: 'Rodalies R2',
        },
        colour: '#33AA50',
    },
    {
        id: 'r2n',
        name: {
            ca: 'Rodalies R2 Nord',
            [LanguageCode.English]: 'Rodalies R2 North',
        },
        colour: '#BFD427',
    },
    {
        id: 'r2s',
        name: {
            ca: 'Rodalies R2 Sud',
            [LanguageCode.English]: 'Rodalies R2 South',
        },
        colour: '#008F4C',
    },
    {
        id: 'r3',
        name: {
            [LanguageCode.English]: 'Rodalies R3',
        },
        colour: '#E6001F',
    },
    {
        id: 'r4',
        name: {
            [LanguageCode.English]: 'Rodalies R4',
        },
        colour: '#F9B80E',
    },
    {
        id: 'r5',
        name: {
            [LanguageCode.English]: 'FGC R5',
        },
        colour: '#009AB2',
    },
    {
        id: 'r50',
        name: {
            [LanguageCode.English]: 'FGC R50',
        },
        colour: '#007592',
    },
    {
        id: 'r6',
        name: {
            [LanguageCode.English]: 'FGC R6',
        },
        colour: '#A6A6A7',
    },
    {
        id: 'r60',
        name: {
            [LanguageCode.English]: 'FGC R60',
        },
        colour: '#64666C',
    },
    {
        id: 'r7',
        name: {
            [LanguageCode.English]: 'Rodalies R7',
        },
        colour: '#D793BE',
    },
    {
        id: 'r8',
        name: {
            [LanguageCode.English]: 'Rodalies R8',
        },
        colour: '#881062',
    },
    {
        id: 'tram',
        name: {
            [LanguageCode.English]: 'Tram',
        },
        colour: '#009B8C',
    },
    {
        id: 'bush',
        name: {
            [LanguageCode.English]: 'Bus H',
        },
        colour: '#003A86',
    },
    {
        id: 'busv',
        name: {
            [LanguageCode.English]: 'Bus V',
        },
        colour: '#6AB023',
    },
    {
        id: 'busd',
        name: {
            [LanguageCode.English]: 'Bus D',
        },
        colour: '#93107E',
    },
    {
        id: 'bus6',
        name: {
            [LanguageCode.English]: 'Bus 6',
        },
        colour: '#A2DAF4',
        fg: MonoColour.black,
    },
    {
        id: 'bus7',
        name: {
            [LanguageCode.English]: 'Bus 7',
        },
        colour: '#D0D959',
        fg: MonoColour.black,
    },
    {
        id: 'bus11',
        name: {
            [LanguageCode.English]: 'Bus 11',
        },
        colour: '#E8587B',
    },
    {
        id: 'bus13',
        name: {
            [LanguageCode.English]: 'Bus 13',
        },
        colour: '#B16618',
    },
    {
        id: 'bus19',
        name: {
            [LanguageCode.English]: 'Bus 19',
        },
        colour: '#EC80AD',
        fg: MonoColour.black,
    },
    {
        id: 'bus21',
        name: {
            [LanguageCode.English]: 'Bus 21',
        },
        colour: '#A96E66',
    },
    {
        id: 'bus22',
        name: {
            [LanguageCode.English]: 'Bus 22',
        },
        colour: '#D4B3D2',
        fg: MonoColour.black,
    },
    {
        id: 'bus23',
        name: {
            [LanguageCode.English]: 'Bus 23',
        },
        colour: '#E53517',
    },
    {
        id: 'bus24',
        name: {
            [LanguageCode.English]: 'Bus 24',
        },
        colour: '#958D4A',
    },
    {
        id: 'bus27',
        name: {
            [LanguageCode.English]: 'Bus 27',
        },
        colour: '#A4C537',
        fg: MonoColour.black,
    },
    {
        id: 'bus33',
        name: {
            [LanguageCode.English]: 'Bus 33',
        },
        colour: '#A8BED4',
        fg: MonoColour.black,
    },
    {
        id: 'bus34',
        name: {
            [LanguageCode.English]: 'Bus 34',
        },
        colour: '#7F8669',
    },
    {
        id: 'bus39',
        name: {
            [LanguageCode.English]: 'Bus 39',
        },
        colour: '#D3AE76',
        fg: MonoColour.black,
    },
    {
        id: 'bus46',
        name: {
            [LanguageCode.English]: 'Bus 46',
        },
        colour: '#006A32',
    },
    {
        id: 'bus47',
        name: {
            [LanguageCode.English]: 'Bus 47',
        },
        colour: '#6AA343',
    },
    {
        id: 'bus52',
        name: {
            [LanguageCode.English]: 'Bus 52',
        },
        colour: '#FFED00',
        fg: MonoColour.black,
    },
    {
        id: 'bus54',
        name: {
            [LanguageCode.English]: 'Bus 54',
        },
        colour: '#F3B1CD',
        fg: MonoColour.black,
    },
    {
        id: 'bus55',
        name: {
            [LanguageCode.English]: 'Bus 55',
        },
        colour: '#00B1E6',
        fg: MonoColour.black,
    },
    {
        id: 'bus59',
        name: {
            [LanguageCode.English]: 'Bus 59',
        },
        colour: '#DB619D',
    },
    {
        id: 'bus60',
        name: {
            [LanguageCode.English]: 'Bus 60',
        },
        colour: '#C4920E',
        fg: MonoColour.black,
    },
    {
        id: 'bus62',
        name: {
            [LanguageCode.English]: 'Bus 62',
        },
        colour: '#A0573F',
    },
    {
        id: 'bus63',
        name: {
            [LanguageCode.English]: 'Bus 63',
        },
        colour: '#FFE595',
        fg: MonoColour.black,
    },
    {
        id: 'bus65',
        name: {
            [LanguageCode.English]: 'Bus 65',
        },
        colour: '#A98B00',
    },
    {
        id: 'bus67',
        name: {
            [LanguageCode.English]: 'Bus 67',
        },
        colour: '#E20075',
    },
    {
        id: 'bus68',
        name: {
            [LanguageCode.English]: 'Bus 68',
        },
        colour: '#F7B171',
        fg: MonoColour.black,
    },
    {
        id: 'bus70',
        name: {
            [LanguageCode.English]: 'Bus 70',
        },
        colour: '#9C9E9F',
    },
    {
        id: 'bus75',
        name: {
            [LanguageCode.English]: 'Bus 75',
        },
        colour: '#D86C12',
    },
    {
        id: 'bus76',
        name: {
            [LanguageCode.English]: 'Bus 76',
        },
        colour: '#F7AE44',
        fg: MonoColour.black,
    },
    {
        id: 'bus78',
        name: {
            [LanguageCode.English]: 'Bus 78',
        },
        colour: '#B06D9B',
    },
    {
        id: 'bus79',
        name: {
            [LanguageCode.English]: 'Bus 79',
        },
        colour: '#00B0E6',
    },
    {
        id: 'bus80',
        name: {
            [LanguageCode.English]: 'Bus 80-83/86-88/B/CJ/EP/E/JM/L/M',
        },
        colour: '#88A0AB',
    },
    {
        id: 'bus91',
        name: {
            [LanguageCode.English]: 'Bus 91',
        },
        colour: '#F5AD88',
        fg: MonoColour.black,
    },
    {
        id: 'bus96',
        name: {
            [LanguageCode.English]: 'Bus 96',
        },
        colour: '#909737',
    },
    {
        id: 'bus97',
        name: {
            [LanguageCode.English]: 'Bus 97',
        },
        colour: '#EDE100',
        fg: MonoColour.black,
    },
    {
        id: 'bus102',
        name: {
            [LanguageCode.English]: 'Bus 102',
        },
        colour: '#EF8100',
    },
    {
        id: 'bus104',
        name: {
            [LanguageCode.English]: 'Bus 104',
        },
        colour: '#6783BC',
    },
    {
        id: 'bus107',
        name: {
            [LanguageCode.English]: 'Bus 107',
        },
        colour: '#F29400',
        fg: MonoColour.black,
    },
    {
        id: 'bus109',
        name: {
            [LanguageCode.English]: 'Bus 109',
        },
        colour: '#0070B8',
    },
    {
        id: 'bus112',
        name: {
            [LanguageCode.English]: 'Bus 112',
        },
        colour: '#99CDA9',
        fg: MonoColour.black,
    },
    {
        id: 'bus113',
        name: {
            [LanguageCode.English]: 'Bus 113',
        },
        colour: '#00A7E3',
    },
    {
        id: 'bus114',
        name: {
            [LanguageCode.English]: 'Bus 114',
        },
        colour: '#F2DB00',
        fg: MonoColour.black,
    },
    {
        id: 'bus115',
        name: {
            [LanguageCode.English]: 'Bus 115',
        },
        colour: '#E5C9D0',
        fg: MonoColour.black,
    },
    {
        id: 'bus116',
        name: {
            [LanguageCode.English]: 'Bus 116',
        },
        colour: '#E85290',
    },
    {
        id: 'bus117',
        name: {
            [LanguageCode.English]: 'Bus 117/132',
        },
        colour: '#0086CB',
    },
    {
        id: 'bus119',
        name: {
            [LanguageCode.English]: 'Bus 119/133',
        },
        colour: '#C7C1DE',
        fg: MonoColour.black,
    },
    {
        id: 'bus120',
        name: {
            [LanguageCode.English]: 'Bus 120',
        },
        colour: '#006B6A',
    },
    {
        id: 'bus121',
        name: {
            [LanguageCode.English]: 'Bus 121',
        },
        colour: '#E5316C',
    },
    {
        id: 'bus122',
        name: {
            [LanguageCode.English]: 'Bus 122',
        },
        colour: '#EB690A',
    },
    {
        id: 'bus123',
        name: {
            [LanguageCode.English]: 'Bus 123',
        },
        colour: '#B1C800',
        fg: MonoColour.black,
    },
    {
        id: 'bus124',
        name: {
            [LanguageCode.English]: 'Bus 124',
        },
        colour: '#006AB3',
    },
    {
        id: 'bus125',
        name: {
            [LanguageCode.English]: 'Bus 125',
        },
        colour: '#FAB700',
        fg: MonoColour.black,
    },
    {
        id: 'bus126',
        name: {
            [LanguageCode.English]: 'Bus 126',
        },
        colour: '#E2001A',
    },
    {
        id: 'bus127',
        name: {
            [LanguageCode.English]: 'Bus 127',
        },
        colour: '#C9E9F8',
        fg: MonoColour.black,
    },
    {
        id: 'bus129',
        name: {
            [LanguageCode.English]: 'Bus 129',
        },
        colour: '#A51A3E',
    },
    {
        id: 'bus130',
        name: {
            [LanguageCode.English]: 'Bus 130',
        },
        colour: '#FBCA81',
        fg: MonoColour.black,
    },
    {
        id: 'bus131',
        name: {
            [LanguageCode.English]: 'Bus 131',
        },
        colour: '#F9D2D8',
        fg: MonoColour.black,
    },
    {
        id: 'bus136',
        name: {
            [LanguageCode.English]: 'Bus 136',
        },
        colour: '#30B8CD',
    },
    {
        id: 'bus150',
        name: {
            [LanguageCode.English]: 'Bus 150',
        },
        colour: '#1EA22D',
    },
    {
        id: 'bus157',
        name: {
            [LanguageCode.English]: 'Bus 157',
        },
        colour: '#FFDD00',
        fg: MonoColour.black,
    },
    {
        id: 'bus165',
        name: {
            [LanguageCode.English]: 'Bus 165',
        },
        colour: '#D96195',
    },
    {
        id: 'bus185',
        name: {
            [LanguageCode.English]: 'Bus 185',
        },
        colour: '#E30062',
    },
    {
        id: 'bus191',
        name: {
            [LanguageCode.English]: 'Bus 191',
        },
        colour: '#BFCF1C',
        fg: MonoColour.black,
    },
    {
        id: 'bus192',
        name: {
            [LanguageCode.English]: 'Bus 192',
        },
        colour: '#864A0A',
    },
    {
        id: 'bus196',
        name: {
            [LanguageCode.English]: 'Bus 196',
        },
        colour: '#E53075',
    },
];

export default Barcelona;
