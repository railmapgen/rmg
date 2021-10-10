import { StationDict } from '../../constants/constants';

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
    const stack = ['linestart'];
    const branches = [['linestart']];
    let branchCount = 0;

    while (stack.length) {
        let curId = stack.shift() as string;
        let prevId = branches[branchCount].slice(-1)[0] || null;
        if (prevId && curId !== 'linestart') {
            branches[branchCount].push(curId);
        } else {
            branches[branchCount] = [curId];
        }
        while (curId !== 'lineend') {
            prevId = curId;
            const children = stnList[prevId].children;
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
    const stack = ['linestart'];
    const branches = [['linestart']];
    let branchCount = 0;

    while (stack.length) {
        let curId = stack.shift() as string;
        let prevId = branches[branchCount].slice(-1)[0] || null;
        if (prevId && curId !== 'linestart') {
            branches[branchCount].push(curId);
        } else {
            branches[branchCount] = [curId];
        }
        while (curId !== 'lineend') {
            prevId = curId;
            const children = stnList[prevId].children;
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
 * Calculate topology ordering for all stations by stacking all branches into an 1-dimension array
 */
export const getTpo = (branches: string[][]) => {
    if (branches.length === 1) {
        return branches[0].slice(1, -1);
    } else {
        return branches
            .reduce(
                (acc, cur) => {
                    // insert the other branch before the rest of the main branch
                    const idx = acc.indexOf(cur[cur.length - 1]);
                    return [...acc.slice(0, idx), ...cur.slice(1), ...acc.slice(idx + 1)];
                },
                ['lineend']
            )
            .slice(0, -1);
    }
};
