import { ShortDirection, StationDict, StationInfo } from '../../constants/constants';

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
        // must has 1 parent and 1 child only
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

        // expand to fit
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
            // right open jaw
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
        const stnPred = this.stnList[stnId].parents[0];
        if (stnPred) {
            // parent exist
            if (this.stnList[stnPred].children.length === 1) {
                // no sibling, then y same as parent
                const res = this.getYShare(stnPred);
                this.yShares[stnId] = res;
                return res;
            } else {
                // sibling exists, then y depends on its idx of being children
                const res: 1 | -1 = this.stnList[stnPred].children.indexOf(stnId) === 0 ? 1 : -1;
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
        const stations = new this({ stnList });

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
        const tr = 35; // turning radius
        const dx_a = tr / 2; // dx of a
        const dy_a = tr - dx_a * Math.sqrt(3); // dy of a
        const dy_l = branchSpacing - 2 * dy_a; // dy of l
        const dx_l = dy_l * Math.sqrt(3); // dx of l
        return { tr, dx_a, dy_a, dx_l, dy_l };
    };

    /**
     * Path segment from a station towards its southeast (lower-right).
     */
    private pathTurnSE = (branchSpacing: number) => {
        const { tr, dx_a, dy_a, dx_l, dy_l } = this.pathTurnParams(branchSpacing);
        return `a ${tr},${tr} 0 0,1 ${dx_a},${dy_a} l ${dx_l},${dy_l} a ${tr},${tr} 0 0,0 ${dx_a},${dy_a}`;
    };

    /**
     * Path segment from a station towards its northeast (upper-right).
     */
    private pathTurnNE = (branchSpacing: number) => {
        const { tr, dx_a, dy_a, dx_l, dy_l } = this.pathTurnParams(branchSpacing);
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
}

export const drawLine = (branch: string[], stnStates: { [stnId: string]: -1 | 0 | 1 }) => {
    branch = branch.filter(stnId => !['linestart', 'lineend'].includes(stnId));
    let lineMainStns = branch.filter(stnId => stnStates[stnId] >= 0);
    let linePassStns = branch.filter(stnId => stnStates[stnId] <= 0);

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

    return {
        main: lineMainStns,
        pass: linePassStns,
    };
};
