import { MonoColour } from '@railmapgen/rmg-palette-resources';
import { vi } from 'vitest';
import {
    dottieGet,
    getMatchedThemesWithPaths,
    updateThemes,
    v5_10_updateInterchangeGroup,
    v5_17_updateLocalisedName,
    v5_18_addStationNameSpacingAndSvgWidthPlatform,
} from './param-updater-utils';
import { waitForMs } from './utils';

const originalFetch = global.fetch;

describe('ParamUpdaterUtils', () => {
    afterEach(() => {
        global.fetch = originalFetch;
    });

    it('v5_10_updateInterchangeGroup', () => {
        const param: Record<string, any> = {
            stn_list: {
                stn0: {
                    transfer: {
                        info: [[]],
                        osi_names: [],
                    },
                },
                stn1: {
                    transfer: {
                        info: [[['hongkong', 'twl', '#E2231A', MonoColour.white, '荃灣綫', 'Tsuen Wan Line']], []],
                        osi_names: [],
                    },
                },
                stn2: {
                    transfer: {
                        info: [
                            [['hongkong', 'twl', '#E2231A', MonoColour.white, '荃灣綫', 'Tsuen Wan Line']],
                            [['hongkong', 'ktl', '#00AF41', MonoColour.white, '觀塘綫', 'Kwun Tong Line']],
                        ],
                        osi_names: [['車站', 'Station']],
                    },
                },
            },
        };
        v5_10_updateInterchangeGroup(param);

        // data upgraded
        expect(param.stn_list.stn0.transfer.groups[0]).toEqual({ lines: [] });
        expect(param.stn_list.stn0.transfer.groups[1]).toBeUndefined();

        expect(param.stn_list.stn1.transfer.groups[0]).toEqual({
            lines: [{ theme: ['hongkong', 'twl', '#E2231A', MonoColour.white], name: ['荃灣綫', 'Tsuen Wan Line'] }],
        });
        expect(param.stn_list.stn1.transfer.groups[1]).toEqual({ lines: [] });

        expect(param.stn_list.stn2.transfer.groups[0]).toEqual({
            lines: [{ theme: ['hongkong', 'twl', '#E2231A', MonoColour.white], name: ['荃灣綫', 'Tsuen Wan Line'] }],
        });
        expect(param.stn_list.stn2.transfer.groups[1]).toEqual({
            name: ['車站', 'Station'],
            lines: [{ theme: ['hongkong', 'ktl', '#00AF41', MonoColour.white], name: ['觀塘綫', 'Kwun Tong Line'] }],
        });

        // legacy fields removed
        expect(param.stn_list.stn0.transfer.info).toBeUndefined();
        expect(param.stn_list.stn0.transfer.osi_names).toBeUndefined();
        expect(param.stn_list.stn1.transfer.info).toBeUndefined();
        expect(param.stn_list.stn1.transfer.osi_names).toBeUndefined();
        expect(param.stn_list.stn2.transfer.info).toBeUndefined();
        expect(param.stn_list.stn2.transfer.osi_names).toBeUndefined();
    });

    it('v5_10_updateInterchangeGroup - post upgrade', () => {
        const param: Record<string, any> = {
            stn_list: {
                stn0: {
                    transfer: {
                        groups: [
                            {
                                lines: [
                                    {
                                        theme: ['hongkong', 'twl', '#E2231A', MonoColour.white],
                                        name: ['荃灣綫', 'Tsuen Wan Line'],
                                    },
                                ],
                            },
                        ],
                    },
                },
            },
        };
        v5_10_updateInterchangeGroup(param);

        // nothing changed
        expect(param.stn_list.stn0.transfer.groups[0]).toEqual({
            lines: [{ theme: ['hongkong', 'twl', '#E2231A', MonoColour.white], name: ['荃灣綫', 'Tsuen Wan Line'] }],
        });
    });

    it('v5_17_updateLocalisedName', () => {
        const param: Record<string, any> = {
            stn_list: {
                stn0: {
                    name: ['車站0', 'Station 0'],
                    secondaryName: ['次要站名0', 'Additional Name 0'],
                },
            },
        };
        v5_17_updateLocalisedName(param);

        expect(param.stn_list.stn0.localisedName).toEqual({ zh: '車站0', en: 'Station 0' });
        expect(param.stn_list.stn0.localisedSecondaryName).toEqual({
            zh: '次要站名0',
            en: 'Additional Name 0',
        });
        expect(param.stn_list.stn0).not.toHaveProperty('name');
        expect(param.stn_list.stn0).not.toHaveProperty('secondaryName');
    });

    it('v5_17_updateLocalisedName - no secondary name', () => {
        const param: Record<string, any> = {
            stn_list: {
                stn0: {
                    name: ['車站0', 'Station 0'],
                },
            },
        };
        v5_17_updateLocalisedName(param);

        expect(param.stn_list.stn0.localisedName).toEqual({ zh: '車站0', en: 'Station 0' });
        expect(param.stn_list.stn0).not.toHaveProperty('localisedSecondaryName');
        expect(param.stn_list.stn0).not.toHaveProperty('name');
        expect(param.stn_list.stn0).not.toHaveProperty('secondaryName');
    });

    it('v5_18_addStationNameSpacingAndSvgWidthPlatform', () => {
        const param: Record<string, any> = { svgWidth: {}, stn_list: { stn0: {}, stn1: { character_spacing: 0 } } };
        v5_18_addStationNameSpacingAndSvgWidthPlatform(param);

        expect(param.svgWidth.platform).toEqual(1200);
        expect(param.stn_list.stn0.character_spacing).toEqual(75);
        expect(param.stn_list.stn1.character_spacing).toEqual(0);
    });

    it('Can find all matched themes with paths as expected', () => {
        const obj = {
            theme: ['hongkong', 'twl', '#E2231A', '#fff'],
            unrelated: 'abc',
            nested: {
                themes: [
                    ['guangzhou', 'gz1', '#F3D03E', '#000'],
                    ['Chinese name', 'English name'],
                    ['guangzhou', 'gz2', '#00629b', '#fff'],
                ],
                deeply: {
                    inside: ['guangzhou', 'gz3', '#ECA154', '#fff'],
                },
            },
            deep: [
                {
                    val: ['shanghai', 'gz1', '#E3002B', '#fff'],
                },
                {
                    fake: ['shanghai', 'is', 'a', 'city'],
                },
            ],
        };

        const result = getMatchedThemesWithPaths(obj);
        console.log(result);

        expect(result).toHaveLength(5);
        expect(result).toContainEqual(expect.objectContaining({ path: 'theme' }));
        expect(result).toContainEqual(expect.objectContaining({ path: 'nested.themes.0' }));
        expect(result).toContainEqual(expect.objectContaining({ path: 'nested.themes.2' }));
        expect(result).toContainEqual(expect.objectContaining({ path: 'nested.deeply.inside' }));
        expect(result).toContainEqual(expect.objectContaining({ path: 'deep.0.val' }));
    });

    it('Can return partially updated param when timed out', async () => {
        const mockFetch = vi.fn().mockImplementation(async () => {
            await waitForMs(1500);
            return { json: () => Promise.resolve([{ id: 'm', colour: '#bbbbbb' }]) };
        });
        global.fetch = mockFetch;

        const mockParam = [
            ['hongkong', 'm', '#aaaaaa', '#fff'],
            ['guangzhou', 'm', '#aaaaaa', '#fff'],
            ['shanghai', 'm', '#aaaaaa', '#fff'],
            ['london', 'm', '#aaaaaa', '#fff'],
            ['newyork', 'm', '#aaaaaa', '#fff'],
        ];

        const updatedParam: any = await updateThemes(mockParam as any);
        console.log(updatedParam);

        expect(updatedParam[0][2]).toBe('#bbbbbb');
        expect(updatedParam[1][2]).toBe('#bbbbbb');
        expect(updatedParam[2][2]).toBe('#bbbbbb');
        expect(updatedParam[3][2]).toBe('#aaaaaa'); // no time to update this
        expect(updatedParam[4][2]).toBe('#aaaaaa'); // no time to update this

        await waitForMs(3000); // by now 8 sec passed
        expect(mockFetch).toBeCalledTimes(4); // 5th time isn't called
    }, 10_000);

    it('dottie get with wildcard', () => {
        const obj = {
            stations: {
                a: { name: 'A', facility: '' },
                b: { name: 'B' },
                c: { name: 'C', secondaryName: 'c' },
                d: { name: 'D', secondaryName: '' },
            },
            interchanges: {
                groups: [{ lines: [{ name: '1' }, { name: '2' }] }, { lines: [{ name: '3' }] }],
                osi: true,
            },
            notes: [],
            loop: {
                bank: true,
            },
        };

        expect(dottieGet(obj, 'stations.*.secondaryName')).toEqual({
            'stations.c.secondaryName': 'c',
            'stations.d.secondaryName': '',
        });
        expect(dottieGet(obj, 'stations.*.facility')).toEqual({ 'stations.a.facility': '' });
        expect(dottieGet(obj, 'interchanges.groups.*.lines.*.name')).toEqual({
            'interchanges.groups.0.lines.0.name': '1',
            'interchanges.groups.0.lines.1.name': '2',
            'interchanges.groups.1.lines.0.name': '3',
        });
        expect(dottieGet(obj, 'notes')).toEqual({ notes: [] });
        expect(dottieGet(obj, 'loop.bank')).toEqual({ 'loop.bank': true });
    });
});
