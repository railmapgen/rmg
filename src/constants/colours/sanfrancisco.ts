import { LanguageCode, PaletteEntry } from '../constants';

const SanFrancisco: PaletteEntry[] = [
    {
        id: 'orange',
        name: {
            [LanguageCode.English]: 'Richmond–Warm Springs/South Fremont Line',
        },
        colour: '#F9A01B',
    },
    {
        id: 'yellow',
        name: {
            [LanguageCode.English]: 'Antioch–SFO/Millbrae Line',
        },
        colour: '#FFF44E',
    },
    {
        id: 'green',
        name: {
            [LanguageCode.English]: 'Warm Springs/South Fremont–Daly City Line',
        },
        colour: '#4DB848',
    },
    {
        id: 'red',
        name: {
            [LanguageCode.English]: 'Richmond–Daly City/Millbrae Line',
        },
        colour: '#E21156',
    },
    {
        id: 'blue',
        name: {
            [LanguageCode.English]: 'Dublin/Pleasanton–Daly City Line',
        },
        colour: '#00AEEF',
    },
    {
        id: 'shuttle',
        name: {
            [LanguageCode.English]: 'SFO–Millbrae Line',
        },
        colour: '#903E98',
    },
    {
        id: 'oak',
        name: {
            [LanguageCode.English]: 'Coliseum–Oakland International Airport Line',
        },
        colour: '#D4CFA2',
    },
];

export default SanFrancisco;
