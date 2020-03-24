import { getYShareMTR } from '../../methods';

export const addStation = (
    prep: 'before' | 'after',
    stnId: string,
    loc: 'centre' | 'upper' | 'lower' | 'newupper' | 'newlower',
    end: string,
    stnList: { [stnId: string]: StationInfo }
) => {
    // get new id
    let newId = getRandomId();
    while (Object.keys(stnList).includes(newId)) {
        newId = getRandomId();
    }
    let newInfo: StationInfo = {
        name: getNameFromId(newId),
        num: '00',
        services: ['local'],
        parents: [],
        children: [],
        branch: {
            left: [],
            right: [],
        },
        transfer: {
            info: [[]],
            type: 'none',
            tick_direc: 'r',
            paid_area: true,
            osi_names: [],
        },
        facility: '',
    };

    let newStnList = JSON.parse(JSON.stringify(stnList));

    if (prep === 'before') {
        if (loc === 'centre') {
            newInfo.parents = stnList[stnId].parents;
            if (stnList[stnId].parents.length === 0 && getYShareMTR(stnId, stnList) !== 0) {
                // todo: is this case really exist?
                newInfo.children = stnList.linestart.children;
            } else if (getYShareMTR(stnId, stnList) !== 0) {
                // pivot on branch
                newInfo.children = stnList[stnList[stnId].parents[0]].children.slice();
                newInfo.branch.right = stnList[newInfo.parents[0]].branch.right;
                newStnList[newInfo.parents[0]].branch.right = [];
            } else {
                // pivot on main
                newInfo.children = [stnId];
                newInfo.branch.left = stnList[stnId].branch.left;
                newStnList[stnId].branch.left = [];
            }
            newInfo.parents.forEach(par => {
                newStnList[par].children = [newId];
            });
            newInfo.children.forEach(child => {
                newStnList[child].parents = [newId];
            });
        } else if (loc === 'upper') {
            if (stnList[stnId].parents.length === 2) {
                if (stnList[stnId].branch.left[1] === stnList[stnId].parents[0]) {
                    newStnList[stnId].branch.left[1] = newId;
                }

                newInfo.parents = stnList[stnId].parents.slice(0, 1);
                newInfo.children = [stnId];
                newInfo.parents.forEach(par => {
                    newStnList[par].children = [newId];
                });
                newStnList[stnId].parents[0] = newId;
            } else {
                // already on branch
                newInfo.parents = stnList[stnId].parents;
                newInfo.children = [stnId];
                newInfo.parents.forEach(par => {
                    newStnList[par].children[0] = newId;

                    if (stnList[par].branch.right[1] === stnId) {
                        newStnList[par].branch.right[1] = newId;
                    }
                });
                newInfo.children.forEach(child => {
                    newStnList[child].parents = [newId];
                });
            }
        } else if (loc === 'lower') {
            if (stnList[stnId].parents.length === 2) {
                if (stnList[stnId].branch.left[1] === stnList[stnId].parents[1]) {
                    newStnList[stnId].branch.left[1] = newId;
                }

                newInfo.parents = stnList[stnId].parents.slice(1);
                newInfo.children = [stnId];
                newInfo.parents.forEach(par => {
                    newStnList[par].children = [newId];
                });
                newStnList[stnId].parents[1] = newId;
            } else {
                // already on branch
                newInfo.parents = stnList[stnId].parents;
                newInfo.children = [stnId];
                newInfo.parents.forEach(par => {
                    let parChildLen = stnList[par].children.length;
                    newStnList[par].children[parChildLen - 1] = newId;

                    if (stnList[par].branch.right[1] === stnId) {
                        newStnList[par].branch.right[1] = newId;
                    }
                });
                newInfo.children.forEach(child => {
                    newStnList[child].parents = [newId];
                });
            }
        } else {
            newStnList[stnId].branch.left = ['through', newId];
            newStnList[end].branch.right = ['through', newId];
            newInfo.parents = [end];
            newInfo.children = [stnId];

            if (loc === 'newupper') {
                newStnList[end].children.unshift(newId);
                newStnList[stnId].parents.unshift(newId);
            } else {
                newStnList[end].children.push(newId);
                newStnList[stnId].parents.push(newId);
            }
        }
    } else {
        if (loc === 'centre') {
            newInfo.children = stnList[stnId].children;
            if (stnList[stnId].children.length === 0 && getYShareMTR(stnId, stnList) !== 0) {
                newInfo.parents = stnList.lineend.parents;
            } else if (getYShareMTR(stnId, stnList) !== 0) {
                // pivot on branch
                newInfo.parents = stnList[stnList[stnId].children[0]].parents;
                newInfo.branch.left = stnList[newInfo.children[0]].branch.left;
                newStnList[newInfo.children[0]].branch.left = [];
            } else {
                // pivot on main
                newInfo.parents = [stnId];
                newInfo.branch.right = stnList[stnId].branch.right;
                newStnList[stnId].branch.right = [];
            }
            newInfo.children.forEach(child => {
                newStnList[child].parents = [newId];
            });
            newInfo.parents.forEach(par => {
                newStnList[par].children = [newId];
            });
        } else if (loc === 'upper') {
            if (stnList[stnId].children.length === 2) {
                if (stnList[stnId].branch.right[1] === stnList[stnId].children[0]) {
                    newStnList[stnId].branch.right[1] = newId;
                }

                newInfo.children = stnList[stnId].children.slice(0, 1);
                newInfo.parents = [stnId];
                newInfo.children.forEach(child => {
                    newStnList[child].parents = [newId];
                });
                newStnList[stnId].children[0] = newId;
            } else {
                // already on branch
                newInfo.children = stnList[stnId].children;
                newInfo.parents = [stnId];
                newInfo.children.forEach(child => {
                    newStnList[child].parents[0] = newId;

                    if (stnList[child].branch.left[1] === stnId) {
                        newStnList[child].branch.left[1] = newId;
                    }
                });
                newInfo.parents.forEach(par => {
                    newStnList[par].children = [newId];
                });
            }
        } else if (loc === 'lower') {
            if (stnList[stnId].children.length === 2) {
                if (stnList[stnId].branch.right[1] === stnList[stnId].children[1]) {
                    newStnList[stnId].branch.right[1] = newId;
                }

                newInfo.children = stnList[stnId].children.slice(1);
                newInfo.parents = [stnId];
                newInfo.children.forEach(child => {
                    newStnList[child].parents = [newId];
                });
                newStnList[stnId].children[1] = newId;
            } else {
                // already on branch
                newInfo.children = stnList[stnId].children;
                newInfo.parents = [stnId];
                newInfo.children.forEach(child => {
                    newStnList[child].parents[stnList[child].parents.length === 1 ? 0 : 1] = newId;

                    if (stnList[child].branch.left[1] === stnId) {
                        newStnList[child].branch.left[1] = newId;
                    }
                });
                newInfo.parents.forEach(par => {
                    newStnList[par].children = [newId];
                });
            }
        } else {
            newStnList[stnId].branch.right = ['through', newId];
            newStnList[end].branch.left = ['through', newId];

            newInfo.children = [end];
            newInfo.parents = [stnId];

            if (loc === 'newupper') {
                newStnList[end].parents.unshift(newId);
                newStnList[stnId].children.unshift(newId);
            } else {
                newStnList[end].parents.push(newId);
                newStnList[stnId].children.push(newId);
            }
        }
    }

    return [
        newId,
        {
            ...newStnList,
            [newId]: newInfo,
        },
    ];
};

