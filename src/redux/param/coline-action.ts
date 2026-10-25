// 线路参数与编辑操作：共线区段操作。
import { RootDispatch, RootState } from '../index';
import { ColineColours, ColineInfo, StationDict } from '../../constants/constants';
import { setColine } from './param-slice';
import { nanoid } from 'nanoid';

// JavaScript 中多个数组的笛卡尔积
// https://stackoverflow.com/questions/12303989/cartesian-product-of-multiple-arrays-in-javascript
// 等价的 TypeScript 版本
// https://gist.github.com/ssippe/1f92625532eef28be6974f898efb23ef?permalink_comment_id=3364149#gistcomment-3364149
function cartesian<T>(...allEntries: T[][]): T[][] {
    return allEntries.reduce<T[][]>(
        (results, entries) =>
            results
                .map(result => entries.map(entry => result.concat([entry])))
                .reduce((subResults, result) => subResults.concat(result), []),
        [[]]
    );
}

/**
 * 共线支线也称为下层支线。
 */
export const isColineBranch = (branch: string[], stnList: StationDict) =>
    !!stnList[branch[0]].children.indexOf(branch[1]);

export const getPossibleStnIdsFromMainLine = (branches: string[][], stnList: StationDict) => [
    branches[0][1], // skip linestart
    branches[0][branches[0].length - 2], // skip lineend
    ...branches[0].filter(stnId =>
        // 遍历主线车站，判断当前车站是否产生分支
        branches
            .slice(1)
            .filter(branch => isColineBranch(branch, stnList))
            // 主线之后的支线可能没有线路起点或终点节点
            .map(branch => branch.filter(stnId => !['linestart', 'lineend'].includes(stnId)))
            // 只需考虑两端车站
            .map(branch => [branch[0], branch[branch.length - 1]])
            .flat()
            .includes(stnId)
    ),
];

export const getPossibleStnIdsFromBranchLine = (branches: string[][], stnList: StationDict) =>
    branches
        .slice(1)
        .filter(branch => isColineBranch(branch, stnList))
        .map(branch => branch.filter(stnId => !['linestart', 'lineend'].includes(stnId)))
        .map(branch => [branch[0], branch[branch.length - 1]]);

export const getPossibleCombinations = (branchIndex: number) => {
    return (dispatch: RootDispatch, getState: () => RootState): [string, string][] => {
        const branches = getState().helper.branches;

        if (branchIndex === 0) {
            const stnList = getState().param.stn_list;
            const possibleStnIdsFromMainLine = getPossibleStnIdsFromMainLine(branches, stnList);
            return cartesian(possibleStnIdsFromMainLine, possibleStnIdsFromMainLine).filter(
                val => val[0] !== val[1]
            ) as [string, string][];
        } else {
            const branch = branches[branchIndex];
            if (branch) {
                const b = branch.filter(id => !['linestart', 'lineend'].includes(id));
                return [[b[0], b.slice(-1)[0]]];
            } else {
                return [];
            }
        }
    };
};

/**
 * 校验共线起止点。当前允许以下两种共线：
 * 1. 从主线或支线的某一端开始，并在主线或支线的另一端结束。
 * 2. 从支线的一端开始，并在同一条支线的另一端结束。

 * @param from 共线起始车站 ID
 * @param to 共线结束车站 ID
 */
export const checkColineValidity = (from: string, to: string) => {
    return (dispatch: RootDispatch, getState: () => RootState) => {
        const stnList = getState().param.stn_list;
        const branches = getState().helper.branches;

        if (from === to) {
            throw new Error('addColine():: failed for same stnId');
        }
        // 判断共线是否位于主线
        const colineInMainLine = getPossibleStnIdsFromMainLine(branches, stnList).filter(stnId =>
            [from, to].includes(stnId)
        );
        // 判断共线是否位于某条支线
        const colineInBranches = getPossibleStnIdsFromBranchLine(branches, stnList).filter(terminals =>
            [from, to].every(stnId => terminals.includes(stnId))
        );
        // 检查共线是否位于主线
        if (colineInMainLine.length === 2 && colineInBranches.length > 0) {
            throw new Error(`addColine():: main check failed for ${from}, ${to}`);
        }
        // 检查共线是否位于某条支线
        if (colineInMainLine.length !== 2 && colineInBranches.length !== 1) {
            throw new Error(`addColine():: branch check failed for ${from}, ${to}`);
        }
    };
};

