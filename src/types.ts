export enum DirectionLong {left, right};
export enum NeighbourPl {parents, children};
/**
 * Information of branch on both side. 
 * @index 0 - branch type (through, nonthrough or empty)
 * @index 1 - ID of the first station of the branch (should also be one of the station's parents/children) or empty
 */
export interface BranchInfo {
    left: ['through' | 'nonthrough', string] | [], 
    right: ['through' | 'nonthrough', string] | []
}
/**
 * Array of name `string`s. The first element is in Chinese characters and the second element is in Latin characters. 
 */
export type Name = [string, string];
/**
 * Array of PidsTimeTableUIEntry `string`s. The first element is the arrival time of the station and the second element is departure time of the station. 
 */
// Todo: waiting for review
type PidsTimeTableUIEntry = [string, string]
export type PidsTimeTableUI = {
    [T in string]: PidsTimeTableUIEntry;
};

export interface StationInfo {
    /**
     * Station name in two languages. 
     */
    name: Name;
    /**
     * Station number. (GZMTR specific)
     */
    num?: string;
    /**
     * Dictionary of the information of branch on the station's both side. 
     */
    branch?: BranchInfo;
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
    transfer?: StationTransfer;
    /**
     * Array of services at this station. 
     */
    services: ('local' | 'express')[];
    /**
     * Detail of interchanges (legacy). 
     */
    interchange?: any;
    change_type?: string;
    usage?: 'airport' | 'disney' | 'hsr' | '';
};

export enum IntInfoTag {
    city, line, colour, fg, nameZH, nameEN
};
export type InterchangeInfo = {
    [T in IntInfoTag]: string;
};

interface StationTransfer {
    /**
     * Interchange type of station. 
     */
    type: 'none' | 'int2' | 'int3' | 'osi11' | 'osi12' | 'osi13' | 'osi21' | 'osi22' | 'osi31';
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

/**
 * Dictionary of configuration parameters for RMG, stored in `localStorage` as string. 
 */
export interface RMGParam {
    /**
     * Width (in pixels) of `svg#railmap`.
     */
    svg_width: number;
    /**
     * Width (in pixels) of `svg#destination`.
     */
    svg_dest_width: number;
    /**
     * Height (in pixels) of `svg`s.
     */
    svg_height: number;
    /**
     * Train direction. 
     */
    direction: 'l' | 'r';
    /**
     * Colour theme of line, derived from `LineEntry`
     * @index 0 - city id
     * @index 1 - line id
     * @index 2 - background colour (in HEX)
     * @index 3 - foreground colour
     */
    theme: [string, string, string, '#fff' | '#000'];
    /**
     * ID of current station. 
     */
    current_stn_idx: string;
    /**
     * Key-value pairs of the information of each station. 
     */
    stn_list: {
        [stnId: string]: StationInfo;
    };
    /**
     * Flag of flipping station names. (MTR specific)
     */
    txt_flip?: boolean;
    /**
     * Legacy style of destination information panel. (MTR specific)
     */
    dest_legacy?: boolean;
    /**
     * Country-variant character form. (MTR specific)
     */
    char_form?: 'trad' | 'cn' | 'tw' | 'jp';
    [propName: string]: any;
};

export interface LineEntry {
    /**
     * ID of line. 
     */
    id: string;
    /**
     * Key-value pairs of multi-lingual names of the line. 
     */
    name: {
        en: string;
        [lang: string]: string;
    };
    /**
     * Background colour (in #HEX). 
     */
    colour: string;
    /**
     * Foreground colour. Mandatory field if foreground colour is black. 
     */
    fg?: '#000' | '#fff';
};

export interface CityEntry {
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
    name: {
        en: string;
        [lang: string]: string;
    }
};