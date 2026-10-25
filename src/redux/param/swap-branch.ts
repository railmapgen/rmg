// 线路参数与编辑操作：交换主线和支线。
import { RootDispatch, RootState } from '..';
import { StationDict } from '../../constants/constants';
import { setStationsBulk } from './action';

/**
 * 在拓扑图中交换一条支线与主线。
 *
 * 图结构与支线定义：
 * 图是只有唯一首尾节点的有向无环图，支线由以下节点定义：
 * - 分叉点 D：线路在此分开，并带有 `branch.right` 属性。
 * - 汇合点 G：分开的线路在此重新汇合，并带有 `branch.left` 属性。
 * 简单分叉、简单汇合两种情况均视为完整环线的特例：
 *      --- A ---
 *      |       |
 *  C - D - E - G - H
 * 其中 C 可为起点，H 可为终点。
 *
 * 交换操作：
 * 通过互换贯通路径（主线）与支线路径来变换拓扑。
 * 目标结构：
 *      --- E ---           （原支线 E 成为主线）
 *      |       |
 *  C - D - A - G - H       （原主线 A 成为支线）
 *
 * 实现细节：
 * 1. 分叉点 D：
 *    - 交换 `children` 节点，同时保留决定绘制细节的支线起始索引。
 *    - 更新 `branch.right`，使其指向新的支线起始节点（原主线）。
 * 2. 汇合点 G：
 *    - 交换 `parents` 节点，同时保留决定绘制细节的支线末端索引。
 *    - 更新 `branch.left`，使其指向新的支线结束节点（原主线）。
 *
 * 前提：D 与 G 处均为严格的双向分叉或汇合。
 */
export const swapBranch = (branchIndex: number) => {
    return (dispatch: RootDispatch, getState: () => RootState) => {
        if (branchIndex === 0) {
            console.error('Cannot swap main line (branch 0)');
            return;
        }

        const state = getState();
        // 重命名以避免与 `StationInfo` 中的 `branch` 属性混淆
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

        // 交换 `divergePoint` 的子节点，并保留原索引赋值给 `branch.right[1]`
        if (divergePoint.branch && divergePoint.branch.right) {
            const indexOfRightInChildren = divergePoint.children.indexOf(divergePoint.branch.right[1]);
            const [child1, child2] = divergePoint.children;
            divergePoint.children = [child2, child1];
            divergePoint.branch = {
                ...divergePoint.branch,
                right: [divergePoint.branch.right[0], divergePoint.children[indexOfRightInChildren]],
            };

            modified = true;
        }
        // 交换 `convergePoint` 的父节点，并保留原索引赋值给 `branch.left[1]`
        if (convergePoint.branch && convergePoint.branch.left) {
            const indexOfLeftInParents = convergePoint.parents.indexOf(convergePoint.branch.left[1]);
            const [parent1, parent2] = convergePoint.parents;
            convergePoint.parents = [parent2, parent1];
            convergePoint.branch = {
                ...convergePoint.branch,
                left: [convergePoint.branch.left[0], convergePoint.parents[indexOfLeftInParents]],
            };

            modified = true;
        }

        if (modified) {
            dispatch(setStationsBulk(newStationList));
        }
    };
};
