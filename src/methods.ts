import * as React from 'react';

import { StationInfo } from "./types";

/**
 * Horizontal position (in shares) of every station icon. 
 */
export const getXShares = (stnList: {[stnId: string]: StationInfo}) => {
    console.log('computing x shares');
    let xShares = {} as {[stnId: string]: number};
    let cp = getCriticalPath(stnList);

    const getXShare = (
        stnId: string, 
        stnList: {[stnId: string]: StationInfo}, 
        cp: {len: number, nodes: string[]}
    ): number => {
        if (stnId in xShares) return xShares[stnId];
        console.log(stnId);
    
        if (cp.nodes.includes(stnId)) {
            let res = cpm(cp.nodes[0], stnId, stnList).len;
            xShares[stnId] = res;
            return res;
        }
    
        var partSource = stnId;
        var partSink = stnId;
        var leftOpenJaw = false;
        var rightOpenJaw = false;
    
        while (true) {
            var parent = stnList[partSource].parents[0];
            if (parent == 'linestart') {
                leftOpenJaw = true;
                break;
            }
            partSource = parent;
            if (stnList[partSource].children.length > 1) {
                break;
            }
        }
    
        while (true) {
            var children = stnList[partSink].children;
            if (children[0] != 'lineend') {
                partSink = children[0];
            } else {
                rightOpenJaw = true;
                break;
            }
            if (stnList[partSink].parents.length > 1) {
                break;
            }
        }
    
        var lengthToSource = cpm(partSource, stnId, stnList).len;
        var lengthToSink = cpm(stnId, partSink, stnList).len;
        if (leftOpenJaw) {
            var actualPartLength = cpm(cp.nodes[0], partSink, stnList).len;
            let res = getXShare(partSink, stnList, cp) - lengthToSink / (lengthToSource + lengthToSink) * actualPartLength;
            xShares[stnId] = res;
            return res;
        } else if (rightOpenJaw) {
            var actualPartLength = cpm(partSource, cp.nodes.slice(-1)[0], stnList).len;
        } else {
            var actualPartLength = cpm(partSource, partSink, stnList).len;
        }
        let res = getXShare(partSource, stnList, cp) + lengthToSource / (lengthToSource + lengthToSink) * actualPartLength;
        xShares[stnId] = res;
        return res;
    };

    Object.keys(stnList).forEach(stnId => {
        if (['linestart','lineend'].includes(stnId)) return;
        if (stnId in xShares) return;
        getXShare(stnId, stnList, cp);
    });

    return xShares;
};

/**
 * Vertical position (in shares) of station icon if using MTR style (for consistency of method `RMGLine.newStnPossibleLoc()`). 
 */
export const getYShareMTR = (stnId: string, stnList: {[stnId: string]: StationInfo}): -1 | 0 | 1 => {
    if (['linestart', 'lineend'].includes(stnId) || 
        stnList[stnId].parents.length > 1 || 
        stnList[stnId].children.length > 1) {
        return 0;
    }
    var stnPred = stnList[stnId].parents[0];
    if (stnPred) {
        // parent exist
        if (stnList[stnPred].children.length == 1) {
            // no sibling, then y same as parent
            return getYShareMTR(stnPred, stnList);
        } else {
            // sibling exists, then y depends on its idx of being children
            return (stnList[stnPred].children.indexOf(stnId) == 0) ? 1 : -1;
        }
    } else {
        // no parent, must be linestart
        return 0;
    }
};

export const getYShares = (stnList: {[stnId: string]: StationInfo}) => {
    console.log('computing y shares');
    let yShares = {} as {[stnId: string]: -1 | 0 | 1};

    const getYShare = (stnId: string, stnList: {[stnId: string]: StationInfo}) => {
        if (stnId in yShares) return yShares[stnId];

        if (['linestart', 'lineend'].includes(stnId) || 
        stnList[stnId].parents.length > 1 || 
        stnList[stnId].children.length > 1) {
            yShares[stnId] = 0;
            return 0;
        }
        var stnPred = stnList[stnId].parents[0];
        if (stnPred) {
            // parent exist
            if (stnList[stnPred].children.length == 1) {
                // no sibling, then y same as parent
                let res = getYShareMTR(stnPred, stnList);
                yShares[stnId] = res;
                return res;
            } else {
                // sibling exists, then y depends on its idx of being children
                let res: 1 | -1 = (stnList[stnPred].children.indexOf(stnId) == 0) ? 1 : -1;
                yShares[stnId] = res;
                return res;
            }
        } else {
            // no parent, must be linestart
            yShares[stnId] = 0;
            return 0;
        }
    }

    Object.keys(stnList).forEach(stnId => {
        if (['linestart','lineend'].includes(stnId)) return;
        if (stnId in yShares) return;
        getYShare(stnId, stnList);
    });

    return yShares;
};

/**
 * Critical path and corresponding length from a station to another. 
 * @param from ID of station on the left
 * @param to ID of station on the left
 */
