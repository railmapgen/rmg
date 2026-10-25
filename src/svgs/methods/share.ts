// 线路图几何与拓扑算法：共享绘制工具。
import { ShortDirection, StationDict, StationInfo } from '../../constants/constants';

/**
 * 计算线路图的邻接表。
 * @param stnList 车站信息键值对
 * @param leftW 左侧宽度系数回调
 * @param rightW 右侧宽度系数回调
 */
export const adjacencyList = (
    stnList: { [stnId: string]: StationInfo },
    leftW: (stnList: { [stnId: string]: StationInfo }, stnId: string) => number,
    rightW: (stnList: { [stnId: string]: StationInfo }, stnId: string) => number
) => {
    return Object.keys(stnList).reduce(
        (acc, cur) => ({
            ...acc,
            [cur]: stnList[cur].children.reduce(
                (a, c) => ({ ...a, [c]: 1 + leftW(stnList, c) + rightW(stnList, cur) }),
                {}
            ),
        }),
        {} as { [from: string]: { [to: string]: number } }
    );
};

/**
 * 使用关键路径法计算 `from` 到 `to` 的最长路径及其长度。
 * @param from 左侧车站 ID
 * @param to 右侧车站 ID
 * @param adjMat `adjacencyList` 返回的对象形式邻接矩阵
 */
export const criticalPathMethod = (from: string, to: string, adjMat: ReturnType<typeof adjacencyList>) => {
    if (from === to) {
        return { len: 0, nodes: [from] };
    }
    const allLengths: number[] = [];
    const criticalPaths: string[][] = [];
    Object.keys(adjMat[from]).forEach(child => {
        const cp = criticalPathMethod(child, to, adjMat);
        if (cp.len < 0) return;
        allLengths.push(adjMat[from][child] + cp.len);
        cp.nodes.unshift(from);
        criticalPaths.push(cp.nodes);
    });
    const maxLength = Math.max(...allLengths);
    return {
        len: maxLength,
        nodes: criticalPaths[allLengths.indexOf(maxLength)],
    };
};

export const getXShareMTR = (stnId: string, adjMat: ReturnType<typeof adjacencyList>, branches: string[][]) => {
    const criticalPath = criticalPathMethod('linestart', 'lineend', adjMat);
    if (criticalPath.nodes.includes(stnId)) {
        return criticalPathMethod(criticalPath.nodes[1], stnId, adjMat).len;
    } else {
        // 必须且只能有一个父站和一个子站
        const branchOfStn = branches.filter(branch => branch.includes(stnId))[0];

        let partSource = stnId;
        while (!criticalPath.nodes.includes(partSource)) {
            partSource = branchOfStn[branchOfStn.indexOf(partSource) - 1];
        }
        let partSink = stnId;
        while (!criticalPath.nodes.includes(partSink)) {
            partSink = branchOfStn[branchOfStn.indexOf(partSink) + 1];
        }

        const leftOpenJaw = partSource === 'linestart';
        const rightOpenJaw = partSink === 'lineend';

        // 扩展以适配内容
        const lens = [];
        if (!leftOpenJaw && !rightOpenJaw) {
            lens[0] = criticalPathMethod(criticalPath.nodes[1], partSource, adjMat).len;
            lens[1] = criticalPathMethod(partSource, partSink, adjMat).len;
            lens[2] = criticalPathMethod(partSource, stnId, adjMat).len;
            lens[3] = criticalPathMethod(stnId, partSink, adjMat).len;
        } else if (leftOpenJaw) {
            lens[0] = 0;
            lens[1] = criticalPathMethod(criticalPath.nodes[1], partSink, adjMat).len;
            lens[2] = criticalPathMethod(branchOfStn[1], stnId, adjMat).len;
            lens[3] = criticalPathMethod(stnId, partSink, adjMat).len;
        } else {
            // 右侧开口支线
            lens[0] = criticalPathMethod(criticalPath.nodes[1], partSource, adjMat).len;
            lens[1] = criticalPathMethod(partSource, criticalPath.nodes.slice(-2)[0], adjMat).len;
            lens[2] = criticalPathMethod(partSource, stnId, adjMat).len;
            lens[3] = criticalPathMethod(stnId, branchOfStn.slice(-2)[0], adjMat).len;
        }
        return lens[0] + (lens[2] * lens[1]) / (lens[2] + lens[3]);
    }
};

