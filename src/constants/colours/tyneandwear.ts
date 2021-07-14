import { LanguageCode, PaletteEntry } from '../constants';

/**
 * https://www.nexus.org.uk/metro
 */
const TyneAndWear: PaletteEntry[] = [
    {
        id: 'yellow',
        name: {
            [LanguageCode.English]: 'Yellow Line',
        },
        colour: '#FABF00',
    },
    {
        id: 'green',
        name: {
            [LanguageCode.English]: 'Green Line',
        },
        colour: '#0EAB4A',
    },
    {
        id: 'bus',
        name: {
            [LanguageCode.English]: 'Bus',
        },
        colour: '#e9172a',
    },
    {
        id: 'ferry',
        name: {
            [LanguageCode.English]: 'Ferry',
        },
        colour: '#82CEF3',
    },
];

export default TyneAndWear;
