import * as Global from '../../../methods';
import { RMGParam, ShortDirection, StationDict, StationInfo } from '../../../constants/constants';

/**
 * Compute the adjacency list of the graph.
 * @param stnList Key-value pairs of station info
 * @param leftW Callback of left wide factor
 * @param rightW Callback of right wide factor
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
 * Compute critical path and its length from `from` node to `to` node with critical path method.
 * @param from ID of station on the left
 * @param to ID of station on the right
 * @param adjMat Adjacency matrix in the form of `Object` returned from `adjacencyList` method.
 */
export const criticalPathMethod = (from: string, to: string, adjMat: ReturnType<typeof adjacencyList>) => {
    if (from === to) {
        return { len: 0, nodes: [from] };
    }
    let allLengths: number[] = [];
    let criticalPaths: string[][] = [];
    Object.keys(adjMat[from]).forEach(child => {
        let cp = criticalPathMethod(child, to, adjMat);
        if (cp.len < 0) return;
        allLengths.push(adjMat[from][child] + cp.len);
        cp.nodes.unshift(from);
        criticalPaths.push(cp.nodes);
    });
    let maxLength = Math.max(...allLengths);
    return {
        len: maxLength,
        nodes: criticalPaths[allLengths.indexOf(maxLength)],
    };
};

export const getXShareMTR = (stnId: string, adjMat: ReturnType<typeof adjacencyList>, branches: string[][]) => {
    let criticalPath = criticalPathMethod('linestart', 'lineend', adjMat);
    if (criticalPath.nodes.includes(stnId)) {
        return criticalPathMethod(criticalPath.nodes[1], stnId, adjMat).len;
    } else {
        // must has 1 parent and 1 child only
        let branchOfStn = branches.filter(branch => branch.includes(stnId))[0];

        let partSource = stnId;
        while (!criticalPath.nodes.includes(partSource)) {
            partSource = branchOfStn[branchOfStn.indexOf(partSource) - 1];
        }
        let partSink = stnId;
        while (!criticalPath.nodes.includes(partSink)) {
            partSink = branchOfStn[branchOfStn.indexOf(partSink) + 1];
        }

        let leftOpenJaw = partSource === 'linestart';
        let rightOpenJaw = partSink === 'lineend';

        // expand to fit
        let lens = [];
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
            // right open jaw
            lens[0] = criticalPathMethod(criticalPath.nodes[1], partSource, adjMat).len;
            lens[1] = criticalPathMethod(partSource, criticalPath.nodes.slice(-2)[0], adjMat).len;
            lens[2] = criticalPathMethod(partSource, stnId, adjMat).len;
            lens[3] = criticalPathMethod(stnId, branchOfStn.slice(-2)[0], adjMat).len;
        }
        return lens[0] + (lens[2] * lens[1]) / (lens[2] + lens[3]);
    }
};

const getYShare = (stnId: string, stnList: { [stnId: string]: StationInfo }) => {
    return Global.getYShareMTR(stnId, stnList);
};

/**
 * Vertical position (in pixels) of station icon related to vertical position of line.
 */
export const getYReal = (stnId: string, param: RMGParam) => {
    return -getYShare(stnId, param.stn_list) * param.branch_spacing;
};

const _isPredecessor = (stnId1: string, stnId2: string, routes: string[][]) => {
    for (let route of routes) {
        let idx1 = route.indexOf(stnId1);
        let idx2 = route.indexOf(stnId2);
        if (idx2 !== -1 && idx2 < idx1) return true;
    }
    return false;
};