const getRandomId = () =>
    Math.floor(Math.random() * Math.pow(36, 4))
        .toString(36)
        .padStart(4, '0');

function getNameFromId(stnId: string): Name {
    let numsZH = '癸甲乙丙丁戊己庚辛壬日月金木水火土竹戈十大中一弓人心手口尸廿山女田難卜重'.split('');
    let numsEN = 'Zero One Two Three Four Five Six Seven Eight Nine Alfa Bravo Charlie Delta Echo Foxtrot Golf Hotel India Juliett Kilo Lima Mike November Oscar Papa Quebec Romeo Sierra Tango Uniform Victor Whiskey X-ray Yankee Zulu'.split(
        ' '
    );
    return [
        stnId
            .split('')
            .map(char => numsZH[parseInt(char, 36)])
            .join(''),
        stnId
            .split('')
            .map(char => numsEN[parseInt(char, 36)])
            .join(' '),
    ];
}

/**
 * Remove a station and update neighbour's parameters at the same time.
 * (All descriptions are based on MTR style. )
 */
export const removeStation = (stnId: string, stnList: StationDict) => {
    let newStnList = JSON.parse(JSON.stringify(stnList)) as StationDict;
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

    if (parents.length === 2 && children.length === 2) {
        // Todo: rewrite, join two branches rather than reject
        return false;
    } else if (isLastMainBranchStn) {
        // Last main line station
        return false;
    } else if (Object.keys(newStnList).length === 4) {
        // Last two stations
        return false;
    } else if (parents.length === 2 || children.length === 2) {
        console.log('this case');
        parents.forEach(parId => {
            newStnList[parId].children = children;
        });
        children.forEach(childId => {
            newStnList[childId].parents = parents;
        });
        if (parents.length === 1) {
            newStnList[parents[0]].branch.right = newStnList[stnId].branch.right;
        }
        if (children.length === 1) {
            newStnList[children[0]].branch.left = newStnList[stnId].branch.left;
        }
    } else if (newStnList[parents[0]].children.length === 2 && newStnList[children[0]].parents.length === 2) {
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
        });
    }

    delete newStnList[stnId];

    return newStnList;
};

export const reverseStations = (stnList: { [stnId: string]: StationInfo }) => {
    let newStnList = JSON.parse(JSON.stringify(stnList));
    Object.keys(stnList).forEach(stnId => {
        let stnInfo = { ...stnList[stnId] };
        if (stnId === 'linestart') {
            newStnList.lineend.parents = stnInfo.children.reverse();
            newStnList.lineend.branch = {
                left: stnInfo.branch.right,
                right: [],
            };
        } else if (stnId === 'lineend') {
            newStnList.linestart.children = stnInfo.parents.reverse();
            newStnList.linestart.branch = {
                left: [],
                right: stnInfo.branch.left,
            };
        } else {
            var tmpArr = stnInfo.children.reverse().map(id => {
                switch (id) {
                    case 'linestart':
                        return 'lineend';
                    case 'lineend':
                        return 'linestart';
                    default:
                        return id;
                }
            });
            newStnList[stnId].children = stnInfo.parents.reverse().map(id => {
                switch (id) {
                    case 'linestart':
                        return 'lineend';
                    case 'lineend':
                        return 'linestart';
                    default:
                        return id;
                }
            });
            newStnList[stnId].parents = tmpArr;
            newStnList[stnId].branch.left = stnInfo.branch.right;
            newStnList[stnId].branch.right = stnInfo.branch.left;
        }
    });
    return newStnList;
};
