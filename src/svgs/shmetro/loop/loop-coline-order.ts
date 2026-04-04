/**
 * In this file, "left/right branch" is defined relative to the top arc of the displayed loop coline.
 *
 * It does not describe the fork and merge direction stored in station topology (stn_list). Instead, it
 * describes whether an entire branch is rendered before or after the top arc in the linearized loop-
 * coline order.
 */

import { ColineInfo, ShortDirection, StationDict } from '../../../constants/constants';
import { isColineBranch } from '../../../redux/param/coline-action';

export type LoopColineArc = 'major' | 'minor';

/**
 * Linearized coline station order for loop lines.
 *
 * The full order is composed as left branch -> top arc -> right branch.
 */
export type ColineOrder = {
    stnIds: string[];
    leftBranchEndIndex: number; // [0, leftBranchEndIndex) in stnIds
    rightBranchBeginIndex: number; // [rightBranchBeginIndex, stnIds.length) in stnIds
    leftBranchIndexInBranches: number | null; // index in branches, or null if no left branch
    rightBranchIndexInBranches: number | null; // index in branches, or null if no right branch
};

type ColineArcInfo = {
    colineInfo: ColineInfo;
    arcType: LoopColineArc;
    topStnIds: string[];
};

/**
 * Finds branch connection stations shared by the loop line and loop-side branches.
 *
 * Only the loop line and the first two branch entries are considered here, because the loop layout
 * currently supports at most two branches around the loop.
 *
 * @param branches Full branch list including the loop line.
 * @returns Repeated station ids excluding sentinel endpoints.
 */
export const getBranchStnIds = (branches: string[][]): string[] => {
    const counts = new Map<string, number>();
    for (const stnId of branches.slice(0, 3).flat()) {
        counts.set(stnId, (counts.get(stnId) ?? 0) + 1);
    }
    return [...counts.entries()]
        .filter(([stnId, count]) => count >= 2 && !['linestart', 'lineend'].includes(stnId))
        .map(([stnId]) => stnId);
};

/**
 * Resolves the displayed loop coline and determines which loop arc is treated as the top arc.
 *
 * @param loopline Ordered loop stations.
 * @param coline Coline configuration map.
 * @param branches Full branch list including the loop line.
 * @param stnList Station dictionary used to identify coline branches.
 * @returns Arc metadata for the displayed loop coline, if any.
 */
export const getColineArcInfo = (
    loopline: string[],
    coline: Record<string, ColineInfo>,
    branches: string[][],
    stnList: StationDict
): ColineArcInfo | undefined => {
    const colineBranchStationIds = new Set(
        branches
            .slice(1, 3)
            .filter(branch => isColineBranch(branch, stnList))
            .flat()
            .filter(stnId => loopline.includes(stnId))
    );

    const colineInfo = Object.values(coline).find(
        co => co.display && [co.from, co.to].every(stnId => colineBranchStationIds.has(stnId))
    );

    if (!colineInfo) return undefined;

    let fromIndex = loopline.indexOf(colineInfo.from);
    let toIndex = loopline.indexOf(colineInfo.to);
    if (fromIndex === -1 || toIndex === -1) return undefined;

    if (fromIndex > toIndex) {
        [fromIndex, toIndex] = [toIndex, fromIndex];
    }

    const topA = loopline.slice(fromIndex, toIndex + 1);
    const topB = [...loopline.slice(toIndex), ...loopline.slice(0, fromIndex + 1)];
    const distance = Math.abs(toIndex - fromIndex);
    const arcType = distance > loopline.length - 2 - distance ? 'major' : 'minor';
    const topStnIds =
        arcType === 'major' ? (topA.length > topB.length ? topA : topB) : topA.length > topB.length ? topB : topA;

    return {
        colineInfo,
        arcType,
        topStnIds,
    };
};

/**
 * Builds the linear station order used to evaluate past/current/future state on a loop coline.
 *
 * The result is always laid out as: left branch -> top arc -> right branch.
 * Branch indexes refer to the original indexes in the global branches array.
 *
 * @param branches Full branch list including the loop line.
 * @param arc Arc metadata returned by getColineArcInfo.
 * @param coline Coline configuration map.
 * @returns The linearized coline order for the displayed coline, if any.
 */
