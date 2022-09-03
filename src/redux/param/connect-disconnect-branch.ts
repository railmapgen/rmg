import { RootDispatch, RootState } from '..';
import { StationDict } from '../../constants/constants';
import { setStationsBulk } from './action';

export const getBranchType = (branchIndex: number) => {
    return (dispatch: RootDispatch, getState: () => RootState): 1 | 2 => {
        const branches = getState().helper.branches;
        const branch = branches[branchIndex];

        if (branch.includes('linestart') || branch.includes('lineend')) {
            return 1;
        } else {
            return 2;
        }
    };
};

export const getPossibleStations = (branchIndex: number) => {
    return (dispatch: RootDispatch, getState: () => RootState): string[] => {
        const { branches } = getState().helper;
        const mainBranch = branches[0];
        const branch = branches[branchIndex];
        return mainBranch.slice(mainBranch.indexOf(branch[0]) + 1, mainBranch.indexOf(branch.slice(-1)[0]));
    };
};

export const isStationValid2ConnectBranch = (stationId: string, branchIndex: number) => {
    return (dispatch: RootDispatch): boolean => {
        const branchType = dispatch(getBranchType(branchIndex));

        if (branchType === 2) {
            console.log('isStationValid2ConnectBranch():: failed as current branch has 2 connected ends');
            return false;
        }

        const possibleStations = dispatch(getPossibleStations(branchIndex));

        if (!possibleStations.includes(stationId)) {
            console.log('isStationValid2ConnectBranch():: failed as the target station is invalid');
            return false;
        }
        return true;
    };
};

export const connect2MainLine = (stationId: string, branchIndex: number) => {
    return (dispatch: RootDispatch, getState: () => RootState) => {
        const isValid = dispatch(isStationValid2ConnectBranch(stationId, branchIndex));
        if (!isValid) {
            return;
        }
        const { branches } = getState().helper;
        const stationList = getState().param.stn_list;
        const branch = branches[branchIndex];

        if (branch[0] === 'linestart') {
            const nextStationList: StationDict = {
                ...stationList,
                [branch[1]]: {
                    ...stationList[branch[1]],
                    parents: [stationId],
                },
                [stationId]: {
                    ...stationList[stationId],
                    children: stationList.linestart.children.map(id =>
                        id === branch[1] ? id : stationList[stationId].children[0]
                    ),
                    branch: {
                        left: [],
                        right: stationList.linestart.branch.right,
                    },
                },
                linestart: {
                    ...stationList.linestart,
                    children: stationList.linestart.children.filter(id => id !== branch[1]),
                    branch: {
                        left: [],
                        right: [],
                    },
                },
            };
            dispatch(setStationsBulk(nextStationList));
        } else {
            const seconndLastId : string = branch.slice(-2)[0];
            const nextStationList: StationDict = {
                ...stationList,
                [seconndLastId]: {
                    ...stationList[seconndLastId],
                    children: [stationId],
                },
                [stationId]: {
                    ...stationList[stationId],
                    parents: stationList.lineend.parents.map(id =>
                        id === seconndLastId ? id : stationList[stationId].parents[0]
                    ),
                    branch: {
                        right: [],
                        left: stationList.lineend.branch.left,
                    },
                },
                lineend: {
                    ...stationList.lineend,
                    parents: stationList.lineend.parents.filter(id => id !== seconndLastId),
                    branch: {
                        left: [],
                        right: [],
                    },
                },
            };
            dispatch(setStationsBulk(nextStationList));
        }
    };
};
