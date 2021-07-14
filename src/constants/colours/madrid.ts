import { LanguageCode, MonoColour, PaletteEntry } from '../constants';

/**
 * Metro and Light Rail except ML4: https://www.metromadrid.es/es/viaja-en-metro/plano-de-metro-de-madrid.
 * Cercanías and ML4: https://www.crtm.es/atencion-al-cliente/area-de-descargas/planos.aspx
 */
const Madrid: PaletteEntry[] = [
    {
        id: 'm1',
        name: {
            [LanguageCode.English]: 'Metro Line 1',
            es: 'Metro Línea 1',
        },
        colour: '#36B3E6',
    },
    {
        id: 'm2',
        name: {
            [LanguageCode.English]: 'Metro Line 2',
            es: 'Metro Línea 2',
        },
        colour: '#E5271A',
    },
    {
        id: 'm3',
        name: {
            [LanguageCode.English]: 'Metro Line 3',
            es: 'Metro Línea 3',
        },
        colour: '#FFD700',
        fg: MonoColour.black,
        // fg: "#004892"
    },
    {
        id: 'm4',
        name: {
            [LanguageCode.English]: 'Metro Line 4',
            es: 'Metro Línea 4',
        },
        colour: '#AB5D25',
    },
    {
        id: 'm5',
        name: {
            [LanguageCode.English]: 'Metro Line 5',
            es: 'Metro Línea 5',
        },
        colour: '#7ABD28',
    },
    {
        id: 'm6',
        name: {
            [LanguageCode.English]: 'Metro Line 6',
            es: 'Metro Línea 6',
        },
        colour: '#7A868B',
    },
    {
        id: 'm7',
        name: {
            [LanguageCode.English]: 'Metro Line 7',
            es: 'Metro Línea 7',
        },
        colour: '#F49C00',
    },
    {
        id: 'm8',
        name: {
            [LanguageCode.English]: 'Metro Line 8',
            es: 'Metro Línea 8',
        },
        colour: '#DD71A8',
    },
    {
        id: 'm9',
        name: {
            [LanguageCode.English]: 'Metro Line 9',
            es: 'Metro Línea 9',
        },
        colour: '#A01E87',
    },
    {
        id: 'm10',
        name: {
            [LanguageCode.English]: 'Metro Line 10',
            es: 'Metro Línea 10',
        },
        colour: '#004892',
    },
    {
        id: 'm11',
        name: {
            [LanguageCode.English]: 'Metro Line 11',
            es: 'Metro Línea 11',
        },
        colour: '#009D42',
    },
    {
        id: 'm12',
        name: {
            [LanguageCode.English]: 'Metro Line 12',
            es: 'Metro Línea 12',
        },
        colour: '#B0A400',
    },
    {
        id: 'r',
        name: {
            [LanguageCode.English]: 'Ramal',
        },
        colour: '#004892',
    },
    {
        id: 'ml1',
        name: {
            [LanguageCode.English]: 'ML1',
        },
        colour: '#4F82C3',
    },
    {
        id: 'ml2',
        name: {
            [LanguageCode.English]: 'ML2',
        },
        colour: '#A01E87',
    },
    {
        id: 'ml3',
        name: {
            [LanguageCode.English]: 'ML3',
        },
        colour: '#E94D31',
    },
    {
        id: 'ml4',
        name: {
            [LanguageCode.English]: 'ML4',
        },
        colour: '#009849',
    },
    {
        id: 'c1',
        name: {
            [LanguageCode.English]: 'Cercanías C-1',
        },
        colour: '#77b5d7',
    },
    {
        id: 'c2',
        name: {
            [LanguageCode.English]: 'Cercanías C-2',
        },
        colour: '#009252',
    },
    {
        id: 'c3',
        name: {
            [LanguageCode.English]: 'Cercanías C-3',
        },
        colour: '#8d3b84',
    },
    {
        id: 'c3a',
        name: {
            [LanguageCode.English]: 'Cercanías C-3a',
        },
        colour: '#ea5ebe',
    },
    {
        id: 'c4',
        name: {
            [LanguageCode.English]: 'Cercanías C-4a/C-4b',
        },
        colour: '#2a5f9b',
    },
    {
        id: 'c5',
        name: {
            [LanguageCode.English]: 'Cercanías C-5',
        },
        colour: '#f3b137',
    },
    {
        id: 'c7',
        name: {
            [LanguageCode.English]: 'Cercanías C-7',
        },
        colour: '#db3c37',
    },
    {
        id: 'c8',
        name: {
            [LanguageCode.English]: 'Cercanías C-8',
        },
        colour: '#636463',
    },
    {
        id: 'c9',
        name: {
            [LanguageCode.English]: 'Cercanías C-9',
        },
        colour: '#ed9a43',
    },
    {
        id: 'c10',
        name: {
            [LanguageCode.English]: 'Cercanías C-10',
        },
        colour: '#b6d144',
    },
];

export default Madrid;
