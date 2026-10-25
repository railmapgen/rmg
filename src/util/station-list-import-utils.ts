// TXT 车站列表导入：将逐行站点与换乘线路转换为完整 RMGParam。
import { MonoColour, Theme } from '@railmapgen/rmg-palette-resources';
import { LanguageCode } from '@railmapgen/rmg-translate';
import { nanoid } from 'nanoid';
import { pinyin } from 'pinyin-pro';
import { ExtendedInterchangeInfo, RMGParam, RmgStyle, StationDict, StationInfo } from '../constants/constants';
import { initParam, initStationInfo } from '../redux/param/util';
import { getOfflineEnglishName } from './station-name-dictionary-utils';

interface StationListRow {
    name: string;
    interchanges: string[];
}

export class StationListImportError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'StationListImportError';
    }
}

const parseStationList = (text: string): StationListRow[] =>
    text
        .replace(/^\uFEFF/, '')
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(Boolean)
        .map(line => {
            const [name, ...interchanges] = line.split(/\s+/);
            return { name, interchanges };
        });

const unique = (items: string[]) => [...new Set(items)];

const hasHan = (value: string) => /[\u3400-\u9FFF\uF900-\uFAFF]/.test(value);

/**
 * 优先使用离线官方词典中的英文名称。词条缺失或不可可靠翻译时，
 * 仅将当前名称回退为连续拼音，例如“新庄”转换为“Xinzhuang”。
 */
const getDefaultEnglishName = (name: string, style: RmgStyle) => {
    if (!hasHan(name)) return name;

    const offlineEnglishName = getOfflineEnglishName(name, style);
    if (offlineEnglishName) return offlineEnglishName;

    return pinyin(name, {
        toneType: 'none',
        type: 'array',
        nonZh: 'consecutive',
    })
        .join('')
        .replace(/\s+/g, '')
        .replace(/[a-z]/, letter => letter.toUpperCase());
};

/**
 * 将纯文本车站列表转换为可直接导入的线路参数。
 *
 * 每行格式：`车站名称 可换乘线路1 可换乘线路2 ...`。
 * 首尾车站名称相同时，最后一站作为环线闭合标记，不创建重复站点。
 */
export const convertStationListToParam = (text: string, language: LanguageCode, style = RmgStyle.GZMTR): RMGParam => {
    const rows = parseStationList(text);
    const isLoop = rows.length > 1 && rows[0].name === rows[rows.length - 1].name;
    const stations = isLoop ? rows.slice(0, -1) : rows;

    if (isLoop) {
        stations[0] = {
            ...stations[0],
            interchanges: unique([...stations[0].interchanges, ...rows[rows.length - 1].interchanges]),
        };
    }

    const minimumStationCount = isLoop ? 3 : 2;
    if (stations.length < minimumStationCount) {
        throw new StationListImportError(
            `A ${isLoop ? 'loop line' : 'line'} requires at least ${minimumStationCount} different stations`
        );
    }

    const param = initParam(style, language);
    const usedIds = new Set(Object.keys(param.stn_list));
    const stationIds = stations.map(station => {
        let id = nanoid(6);
        while (usedIds.has(id)) {
            id = nanoid(6);
        }
        usedIds.add(id);
        return { id, station };
    });
    const interchangeTheme: Theme = [param.theme[0], '', '#AAAAAA', MonoColour.white];
    const stationList = stationIds.reduce<StationDict>((acc, { id, station }, index) => {
        const interchanges: ExtendedInterchangeInfo[] = unique(station.interchanges).map(name => ({
            theme: [...interchangeTheme],
            name: [name, getDefaultEnglishName(name, style)],
        }));
        const stationInfo: StationInfo = {
            ...initStationInfo(id),
            localisedName: { zh: station.name, en: getDefaultEnglishName(station.name, style) },
            num: (index + 1).toString().padStart(2, '0'),
            parents: index === 0 ? ['linestart'] : [stationIds[index - 1].id],
            children: index === stationIds.length - 1 ? ['lineend'] : [stationIds[index + 1].id],
            transfer: {
                ...initStationInfo(id).transfer,
                groups: [{ lines: interchanges }],
            },
        };
        return { ...acc, [id]: stationInfo };
    }, {});

    param.stn_list = {
        linestart: {
            ...param.stn_list.linestart,
            children: [stationIds[0].id],
        },
        ...stationList,
        lineend: {
            ...param.stn_list.lineend,
            parents: [stationIds[stationIds.length - 1].id],
        },
    };
    param.current_stn_idx = stationIds[0].id;
    param.loop = isLoop;

    if (isLoop) {
        param.loop_info = {
            bank: true,
            left_and_right_factor: 0,
            bottom_factor: 1,
        };
    }

    return param;
};