export const getColineOrder = (
    branches: string[][],
    arc: ColineArcInfo,
    coline: Record<string, ColineInfo>
): ColineOrder | undefined => {
    if (!Object.values(coline).some(co => co.display)) return undefined;

    const topStationIds = arc.topStnIds;
    // In loop layout, the branch connected to linestart is rendered on the left of the top arc.

    let leftBranchIndex: number | null = null;
    let rightBranchIndex: number | null = null;

    for (const [index, branch] of branches.slice(1, 3).entries()) {
        if (branch.includes('linestart')) {
            leftBranchIndex = index + 1;
        } else if (branch.includes('lineend')) {
            rightBranchIndex = index + 1;
        }
    }

    const leftBranchStationIds = leftBranchIndex
        ? branches[leftBranchIndex].filter(stn_id => stn_id !== 'linestart' && !topStationIds.includes(stn_id))
        : [];
    const rightBranchStationIds = rightBranchIndex
        ? branches[rightBranchIndex].filter(stn_id => stn_id !== 'lineend' && !topStationIds.includes(stn_id))
        : [];

    const stationIds = [...leftBranchStationIds, ...topStationIds, ...rightBranchStationIds];

    return {
        stnIds: stationIds,
        leftBranchEndIndex: leftBranchStationIds.length,
        rightBranchBeginIndex: leftBranchStationIds.length + topStationIds.length,
        leftBranchIndexInBranches: leftBranchIndex,
        rightBranchIndexInBranches: rightBranchIndex,
    };
};

/**
 * Calculate station render states based on the current position within the linearized coline order.
 *
 * Stations before the current station in travel direction are marked as past, the current station
 * is marked as current, and the remaining stations are marked as future.
 *
 * @param args Runtime inputs for the displayed coline.
 * @param args.order Linearized coline station order.
 * @param args.curStnId Current station id.
 * @param args.direction Travel direction on the coline.
 * @returns Mapping from station id to render state.
 */
export const getColineStnStates = (args: {
    order: ColineOrder;
    curStnId: string;
    direction: ShortDirection;
}): Record<string, -1 | 0 | 1> => {
    const { order, curStnId, direction } = args;

    const curStnIndex = order.stnIds.indexOf(curStnId);

    const stationStates = order.stnIds.map((_, index) => {
        if (index === curStnIndex) return 0;
        return direction === 'l' ? (index >= curStnIndex ? -1 : 1) : index <= curStnIndex ? -1 : 1;
    });

    return Object.fromEntries(order.stnIds.map((stnId, index) => [stnId, stationStates[index]]));
};

/**
 * Resolves a station index relative to the top arc segment in the linearized coline order.
 *
 * For stations on a branch, the returned value is clamped just outside the top arc range so callers
 * can still place indicators at the corresponding top-edge boundary.
 *
 * @param stn_id Station id to resolve.
 * @param colineOrder Linearized coline station order.
 * @returns Zero-based index relative to the top arc, or undefined when the station is not on the coline.
 */
export const resolveIndexInTop = (stn_id: string, colineOrder: ColineOrder): number | undefined => {
    const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

    const index_in_coline_order = colineOrder.stnIds.findIndex(id => id === stn_id);
    if (index_in_coline_order === -1) {
        return undefined; // not on the coline at all
    }

    // [-1, top.length], to handle the case when current station is not on the loop line (e.g. on branch)
    return (
        clamp(index_in_coline_order, colineOrder.leftBranchEndIndex - 1, colineOrder.rightBranchBeginIndex) -
        colineOrder.leftBranchEndIndex
    );
};

/**
 * Resolves a station index relative to one branch segment of the linearized coline order.
 *
 * The returned index is clamped to keep callers anchored near the branch-to-top junction even when
 * the current station lies outside the target branch segment.
 *
 * @param stn_id Station id to resolve.
 * @param colineOrder Linearized coline station order.
 * @param branchIndex Branch index in the global branches array.
 * @returns Zero-based index relative to the requested branch segment, or undefined when unavailable.
 */
export const resolveIndexInBranch = (
    stn_id: string,
    colineOrder: ColineOrder,
    branchIndex: number
): number | undefined => {
    const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

    const index_in_coline_order = colineOrder.stnIds.findIndex(id => id === stn_id);
    if (index_in_coline_order === -1) {
        return undefined; // not on the coline at all
    }

    if (branchIndex === colineOrder.leftBranchIndexInBranches) {
        return clamp(index_in_coline_order, 0, colineOrder.leftBranchEndIndex);
    } else if (branchIndex === colineOrder.rightBranchIndexInBranches) {
        return clamp(
            index_in_coline_order - colineOrder.rightBranchBeginIndex,
            -1,
            colineOrder.stnIds.length - colineOrder.rightBranchBeginIndex
        );
    } else {
        return undefined; // branchIndex is not included in colineOrder
    }
};
