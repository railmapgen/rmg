import {
    Name,
    PanelTypeGZMTR,
    PanelTypeShmetro,
    RMGParam,
    RmgStyle,
    Services,
    ShortDirection,
    StationInfo,
} from '../../constants/constants';
import { MonoColour, Theme } from '@railmapgen/rmg-palette-resources';
import { LanguageCode } from '@railmapgen/rmg-translate';
import { nanoid } from 'nanoid';

const initTheme = (style: RmgStyle): Theme => {
    switch (style) {
        case RmgStyle.MTR:
            return ['hongkong', 'twl', '#E2231A', MonoColour.white];
        case RmgStyle.GZMTR:
            return ['guangzhou', 'gz1', '#F3D03E', MonoColour.black];
        case RmgStyle.SHMetro:
            return ['shanghai', 'sh1', '#E4002B', MonoColour.white];
        default:
            return ['other', 'other', '#AAAAAA', MonoColour.white];
    }
};

const initLineName = (language: LanguageCode): Name => {
    switch (language) {
        case 'zh-Hans':
            return ['1号线', 'Line 1'];
        case 'zh-Hant':
            return ['荃灣綫', 'Tsuen Wan Line'];
        default:
            return ['地鐵線', 'Metro Line'];
    }
};

export const initStationInfo = (id: string): StationInfo => ({
    name: ['未命名 ' + id, 'Unnamed ' + id],
    num: '00',
    services: [Services.local],
    parents: [],
    children: [],
    transfer: {
        groups: [{}],
        tick_direc: ShortDirection.right,
        paid_area: true,
    },
    loop_pivot: false,
    one_line: true,
    int_padding: 355,
});

export const initParam = (style: RmgStyle, language: LanguageCode): RMGParam => {
    // init station info
    const lineStartInfo = initStationInfo('linestart');
    lineStartInfo.name = ['LEFT END', 'LEFT END'];

    const lineEndInfo = initStationInfo('lineend');
    lineEndInfo.name = ['RIGHT END', 'RIGHT END'];

    const station1Id = nanoid(6);
    const station1Info = initStationInfo(station1Id);
    station1Info.num = '01';

    const station2Id = nanoid(6);
    const station2Info = initStationInfo(station2Id);
    station2Info.num = '02';

    // set parents and children
    lineStartInfo.children = [station1Id];

    station1Info.parents = ['linestart'];
    station1Info.children = [station2Id];

    station2Info.parents = [station1Id];
    station2Info.children = ['lineend'];

    lineEndInfo.parents = [station2Id];

    return {
        svgWidth: {
            destination: 1200,
            runin: 1200,
            railmap: 1200,
            indoor: 1200,
        },
        svg_height: 300,
        style: style,
        y_pc: 50,
        padding: 10,
        branchSpacingPct: 33,
        direction: ShortDirection.left,
        platform_num: '1',
        theme: initTheme(style),
        line_name: initLineName(language),
        current_stn_idx: station2Id,
        stn_list: {
            linestart: lineStartInfo,
            [station1Id]: station1Info,
            [station2Id]: station2Info,
            lineend: lineEndInfo,
        },
        namePosMTR: {
            isStagger: true,
            isFlip: true,
        },
        customiseMTRDest: {
            isLegacy: false,
            terminal: false,
        },
        line_num: '1',
        spanLineNum: true,
        psd_num: '1',
        info_panel_type: style === RmgStyle.SHMetro ? PanelTypeShmetro.sh : PanelTypeGZMTR.gz1,
        direction_gz_x: 40,
        direction_gz_y: 70,
        coline: {},
        loop: false,
        loop_info: {
            bank: true,
            left_and_right_factor: 1,
            bottom_factor: 1,
        },
    };
};
