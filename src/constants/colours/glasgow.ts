import { LanguageCode, PaletteEntry } from '../constants';

const Glasgow: PaletteEntry[] = [
    {
        id: 'inner',
        name: {
            [LanguageCode.English]: 'Inner Circle',
        },
        colour: '#4f4c4d',
    },
    {
        id: 'outer',
        name: {
            [LanguageCode.English]: 'Outer Circle',
        },
        colour: '#f57c14',
    },
];

export default Glasgow;
