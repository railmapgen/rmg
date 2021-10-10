import { LanguageCode, MonoColour, PaletteEntry } from '../constants';

/**
 * Colors from #142 (https://github.com/wongchito/RailMapGenerator/issues/142)
 * 圣保罗地铁官方网址/ São Paulo Metro：www.metro.sp.gov.br
 * 圣保罗都市圈铁道官方网址/CPTM：https://www.cptm.sp.gov.br
 * 圣保罗地铁6号线（工程官方网址）/Linhauni (Line 6)：https://www.linhauni.com.br/
 */
const SaoPaulo: PaletteEntry[] = [
    {
        id: 'sp1',
        name: {
            [LanguageCode.English]: 'Line 1',
            [LanguageCode.Portuguese]: 'Linha 1',
        },
        colour: '#0153A0',
    },
    {
        id: 'sp2',
        name: {
            [LanguageCode.English]: 'Line 2',
            [LanguageCode.Portuguese]: 'Linha 2',
        },
        colour: '#008061',
    },
    {
        id: 'sp3',
        name: {
            [LanguageCode.English]: 'Line 3',
            [LanguageCode.Portuguese]: 'Linha 3',
        },
        colour: '#EE3E34',
    },
    {
        id: 'sp4',
        name: {
            [LanguageCode.English]: 'Line 4',
            [LanguageCode.Portuguese]: 'Linha 4',
        },
        colour: '#FED304',
        fg: MonoColour.black,
    },
    {
        id: 'sp5',
        name: {
            [LanguageCode.English]: 'Line 5',
            [LanguageCode.Portuguese]: 'Linha 5',
        },
        colour: '#784D9F',
    },
    {
        id: 'sp6',
        name: {
            [LanguageCode.English]: 'Line 6',
            [LanguageCode.Portuguese]: 'Linha 6',
        },
        colour: '#F27C00',
        fg: MonoColour.black,
    },
    {
        id: 'sp7',
        name: {
            [LanguageCode.English]: 'Line 7',
            [LanguageCode.Portuguese]: 'Linha 7',
        },
        colour: '#9E1766',
    },
    {
        id: 'sp8',
        name: {
            [LanguageCode.English]: 'Line 8',
            [LanguageCode.Portuguese]: 'Linha 8',
        },
        colour: '#9E9E93',
    },
    {
        id: 'sp9',
        name: {
            [LanguageCode.English]: 'Line 9',
            [LanguageCode.Portuguese]: 'Linha 9',
        },
        colour: '#00A78E',
    },
    {
        id: 'sp10',
        name: {
            [LanguageCode.English]: 'Line 10',
            [LanguageCode.Portuguese]: 'Linha 10',
        },
        colour: '#007C8F',
    },
    {
        id: 'sp11',
        name: {
            [LanguageCode.English]: 'Line 11',
            [LanguageCode.Portuguese]: 'Linha 11',
        },
        colour: '#F04D22',
    },
    {
        id: 'sp12',
        name: {
            [LanguageCode.English]: 'Line 12',
            [LanguageCode.Portuguese]: 'Linha 12',
        },
        colour: '#083E89',
    },
    {
        id: 'sp13',
        name: {
            [LanguageCode.English]: 'Line 13',
            [LanguageCode.Portuguese]: 'Linha 13',
        },
        colour: '#00AB5B',
    },
    {
        id: 'sp15',
        name: {
            [LanguageCode.English]: 'Line 15',
            [LanguageCode.Portuguese]: 'Linha 15',
        },
        colour: '#858D90',
    },
];

export default SaoPaulo;
