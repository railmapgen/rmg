// 领域常量与类型定义：描述线路参数、车站拓扑、画布和样式枚举。
import { Theme } from '@railmapgen/rmg-palette-resources';
import { Translation } from '@railmapgen/rmg-translate';

/**
 * `Partial` 至少要保留一个必选键
 * https://stackoverflow.com/questions/48230773/how-to-create-a-partial-like-that-requires-a-single-property-to-be-set
 */
export type AtLeastOneOfPartial<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U];

export enum RmgStyle {
    MTR = 'mtr',
    GZMTR = 'gzmtr',
    SHMetro = 'shmetro',
    SHSuburbanRailway = 'shsubrwy',
}

export enum CanvasType {
    Destination = 'destination',
    RunIn = 'runin',
    RailMap = 'railmap',
    Indoor = 'indoor',
    Platform = 'platform',
}

export const canvasConfig: { [s in RmgStyle]: CanvasType[] } = {
    [RmgStyle.MTR]: [CanvasType.Destination, CanvasType.RailMap],
    [RmgStyle.GZMTR]: [CanvasType.RunIn, CanvasType.RailMap],
    [RmgStyle.SHMetro]: [CanvasType.Destination, CanvasType.RunIn, CanvasType.RailMap, CanvasType.Indoor],
    [RmgStyle.SHSuburbanRailway]: [CanvasType.Destination, CanvasType.RunIn, CanvasType.Platform],
};

export enum SidePanelMode {
    STATION = 'STATION',
    STYLE = 'STYLE',
    BRANCH = 'BRANCH',
}

/**
 * @property {string} 0 - 中文字符
 * @property {string} 1 - 拉丁字符
 */
export type Name = [string, string];

export enum Direction {
    left = 'left',
    right = 'right',
}

export enum ShortDirection {
    left = 'l',
    right = 'r',
}

export enum PsdLabel {
    screen = 'screen',
    platform = 'platform',
}

export enum BranchStyle {
    through = 'through',
    nonThrough = 'nonthrough',
}

/**
 * 车站两侧支线的信息。
 * @property 0 - 支线类型
 * @property 1 - 支线首站 ID，应同时属于该车站的父站或子站；没有支线时为空
 */
export type BranchInfo = Partial<Record<Direction, [BranchStyle, string]>>;

export enum Services {
    local = 'local',
    express = 'express',
    direct = 'direct',
}

export interface ColineInfo {
    from: string;
    to: string;
    colors: ColineColours[];
    display: boolean;
}

export type ColineColours = [...Theme, ...Name];

export interface ExtendedInterchangeInfo {
    theme?: Theme;
    name: Name;
    facility?: Facilities;
}

export interface InterchangeGroup {
    name?: Name;
    lines?: ExtendedInterchangeInfo[];
}

export interface StationTransfer {
    /**
     * 换乘文字或刻度的方向。
     */
    tick_direc: ShortDirection;
    /**
     * 出站换乘区域是否位于付费区内。
     */
    paid_area: boolean;
    groups: [InterchangeGroup, ...InterchangeGroup[]];
}

export const FACILITIES = {
    airport: 'Airport',
    hsr: 'High speed rail',
    railway: 'National rail',
    disney: 'Disneyland resort',
    np360: 'Ngong Ping 360',
};
export type Facilities = keyof typeof FACILITIES;

export const UNDER_CONSTRUCTION = 'under-construction';
export const SERVICE_SUSPENDED = 'service-suspended';

export interface StationInfo {
    title?: string;
    /**
     * 双语车站名称。
     */
    // 旧字段 name?: Name;
    // 旧字段 secondaryName?: Name;
    localisedName: Translation;
    localisedSecondaryName?: Translation;
    /**
     * 车站编号，仅广州地铁样式使用。
     */
    num: string;
    /**
     * 车站两侧支线信息的字典。
     */
    branch?: BranchInfo;
    /**
     * 父车站 ID 数组。
     */
    parents: string[];
    /**
     * 子车站 ID 数组。
     */
    children: string[];
    /**
     * 换乘信息详情。
     */
    transfer: StationTransfer;
    /**
     * 本站提供的列车服务类型。
     */
    services: Services[];
    /**
     * 车站附近设施信息。
     */
    facility?: Facilities;
    /**
     * 是否为环线中的枢轴车站。
     */
    loop_pivot: boolean;
    /**
     * 是否在同一行显示中英文站名。
     */
    one_line: boolean;
    /**
     * 上海地铁车站图中换乘框与站名之间的间距。
     * `updateParam` 中的默认值为 355。
     * 由 `(svg_height - 200) * 1.414` 计算，常见 `svg_height`
     * 为 450，车站元素倾斜 45 度。
     */
    int_padding: number;
    /**
     * 控制站名文字之间的字符间距。
     * `updateParam` 中的默认值为 20。
     */
    character_spacing: number;
    noServiceType?: typeof UNDER_CONSTRUCTION | typeof SERVICE_SUSPENDED;
    /**
     * 以边框表示的临时线路提示标记。
     */
    noServiceWithBorder?: boolean;
}

export type StationDict = Record<string, StationInfo>;

export enum PanelTypeGZMTR {
    gz1 = 'gz1',
    gz28 = 'gz28',
    gz2otis = 'gz2otis',
    gz3 = 'gz3',
    gz4 = 'gz4',
    gz5 = 'gz5',
    gz11 = 'gz11',
    gz1822 = 'gz1822',
    gz6 = 'gz6',
    gzgf = 'gzgf',
    gz1421 = 'gz1421',
    gz7w = 'gz7w',
}

