import { getLoopNextViaStations } from './runin-utils';
import { StationInfo } from '../../../constants/constants';

describe('GZMTRRuninUtils', () => {
    describe('getLoopNextViaStations', () => {
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
            bprime: {
                transfer: {
                    groups: [
                        {
                            lines: [{ name: ['4号线', 'Line 4'] }],
                        },
                    ],
                },
                underConstruction: 'temp',
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
            expect(getLoopNextViaStations(stations, stationList, 'g', 'e', false)).toEqual({
                nextStations: ['a'],
                viaStations: ['b', 'c', 'e'],
            });
            expect(getLoopNextViaStations(stations, stationList, 'a', 'c', true)).toEqual({
                nextStations: ['g'],
                viaStations: ['f', 'd', 'c'],
            });

            expect(getLoopNextViaStations(stations, stationList, 'g', undefined, false)).toEqual({
                nextStations: ['a'],
                viaStations: ['b', 'c', 'd'],
            });
            expect(getLoopNextViaStations(stations, stationList, 'a', undefined, true)).toEqual({
                nextStations: ['g'],
                viaStations: ['f', 'd', 'c'],
            });
        });
    });
});