export const cpm = (from: string, to: string, stnList: {[stnId: string]: StationInfo}) => {
    if (from == to) {
        return { len: 0, nodes: [from] };
    }
    let allLengths: number[] = [];
    let criticalPaths: string[][] = [];
    stnList[from].children.forEach(child => {
        let cp = cpm(child, to, stnList);
        if (cp.len < 0) {return;}
        // allLengths.push(this._pathWeight(from, child) + cp.len); // TODO
        allLengths.push(1 + cp.len);
        cp.nodes.unshift(from);
        criticalPaths.push(cp.nodes);
    });
    let maxLength = Math.max(...allLengths);
    return {
        'len': maxLength, 
        'nodes': criticalPaths[allLengths.indexOf(maxLength)]
    };
}

const getCriticalPath = (stnList: {[stnId: string]: StationInfo}) => {
    console.log('computing critical path');
    let allLengths: number[] = [];
    let criticalPaths: string[][] = [];
    stnList.linestart.children.forEach(ld => {
        stnList.lineend.parents.forEach(rd => {
            let cp = cpm(ld, rd, stnList);
            allLengths.push(cp.len);
            criticalPaths.push(cp.nodes);
        });
    });
    let maxLen = Math.max(...allLengths);
    return({
        'len': maxLen,
        'nodes': criticalPaths[allLengths.indexOf(maxLen)]
    });
};

/**
 * Getter of critical path (from left to right) and corresponding length of the entire line. 
 */
const useCriticalPath = (stnList: {[stnId: string]: StationInfo}) => {
    const [cp, setCp] = React.useState({} as {len: number, nodes: string[]});

    React.useEffect(() => {
        console.log('computing critical path');
        let allLengths: number[] = [];
        let criticalPaths: string[][] = [];
        stnList.linestart.children.forEach(ld => {
            stnList.lineend.parents.forEach(rd => {
                let cp = cpm(ld, rd, stnList);
                allLengths.push(cp.len);
                criticalPaths.push(cp.nodes);
            });
        });
        let maxLen = Math.max(...allLengths);
        setCp({
            'len': maxLen,
            'nodes': criticalPaths[allLengths.indexOf(maxLen)]
        });
    }, [JSON.stringify(stnList)]);

    return cp;
};

/**
 * Getter of all branches (支線段) of the line (both ends included). The first branch must be the main line. 
 * @example MTREastRailLine.branches
 * /*
 * [0]: [LineStart, Lo Wu, ..., Hung Hom, LineEnd]
 * [1]: [LineStart, Lok Ma Chau, Sheung Shui]
 * [2]: [University, Racecourse, Sha Tin]
 * /
 */
export const getBranches = (stnList: {[stnId: string]: StationInfo}) => {
    console.log('computing branches');

    var stack = ['linestart'];
    var branches = [['linestart']];
    var branchCount = 0;
    
    while (stack.length) {
        var curId = stack.shift();
        var prevId = branches[branchCount].slice().reverse()[0] || null;
        if (prevId && curId !== 'linestart') {
            branches[branchCount].push(curId);
        } else {
            branches[branchCount] = [curId];
        }
        while (curId !== 'lineend') {
            prevId = curId;
            var children = stnList[prevId].children;
            switch (children.length) {
                case 1:
                    curId = children[0];
                    break;
                case 2:
                    var branchNextId = stnList[prevId].branch.right[1];
                    // if (branchCount === 0) {
                    if (stnList[prevId].branch.right[0] === 'through') {
                        branches.push([curId]);
                        stack.push(branchNextId);
                    } else {
                        if (branchCount === 0) {
                            branches.push([prevId]);
                            stack.push(branchNextId);
                            // all branching out nodes are added to stack in the first loop
                        }
                    }
                    curId = children.filter(stnId => stnId != branchNextId)[0];
                    break;
            }
            branches[branchCount].push(curId);

            if (prevId === stnList[curId].branch.left[1]) {
                break;
            }
        }
        // branches[branchCount] = curBranch;
        branchCount++;
    }

    return branches;
};

/**
 * Memo of topological ordering for all stations by stacking all branches into an one-dimensional array. 
 * @param branches Branches from `useBranches` memo
 */
export const useTpo = (branches: string[][]) => {
    const [tpo, setTpo] = React.useState([] as string[]);

    React.useEffect(() => {
        console.log('computing tpo');
        if (branches.length === 1) {
            setTpo(branches[0].slice(1,-1));
            return;
        } else {
            let res = branches.reduce((acc, cur) => {
                let idx = acc.indexOf(cur.slice(-1)[0]);
                return acc
                    .slice(0,idx)
                    .concat(cur.slice(1), acc.slice(idx+1));
            }, ['lineend']).slice(0,-1);
            setTpo(res);
            return;
        }
    }, [branches.toString()]);

    return tpo;
};