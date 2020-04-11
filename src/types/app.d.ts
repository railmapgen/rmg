type ProvidedCanvas = 'destination' | 'runin' | 'railmap';
type ProvidedStyles = 'mtr' | 'gzmtr' | 'shmetro';

/**
 * Array of name `string`s. The first element is in Chinese characters and the second element is in Latin characters.
 */
type Name = [string, string];

/**
 * Information of branch on both side.
 * @index 0 - branch type (through, nonthrough or empty)
 * @index 1 - ID of the first station of the branch (should also be one of the station's parents/children) or empty
 */
interface BranchInfo {
    left: ['through' | 'nonthrough', string] | [];
    right: ['through' | 'nonthrough', string] | [];
}
/**
 * Colour theme of line, derived from `LineEntry`.
 * @index 0 - city id
 * @index 1 - line id
 * @index 2 - background colour (in HEX)
 * @index 3 - foreground colour
 */
type Theme = [string, string, string, '#000' | '#fff'];
/**
 * Equivalent to `[...Theme, ...Name]`.
 */
type InterchangeInfo = [string, string, string, '#000' | '#fff', string, string];

interface StationTransfer {
    /**
     * Interchange type of station.
     */
    // type: 'none' | 'int2' | 'int3' | 'osi11' | 'osi12' | 'osi13' | 'osi21' | 'osi22' | 'osi31';
    /**
     * Direction of text/tick of interchanges.
     */
    tick_direc: 'r' | 'l';
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
     * @index 0 - array of within-station interchange info
     * @index remaining - arrays of out-of-station interchange info (from the nearest to the furthest station)
     */
    info: InterchangeInfo[][];
}

type Services = 'local' | 'express';
type Facilities = 'airport' | 'disney' | 'hsr' | '';

interface StationInfo {
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

interface StationDict {
    [stnId: string]: StationInfo;
}

type PanelTypeGZMTR = 'gz1' | 'gz28' | 'gz2otis' | 'gz3' | 'gz4' | 'gz5' | 'gz1421' | 'gz6' | 'gzgf';
/**
 * Array of a single note entry for Guangzhou Metro style.
 * @property 0 - text in Chinese characters
 * @property 1 - text in Latin characters
 * @property 2 - percentage of horizontal position
 * @property 3 - percentage of vertical position
 * @property 4 - flag of showing border
 */
type Note = [string, string, number, number, boolean];

/**
 * Dictionary of configuration parameters for RMG, stored in `localStorage` as string.
 */
interface RMGParam {
    svgWidth: {
        destination: number;
        runin: number;
        railmap: number;
    };
    svg_height: number;
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
    direction: 'l' | 'r';
    platform_num: string | false;
    theme: Theme;
    line_name: Name;
    current_stn_idx: string;
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
         * Flag of flipping station names when `isStagger === true`.
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
    info_panel_type: PanelTypeGZMTR;
    notesGZMTR: Note[];
    direction_gz_x: number;
    direction_gz_y: number;
    // [propName: string]: any;
}

interface LineEntry {
    /**
     * ID of line.
     */
    id: string;
    /**
     * Key-value pairs of multi-lingual names of the line.
     */
    name: ITrans;
    /**
     * Background colour (in #HEX).
     */
    colour: string;
    /**
     * Foreground colour. Mandatory field if foreground colour is black.
     */
    fg?: '#000' | '#fff';
}

interface CityEntry {
    /**
     * ID of city.
     */
    id: string;
    /**
     * ISO 3166-1 alpha-2 country code. (For cities in Britain, append BS 6879 subdivision code. )
     */
    country: string;
    /**
     * Key-value pairs of multi-lingual names of the city.
     */
    name: ITrans;
}

interface CompanyEntry {
    id: string;
    name: ITrans;
}

interface ITrans {
    en: string;
    [lang: string]: string;
}
