import { MonoColour } from '@railmapgen/rmg-palette-resources';
import { v5_10_updateInterchangeGroup } from './param-updater-utils';

describe('ParamUpdaterUtils', () => {
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
});