export const findAllColinesInBranch = (branchIndex: number) => {
    return (dispatch: RootDispatch, getState: () => RootState) => {
        const coline = getState().param.coline;
        const branches = getState().helper.branches;
        const branch = branches[branchIndex];

        if (branch) {
            return Object.entries(coline).reduce<Record<string, ColineInfo>>((acc, cur) => {
                if (branch.includes(cur[1].from) && branch.includes(cur[1].to)) {
                    return { ...acc, [cur[0]]: cur[1] };
                } else {
                    return { ...acc };
                }
            }, {});
        } else {
            return {};
        }
    };
};

/**
 * 删除车站时，同时移除以该车站为 `from` 或 `to` 的共线信息。
 */
export const removeInvalidColineOnRemoveStation = (deleteStnId: string) => {
    return (dispatch: RootDispatch, getState: () => RootState) => {
        const colineInfo = getState().param.coline;

        if (Object.keys(colineInfo).length === 0) return;

        const nextColine = Object.entries(colineInfo).reduce<Record<string, ColineInfo>>((acc, cur) => {
            if (cur[1].from !== deleteStnId && cur[1].to !== deleteStnId) {
                return { ...acc, [cur[0]]: cur[1] };
            } else {
                return { ...acc };
            }
        }, {});

        dispatch(setColine(nextColine));
    };
};

export const addColine = (from: string, to: string, colors: ColineColours[], display = true) => {
    return (dispatch: RootDispatch, getState: () => RootState) => {
        const colineInfo = getState().param.coline;

        dispatch(checkColineValidity(from, to));
        dispatch(
            setColine({
                ...colineInfo,
                [nanoid(4)]: { from: from, to: to, colors: colors, display: display },
            })
        );
    };
};

export const updateColine = (colineId: string, from: string, to: string, display = true) => {
    return (dispatch: RootDispatch, getState: () => RootState) => {
        const colineInfo = getState().param.coline;

        if (colineId in colineInfo) {
            dispatch(checkColineValidity(from, to));

            const newColineInfo = {
                ...colineInfo,
                [colineId]: { ...colineInfo[colineId], from, to, display },
            };

            dispatch(setColine(newColineInfo));
        }
    };
};

export const removeColineColor = (colineId: string, interchangeIndex: number) => {
    return (dispatch: RootDispatch, getState: () => RootState) => {
        const colineInfo = getState().param.coline;

        if (colineId in colineInfo && colineInfo[colineId].colors.length > interchangeIndex) {
            const nextColours = colineInfo[colineId].colors.filter((_, colineIdx) => colineIdx !== interchangeIndex);
            if (nextColours.length === 0) {
                // 整段移除共线信息
                const { [colineId]: _, ...nextColine } = colineInfo;
                dispatch(setColine(nextColine));
            } else {
                // 更新共线颜色列表
                const nextColine = {
                    ...colineInfo,
                    [colineId]: { ...colineInfo[colineId], colors: nextColours },
                };
                dispatch(setColine(nextColine));
            }
        }
    };
};

export const updateColineColor = (colineId: string, interchangeIndex: number, interchangeInfo: ColineColours) => {
    return (dispatch: RootDispatch, getState: () => RootState) => {
        const colineInfo = getState().param.coline;

        if (colineId in colineInfo && colineInfo[colineId].colors.length > interchangeIndex) {
            const nextColineInfo = {
                ...colineInfo,
                [colineId]: {
                    ...colineInfo[colineId],
                    colors: colineInfo[colineId].colors.map((int, colineIdx) =>
                        colineIdx === interchangeIndex
                            ? ([0, 1, 2, 3, 4, 5].map(i =>
                                  interchangeInfo[i] === undefined ? int[i] : interchangeInfo[i]
                              ) as ColineColours)
                            : int
                    ),
                },
            };
            dispatch(setColine(nextColineInfo));
        }
    };
};

// 调试代理
// declare const window: any;
// window.addColine = addColine;
// window.updateColine = updateColine;
// window.removeColine = removeColine;
// window.rmgStore.dispatch(window.removeColine(2))
// let t = ['shanghai', 'sh4', '#5F259F', '#fff', '4号线', 'Line 4']
// window.rmgStore.dispatch(window.addColine('s9tt', 'l1mz', [t]))
