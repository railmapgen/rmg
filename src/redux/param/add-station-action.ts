import { RootDispatch, RootState } from '../index';
import { BranchStyle, Facilities, Services, ShortDirection, StationInfo } from '../../constants/constants';
import { getYShareMTR } from '../../methods';
import { setStationsBulk } from './action';
import { nanoid } from 'nanoid';

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

export const addStation = (where: `${number}` | 'new', from: string, to: string, position?: 'upper' | 'lower') => {
    return (dispatch: RootDispatch, getState: () => RootState): string | false => {
        const stationList = getState().param.stn_list;

        // get new id
        let newId = nanoid(6);
        while (newId in stationList) {
            newId = nanoid(6);
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
                            stationList[from].branch.right.length && stationList[from].branch.right[1] === to
                                ? ([stationList[from].branch.right[0], newId] as [BranchStyle, string])
                                : stationList[from].branch.right,
                    },
                },
                [to]: {
                    ...stationList[to],
                    parents: stationList[to].parents.map(id => (id === from ? newId : id)),
                    branch: {
                        left:
                            stationList[to].branch.left.length && stationList[to].branch.left[1] === from
                                ? ([stationList[to].branch.left[0], newId] as [BranchStyle, string])
                                : stationList[to].branch.left,
                        right: stationList[to].branch.right,
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
                        left: stationList[from].branch.left,
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
                        right: stationList[to].branch.right,
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

        // should be included in main line
        if (!branches[0].includes(from) || !branches[0].includes(to)) {
            return 'Branch should end at main line';
        }

        // from should come before to
        if (branches[0].indexOf(from) >= branches[0].indexOf(to)) {
            return 'Not in correct ordering';
        }

        // should not from linestart to lineend
        if (from === 'linestart' && to === 'lineend') {
            return 'Should not be parallel to main line';
        }

        // should not be open jaw from the first station
        if (from === 'linestart' && branches[0].indexOf(to) === 1) {
            return 'Branch should not be open jaw from the first station';
        }

        // should not be open jaw from the last station
        if (to === 'lineend' && branches[0].indexOf(from) === branches[0].length - 2) {
            return 'Branch should not be open jaw from the last station';
        }

        // from has one child, to has one parent
        if (stationList[from].children.length > 1 || stationList[to].parents.length > 1) {
            return 'Branch already exist';
        }

        // end station won't be a middle station of any branch except main line
        const isExistBranchIncludesEndStation = branches
            .slice(1)
            .some(branch => branch.slice(1, -1).includes(from) || branch.slice(1, -1).includes(to));
        if (isExistBranchIncludesEndStation) {
            return 'Cannot branch out from existing branch';
        }

        // stations between both ends should be stations which isn't branching out
        const isStationsBetweenNotBranchOut = branches[0]
            .slice(branches[0].indexOf(from) + 1, branches[0].indexOf(to))
            .every(id => stationList[id].parents.length === 1 && stationList[id].children.length === 1);
        if (!isStationsBetweenNotBranchOut) {
            return 'One or more stations between both ends are branching out';
        }

        return '';
    };
};
