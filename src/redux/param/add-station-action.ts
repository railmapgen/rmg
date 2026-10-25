// 线路参数与编辑操作：新增车站操作。
import { nanoid } from 'nanoid';
import { RootDispatch, RootState } from '../index';
import { BranchStyle } from '../../constants/constants';
import { getYShareMTR } from '../../methods';
import { setStationsBulk } from './action';
import { initStationInfo } from './util';

export const addStation = (where: `${number}` | 'new', from: string, to: string, position?: 'upper' | 'lower') => {
    return (dispatch: RootDispatch, getState: () => RootState): string | false => {
        const stationList = getState().param.stn_list;

        // 生成新 ID
        let newId = nanoid(6);
        while (newId in stationList) {
            newId = nanoid(6);
        }
        const newStationInfo = initStationInfo(newId);

        if (where !== 'new') {
            const nextStationList = {
                ...stationList,
                [from]: {
                    ...stationList[from],
                    children: stationList[from].children.map(id => (id === to ? newId : id)),
                    branch: {
                        left: stationList[from].branch?.left,
                        right:
                            stationList[from].branch?.right?.[1] === to
                                ? (stationList[from].branch?.right?.with(1, newId) as [BranchStyle, string])
                                : stationList[from].branch?.right,
                    },
                },
                [to]: {
                    ...stationList[to],
                    parents: stationList[to].parents.map(id => (id === from ? newId : id)),
                    branch: {
                        left:
                            stationList[to].branch?.left?.[1] === from
                                ? (stationList[to].branch?.left?.with(1, newId) as [BranchStyle, string])
                                : stationList[to].branch?.left,
                        right: stationList[to].branch?.right,
                    },
                },
                [newId]: {
                    ...newStationInfo,
                    parents: [from],
                    children: [to],
                },
            };
            dispatch(setStationsBulk(nextStationList));
            return newId;
        } else {
            if (!position) {
                return false;
            }

            const nextStationList = {
                ...stationList,
                [from]: {
                    ...stationList[from],
                    children:
                        position === 'upper'
                            ? [newId, stationList[from].children[0]]
                            : [stationList[from].children[0], newId],
                    branch: {
                        left: stationList[from].branch?.left,
                        right: [BranchStyle.through, newId] as [BranchStyle, string],
                    },
                },
                [to]: {
                    ...stationList[to],
                    parents:
                        position === 'upper'
                            ? [newId, stationList[to].parents[0]]
                            : [stationList[to].parents[0], newId],
                    branch: {
                        left: [BranchStyle.through, newId] as [BranchStyle, string],
                        right: stationList[to].branch?.right,
                    },
                },
                [newId]: {
                    ...newStationInfo,
                    parents: [from],
                    children: [to],
                },
            };
            dispatch(setStationsBulk(nextStationList));
            return newId;
        }
    };
};

export const addStationToExistingBranch = (where: number, preposition: 'before' | 'after', pivot: string) => {
    return (dispatch: RootDispatch, getState: () => RootState): false | string => {
        const branches = getState().helper.branches;
        const branch = branches[where];

        if (branch?.length) {
            if (preposition === 'before') {
                const from = branch[branch.indexOf(pivot) - 1];
                return dispatch(addStation(where.toString() as `${number}`, from, pivot));
            } else {
                const to = branch[branch.indexOf(pivot) + 1];
                return dispatch(addStation(where.toString() as `${number}`, pivot, to));
            }
        } else {
            return false;
        }
    };
};

export const getNewBranchAllowedEnds = () => {
    return (dispatch: RootDispatch, getState: () => RootState): string[] => {
        const stationList = getState().param.stn_list;
        const branches = getState().helper.branches;

        return branches[0].filter(id => {
            const isTwoSidedBranchOut = stationList[id].parents.length + stationList[id].children.length === 4;
            const isYShare0 = getYShareMTR(id, stationList) === 0;

            return !isTwoSidedBranchOut && isYShare0;
        });
    };
};

export const verifyNewBranchEnds = (from: string, to: string) => {
    return (dispatch: RootDispatch, getState: () => RootState): string => {
        const stationList = getState().param.stn_list;
        const branches = getState().helper.branches;

        // 应包含在主线上
        if (!branches[0].includes(from) || !branches[0].includes(to)) {
            return 'Branch should end at main line';
        }

        // 起点应位于终点之前
        if (branches[0].indexOf(from) >= branches[0].indexOf(to)) {
            return 'Not in correct order';
        }

        // 不能直接从线路起点连到线路终点
        if (from === 'linestart' && to === 'lineend') {
            return 'Should not be parallel to main line';
        }

        // 不能从首站开始形成开口支线
        if (from === 'linestart' && branches[0].indexOf(to) === 1) {
            return 'Branch should not be open jaw from the first station';
        }

        // 不能从末站开始形成开口支线
        if (to === 'lineend' && branches[0].indexOf(from) === branches[0].length - 2) {
            return 'Branch should not be open jaw from the last station';
        }

        // 起点须只有一个子站，终点须只有一个父站
        if (stationList[from].children.length > 1 || stationList[to].parents.length > 1) {
            return 'Branch already exist';
        }

        // 终点站不能成为除主线外任何支线的中间站
        const isExistBranchIncludesEndStation = branches
            .slice(1)
            .some(branch => branch.slice(1, -1).includes(from) || branch.slice(1, -1).includes(to));
        if (isExistBranchIncludesEndStation) {
            return 'Cannot branch out from existing branch';
        }

        // 两端之间的车站都不能是分叉站
        const isStationsBetweenNotBranchOut = branches[0]
            .slice(branches[0].indexOf(from) + 1, branches[0].indexOf(to))
            .every(id => stationList[id].parents.length === 1 && stationList[id].children.length === 1);
        if (!isStationsBetweenNotBranchOut) {
            return 'One or more stations between both ends are branching out';
        }

        return '';
    };
};
