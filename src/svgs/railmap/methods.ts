import * as Global from '../../methods';
import { StationInfo, RMGParam } from '../../types';

/**
 * Increment of the weight of out-bound edge of a station, which increases the horizontal interval from its children. 
 */
const _rightWideFactor = (stnId: string) => {
    return 0;
};

/**
 * Increment of the weight of in-bound edge of a station, which increases the horizontal interval from its parents. 
 */
const _leftWideFactor = (stnId: string) => {
    return 0;
};

/**
 * Path weight from station 1 to station 2 (station 2 must be a child of station 1, otherwise return `-Infinity`).
 */
const _pathWeight = (stnId1: string, stnId2: string, stnList: {[stnId: string]: StationInfo}) => {
    if (!stnList[stnId1].children.includes(stnId2)) {return -Infinity;}
    return 1 + _rightWideFactor(stnId1) + _leftWideFactor(stnId2);
};

/**
 * Critical path and corresponding length from a station to another. 
 * @param from ID of station on the left
 * @param to ID of station on the left
 */
const _cp = (from: string, to: string, stnList: {[stnId: string]: StationInfo}) => {
    if (from == to) {
        return { len: 0, nodes: [from] };
    }
    let allLengths: number[] = [];
    let criticalPaths: string[][] = [];
    stnList[from].children.forEach(child => {
        let cp = _cp(child, to, stnList);
        if (cp.len < 0) {return;}
        allLengths.push(_pathWeight(from, child, stnList) + cp.len);
        cp.nodes.unshift(from);
        criticalPaths.push(cp.nodes);
    });
    let maxLength = Math.max(...allLengths);
    return {
        'len': maxLength, 
        'nodes': criticalPaths[allLengths.indexOf(maxLength)]
    };
}

/**
 * Getter of critical path (from left to right) and corresponding length of the entire line. 
 */
const criticalPath = (stnList: {[stnId: string]: StationInfo}) => {
    let allLengths: number[] = [];
    let criticalPaths: string[][] = [];
    stnList.linestart.children.forEach(ld => {
        stnList.lineend.parents.forEach(rd => {
            let cp = _cp(ld, rd, stnList);
            allLengths.push(cp.len);
            criticalPaths.push(cp.nodes);
        });
    });
    let maxLen = Math.max(...allLengths);
    return {
        'len': maxLen,
        'nodes': criticalPaths[allLengths.indexOf(maxLen)]
    };
}

const getYShare = (stnId: string, stnList: {[stnId: string]: StationInfo}) => {
    return Global.getYShareMTR(stnId, stnList);
};

/**
 * Vertical position (in pixels) of station icon related to vertical position of line. 
 */
export const getYReal = (stnId: string, param: RMGParam) => {
    return -getYShare(stnId, param.stn_list) * param.branch_spacing;
};
