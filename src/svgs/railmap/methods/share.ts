import * as Global from '../../../methods';
import { StationInfo, RMGParam } from '../../../types';

/**
 * Critical path and corresponding length from a station to another.
 * @param from ID of station on the left
 * @param to ID of station on the left
 */
const cpm = (
    from: string,
    to: string,
    stnList: { [stnId: string]: StationInfo },
    pathWeight: (
        stnId1: string,
        stnId2: string,
        stnList: { [stnId: string]: StationInfo }
    ) => number
) => {
    if (from == to) {
        return { len: 0, nodes: [from] };
    }
    let allLengths: number[] = [];
    let criticalPaths: string[][] = [];
    stnList[from].children.forEach(child => {
        let cp = cpm(child, to, stnList, pathWeight);
        if (cp.len < 0) {
            return;
        }
        allLengths.push(pathWeight(from, child, stnList) + cp.len); // TODO
        // allLengths.push(1 + cp.len);
        cp.nodes.unshift(from);
        criticalPaths.push(cp.nodes);
    });
    let maxLength = Math.max(...allLengths);
    return {
        len: maxLength,
        nodes: criticalPaths[allLengths.indexOf(maxLength)],
    };
};

/**
 * Getter of critical path (from left to right) and corresponding length of the entire line.
 */
