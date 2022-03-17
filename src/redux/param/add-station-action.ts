import { AppDispatch, RootState } from '../index';
import { getRandomId } from './station-list-util';
import { BranchStyle, Facilities, Services, ShortDirection, StationDict, StationInfo } from '../../constants/constants';
import { getYShareMTR } from '../../methods';
import { setStationsBulk } from './action';

const getStationTemplate = (id: string): StationInfo => ({
    name: ['未命名 ' + id, 'Unnamed ' + id],
    secondaryName: false,
    num: '00',
    services: [Services.local],
    parents: [],
    children: [],
    branch: { left: [], right: [] },
    transfer: {
        info: [[]],
        // type: 'none',
        tick_direc: ShortDirection.right,
        paid_area: true,
        osi_names: [],
    },
    facility: Facilities.none,
    loop_pivot: false,
});

/**
 * @deprecated For V3 legacy support
 */
export const addStationLegacy = (
    prep: 'before' | 'after',
    pivotStationId: string,
    loc: 'centre' | 'upper' | 'lower' | 'newupper' | 'newlower',
    end: string
) => {
    // return new station id
    return (dispatch: AppDispatch, getState: () => RootState): string => {
        const stationList = getState().param.stn_list;
        // get new id
        let newId = getRandomId();
        while (Object.keys(stationList).includes(newId)) {
            newId = getRandomId();
        }
        let newInfo: StationInfo = {
            name: ['未命名 ' + newId, 'Unnamed ' + newId],
            secondaryName: false,
            num: '00',
            services: [Services.local],
            parents: [],
            children: [],
            branch: {
                left: [],
                right: [],
            },
            transfer: {
                info: [[]],
                // type: 'none',
                tick_direc: ShortDirection.right,
                paid_area: true,
                osi_names: [],
            },
            facility: Facilities.none,
            loop_pivot: false,
        };

        let newStnList = JSON.parse(JSON.stringify(stationList)) as StationDict;

        if (prep === 'before') {
            if (loc === 'centre') {
                newInfo.parents = stationList[pivotStationId].parents;
                if (
                    stationList[pivotStationId].parents.length === 0 &&
                    getYShareMTR(pivotStationId, stationList) !== 0
                ) {
                    // todo: is this case really exist?
                    newInfo.children = stationList.linestart.children;
                } else if (getYShareMTR(pivotStationId, stationList) !== 0) {
                    // pivot on branch
                    newInfo.children = stationList[stationList[pivotStationId].parents[0]].children.slice();
                    newInfo.branch.right = stationList[newInfo.parents[0]].branch.right;
                    newStnList[newInfo.parents[0]].branch.right = [];
                } else {
                    // pivot on main
                    newInfo.children = [pivotStationId];
                    newInfo.branch.left = stationList[pivotStationId].branch.left;
                    newStnList[pivotStationId].branch.left = [];
                }
                newInfo.parents.forEach(par => {
                    newStnList[par].children = [newId];
                });
                newInfo.children.forEach(child => {
                    newStnList[child].parents = [newId];
                });
            } else if (loc === 'upper') {
                if (stationList[pivotStationId].parents.length === 2) {
                    if (stationList[pivotStationId].branch.left[1] === stationList[pivotStationId].parents[0]) {
                        newStnList[pivotStationId].branch.left[1] = newId;
                    }

                    newInfo.parents = stationList[pivotStationId].parents.slice(0, 1);
                    newInfo.children = [pivotStationId];
                    newInfo.parents.forEach(par => {
                        newStnList[par].children = [newId];
                    });
                    newStnList[pivotStationId].parents[0] = newId;
                } else {
                    // already on branch
                    newInfo.parents = stationList[pivotStationId].parents;
                    newInfo.children = [pivotStationId];
                    newInfo.parents.forEach(par => {
                        newStnList[par].children[0] = newId;

                        if (stationList[par].branch.right[1] === pivotStationId) {
                            newStnList[par].branch.right[1] = newId;
                        }
                    });
                    newInfo.children.forEach(child => {
                        newStnList[child].parents = [newId];
                    });
                }
            } else if (loc === 'lower') {
                if (stationList[pivotStationId].parents.length === 2) {
                    if (stationList[pivotStationId].branch.left[1] === stationList[pivotStationId].parents[1]) {
                        newStnList[pivotStationId].branch.left[1] = newId;
                    }

                    newInfo.parents = stationList[pivotStationId].parents.slice(1);
                    newInfo.children = [pivotStationId];
                    newInfo.parents.forEach(par => {
                        newStnList[par].children = [newId];
                    });
                    newStnList[pivotStationId].parents[1] = newId;
                } else {
                    // already on branch
                    newInfo.parents = stationList[pivotStationId].parents;
                    newInfo.children = [pivotStationId];
                    newInfo.parents.forEach(par => {
                        let parChildLen = stationList[par].children.length;
                        newStnList[par].children[parChildLen - 1] = newId;

                        if (stationList[par].branch.right[1] === pivotStationId) {
                            newStnList[par].branch.right[1] = newId;
                        }
                    });
                    newInfo.children.forEach(child => {
                        newStnList[child].parents = [newId];
                    });
                }
            } else {
                newStnList[pivotStationId].branch.left = [BranchStyle.through, newId];
                newStnList[end].branch.right = [BranchStyle.through, newId];
                newInfo.parents = [end];
                newInfo.children = [pivotStationId];

                if (loc === 'newupper') {
                    newStnList[end].children.unshift(newId);
                    newStnList[pivotStationId].parents.unshift(newId);
                } else {
                    newStnList[end].children.push(newId);
                    newStnList[pivotStationId].parents.push(newId);
                }
            }
        } else {
            if (loc === 'centre') {
                newInfo.children = stationList[pivotStationId].children;
                if (
                    stationList[pivotStationId].children.length === 0 &&
                    getYShareMTR(pivotStationId, stationList) !== 0
                ) {
                    newInfo.parents = stationList.lineend.parents;
                } else if (getYShareMTR(pivotStationId, stationList) !== 0) {
                    // pivot on branch
                    newInfo.parents = stationList[stationList[pivotStationId].children[0]].parents;
                    newInfo.branch.left = stationList[newInfo.children[0]].branch.left;
                    newStnList[newInfo.children[0]].branch.left = [];
                } else {
                    // pivot on main
                    newInfo.parents = [pivotStationId];
                    newInfo.branch.right = stationList[pivotStationId].branch.right;
                    newStnList[pivotStationId].branch.right = [];
                }
                newInfo.children.forEach(child => {
                    newStnList[child].parents = [newId];
                });
                newInfo.parents.forEach(par => {
                    newStnList[par].children = [newId];
                });
            } else if (loc === 'upper') {
                if (stationList[pivotStationId].children.length === 2) {
                    if (stationList[pivotStationId].branch.right[1] === stationList[pivotStationId].children[0]) {
                        newStnList[pivotStationId].branch.right[1] = newId;
                    }

                    newInfo.children = stationList[pivotStationId].children.slice(0, 1);
                    newInfo.parents = [pivotStationId];
                    newInfo.children.forEach(child => {
                        newStnList[child].parents = [newId];
                    });
                    newStnList[pivotStationId].children[0] = newId;
                } else {
                    // already on branch
                    newInfo.children = stationList[pivotStationId].children;
                    newInfo.parents = [pivotStationId];
                    newInfo.children.forEach(child => {
                        newStnList[child].parents[0] = newId;

                        if (stationList[child].branch.left[1] === pivotStationId) {
                            newStnList[child].branch.left[1] = newId;
                        }
                    });
                    newInfo.parents.forEach(par => {
                        newStnList[par].children = [newId];
                    });
                }
            } else if (loc === 'lower') {
                if (stationList[pivotStationId].children.length === 2) {
                    if (stationList[pivotStationId].branch.right[1] === stationList[pivotStationId].children[1]) {
                        newStnList[pivotStationId].branch.right[1] = newId;
                    }

                    newInfo.children = stationList[pivotStationId].children.slice(1);
                    newInfo.parents = [pivotStationId];
                    newInfo.children.forEach(child => {
                        newStnList[child].parents = [newId];
                    });
                    newStnList[pivotStationId].children[1] = newId;
                } else {
                    // already on branch
                    newInfo.children = stationList[pivotStationId].children;
                    newInfo.parents = [pivotStationId];
                    newInfo.children.forEach(child => {
                        newStnList[child].parents[stationList[child].parents.length === 1 ? 0 : 1] = newId;

                        if (stationList[child].branch.left[1] === pivotStationId) {
                            newStnList[child].branch.left[1] = newId;
                        }
                    });
                    newInfo.parents.forEach(par => {
                        newStnList[par].children = [newId];
                    });
                }
            } else {
                newStnList[pivotStationId].branch.right = [BranchStyle.through, newId];
                newStnList[end].branch.left = [BranchStyle.through, newId];

                newInfo.children = [end];
                newInfo.parents = [pivotStationId];

                if (loc === 'newupper') {
                    newStnList[end].parents.unshift(newId);
                    newStnList[pivotStationId].children.unshift(newId);
                } else {
                    newStnList[end].parents.push(newId);
                    newStnList[pivotStationId].children.push(newId);
                }
            }
        }

        dispatch(
            setStationsBulk({
                ...newStnList,
                [newId]: newInfo,
            })
        );
        return newId;
    };
};

