import React from 'react';

/**
 * Vertical position (in shares) of station icon if using MTR style (for consistency of method `RMGLine.newStnPossibleLoc()`).
 */
export const getYShareMTR = (stnId: string, stnList: StationDict): -1 | 0 | 1 => {
    if (
        ['linestart', 'lineend'].includes(stnId) ||
        stnList[stnId].parents.length > 1 ||
        stnList[stnId].children.length > 1
    ) {
        return 0;
    }
    var stnPred = stnList[stnId].parents[0];
    if (stnPred) {
        // parent exist
        if (stnList[stnPred].children.length === 1) {
            // no sibling, then y same as parent
            return getYShareMTR(stnPred, stnList);
        } else {
            // sibling exists, then y depends on its idx of being children
            return stnList[stnPred].children.indexOf(stnId) === 0 ? 1 : -1;
        }
    } else {
        // no parent, must be linestart
        return 0;
    }
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
export const getBranches = (stnList: StationDict) => {
    console.log('computing branches');

    var stack = ['linestart'];
    var branches = [['linestart']];
    var branchCount = 0;

    while (stack.length) {
        var curId = stack.shift() as string;
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
                    let branchNextId = stnList[prevId].branch.right[1] as string;
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
                    curId = children.filter(stnId => stnId !== branchNextId)[0];
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
 * Getter of all routes (行車交路) of the line (both ends included). The first branch must be the main line.
 * @example MTREastRailLine.branches
 * /*
 * [0]: [LineStart, Lo Wu, Sheung Shui, ..., Hung Hom, LineEnd]
 * [1]: [LineStart, Lok Ma Chau, Sheung Shui, ..., Hung Hom, LineEnd]
 * [2]: [LineStart, Lo Wu, Sheung Shui, ..., University, Racecourse, Sha Tin, ..., Hung Hom, LineEnd]
 * [3]: [LineStart, Lok Ma Chau, Sheung Shui, ..., University, Racecourse, Sha Tin, ..., Hung Hom, LineEnd]
 * /
 */
export const getRoutes = (stnList: StationDict) => {
    console.log('computing routes');

    var stack = ['linestart'];
    var branches = [['linestart']];
    var branchCount = 0;

    while (stack.length) {
        var curId = stack.shift() as string;
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
                    let branchNextId = stnList[prevId].branch.right[1] as string;
                    // if (branchCount === 0) {
                    if (stnList[prevId].branch.right[0] === 'through') {
                        branches.push(branches[branchCount].slice());
                        stack.push(branchNextId);
                    } else {
                        if (branchCount === 0) {
                            branches.push([prevId]);
                            stack.push(branchNextId);
                        }
                        // branches.push([prevId]);
                    }
                    // stack.push(branchNextId);
                    // }
                    curId = children.filter(stnId => stnId !== branchNextId)[0];
                    break;
            }
            branches[branchCount].push(curId);

            if (prevId === stnList[curId].branch.left[1] && stnList[curId].branch.left[0] === 'nonthrough') {
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

    React.useEffect(
        () => {
            console.log('computing tpo');
            if (branches.length === 1) {
                setTpo(branches[0].slice(1, -1));
                return;
            } else {
                let res = branches
                    .reduce(
                        (acc, cur) => {
                            let idx = acc.indexOf(cur.slice(-1)[0]);
                            return acc.slice(0, idx).concat(cur.slice(1), acc.slice(idx + 1));
                        },
                        ['lineend']
                    )
                    .slice(0, -1);
                setTpo(res);
                return;
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [branches.toString()]
    );

    return tpo;
};
