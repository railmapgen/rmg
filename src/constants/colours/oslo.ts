import { LanguageCode, MonoColour, PaletteEntry } from '../constants';

/**
 * https://ruter.no/en/journey/route-maps/
 */
const Oslo: PaletteEntry[] = [
    {
        id: 't1',
        name: {
            [LanguageCode.English]: 'Metro Line 1',
            no: 'T-bane Linje 1',
        },
        colour: '#009CDC',
    },
    {
        id: 't2',
        name: {
            [LanguageCode.English]: 'Metro Line 2',
            no: 'T-bane Linje 2',
        },
        colour: '#EA5B0C',
    },
    {
        id: 't3',
        name: {
            [LanguageCode.English]: 'Metro Line 3',
            no: 'T-bane Linje 3',
        },
        colour: '#A863A5',
    },
    {
        id: 't4',
        name: {
            [LanguageCode.English]: 'Metro Line 4',
            no: 'T-bane Linje 4',
        },
        colour: '#004899',
    },
    {
        id: 't5',
        name: {
            [LanguageCode.English]: 'Metro Line 5',
            no: 'T-bane Linje 5',
        },
        colour: '#3AAA35',
    },
    {
        id: 'trikk11',
        name: {
            [LanguageCode.English]: 'Tram Line 11',
            no: 'Trikk Linje 11',
        },
        colour: '#88BD25',
    },
    {
        id: 'trikk11b',
        name: {
            [LanguageCode.English]: 'Tram Line 11B',
            no: 'Trikk Linje 11B',
        },
        colour: '#E30D18',
    },
    {
        id: 'trikk12',
        name: {
            [LanguageCode.English]: 'Tram Line 12',
            no: 'Trikk Linje 12',
        },
        colour: '#AA63A5',
    },
    {
        id: 'trikk13',
        name: {
            [LanguageCode.English]: 'Tram Line 13',
            no: 'Trikk Linje 13',
        },
        colour: '#10A85F',
    },
    {
        id: 'trikk17',
        name: {
            [LanguageCode.English]: 'Tram Line 17',
            no: 'Trikk Linje 17',
        },
        colour: '#E63612',
    },
    {
        id: 'trikk18',
        name: {
            [LanguageCode.English]: 'Tram Line 18',
            no: 'Trikk Linje 18',
        },
        colour: '#FBBA00',
    },
    {
        id: 'trikk19',
        name: {
            [LanguageCode.English]: 'Tram Line 19',
            no: 'Trikk Linje 19',
        },
        colour: '#F4951F',
    },
    {
        id: 'bus20',
        name: {
            [LanguageCode.English]: 'City Bus 20/23/28/37/79/82E/83/84E',
            no: 'Bybuss 20/23/28/37/79/82E/83/84E',
        },
        colour: '#ED1D24',
    },
    {
        id: 'bus21',
        name: {
            [LanguageCode.English]: 'City Bus 21/31/31E/65/70/71B',
            no: 'Bybuss 21/31/31E/65/70/71B',
        },
        colour: '#003E5E',
    },
    {
        id: 'bus24',
        name: {
            [LanguageCode.English]: 'City Bus 24/34/45/68/69/81',
            no: 'Bybuss 24/34/45/68/69/81',
        },
        colour: '#8E5CA5',
    },
    {
        id: 'bus25',
        name: {
            [LanguageCode.English]: 'City Bus 25/32/48/72/73/85',
            no: 'Bybuss 25/32/48/72/73/85',
        },
        colour: '#00B3F0',
    },
    {
        id: 'bus30',
        name: {
            [LanguageCode.English]: 'City Bus 30/46/66/75/77/78',
            no: 'Bybuss 30/46/66/75/77/78',
        },
        colour: '#8DC63F',
    },
    {
        id: 'bus33',
        name: {
            [LanguageCode.English]: 'City Bus 33/40/51/60/61/74/86/88',
            no: 'Bybuss 33/40/51/60/61/74/86/88',
        },
        colour: '#F68B1F',
    },
    {
        id: 'bus41',
        name: {
            [LanguageCode.English]: 'City Bus 41/54/56/67/76',
            no: 'Bybuss 41/54/56/67/76',
        },
        colour: '#0072BC',
    },
    {
        id: 'bus58',
        name: {
            [LanguageCode.English]: 'City Bus 58/62/64/71A/80/80E/87',
            no: 'Bybuss 58/62/64/71A/80/80E/87',
        },
        colour: '#00A651',
    },
    {
        id: 'bus63',
        name: {
            [LanguageCode.English]: 'City Bus 63',
            no: 'Bybuss 63',
        },
        colour: '#006CB7',
    },
    {
        id: 'natt1n',
        name: {
            [LanguageCode.English]: 'City Night Bus 1N/2N/18N',
            no: 'Nattbuss By 1N/2N/18N',
        },
        colour: '#F78D33',
        fg: MonoColour.black,
    },
    {
        id: 'natt3n',
        name: {
            [LanguageCode.English]: 'City Night Bus 3N/4N/5N/70N',
            no: 'Nattbuss By 3N/4N/5N/70N',
        },
        colour: '#FFCF31',
        fg: MonoColour.black,
    },
    {
        id: 'natt11n',
        name: {
            [LanguageCode.English]: 'City Night Bus 11N/81N/83N',
            no: 'Nattbuss By 11N/81N/83N',
        },
        colour: '#B28ABF',
        fg: MonoColour.black,
    },
    {
        id: 'natt12n',
        name: {
            [LanguageCode.English]: 'City Night Bus 12N/54',
            no: 'Nattbuss By 12N/54',
        },
        colour: '#EF4130',
        fg: MonoColour.black,
    },
    {
        id: 'natt20',
        name: {
            [LanguageCode.English]: 'City Night Bus 20/21',
            no: 'Nattbuss By 20/21',
        },
        colour: '#83C452',
        fg: MonoColour.black,
    },
    {
        id: 'natt30n',
        name: {
            [LanguageCode.English]: 'City Night Bus 30N/31/32N/63N',
            no: 'Nattbuss By 30N/31/32N/63N',
        },
        colour: '#F599B1',
        fg: MonoColour.black,
    },
    {
        id: 'natt37',
        name: {
            [LanguageCode.English]: 'City Night Bus 37',
            no: 'Nattbuss By 37',
        },
        colour: '#4BC4D4',
        fg: MonoColour.black,
    },
    {
        id: 'natt81n',
        name: {
            [LanguageCode.English]: 'Regional Night Bus 81N/110/240N',
            no: 'Nattbuss Region 81N/110/240N',
        },
        colour: '#6DCFF6',
        fg: MonoColour.black,
    },
    {
        id: 'natt100',
        name: {
            [LanguageCode.English]: 'Regional Night Bus 100/130N/140N/150/160/550',
            no: 'Nattbuss Region 100/130N/140N/150/160/550',
        },
        colour: '#FFCF31',
        fg: MonoColour.black,
    },
    {
        id: 'natt210',
        name: {
            [LanguageCode.English]: 'Regional Night Bus 210/220/380/510/575',
            no: 'Nattbuss Region 210/220/380/510/575',
        },
        colour: '#9ACA3C',
        fg: MonoColour.black,
    },
    {
        id: 'natt230',
        name: {
            [LanguageCode.English]: 'Regional Night Bus 230/340/350/520/560',
            no: 'Nattbuss Region 230/340/350/520/560',
        },
        colour: '#F287B7',
        fg: MonoColour.black,
    },
    {
        id: 'natt250n',
        name: {
            [LanguageCode.English]: 'Regional Night Bus 250N/300/400/500N/540N',
            no: 'Nattbuss Region 250N/300/400/500N/540N',
        },
        colour: '#EF4136',
        fg: MonoColour.black,
    },
    {
        id: 'natt390n',
        name: {
            [LanguageCode.English]: 'Regional Night Bus 390N/B10',
            no: 'Nattbuss Region 390N/B10',
        },
        colour: '#F78D33',
        fg: MonoColour.black,
    },
    {
        id: 'b1',
        name: {
            [LanguageCode.English]: 'Ferry Service B1/B2/B3/B4',
            no: 'Båt B1/B2/B3/B4',
        },
        colour: '#003D64',
    },
    {
        id: 'b9',
        name: {
            [LanguageCode.English]: 'Ferry Service B9',
            no: 'Båt B9',
        },
        colour: '#9FA0A0',
    },
    {
        id: 'b10',
        name: {
            [LanguageCode.English]: 'Ferry Service B10',
            no: 'Båt B10',
        },
        colour: '#E50315',
    },
    {
        id: 'b11',
        name: {
            [LanguageCode.English]: 'Ferry Service B11',
            no: 'Båt B11',
        },
        colour: '#F8B500',
    },
    {
        id: 'b20',
        name: {
            [LanguageCode.English]: 'Ferry Service B20/B21/B22',
            no: 'Båt B20/B21/B22',
        },
        colour: '#6FBA2C',
    },
];

export default Oslo;