export const getCriticalPath = (stnList: { [stnId: string]: StationInfo }) => {
    console.log('computing critical path');
    let allLengths: number[] = [];
    let criticalPaths: string[][] = [];
    stnList.linestart.children.forEach(ld => {
        stnList.lineend.parents.forEach(rd => {
            let cp = cpm(ld, rd, stnList, new Stations({ stnList }).pathWeight);
            allLengths.push(cp.len);
            criticalPaths.push(cp.nodes);
        });
    });
    let maxLen = Math.max(...allLengths);
    return {
        len: maxLen,
        nodes: criticalPaths[allLengths.indexOf(maxLen)],
    };
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

export class Stations {
    yShares = {} as { [stnId: string]: number };
    xShares = {} as { [stnId: string]: number };
    namePoss = {} as { [stnId: string]: boolean };
    stnList = {} as { [stnId: string]: StationInfo };
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

    protected getXShare(
        stnId: string,
        cpm: (
            from: string,
            to: string,
            stnList: { [stnId: string]: StationInfo },
            pathWeight: (
                stnId1: string,
                stnId2: string,
                stnList: { [stnId: string]: StationInfo }
            ) => number
        ) => { len: number; nodes: string[] },
        branches?: string[][]
    ): number {
        let self = this;
        if (stnId in this.xShares) return this.xShares[stnId];

        if (this.criticalPath.nodes.includes(stnId)) {
            let res = cpm(this.criticalPath.nodes[0], stnId, this.stnList, this.pathWeight).len;
            this.xShares[stnId] = res;
            return res;
        }

        var partSource = stnId;
        var partSink = stnId;
        var leftOpenJaw = false;
        var rightOpenJaw = false;

        while (true) {
            var parent = this.stnList[partSource].parents[0];
            if (parent == 'linestart') {
                leftOpenJaw = true;
                break;
            }
            partSource = parent;
            if (this.stnList[partSource].children.length > 1) {
                break;
            }
        }

        while (true) {
            var children = this.stnList[partSink].children;
            if (children[0] != 'lineend') {
                partSink = children[0];
            } else {
                rightOpenJaw = true;
                break;
            }
            if (this.stnList[partSink].parents.length > 1) {
                break;
            }
        }

        var lengthToSource = cpm(partSource, stnId, this.stnList, this.pathWeight).len;
        var lengthToSink = cpm(stnId, partSink, this.stnList, this.pathWeight).len;
        if (leftOpenJaw) {
            var actualPartLength = cpm(
                this.criticalPath.nodes[0],
                partSink,
                this.stnList,
                this.pathWeight
            ).len;
            let res =
                self.getXShare(partSink, cpm) -
                (lengthToSink / (lengthToSource + lengthToSink)) * actualPartLength;
            this.xShares[stnId] = res;
            return res;
        } else if (rightOpenJaw) {
            var actualPartLength = cpm(
                partSource,
                this.criticalPath.nodes.slice(-1)[0],
                this.stnList,
                this.pathWeight
            ).len;
        } else {
            var actualPartLength = cpm(partSource, partSink, this.stnList, this.pathWeight).len;
        }
        let res =
            self.getXShare(partSource, cpm) +
            (lengthToSource / (lengthToSource + lengthToSink)) * actualPartLength;
        this.xShares[stnId] = res;
        return res;
    }

    /**
     * Horizontal position (in shares) of every station icon.
     */
    static getXShares(
        stnList: { [stnId: string]: StationInfo },
        cp: { len: number; nodes: string[] },
        branches?: string[][]
    ) {
        console.log('computing x shares');
        let stations = new this({ stnList, criticalPath: cp });

        Object.keys(stnList).forEach(stnId => {
            if (['linestart', 'lineend'].includes(stnId)) return;
            if (stnId in stations.xShares) return;
            stations.getXShare(stnId, cpm, branches);
        });

        return stations.xShares;
    }

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
            if (this.stnList[stnPred].children.length == 1) {
                // no sibling, then y same as parent
                let res = this.getYShare(stnPred);
                this.yShares[stnId] = res;
                return res;
            } else {
                // sibling exists, then y depends on its idx of being children
                let res: 1 | -1 = this.stnList[stnPred].children.indexOf(stnId) == 0 ? 1 : -1;
                this.yShares[stnId] = res;
                return res;
            }
        } else {
            // no parent, must be linestart
            this.yShares[stnId] = 0;
            return 0;
        }
    }

    static getYShares(stnList, branches?: string[][]) {
        console.log('computing y shares');
        let stations = new this({ stnList });

        Object.keys(stnList).forEach(stnId => {
            if (['linestart', 'lineend'].includes(stnId)) return;
            if (stnId in stations.yShares) return;
            stations.getYShare(stnId, branches);
        });

        return stations.yShares;
    }

    private isPredecessor(stnId1: string, stnId2: string, routes: string[][]) {
        for (let route of routes) {
            let idx1 = route.indexOf(stnId1);
            let idx2 = route.indexOf(stnId2);
            if (idx1 !== -1 && idx2 !== -1 && idx2 < idx1) {
                return true;
            }
        }
        return false;
    }

    private isSuccessor(stnId1: string, stnId2: string, routes: string[][]) {
        for (let route of routes) {
            let idx1 = route.indexOf(stnId1);
            let idx2 = route.indexOf(stnId2);
            if (idx1 !== -1 && idx2 !== -1 && idx1 < idx2) {
                return true;
            }
        }
        return false;
    }

    static getStnState(stnId: string, currentId: string, direction: 'l' | 'r', routes: string[][]) {
        if (stnId == currentId) {
            return 0;
        }
        if (direction == 'r') {
            return new this({}).isSuccessor(currentId, stnId, routes) ? 1 : -1;
        } else {
            return new this({}).isPredecessor(currentId, stnId, routes) ? 1 : -1;
        }
    }

    private getNamePos(stnId: string) {
        if (stnId === 'linestart') {
            this.namePoss['linestart'] = true;
            return true;
        }
        let self = this;
        let pos = this.criticalPath.nodes.indexOf(stnId) % 2; // -1, 0 or 1;
        if (pos === -1) {
            let parId = this.stnList[stnId].parents[0];
            if (this.stnList[parId].children.length === 2) {
                let res = self.getNamePos(parId);
                this.namePoss[stnId] = res;
                return res;
            }
            let res = !self.getNamePos(parId);
            this.namePoss[stnId] = res;
            return res;
        }
        this.namePoss[stnId] = pos === 1;
        return pos === 1;
    }

    static getNamePos(stnList, cp) {
        console.log('computing name position');
        let stations = new this({ stnList, criticalPath: cp });

        Object.keys(stnList).forEach(stnId => {
            if (['linestart', 'lineend'].includes(stnId)) return;
            if (stnId in stations.namePoss) return;
            stations.getNamePos(stnId);
        });

        return stations.namePoss;
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
        cp: { len: number; nodes: string[] }
    ) {
        var [prevId, prevY, prevX]: [string?, number?, number?] = [];
        var path = [];

        let { dx_a, dx_l } = this.pathTurnParams(branchSpacing);
        let stnDX = dx_a + dx_l / 2;
        let stnExtraH = ((lineXs[1] - lineXs[0]) / cp.len) * 0.8;
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
                        path.push(`M ${x},${y + 9.68}`);
                    }
                    if (realYs[stnIds[1]] < 0) {
                        path.push(`M ${x},${y - 9.68}`);
                    }
                }
                return;
            }
            if (y > prevY) {
                path.push(
                    y === 0
                        ? `h ${x -
                              prevX -
                              stnExtraH * this.leftWideFactor(stnId) -
                              stnSpareH -
                              stnDX * 2}`
                        : `h ${stnExtraH * this.rightWideFactor(prevId) + stnSpareH}`
                );
                path.push(this.pathTurnSE(branchSpacing));
            } else if (y < prevY) {
                path.push(
                    y === 0
                        ? `h ${x -
                              prevX -
                              stnExtraH * this.leftWideFactor(stnId) -
                              stnSpareH -
                              stnDX * 2}`
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
        cp: { len: number; nodes: string[] }
    ) {
        let linePaths = { main: [] as string[], pass: [] as string[] };
        branches.map((branch, i) => {
            branch = branch.filter(stnId => !['linestart', 'lineend'].includes(stnId));
            var lineMainStns = branch.filter(stnId => stnStates[stnId] >= 0);
            var linePassStns = branch.filter(stnId => stnStates[stnId] <= 0);

            if (lineMainStns.length === 1) {
                linePassStns = branch;
            }

            if (
                lineMainStns.filter(stnId => linePassStns.indexOf(stnId) !== -1).length == 0 &&
                lineMainStns.length
            ) {
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
                    cp
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
                    cp
                )
            );
        });

        return linePaths;
    }
}
