import { LanguageCode, PaletteEntry } from '../constants';

/**
 * https://sl.se/en/getting-around/
 */
const Stockholm: PaletteEntry[] = [
    {
        id: 'tblue',
        name: {
            [LanguageCode.English]: 'Metro Line 10/11',
            sv: 'Tunnelbana Linje 10/11',
        },
        colour: '#008BD0',
    },
    {
        id: 'tred',
        name: {
            [LanguageCode.English]: 'Metro Line 13/14',
            sv: 'Tunnelbana Linje 13/14',
        },
        colour: '#DF0515',
    },
    {
        id: 'tgreen',
        name: {
            [LanguageCode.English]: 'Metro Line 17/18/19',
            sv: 'Tunnelbana Linje 17/18/19',
        },
        colour: '#00A84D',
    },
    {
        id: 'pt',
        name: {
            [LanguageCode.English]: 'Commuter Rail',
            sv: 'Pendeltåg',
        },
        colour: '#EA609E',
    },
    {
        id: 's7',
        name: {
            [LanguageCode.English]: 'Tram Line 7',
            sv: 'Spårvagn Linje 7',
        },
        colour: '#8E9287',
    },
    {
        id: 's12',
        name: {
            [LanguageCode.English]: 'Tram Line 12',
            sv: 'Spårvagn Linje 12',
        },
        colour: '#748CA6',
    },
    {
        id: 's21',
        name: {
            [LanguageCode.English]: 'Tram Line 21',
            sv: 'Spårvagn Linje 21',
        },
        colour: '#B8641E',
    },
    {
        id: 's22',
        name: {
            [LanguageCode.English]: 'Tram Line 22',
            sv: 'Spårvagn Linje 22',
        },
        colour: '#E38700',
    },
    {
        id: 'l25',
        name: {
            [LanguageCode.English]: 'Light Rail Line 25/26',
            sv: 'Lokalbana Linje 25/26',
        },
        colour: '#009FA8',
    },
    {
        id: 'l27',
        name: {
            [LanguageCode.English]: 'Light Rail Line 27/28/29',
            sv: 'Lokalbana Linje 27/28/29',
        },
        colour: '#A6559D',
    },
    {
        id: 'pb',
        name: {
            [LanguageCode.English]: 'Commuter Ferry',
            sv: 'Pendelbåt',
        },
        colour: '#009FE3',
    },
];

export default Stockholm;
