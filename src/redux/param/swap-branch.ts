import { RootDispatch, RootState } from '..';
import { StationDict } from '../../constants/constants';
import { setStationsBulk } from './action';

/**
 * Swaps a branch line with the main line in a topological graph.
 *
 * Graph Structure & Branch Definition:
 * The graph acts as a DAG with unique start/end points. Branches are defined by:
 * - Diverge Point (D): Where the line splits. Has a `branch.right` property.
 * - Converge Point (G): Where the split lines rejoin. Has a `branch.left` property.
 * Cases (i) and (ii) (simple splits/merges) are treated as special cases of the complete loop (iii):
 *      --- A ---
 *      |       |
 *  C - D - E - G - H
 * with C as startpoint or H as endpoint.
 *
 * Swap Operation:
 * Transforms the topology by swapping the 'through' path (Main) with the 'branch' path.
 * Target Transformation:
 *      --- E ---           (Old Branch 'E' becomes Main)
 *      |       |
 *  C - D - A - G - H       (Old Main 'A' becomes Branch)
 *
 * Implementation Details:
 * 1. Diverge Point (D):
 *    - Swap `children` nodes (Main <-> Branch).
 *    - Update `branch.right` to point to the *new* branch start node (old Main).
 * 2. Converge Point (G):
 *    - Swap `parents` nodes.
 *    - Update `branch.left` to point to the *new* branch end node (old Main).
 *
 * Assumption: Strict 2-way split/merge at D/G.
 */
export const swapBranch = (branchIndex: number) => {
    return (dispatch: RootDispatch, getState: () => RootState) => {
        if (branchIndex === 0) {
            console.error('Cannot swap main line (branch 0)');
            return;
        }

        const state = getState();
        // rename to avoid confusion with "branch" property in StationInfo
        const { branches: lineBranches } = state.helper;
        const stationList = state.param.stn_list;

        const currentLineBranch = lineBranches[branchIndex];
        if (!currentLineBranch || currentLineBranch.length === 0) {
            console.error('Invalid branch selected');
            return;
        }

        const divergePointId = currentLineBranch[0];
        const convergePointId = currentLineBranch[currentLineBranch.length - 1];

        const newStationList: StationDict = { ...stationList };
        const divergePoint = { ...newStationList[divergePointId] };
        const convergePoint = { ...newStationList[convergePointId] };
        newStationList[divergePointId] = divergePoint;
        newStationList[convergePointId] = convergePoint;

        let modified = false;

        // Swap children of divergePoint, then assign the new children[0] to branch.right[1]
        if (divergePoint.branch && divergePoint.branch.right) {
            const [child1, child2] = divergePoint.children;
            divergePoint.children = [child2, child1];
            divergePoint.branch = {
                ...divergePoint.branch,
                right: [divergePoint.branch.right[0], divergePoint.children[0]],
            };

            modified = true;
        }
        // Swap parents of convergePoint, then assign the new parents[0] to branch.left[1]
        if (convergePoint.branch && convergePoint.branch.left) {
            const [parent1, parent2] = convergePoint.parents;
            convergePoint.parents = [parent2, parent1];
            convergePoint.branch = {
                ...convergePoint.branch,
                left: [convergePoint.branch.left[0], convergePoint.parents[0]],
            };

            modified = true;
        }

        if (modified) {
            dispatch(setStationsBulk(newStationList));
        }
    };
};
