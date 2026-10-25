// 线路参数与编辑操作：删除车站操作。
import { RootDispatch, RootState } from '../index';
import { getYShareMTR } from '../../methods';
import { BranchStyle, StationDict } from '../../constants/constants';
import { setStationsBulk } from './action';

/**
 * 当前算法无法处理此类车站删除时返回 `false`。
 * 必须在 `removeStation` 之前调用并检查结果！
 */
export const checkStationCouldBeRemoved = (stationId: string) => {
    return (dispatch: RootDispatch, getState: () => RootState): boolean => {
        const { stn_list: stationList, current_stn_idx: currentStationIndex } = getState().param;

        if (stationId === currentStationIndex) {
            console.log('removeStation():: failed as current station cannot be deleted');
            return false;
        }

        const { parents, children } = stationList[stationId];

        if (Object.keys(stationList).length === 4) {
            console.log('removeStation():: failed as only 2 stations remaining');
            return false;
        } else if (parents.length === 2 && children.length === 2) {
            // 待办：重写为合并两条支线，而非直接拒绝
            console.log('removeStation():: failed as branches on both sides cannot be combined');
            return false;
        }

        // 若车站是主线最后一个车站则拒绝删除
        const isNotLastMainBranchStn = Object.keys(stationList).some(
            id => ![stationId, 'linestart', 'lineend'].includes(id) && getYShareMTR(id, stationList) === 0
        );
        if (!isNotLastMainBranchStn) {
            console.log('removeStation():: failed as selected station is the only station without siblings');
            return false;
        }

        return true;
    };
};

export const removeStation = (stationId: string) => {
    // 必须在 `removeStation` 之前调用 `checkStationCouldBeRemoved`！
    return (dispatch: RootDispatch, getState: () => RootState) => {
        const stationList = getState().param.stn_list;
        const { parents, children } = stationList[stationId];

        let newStnList = JSON.parse(JSON.stringify(stationList)) as StationDict;

        if (parents.length === 2 || children.length === 2) {
            /**
             * stn1 - stn2 - stn3
             *         ^   \
             *               stn4
             */
            /**
             * stn1 - stn2 - - - - stn3
             *         ^   \      /
             *               stn4
             */
            parents.forEach(parId => {
                newStnList[parId].children = newStnList[parId].children
                    .map(c => (c === stationId ? children : c))
                    .flat();
            });
            children.forEach(childId => {
                newStnList[childId].parents = newStnList[childId].parents
                    .map(p => (p === stationId ? parents : p))
                    .flat();
            });
            if (parents.length === 1) {
                newStnList[parents[0]].branch = {
                    ...newStnList[parents[0]].branch,
                    right: newStnList[stationId].branch?.right,
                };
            }
            if (children.length === 1) {
                newStnList[children[0]].branch = {
                    ...newStnList[children[0]].branch,
                    left: newStnList[stationId].branch?.left,
                };
            }
        } else if (stationList[parents[0]].children.length === 2 && stationList[children[0]].parents.length === 2) {
            /**
             * stn1 -     stn2    - stn3
             *      \      ^      /
             *        stn4 - stn5
             */
            newStnList = {
                ...stationList,
                [parents[0]]: {
                    ...stationList[parents[0]],
                    children: stationList[parents[0]].children.filter(id => id !== stationId),
                    branch: {
                        ...stationList[parents[0]].branch,
                        right: undefined,
                    },
                },
                [children[0]]: {
                    ...stationList[children[0]],
                    parents: stationList[children[0]].parents.filter(id => id !== stationId),
                    branch: {
                        ...stationList[children[0]].branch,
                        left: undefined,
                    },
                },
            };
        } else {
            /**
             * stn1 - stn2
             *      \
             *        stn3 - stn4
             *         ^
             */

            // 父节点数量为 1
            parents.forEach(parId => {
                const idx = newStnList[parId].children.indexOf(stationId);
                if (children.length) {
                    newStnList[parId].children[idx] = children[0];
                } else {
                    // 右侧目的地
                    newStnList[parId].children.splice(idx, 1);
                }

                if (newStnList[parId].branch?.right?.[1] === stationId) {
                    newStnList[parId].branch = {
                        ...newStnList[parId].branch,
                        right: newStnList[parId].branch?.right?.with(1, children[0]) as [BranchStyle, string],
                    };
                }
            });

            // 子节点数量为 1
            children.forEach(childId => {
                const idx = newStnList[childId].parents.indexOf(stationId);
                if (parents.length) {
                    newStnList[childId].parents[idx] = parents[0];
                } else {
                    // 左侧目的地
                    newStnList[childId].parents.splice(idx, 1);
                }

                if (newStnList[childId].branch?.left?.[1] === stationId) {
                    newStnList[childId].branch = {
                        ...newStnList[childId].branch,
                        left: newStnList[childId].branch?.left?.with(1, parents[0]) as [BranchStyle, string],
                    };
                }
            });
        }

        delete newStnList[stationId];
        dispatch(setStationsBulk(newStnList));
    };
};
