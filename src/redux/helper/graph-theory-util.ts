// 线路图拓扑工具：遍历分支与交路并计算稳定的车站绘制顺序。
import { StationDict } from '../../constants/constants';

/**
 * 获取线路中的全部支线段（含两端），第一段必须是主线。
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
                case 2: {
                    const rightBranchInfo = stnList[prevId].branch!.right!;
                    const branchNextId = rightBranchInfo[1];
                    // if (branchCount === 0) {
                    if (rightBranchInfo[0] === 'through') {
                        branches.push([curId]);
                        stack.push(branchNextId);
                    } else {
                        if (branchCount === 0) {
                            branches.push([prevId]);
                            stack.push(branchNextId);
                            // 首轮遍历将所有分叉节点加入栈
                        }
                    }
                    curId = children.filter(stnId => stnId !== branchNextId)[0];
                    break;
                }
            }
            branches[branchCount].push(curId);

            if (prevId === stnList[curId].branch?.left?.[1]) {
                break;
            }
        }
        // branches[branchCount] = curBranch;
        branchCount++;
    }

    return branches;
};

/**
 * 获取线路中的全部行车交路（含两端），第一段必须是主线。
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
                case 2: {
                    const rightBranchInfo = stnList[prevId].branch!.right!;
                    const branchNextId = rightBranchInfo[1];
                    // if (branchCount === 0) {
                    if (rightBranchInfo[0] === 'through') {
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
            }
            branches[branchCount].push(curId);

            if (prevId === stnList[curId].branch?.left?.[1] && stnList[curId].branch?.left?.[0] === 'nonthrough') {
                break;
            }
        }
        // branches[branchCount] = curBranch;
        branchCount++;
    }

    return branches;
};

/**
 * 将所有支线压入一维数组，计算全部车站的拓扑绘制顺序
 */
export const getTpo = (branches: string[][]) => {
    if (branches.length === 1) {
        return branches[0].slice(1, -1);
    } else {
        return branches
            .reduce(
                (acc, cur) => {
                    // 在主线的剩余部分之前插入另一条支线
                    const idx = acc.indexOf(cur[cur.length - 1]);
                    return [...acc.slice(0, idx), ...cur.slice(1), ...acc.slice(idx + 1)];
                },
                ['lineend']
            )
            .slice(0, -1);
    }
};
