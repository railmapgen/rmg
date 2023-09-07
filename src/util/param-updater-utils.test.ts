import { MonoColour } from '@railmapgen/rmg-palette-resources';
import { getMatchedThemesWithPaths, updateThemes, v5_10_updateInterchangeGroup } from './param-updater-utils';
import { vi } from 'vitest';
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
});
