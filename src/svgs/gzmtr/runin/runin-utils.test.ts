import { getNextViaStations } from './runin-utils';
import { StationInfo } from '../../../constants/constants';

describe('GZMTRRuninUtils', () => {
    describe('getNextViaStations', () => {
        const stationList = {
            a: { transfer: { groups: [{ lines: [] }] } },
            b: {
                transfer: {
                    groups: [
                        {
                            lines: [{ name: ['1号线', 'Line 1'] }],
                        },
                    ],
                },
            },
            c: { transfer: { groups: [{ lines: [] }] }, loop_pivot: true },
            d: {
                transfer: {
                    groups: [
                        {
                            lines: [{ name: ['2号线', 'Line 2'] }],
                        },
                    ],
                },
            },
            e: { transfer: { groups: [{ lines: [] }] } },
            f: {
                transfer: {
                    groups: [
                        {
                            lines: [{ name: ['3号线', 'Line 3'] }],
                        },
                    ],
                },
            },
            g: { transfer: { groups: [{ lines: [] }] } },
        } as unknown as Record<string, StationInfo>;
        const stations = Object.keys(stationList);

        it('Can get next station and via stations for all scenarios', () => {
            expect(getNextViaStations(stations, stationList, 'g', 'e', false)).toEqual({
                nextStation: 'a',
                viaStations: ['b', 'c', 'e'],
            });
            expect(getNextViaStations(stations, stationList, 'a', 'c', true)).toEqual({
                nextStation: 'g',
                viaStations: ['f', 'd', 'c'],
            });

            expect(getNextViaStations(stations, stationList, 'g', undefined, false)).toEqual({
                nextStation: 'a',
                viaStations: ['b', 'c', 'd'],
            });
            expect(getNextViaStations(stations, stationList, 'a', undefined, true)).toEqual({
                nextStation: 'g',
                viaStations: ['f', 'd', 'c'],
            });
        });
    });
});