const _isSuccessor = (stnId1: string, stnId2: string, routes: string[][]) => {
    for (let route of routes) {
        let idx1 = route.indexOf(stnId1);
        let idx2 = route.indexOf(stnId2);
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
     * Increment of the weight of in-bound edge of a station, which increases the horizontal interval from its parents.
     */
    protected leftWideFactor = (stnId: string) => {
        return 0;
    };

    /**
     * Increment of the weight of out-bound edge of a station, which increases the horizontal interval from its children.
     */
    protected rightWideFactor = (stnId: string) => {
        return 0;
    };

    /**
     * Path weight from station 1 to station 2 (station 2 must be a child of station 1, otherwise return `-Infinity`).
     */
    public pathWeight = (stnId1: string, stnId2: string) => {
        if (!this.stnList[stnId1].children.includes(stnId2)) {
            return -Infinity;
        }
        return 1 + this.rightWideFactor(stnId1) + this.leftWideFactor(stnId2);
    };

    protected getYShare(stnId: string, branches?: string[][]): number {
        if (stnId in this.yShares) return this.yShares[stnId];

        if (
            ['linestart', 'lineend'].includes(stnId) ||
            this.stnList[stnId].parents.length > 1 ||
            this.stnList[stnId].children.length > 1
        ) {
            this.yShares[stnId] = 0;
            return 0;
        }
        var stnPred = this.stnList[stnId].parents[0];
        if (stnPred) {
            // parent exist
            if (this.stnList[stnPred].children.length === 1) {
                // no sibling, then y same as parent
                let res = this.getYShare(stnPred);
                this.yShares[stnId] = res;
                return res;
            } else {
                // sibling exists, then y depends on its idx of being children
                let res: 1 | -1 = this.stnList[stnPred].children.indexOf(stnId) === 0 ? 1 : -1;
                this.yShares[stnId] = res;
                return res;
            }
        } else {
            // no parent, must be linestart
            this.yShares[stnId] = 0;
            return 0;
        }
    }

    static getYShares(stnList: StationDict, branches?: string[][]) {
        console.log('computing y shares');
        let stations = new this({ stnList });

        Object.keys(stnList).forEach(stnId => {
            if (['linestart', 'lineend'].includes(stnId)) return;
            if (stnId in stations.yShares) return;
            stations.getYShare(stnId, branches);
        });

        return stations.yShares;
    }

    /**
     * Parameters of the arcs involved in the `<path>` element.
     */
    private pathTurnParams = (branchSpacing: number) => {
        let tr = 35; // turning radius
        let dx_a = tr / 2; // dx of a
        let dy_a = tr - dx_a * Math.sqrt(3); // dy of a
        let dy_l = branchSpacing - 2 * dy_a; // dy of l
        let dx_l = dy_l * Math.sqrt(3); // dx of l
        return { tr, dx_a, dy_a, dx_l, dy_l };
    };

    /**
     * Path segment from a station towards its southeast (lower-right).
     */
    private pathTurnSE = (branchSpacing: number) => {
        let { tr, dx_a, dy_a, dx_l, dy_l } = this.pathTurnParams(branchSpacing);
        return `a ${tr},${tr} 0 0,1 ${dx_a},${dy_a} l ${dx_l},${dy_l} a ${tr},${tr} 0 0,0 ${dx_a},${dy_a}`;
    };

    /**
     * Path segment from a station towards its northeast (upper-right).
     */
    private pathTurnNE = (branchSpacing: number) => {
        let { tr, dx_a, dy_a, dx_l, dy_l } = this.pathTurnParams(branchSpacing);
        return `a ${tr},${tr} 0 0,0 ${dx_a},${-dy_a} l ${dx_l},${-dy_l} a ${tr},${tr} 0 0,1 ${dx_a},${-dy_a}`;
    };

    /**
     * Generate `d` attribute of `<path>` element through all stations input.
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
        var [prevId, prevY, prevX] = [] as unknown as [string, number, number];
        var path = [] as string[];

        let { dx_a, dx_l } = this.pathTurnParams(branchSpacing);
        let stnDX = dx_a + dx_l / 2;
        let stnExtraH = ((lineXs[1] - lineXs[0]) / cp.len) * 2;
        let stnSpareH = ((lineXs[1] - lineXs[0]) / cp.len - 2 * stnDX) / 2;
        if (stnSpareH + stnExtraH < 0) {
            console.warn(`SVG width too small! ${stnSpareH + stnExtraH}`);
        }

        stnIds.forEach(stnId => {
            let x = realXs[stnId];
            let y = realYs[stnId];
            if (!prevY && prevY !== 0) {
                [prevId, prevX, prevY] = [stnId, x, y];
                if (stnIds.length === 1) {
                    path.push(`M ${x},${y}`);
                } else if (!branches[0].includes(stnId)) {
                    // started from branch
                    path.push(`M ${x},${y}`);
                } else if (branches[0].includes(stnIds[1])) {
                    // started from branching station, this is main line
                    path.push(`M ${x},${y}`);
                } else {
                    // started form branching station, this is branch line
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

        // simplify path
        return path.join(' ').replace(/( H ([\d.]+))+/g, ' H $2');
    }

    static drawLine(
        branches: string[][],
        stnStates: { [stnId: string]: -1 | 0 | 1 },
        stnList: { [stnId: string]: StationInfo },
        lineXs: [number, number],
        xs: { [stnId: string]: number },
        ys: { [stnId: string]: number },
        branchSpacing: number,
        cp: { len: number; nodes: string[] },
        e: number = 9.68
    ) {
        let linePaths = { main: [] as string[], pass: [] as string[] };
        branches.forEach((branch, i) => {
            branch = branch.filter(stnId => !['linestart', 'lineend'].includes(stnId));
            var lineMainStns = branch.filter(stnId => stnStates[stnId] >= 0);
            var linePassStns = branch.filter(stnId => stnStates[stnId] <= 0);

            if (lineMainStns.length === 1) {
                linePassStns = branch;
            }

            if (lineMainStns.filter(stnId => linePassStns.indexOf(stnId) !== -1).length === 0 && lineMainStns.length) {
                // if two set disjoint
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

            linePaths.main.push(
                new this({ stnList, criticalPath: cp })._linePath(
                    lineMainStns,
                    lineXs,
                    branches,
                    xs,
                    ys,
                    branchSpacing,
                    cp,
                    e
                )
            );
            linePaths.pass.push(
                new this({ stnList, criticalPath: cp })._linePath(
                    linePassStns,
                    lineXs,
                    branches,
                    xs,
                    ys,
                    branchSpacing,
                    cp,
                    e
                )
            );
        });

        return linePaths;
    }
}

export const drawLine = (branches: string[][], stnStates: { [stnId: string]: -1 | 0 | 1 }) => {
    let linePaths = { main: [] as string[][], pass: [] as string[][] };
    branches.forEach(branch => {
        branch = branch.filter(stnId => !['linestart', 'lineend'].includes(stnId));
        var lineMainStns = branch.filter(stnId => stnStates[stnId] >= 0);
        var linePassStns = branch.filter(stnId => stnStates[stnId] <= 0);

        if (lineMainStns.length === 1) {
            linePassStns = branch;
        }

        if (lineMainStns.filter(stnId => linePassStns.indexOf(stnId) !== -1).length === 0 && lineMainStns.length) {
            // if two set disjoint
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

        linePaths.main.push(lineMainStns);
        linePaths.pass.push(linePassStns);
    });

    return linePaths;
};
