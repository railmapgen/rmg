import { CityCode } from './city-config';

export enum LoadingStatus {
    init = 'init',
    loading = 'loading',
    loaded = 'loaded',
    failed = 'failed',
}

export enum RmgStyle {
    MTR = 'mtr',
    GZMTR = 'gzmtr',
    SHMetro = 'shmetro',
}

export enum CanvasType {
    Destination = 'destination',
    RunIn = 'runin',
    RailMap = 'railmap',
    Indoor = 'indoor',
}

export const AllCanvas = 'all';

export const canvasConfig: { [s in RmgStyle]: CanvasType[] } = {
    [RmgStyle.MTR]: [CanvasType.Destination, CanvasType.RailMap],
    [RmgStyle.GZMTR]: [CanvasType.RunIn, CanvasType.RailMap],
    [RmgStyle.SHMetro]: [CanvasType.Destination, CanvasType.RunIn, CanvasType.RailMap, CanvasType.Indoor],
};

export enum SidePanelMode {
    CLOSE = 'CLOSE',
    STATION = 'STATION',
    STYLE = 'STYLE'
}

/**
 * @property {string} 0 - Chinese characters
 * @property {string} 1 - Latin characters
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

export enum BranchStyle {
    through = 'through',
    nonThrough = 'nonthrough',
}

/**
 * Information of branch on both side.
 * @property 0 - branch type
 * @property 1 - ID of the first station of the branch (should also be one of the station's parents/children) or empty
 */
export type BranchInfo = Record<Direction, [BranchStyle, string] | []>;

export enum MonoColour {
    black = '#000',
    white = '#fff',
}

export type ColourHex = `#${string}`;

/**
 * Colour theme of line, derived from `LineEntry`.
 * @property 0 - city id
 * @property 1 - line id
 * @property 2 - background colour
 * @property 3 - foreground colour
 */
export type Theme = [CityCode, string, ColourHex, MonoColour];

export type InterchangeInfo = [...Theme, ...Name];

export interface StationTransfer {
    /**
     * Direction of text/tick of interchanges.
     */
    tick_direc: ShortDirection;
    /**
     * Flag of paid area within out-of-station interchange.
     */
    paid_area: boolean;
    /**
     * Array of name (in two languages) of all out-of-station interchange stations.
     */
    osi_names: Name[];
    /**
     * Array of arrays of interchange info.
     * @property 0 - array of within-station interchange info
     * @property remaining - arrays of out-of-station interchange info (from the nearest to the furthest station)
     */
    info: InterchangeInfo[][];
}

export enum Services {
    local = 'local',
    express = 'express',
    direct = 'direct',
}

export enum Facilities {
    airport = 'airport',
    disney = 'disney',
    hsr = 'hsr',
    railway = 'railway',
    none = '',
}

export interface StationInfo {
    /**
     * Station name in two languages.
     */
    name: Name;
    secondaryName: false | Name;
    /**
     * Station number. (GZMTR specific)
     */
    num: string;
    /**
     * Dictionary of the information of branch on the station's both side.
     */
    branch: BranchInfo;
    /**
     * Array of parents' IDs.
     */
    parents: string[];
    /**
     * Array of children's IDs.
     */
    children: string[];
    /**
     * Detail of interchanges.
     */
    transfer: StationTransfer;
    /**
     * Array of services at this station.
     */
    services: Services[];
    /**
     * Facility near the station
     */
    facility: Facilities;
}

export type StationDict = Record<string, StationInfo>;

export enum PanelTypeGZMTR {
    gz1 = 'gz1',
    gz28 = 'gz28',
    gz2otis = 'gz2otis',
    gz3 = 'gz3',
    gz4 = 'gz4',
    gz5 = 'gz5',
    gz1421 = 'gz1421',
    gz6 = 'gz6',
    gzgf = 'gzgf',
}

export enum PanelTypeShmetro {
    sh = 'sh',
    sh2020 = 'sh2020',
}

/**
 * Dictionary of configuration parameters for RMG, stored in `localStorage` as string.
 */
export interface RMGParam {
    svgWidth: Record<CanvasType, number>;
    svg_height: number;
    style: RmgStyle;
    /**
     * Vertical position (in percentage) of line.
     */
    y_pc: number;
    /**
     * Left and right margin of line (in percentage).
     */
    padding: number;
    /**
     * Branch spacing (in pixels) of line.
     */
    branch_spacing: number;
    direction: ShortDirection;
    platform_num: string | false;
    theme: Theme;
    line_name: Name;
    current_stn_idx: keyof StationDict;
    /**
     * Key-value pairs of the information of each station.
     */
    stn_list: StationDict;
    namePosMTR: {
        /**
         * Flag of whether station names staggered. If false, place name above line.
         */
        isStagger: boolean;
        /**
         * Flag of flipping station names.
         * When `isStagger === false`, names are above line if `isFlip === false`.
         */
        isFlip: boolean;
    };
    /**
     * Customise destination sign of MTR style.
     */
    customiseMTRDest: {
        /**
         * Flag of legacy style. (Show line name before 'to').
         */
        isLegacy: boolean;
        /**
         * Customise terminal stations.
         */
        terminal: false | Name;
    };
    line_num: string;
    psd_num: string;
    info_panel_type: PanelTypeGZMTR | PanelTypeShmetro;
    notesGZMTR: Note[];
    direction_gz_x: number;
    direction_gz_y: number;
}

/**
 * Array of a single note entry for Guangzhou Metro style.
 * @property 0 - text in Chinese characters
 * @property 1 - text in Latin characters
 * @property 2 - percentage of horizontal position
 * @property 3 - percentage of vertical position
 * @property 4 - flag of showing border
 */
export type Note = [...Name, number, number, boolean];

export enum LanguageCode {
    Azerbaijani = 'az',
    Arabic = 'ar',
    Catalan = 'ca',
    Chinese = 'zh',
    ChineseCN = 'zh-CN',
    ChineseSimp = 'zh-Hans',
    ChineseTrad = 'zh-Hant',
    ChineseHK = 'zh-HK',
    ChineseTW = 'zh-TW',
    English = 'en',
    French = 'fr',
    Gaelic = 'ga',
    German = 'de',
    Hindi = 'hi',
    Japanese = 'ja',
    Korean = 'ko',
    Malay = 'ms',
    Norwegian = 'no',
    Spanish = 'es',
    Persian = 'fa',
    Portuguese = 'pt',
    Russian = 'ru',
    Swedish = 'sv',
    Turkish = 'tr',
}

export type Translation = { [l in LanguageCode]?: string };

export interface PaletteEntry {
    /**
     * ID of line.
     */
    id: string;
    /**
     * Key-value pairs of multi-lingual names of the line.
     */
    name: Translation;
    /**
     * Background colour (in #HEX).
     */
    colour: ColourHex;
    /**
     * Foreground colour. Mandatory field if foreground colour is black.
     */
    fg?: MonoColour;
    /**
     * Pantone colour. If defined, colour is converted with Pantone Color Finder (https://www.pantone.com/color-finder).
     */
    pantone?: string;
}

export enum StationState {
    PASSED = -1,
    CURRENT = 0,
    FUTURE = 1,
}
