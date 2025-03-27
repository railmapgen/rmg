import { getLoopNextViaStations, getNormalNextStations } from './runin-utils';
import { BranchStyle, ShortDirection, StationDict, StationInfo } from '../../../constants/constants';
import { getRoutes } from '../../../redux/helper/graph-theory-util';

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

    describe('getNormalNextStations', () => {
        /**
         * stn0 - stn1 - stn2 - [stn3]
         *             \
         *               stn4 - [stn5]
         */
        const stationList = {
            linestart: {
                parents: [],
                children: ['stn0'],
            },
            stn0: {
                parents: ['linestart'],
                children: ['stn1'],
                transfer: {
                    groups: [
                        {
                            lines: [{ name: ['1号线', 'Line 1'] }],
                        },
                    ],
                },
            },
            stn1: {
                parents: ['stn0'],
                children: ['stn2', 'stn4'],
                branch: { right: [BranchStyle.through, 'stn2'] },
                transfer: { groups: [{ lines: [] }] },
            },
            stn2: {
                parents: ['stn1'],
                children: ['stn3'],
                transfer: { groups: [{ lines: [] }] },
            },
            stn3: {
                parents: ['stn2'],
                children: ['lineend'],
                transfer: {
                    groups: [
                        {
                            lines: [{ name: ['1号线', 'Line 1'] }],
                        },
                    ],
                },
            },
            stn4: {
                parents: ['stn1'],
                children: ['stn5'],
                transfer: { groups: [{ lines: [] }] },
            },
            stn5: {
                parents: ['stn4'],
                children: ['lineend'],
                transfer: {
                    groups: [
                        {
                            lines: [{ name: ['2号线', 'Line 2'] }],
                        },
                    ],
                },
            },
            lineend: {
                parents: ['stn3', 'stn5'],
                children: [],
                branch: { left: [BranchStyle.through, 'stn3'] },
            },
        } as unknown as StationDict;
        const routes = getRoutes(stationList);

        it('Can get next station and via stations for all scenarios of non-loop line', () => {
            expect(getNormalNextStations(routes, stationList, 'stn1', ShortDirection.right)).toEqual({
                nextStations: ['stn2', 'stn4'],
                viaStations: ['stn3'],
            });
            expect(getNormalNextStations(routes, stationList, 'stn1', ShortDirection.left)).toEqual({
                nextStations: ['stn0'],
                viaStations: ['stn0'],
            });
            expect(getNormalNextStations(routes, stationList, 'stn2', ShortDirection.right)).toEqual({
                nextStations: ['stn3'],
                viaStations: ['stn3'],
            });
            expect(getNormalNextStations(routes, stationList, 'stn2', ShortDirection.left)).toEqual({
                nextStations: ['stn1'],
                viaStations: ['stn0'],
            });
            expect(getNormalNextStations(routes, stationList, 'stn4', ShortDirection.right)).toEqual({
                nextStations: ['stn5'],
                viaStations: ['stn5'],
            });
            expect(getNormalNextStations(routes, stationList, 'stn4', ShortDirection.left)).toEqual({
                nextStations: ['stn1'],
                viaStations: ['stn0'],
            });
        });
    });
});
