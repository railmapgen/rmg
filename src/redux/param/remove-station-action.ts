import { RootDispatch, RootState } from '../index';
import { getYShareMTR } from '../../methods';
import { StationDict } from '../../constants/constants';
import { setStationsBulk } from './action';

/**
 * Return false when current algo can not handle this kind of station removal.
 * MUST BE CALLED AND CHECKED BEFORE removeStation!!!
 */
export const checkStationCouldBeRemoved = (stationId: string) => {
    return (dispatch: RootDispatch, getState: () => RootState): boolean => {
        const stationList = getState().param.stn_list;

        const { parents, children } = stationList[stationId];

        if (Object.keys(stationList).length === 4) {
            console.log('removeStation():: failed as only 2 stations remaining');
            return false;
        } else if (parents.length === 2 && children.length === 2) {
            // Todo: rewrite, join two branches rather than reject?
            console.log('removeStation():: failed as branches on both sides cannot be combined');
            return false;
        }

        // reject if station is the last one on main branch
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
    // checkStationCouldBeRemoved BEFORE removeStation!!!
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
            parents.forEach(parId => {
                newStnList[parId].children = children;
            });
            children.forEach(childId => {
                newStnList[childId].parents = parents;
            });
            if (parents.length === 1) {
                newStnList[parents[0]].branch.right = newStnList[stationId].branch.right;
            }
            if (children.length === 1) {
                newStnList[children[0]].branch.left = newStnList[stationId].branch.left;
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
                        right: [],
                    },
                },
                [children[0]]: {
                    ...stationList[children[0]],
                    parents: stationList[children[0]].parents.filter(id => id !== stationId),
                    branch: {
                        ...stationList[children[0]].branch,
                        left: [],
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

            // parents have length 1
            parents.forEach(parId => {
                var idx = newStnList[parId].children.indexOf(stationId);
                if (children.length) {
                    newStnList[parId].children[idx] = children[0];
                } else {
                    // Right dest
                    newStnList[parId].children.splice(idx, 1);
                }

                if (newStnList[parId].branch.right[1] === stationId) {
                    newStnList[parId].branch.right[1] = children[0];
                }
            });

            // children have length 1
            children.forEach(childId => {
                var idx = newStnList[childId].parents.indexOf(stationId);
                if (parents.length) {
                    newStnList[childId].parents[idx] = parents[0];
                } else {
                    // Left dest
                    newStnList[childId].parents.splice(idx, 1);
                }

                if (newStnList[childId].branch.left[1] === stationId) {
                    newStnList[childId].branch.left[1] = parents[0];
                }
            });
        }

        delete newStnList[stationId];
        dispatch(setStationsBulk(newStnList));
    };
};
