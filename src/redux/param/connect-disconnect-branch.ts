import { RootDispatch, RootState } from '..';
import { Direction, StationDict } from '../../constants/constants';
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
    return (dispatch: RootDispatch, getState: () => RootState): boolean => {
        const isValid = dispatch(isStationValid2ConnectBranch(stationId, branchIndex));
        if (!isValid) {
            return false;
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
                        right: stationList.linestart.branch.right,
                    },
                },
                linestart: {
                    ...stationList.linestart,
                    children: stationList.linestart.children.filter(id => id !== branch[1]),
                    branch: {},
                },
            };
            dispatch(setStationsBulk(nextStationList));
            return true;
        } else {
            const seconndLastId: string = branch.slice(-2)[0];
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
                        left: stationList.lineend.branch.left,
                    },
                },
                lineend: {
                    ...stationList.lineend,
                    parents: stationList.lineend.parents.filter(id => id !== seconndLastId),
                    branch: {},
                },
            };
            dispatch(setStationsBulk(nextStationList));
            return true;
        }
    };
};

export const getPossibleDirection = (branchIndex: number) => {
    return (dispatch: RootDispatch, getState: () => RootState): Direction[] => {
        const { branches } = getState().helper;
        const stationList = getState().param.stn_list;
        const mainBranch = branches[0];
        const branch = branches[branchIndex];
        const branchType = dispatch(getBranchType(branchIndex));
        if (branchType !== 2) {
            console.log('getPossibleDirection():: failed as there is no possible direction');
            return [];
        }
        const beginStation = mainBranch.indexOf(branch[0]);
        const leftStationIdList = mainBranch.slice(0, beginStation);
        const endStation = mainBranch.indexOf(branch.slice(-1)[0]);
        const rightStationIdList = mainBranch.slice(endStation + 1);

        const isLeftPossible = leftStationIdList.every(stationId => {
            return stationList[stationId].children.length <= 1 && stationList[stationId].parents.length <= 1;
        });

        const isRightPossible = rightStationIdList.every(stationId => {
            return stationList[stationId].children.length <= 1 && stationList[stationId].parents.length <= 1;
        });

        if (isLeftPossible) {
            if (isRightPossible) {
                return [Direction.left, Direction.right];
            } else {
                return [Direction.left];
            }
        } else {
            if (isRightPossible) {
                return [Direction.right];
            } else {
                return [];
            }
        }
    };
};

export const disconnectFromMainLine = (direction: Direction, branchIndex: number) => {
    return (dispatch: RootDispatch, getState: () => RootState): boolean => {
        const directionList = dispatch(getPossibleDirection(branchIndex));
        if (!directionList.includes(direction)) {
            console.log('disconnectFromMainLine():: failed as the aim direction is not in the possible direction list');
            return false;
        }
        const { branches } = getState().helper;
        const stationList = getState().param.stn_list;
        const mainBranch = branches[0];
        const branch = branches[branchIndex];

        if (direction === Direction.left) {
            const beginStation = branch[0];

            const nextStationList: StationDict = {
                ...stationList,
                [branch[1]]: {
                    ...stationList[branch[1]],
                    parents: ['linestart'],
                },
                [beginStation]: {
                    ...stationList[beginStation],
                    children: stationList[beginStation].children.filter(id => id !== branch[1]),
                    branch: {},
                },
                linestart: {
                    ...stationList.linestart,
                    children: stationList[beginStation].children.map(id => (id === branch[1] ? id : mainBranch[1])),
                    branch: {
                        right: stationList[beginStation].branch.right,
                    },
                },
            };
            dispatch(setStationsBulk(nextStationList));
            return true;
        } else {
            const endStation = branch.slice(-1)[0];
            const secondEndStation = branch.slice(-2)[0];
            const nextStationList: StationDict = {
                ...stationList,
                [secondEndStation]: {
                    ...stationList[secondEndStation],
                    children: ['lineend'],
                },
                [endStation]: {
                    ...stationList[endStation],
                    parents: stationList[endStation].parents.filter(id => id !== secondEndStation),
                    branch: {},
                },
                lineend: {
                    ...stationList.lineend,
                    parents: stationList[endStation].parents.map(id =>
                        id === secondEndStation ? id : mainBranch.slice(-2)[0]
                    ),
                    branch: {
                        left: stationList[endStation].branch.left,
                    },
                },
            };
            dispatch(setStationsBulk(nextStationList));
            return true;
        }
    };
};