const _isPredecessor = (stnId1: string, stnId2: string, routes: string[][]) => {
    for (const route of routes) {
        const idx1 = route.indexOf(stnId1);
        const idx2 = route.indexOf(stnId2);
        if (idx2 !== -1 && idx2 < idx1) return true;
    }
    return false;
};

const _isSuccessor = (stnId1: string, stnId2: string, routes: string[][]) => {
    for (const route of routes) {
        const idx1 = route.indexOf(stnId1);
        const idx2 = route.indexOf(stnId2);
        if (idx1 !== -1 && idx1 < idx2) return true;
    }
    return false;
};

export const getStnState = (
    currentId: string,
    routes: string[][],
    direction: 'l' | 'r'
): { [stnId: string]: -1 | 0 | 1 } => {
    console.log("computing stations' states");
    return [...new Set(([] as string[]).concat(...routes))].reduce(
        (acc, cur: string) => ({
            ...acc,
            [cur]:
                cur === currentId
                    ? 0
                    : (
                            direction === ShortDirection.right
                                ? _isSuccessor(currentId, cur, routes)
                                : _isPredecessor(currentId, cur, routes)
                        )
                      ? 1
                      : -1,
        }),
        {}
    );
};

export class Stations {
    yShares = {} as { [stnId: string]: number };
    xShares = {} as { [stnId: string]: number };
    namePoss = {} as { [stnId: string]: boolean };
    stnList = {} as StationDict;
    criticalPath = {} as { len: number; nodes: string[] };

    constructor(data: { stnList?: any; criticalPath?: any }) {
        this.stnList = data.stnList;
        this.criticalPath = data.criticalPath;
    }

    /**
     * 增加车站入边权重，从而扩大它与父站之间的水平间距。
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected leftWideFactor = (stnId: string) => {
        return 0;
    };

    /**
     * 增加车站出边权重，从而扩大它与子站之间的水平间距。
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected rightWideFactor = (stnId: string) => {
        return 0;
    };

    protected getYShare(stnId: string): number {
        if (stnId in this.yShares) return this.yShares[stnId];

        if (
            ['linestart', 'lineend'].includes(stnId) ||
            this.stnList[stnId].parents.length > 1 ||
            this.stnList[stnId].children.length > 1
        ) {
            this.yShares[stnId] = 0;
            return 0;
        }
        const stnPred = this.stnList[stnId].parents[0];
        if (stnPred) {
            // 存在父车站
            if (this.stnList[stnPred].children.length === 1) {
                // 没有同级车站时，纵向位置与父车站相同
                const res = this.getYShare(stnPred);
                this.yShares[stnId] = res;
                return res;
            } else {
                // 存在同级车站时，纵向位置取决于它在子车站中的索引
                const res: 1 | -1 = this.stnList[stnPred].children.indexOf(stnId) === 0 ? 1 : -1;
                this.yShares[stnId] = res;
                return res;
            }
        } else {
            // 没有父车站时，该节点必须是线路起点
            this.yShares[stnId] = 0;
            return 0;
        }
    }

    static getYShares(stnList: StationDict) {
        console.log('computing y shares');
        const stations = new this({ stnList });

        Object.keys(stnList).forEach(stnId => {
            if (['linestart', 'lineend'].includes(stnId)) return;
            if (stnId in stations.yShares) return;
            stations.getYShare(stnId);
        });

        return stations.yShares;
    }

    /**
     * `<path>` 元素中圆弧的参数。
     */
    private pathTurnParams = (branchSpacing: number) => {
        const tr = 35; // turning radius
        const dx_a = tr / 2; // dx of a
        const dy_a = tr - dx_a * Math.sqrt(3); // dy of a
        const dy_l = branchSpacing - 2 * dy_a; // dy of l
        const dx_l = dy_l * Math.sqrt(3); // dx of l
        return { tr, dx_a, dy_a, dx_l, dy_l };
    };

    /**
     * 从车站朝东南方向绘制的路径段。
     */
    private pathTurnSE = (branchSpacing: number) => {
        const { tr, dx_a, dy_a, dx_l, dy_l } = this.pathTurnParams(branchSpacing);
        return `a ${tr},${tr} 0 0,1 ${dx_a},${dy_a} l ${dx_l},${dy_l} a ${tr},${tr} 0 0,0 ${dx_a},${dy_a}`;
    };