export const addStation = (where: `${number}` | 'new', from: string, to: string) => {
    return (dispatch: AppDispatch, getState: () => RootState): boolean => {
        const stationList = getState().param.stn_list;

        // get new id
        let newId = getRandomId();
        while (Object.keys(stationList).includes(newId)) {
            newId = getRandomId();
        }
        const newStationInfo = getStationTemplate(newId);

        if (where !== 'new') {
            const nextStationList = {
                ...stationList,
                [from]: {
                    ...stationList[from],
                    children: stationList[from].children.map(id => (id === to ? newId : id)),
                    branch: {
                        left: stationList[from].branch.left,
                        right:
                            stationList[from].branch.right.length && stationList[to].branch.right[1] === to
                                ? ([stationList[from].branch.right[0], newId] as [BranchStyle, string])
                                : stationList[from].branch.right,
                    },
                },
                [to]: {
                    ...stationList[to],
                    parents: stationList[to].parents.map(id => (id === from ? newId : id)),
                    branch: {
                        right: stationList[to].branch.right,
                        left:
                            stationList[to].branch.left.length && stationList[to].branch.left[1] === from
                                ? ([stationList[to].branch.left[0], newId] as [BranchStyle, string])
                                : stationList[to].branch.left,
                    },
                },
                [newId]: {
                    ...newStationInfo,
                    parents: [from],
                    children: [to],
                },
            };
            dispatch(setStationsBulk(nextStationList));
            return true;
        } else {
            return false;
        }
    };
};
