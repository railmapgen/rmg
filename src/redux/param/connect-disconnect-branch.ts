import { RootDispatch, RootState } from '..';

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

export const isStationValid2ConnectBranch = (stationId: string, branchIndex: number) => {
    return (dispatch: RootDispatch, getState: () => RootState): boolean => {
        const { stn_list: stationList } = getState().param;
        const { branches } = getState().helper;

        const mainBranch = branches[0];
        const branch = branches[branchIndex];
        const targetStationIndex = mainBranch.indexOf(stationId);

        const branchType = dispatch(getBranchType(branchIndex));

        if (branchType === 2) {
            console.log('isStationValid2ConnectBranch():: failed as current branch has 2 connected ends');
            return false;
        }

        if (targetStationIndex < 0) {
            console.log('isStationValid2ConnectBranch():: failed as the target station is not on main line');
            return false;
        }

        if (branch[0] === 'linestart' && targetStationIndex >= mainBranch.indexOf(branch.slice(-1)[0])) {
            console.log('isStationValid2ConnectBranch():: failed as the target station is after the ending station');
            return false;
        }

        if (branch.slice(-1)[0] === 'lineend' && targetStationIndex <= mainBranch.indexOf(branch[0])) {
            console.log('isStationValid2ConnectBranch():: failed as the target station is before the starting station');
            return false;
        }
        return true;
    };
};