    /**
     * 从车站朝东北方向绘制的路径段。
     */
    private pathTurnNE = (branchSpacing: number) => {
        const { tr, dx_a, dy_a, dx_l, dy_l } = this.pathTurnParams(branchSpacing);
        return `a ${tr},${tr} 0 0,0 ${dx_a},${-dy_a} l ${dx_l},${-dy_l} a ${tr},${tr} 0 0,1 ${dx_a},${-dy_a}`;
    };

    /**
     * 根据全部输入车站生成 `<path>` 元素的 `d` 属性。
     */
    protected _linePath(
        stnIds: string[],
        lineXs: [number, number],
        branches: string[][],
        realXs: { [stnId: string]: number },
        realYs: { [stnId: string]: number },
        branchSpacing: number,
        cp: { len: number; nodes: string[] },
        e: number
    ) {
        let [prevId, prevY, prevX] = [] as unknown as [string, number, number];
        const path = [] as string[];

        const { dx_a, dx_l } = this.pathTurnParams(branchSpacing);
        const stnDX = dx_a + dx_l / 2;
        const stnExtraH = ((lineXs[1] - lineXs[0]) / cp.len) * 2;
        const stnSpareH = ((lineXs[1] - lineXs[0]) / cp.len - 2 * stnDX) / 2;
        if (stnSpareH + stnExtraH < 0) {
            console.warn(`SVG width too small! ${stnSpareH + stnExtraH}`);
        }

        stnIds.forEach(stnId => {
            const x = realXs[stnId];
            const y = realYs[stnId];
            if (!prevY && prevY !== 0) {
                [prevId, prevX, prevY] = [stnId, x, y];
                if (stnIds.length === 1) {
                    path.push(`M ${x},${y}`);
                } else if (!branches[0].includes(stnId)) {
                    // 从支线开始
                    path.push(`M ${x},${y}`);
                } else if (branches[0].includes(stnIds[1])) {
                    // 从分叉站开始，当前路径为主线
                    path.push(`M ${x},${y}`);
                } else {
                    // 从分叉站开始，当前路径为支线
                    if (realXs[stnIds[1]] > 0) {
                        path.push(`M ${x},${y + e}`);
                    }
                    if (realYs[stnIds[1]] < 0) {
                        path.push(`M ${x},${y - e}`);
                    }
                }
                return;
            }
            if (y > prevY) {
                path.push(
                    y === 0
                        ? `h ${x - prevX - stnExtraH * this.leftWideFactor(stnId) - stnSpareH - stnDX * 2}`
                        : `h ${stnExtraH * this.rightWideFactor(prevId) + stnSpareH}`
                );
                path.push(this.pathTurnSE(branchSpacing));
            } else if (y < prevY) {
                path.push(
                    y === 0
                        ? `h ${x - prevX - stnExtraH * this.leftWideFactor(stnId) - stnSpareH - stnDX * 2}`
                        : `h ${stnExtraH * this.rightWideFactor(prevId) + stnSpareH}`
                );
                path.push(this.pathTurnNE(branchSpacing));
            }
            path.push(`H ${x}`);
            [prevId, prevX, prevY] = [stnId, x, y];
        });

        // 简化路径
        return path.join(' ').replace(/( H ([\d.]+))+/g, ' H $2');
    }
}

export const drawLine = (branch: string[], stnStates: { [stnId: string]: -1 | 0 | 1 }) => {
    branch = branch.filter(stnId => !['linestart', 'lineend'].includes(stnId));
    let lineMainStns = branch.filter(stnId => stnStates[stnId] >= 0);
    let linePassStns = branch.filter(stnId => stnStates[stnId] <= 0);

    if (lineMainStns.length === 1) {
        linePassStns = branch;
    }

    if (lineMainStns.filter(stnId => linePassStns.indexOf(stnId) !== -1).length === 0 && lineMainStns.length) {
        // 若两个集合不相交
        if (linePassStns[0] === branch[0]) {
            // -1 -1 1 1
            linePassStns.push(lineMainStns[0]);
        } else if (
            lineMainStns[0] === branch[0] &&
            lineMainStns[lineMainStns.length - 1] === branch[branch.length - 1] &&
            linePassStns.length
        ) {
            linePassStns = branch;
            lineMainStns = [];
        } else {
            // 1 1 -1 -1
            linePassStns.unshift(lineMainStns[lineMainStns.length - 1]);
        }
    }

    return {
        main: lineMainStns,
        pass: linePassStns,
    };
};
