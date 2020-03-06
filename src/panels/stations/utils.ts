import { StationInfo } from '../../types';
import { getYShareMTR } from '../../methods';

/**
 * Remove a station and update neighbour's parameters at the same time. 
 * (All descriptions are based on MTR style. )
 */
export const removeStation = (stnId: string, stnList: { [stnId: string]: StationInfo }) => {
    let newStnList = JSON.parse(JSON.stringify(stnList));
    let parents = newStnList[stnId].parents;
    let children = newStnList[stnId].children;

    let isLastMainBranchStn = true;
    for (let id in newStnList) {
        if ([stnId, 'linestart', 'lineend'].includes(id)) continue;
        if (getYShareMTR(id, newStnList) === 0) {
            isLastMainBranchStn = false;
            break;
        }
    }

    if (parents.length == 2 && children.length == 2) {
        // Todo: rewrite, join two branches rather than reject
        return false;
    } else if (isLastMainBranchStn) {
        // Last main line station
        return false;
    } else if (Object.keys(newStnList).length == 4) {
        // Last two stations
        return false;
    } else if (parents.length == 2 || children.length == 2) {
        console.log('this case')
        parents.forEach(parId => {
            newStnList[parId].children = children;
        });
        children.forEach(childId => {
            newStnList[childId].parents = parents;
        });
        if (parents.length == 1) {
            newStnList[parents[0]].branch.right = newStnList[stnId].branch.right;
        }
        if (children.length == 1) {
            newStnList[children[0]].branch.left = newStnList[stnId].branch.left;
        }
    } else if (newStnList[parents[0]].children.length == 2 && newStnList[children[0]].parents.length == 2) {
        // 1 par 1 child, last station on upper/lower branch
        // branch disappear
        var childIdxOfPar = newStnList[parents[0]].children.indexOf(stnId);
        var parIdxOfChild = newStnList[children[0]].parents.indexOf(stnId);
        newStnList[parents[0]].children.splice(childIdxOfPar, 1);
        newStnList[children[0]].parents.splice(parIdxOfChild, 1);

        newStnList[parents[0]].branch.right = [];
        newStnList[children[0]].branch.left = [];
    } else {
        // 1 par 1 child
        parents.forEach(parId => {
            var idx = newStnList[parId].children.indexOf(stnId);
            if (children.length) {
                newStnList[parId].children[idx] = children[0];
            } else {
                // Right dest
                newStnList[parId].children.splice(idx, 1);
            }

            if (newStnList[parId].branch.right[1] === stnId) {
                newStnList[parId].branch.right[1] = children[0];
            }
        });
        children.forEach(childId => {
            var idx = newStnList[childId].parents.indexOf(stnId);
            if (parents.length) {
                newStnList[childId].parents[idx] = parents[0];
            } else {
                // Left dest
                newStnList[childId].parents.splice(idx, 1);
            }

            if (newStnList[childId].branch.left[1] === stnId) {
                newStnList[childId].branch.left[1] = parents[0];
            }
        })
    }

    delete newStnList[stnId];

    return newStnList;
};