export enum PanelTypeShmetro {
    sh = 'sh',
    sh2020 = 'sh2020',
}

/**
 * RMG 配置参数字典，以字符串形式保存在 `localStorage` 中。
 */
export interface RMGParam {
    svgWidth: Record<CanvasType, number>;
    svg_height: number;
    style: RmgStyle;
    /**
     * 线路纵向位置，单位为百分比。
     */
    y_pc: number;
    /**
     * 线路左右边距，单位为百分比。
     */
    padding: number;
    /** 支线间距百分比，即上下支线之间的留白。
     * 上海地铁环线也用它计算纵向内边距。
     */
    branchSpacingPct: number;
    direction: ShortDirection;
    /**
     * 目的地画布的站台编号；设为空字符串将隐藏该元素。
     */
    platform_num: string;
    theme: Theme;
    line_name: Name;
    current_stn_idx: keyof StationDict;
    /**
     * 各车站信息的键值对。
     */
    stn_list: StationDict;
    namePosMTR: {
        /**
         * 是否交错放置站名；为 `false` 时将站名放在线路上方。
         */
        isStagger: boolean;
        /**
         * 是否翻转站名位置。
         * 当 `isStagger === false` 时，若 `isFlip === false`，站名位于线路上方。
         */
        isFlip: boolean;
    };
    /**
     * 自定义港铁样式目的地指示牌。
     */
    customiseMTRDest: {
        /**
         * 是否启用旧版样式，即在线路名后显示“往”。
         */
        isLegacy: boolean;
        /**
         * 自定义终点站。
         */
        terminal: false | Name;
    };
    line_num: string;
    spanLineNum?: boolean;
    psd_num: string;
    psdLabel: PsdLabel;
    coachNum: string;
    info_panel_type: PanelTypeGZMTR | PanelTypeShmetro;
    notesGZMTR?: Note[];
    direction_gz_x: number;
    direction_gz_y: number;
    coline: Record<string, ColineInfo>;
    loop: boolean;
    loop_info: {
        /**
         * 是否将闭合线路图路径转为矩形环线。
         */
        bank: boolean;
        /**
         * 左右两侧的车站尺寸，仅接受整数并向下取整。
         * 该系数还受多条规则约束，详见 `shmetro-loop`。
         */
        left_and_right_factor: number;
        /**
         * 底部的车站尺寸，仅接受整数并向下取整。
         * 该系数还受多条规则约束，详见 `shmetro-loop`。
         */
        bottom_factor: number;
        midpoint_station?: string;
        clockwise?: boolean;
    };
    version?: string; // RMG version
}

/**
 * 广州地铁样式中的单条说明文字数组。
 * @property 0 - 中文文字
 * @property 1 - 拉丁文字
 * @property 2 - 横向位置百分比
 * @property 3 - 纵向位置百分比
 * @property 4 - 是否显示边框
 */
export type Note = [...Name, number, number, boolean];

export enum StationState {
    PASSED = -1,
    CURRENT = 0,
    FUTURE = 1,
}

export enum Position {
    UP = 'UP',
    DOWN = 'DOWN',
    LEFT = 'LEFT',
    RIGHT = 'RIGHT',
}

export interface ParamConfig {
    id: string;
    name?: string;
    lastModified?: number;
}

// 浏览器存储键名
export enum LocalStorageKey {
    CANVAS_TO_SHOW = 'canvasToShow',
    CANVAS_SCALE = 'canvasScale',
    PARAM_BY_ID = 'param:',
    PARAM_CONFIG_BY_ID = 'paramConfig:',
    DO_NOT_SHOW_RMT_MSG = 'doNotShowRMTMsg',
}

export enum Events {
    APP_LOAD = 'APP_LOAD',
    STYLE_CHANGE = 'STYLE_CHANGE',

    OPEN_PARAM = 'OPEN_PARAM',
    NEW_PARAM = 'NEW_PARAM',
    UPLOAD_PARAM = 'UPLOAD_PARAM',
    OPEN_TEMPLATE = 'OPEN_TEMPLATE',
    REMOVE_PARAM = 'REMOVE_PARAM',
    UPDATE_PARAM_CONFIG = 'UPDATE_PARAM_CONFIG',

    ADD_STATION = 'ADD_STATION',
    REMOVE_STATION = 'REMOVE_STATION',
    ADD_BRANCH = 'ADD_BRANCH',
    AUTO_NUMBERING = 'AUTO_NUMBERING',
    REVERSE_STATIONS = 'REVERSE_STATIONS',
    CONNECT_BRANCH = 'CONNECT_BRANCH',
    DISCONNECT_BRANCH = 'DISCONNECT_BRANCH',

    SELECT_COLOUR = 'SELECT_COLOUR',

    DOWNLOAD_PARAM = 'DOWNLOAD_PARAM',
    DOWNLOAD_IMAGES = 'DOWNLOAD_IMAGES',

    APP_CLIP_VIEW_OPENED = 'APP_CLIP_VIEW_OPENED',
    APP_CLIP_VIEW_CLOSED = 'APP_CLIP_VIEW_CLOSED',
    APP_CLIP_VIEW_IMPORT = 'APP_CLIP_VIEW_IMPORT',
}

export const FALSE = false.toString();
export const TRUE = true.toString();
export const UNDEFINED = String(undefined);
