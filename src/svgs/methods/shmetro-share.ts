import { StationDict } from '../../constants/constants';
import { getStnState } from './share';

const _getParallelBranchStations = (
    currentId: string,
    routes: string[][],
    stnList: StationDict,
    direction: 'l' | 'r'
): Set<string> => {
    if (stnList[currentId].parents.length > 1 || stnList[currentId].children.length > 1) {
        return new Set();
    }

    const currentRoute = routes.find(route => route.includes(currentId))!;
    const currentIdx = currentRoute.indexOf(currentId);

    let splitId = '';
    for (let i = currentIdx - 1; i >= 0; i--) {
        if (stnList[currentRoute[i]].children.length > 1) {
            splitId = currentRoute[i];
            break;
        }
    }

    let mergeId = '';
    for (let i = currentIdx + 1; i < currentRoute.length; i++) {
        if (stnList[currentRoute[i]].parents.length > 1) {
            mergeId = currentRoute[i];
            break;
        }
    }

    if ((splitId === 'linestart' && direction === 'l') || (mergeId === 'lineend' && direction === 'r')) {
        return new Set();
    }

    const parallelRoute = routes.find(candidateRoute => {
        const candidateSplitIdx = candidateRoute.indexOf(splitId);
        const candidateMergeIdx = candidateRoute.indexOf(mergeId);
        return candidateSplitIdx !== -1 && candidateMergeIdx !== -1 && !candidateRoute.includes(currentId);
    });

    if (!parallelRoute) {
        return new Set();
    }

    const parallelSplitIdx = parallelRoute.indexOf(splitId);
    const parallelMergeIdx = parallelRoute.indexOf(mergeId);

    return new Set(parallelRoute.slice(parallelSplitIdx + 1, parallelMergeIdx));
};

/**
 * Compute station states for SHMetro, including promoted sibling branch segments.
 */
export const getStnStateShmetro = (
    currentId: string,
    routes: string[][],
    stnList: StationDict,
    direction: 'l' | 'r'
): { [stnId: string]: -1 | 0 | 1 } => {
    const initialStates = getStnState(currentId, routes, direction);
    const parallelBranchStations = _getParallelBranchStations(currentId, routes, stnList, direction);

    return Object.keys(initialStates).reduce(
        (acc, stnId) => ({ ...acc, [stnId]: parallelBranchStations.has(stnId) ? 1 : initialStates[stnId] }),
        {} as { [stnId: string]: -1 | 0 | 1 }
    );
};
