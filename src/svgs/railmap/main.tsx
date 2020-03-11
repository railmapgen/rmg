import * as React from 'react';

import Station from './station';
import { ParamContext } from '../../context';
import { getStnState } from '../../methods';
import { StationInfo } from '../../types';

const Main = () => {
    const { param, branches, routes } = React.useContext(ParamContext);

    let deps = {};
    Object.keys(param.stn_list).forEach(stnId => {
        let { parents, children, branch } = param.stn_list[stnId];
        deps[stnId] = { parents, children, branch };
    });

    const criticalPath = React.useMemo(() => getCriticalPath(param.stn_list), [JSON.stringify(deps)]);
    const xShares = React.useMemo(() => Stations.getXShares(param.stn_list, criticalPath), [JSON.stringify(deps)]);
    const lineXs: [number, number] = [param.svg_width * param.padding / 100, param.svg_width * (1 - param.padding / 100)];
    const xs = xShare2RealX(xShares, criticalPath, lineXs);

    const yShares = React.useMemo(() => Stations.getYShares(param.stn_list), [JSON.stringify(deps)]);
    const ys = yShare2RealY(yShares, param.branch_spacing, branches);

    const namePoss = React.useMemo(() => Stations.getNamePos(param.stn_list, criticalPath.nodes), [JSON.stringify(deps)]);
    let correctedNamePoss = {} as { [stnId: string]: boolean };
    Object.keys(namePoss).forEach(stnId => correctedNamePoss[stnId] = param.txt_flip ? !namePoss[stnId] : namePoss[stnId]);

    let stnStates = {} as { [stnId: string]: -1 | 0 | 1 };
    Object.keys(param.stn_list).forEach(stnId => stnStates[stnId] = getStnState(stnId, param.current_stn_idx, param.direction, routes));

    let linePaths = { main: [] as string[], pass: [] as string[] };
    branches.map((branch, i) => {
        branch = branch.filter(stnId => !['linestart', 'lineend'].includes(stnId));
        var lineMainStns = branch.filter(stnId => stnStates[stnId] >= 0);
        var linePassStns = branch.filter(stnId => stnStates[stnId] <= 0);

        if (lineMainStns.length === 1) {
            linePassStns = branch;
        }

        if (lineMainStns.filter(stnId => linePassStns.indexOf(stnId) !== -1).length == 0 && lineMainStns.length) {
            // if two set disjoint
            if (linePassStns[0] === branch[0]) {
                // -1 -1 1 1
                linePassStns.push(lineMainStns[0]);
            } else if (lineMainStns[0] === branch[0] && lineMainStns[lineMainStns.length - 1] === branch[branch.length - 1] && linePassStns.length) {
                linePassStns = branch;
                lineMainStns = [];
            } else {
                // 1 1 -1 -1
                linePassStns.unshift(lineMainStns[lineMainStns.length - 1]);
            }
        }

        linePaths.main.push(linePath(lineMainStns, param.stn_list, lineXs, branches, xs, ys, param.branch_spacing, criticalPath));
        linePaths.pass.push(linePath(linePassStns, param.stn_list, lineXs, branches, xs, ys, param.branch_spacing, criticalPath));
    });

    return (
        <g id="main" style={{
            ['--y-percentage' as any]: param.y_pc,
            transform: 'translateY(calc(var(--y-percentage) * var(--rmg-svg-height) / 100))',
        }}>
            <g className="rmg-line rmg-line__mtr rmg-line__pass" id="line_pass">
                {linePaths.pass.map((path, i) => <path key={i} d={path} />)}
            </g>
            <g className="rmg-line rmg-line__mtr" id="line_main">
                {linePaths.main.map((path, i) => <path key={i} d={path} />)}
            </g>

            <g id="stn_icons">
                {Object.keys(param.stn_list).map(stnId => {
                    if (['linestart', 'lineend'].includes(stnId)) return;
                    return (
                        <g id={stnId} key={stnId} style={{
                            transform: `translate(${xs[stnId]}px,${ys[stnId]}px)`,
                        }}>
                            <Station stnId={stnId} stnState={stnStates[stnId]} namePos={correctedNamePoss[stnId]} />
                        </g>
                    );
                })}
            </g>
        </g>
    )
};

export default Main;

const xShare2RealX = (
    xShares: { [stnId: string]: number },
    cp: { len: number, nodes: string[] },
    lineXs: [number, number]
) => {
    let realXs = {} as { [stnId: string]: number };
    Object.keys(xShares).forEach(stnId => {
        realXs[stnId] = lineXs[0] + xShares[stnId] / cp.len * (lineXs[1] - lineXs[0]);
    });
    return realXs;
}

const yShare2RealY = (yShares: { [stnId: string]: -1 | 0 | 1 }, branchSpacing: number, branches: string[][]) => {
    let realYs = {} as { [stnId: string]: number };
    Object.keys(yShares).forEach(stnId => {
        let res = -yShares[stnId] * branchSpacing;
        if (branches[0].includes(stnId)) {
            // on main line
            realYs[stnId] = res;
        } else {
            // shift 9.68px
            res += res > 0 ? 9.68 : -9.68;
            realYs[stnId] = res;
        }
    });
    return realYs;
};

class Stations {
    yShares = {} as { [stnId: string]: -1 | 0 | 1 };
    xShares = {} as { [stnId: string]: number };
    namePoss = {} as { [stnId: string]: boolean };

    public leftWideFactor = (stnId: string, stnList: { [stnId: string]: StationInfo }) => {
        var res = 0;
        let { type, tick_direc } = stnList[stnId].transfer;
        if (tick_direc === 'l') {
            if (['int3', 'osi11', 'osi12'].includes(type)) {
                res += 0.8;
            }
        }
        if (type === 'osi22') res += 0.8;
        if (stnList[stnId].parents.length === 2) res += 0.4;
        if (stnList[stnList[stnId].parents[0]].children.length === 2) res += 0.4;
        return res;
    }

    public rightWideFactor = (stnId: string, stnList: { [stnId: string]: StationInfo }) => {
        var res = 0;
        let { type, tick_direc } = stnList[stnId].transfer;
        if (tick_direc === 'r') {
            if (['int3', 'osi11', 'osi12'].includes(type)) {
                res += 0.8;
            }
        }
        if (type === 'osi22') res += 0.8;
        if (stnList[stnId].children.length === 2) res += 0.4;
        if (stnList[stnList[stnId].children[0]].parents.length === 2) res += 0.4;
        return res;
    }

    /**
     * Path weight from station 1 to station 2 (station 2 must be a child of station 1, otherwise return `-Infinity`).
     */
    public pathWeight = (stnId1: string, stnId2: string, stnList: { [stnId: string]: StationInfo }) => {
        if (!stnList[stnId1].children.includes(stnId2)) { return -Infinity; }
        return 1 + this.rightWideFactor(stnId1, stnList) + this.leftWideFactor(stnId2, stnList);
    };

    private getXShare = (
        stnId: string,
        stnList: { [stnId: string]: StationInfo },
        cp: { len: number, nodes: string[] }
    ): number => {
        if (stnId in this.xShares) return this.xShares[stnId];

        if (cp.nodes.includes(stnId)) {
            let res = cpm(cp.nodes[0], stnId, stnList, this.pathWeight).len;
            this.xShares[stnId] = res;
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

        var lengthToSource = cpm(partSource, stnId, stnList, this.pathWeight).len;
        var lengthToSink = cpm(stnId, partSink, stnList, this.pathWeight).len;
        if (leftOpenJaw) {
            var actualPartLength = cpm(cp.nodes[0], partSink, stnList, this.pathWeight).len;
            let res = this.getXShare(partSink, stnList, cp) - lengthToSink / (lengthToSource + lengthToSink) * actualPartLength;
            this.xShares[stnId] = res;
            return res;
        } else if (rightOpenJaw) {
            var actualPartLength = cpm(partSource, cp.nodes.slice(-1)[0], stnList, this.pathWeight).len;
        } else {
            var actualPartLength = cpm(partSource, partSink, stnList, this.pathWeight).len;
        }
        let res = this.getXShare(partSource, stnList, cp) + lengthToSource / (lengthToSource + lengthToSink) * actualPartLength;
        this.xShares[stnId] = res;
        return res;
    };

    /**
     * Horizontal position (in shares) of every station icon. 
     */
    static getXShares = (
        stnList: { [stnId: string]: StationInfo },
        cp: { len: number, nodes: string[] }
    ) => {
        console.log('computing x shares');
        let stations = new Stations;

        Object.keys(stnList).forEach(stnId => {
            if (['linestart', 'lineend'].includes(stnId)) return;
            if (stnId in stations.xShares) return;
            stations.getXShare(stnId, stnList, cp);
        });

        return stations.xShares;
    };

    private getYShare(stnId: string, stnList: { [stnId: string]: StationInfo }) {
        if (stnId in this.yShares) return this.yShares[stnId];

        if (['linestart', 'lineend'].includes(stnId) ||
            stnList[stnId].parents.length > 1 ||
            stnList[stnId].children.length > 1) {
            this.yShares[stnId] = 0;
            return 0;
        }
        var stnPred = stnList[stnId].parents[0];
        if (stnPred) {
            // parent exist
            if (stnList[stnPred].children.length == 1) {
                // no sibling, then y same as parent
                let res = this.getYShare(stnPred, stnList);
                this.yShares[stnId] = res;
                return res;
            } else {
                // sibling exists, then y depends on its idx of being children
                let res: 1 | -1 = (stnList[stnPred].children.indexOf(stnId) == 0) ? 1 : -1;
                this.yShares[stnId] = res;
                return res;
            }
        } else {
            // no parent, must be linestart
            this.yShares[stnId] = 0;
            return 0;
        }
    }

    static getYShares(stnList) {
        console.log('computing y shares');
        let stations = new Stations;

        Object.keys(stnList).forEach(stnId => {
            if (['linestart', 'lineend'].includes(stnId)) return;
            if (stnId in stations.yShares) return;
            stations.getYShare(stnId, stnList);
        });

        return stations.yShares;
    }

    private getNamePos(stnId: string, stnList: { [stnId: string]: StationInfo }, cp) {
        if (stnId === 'linestart') {
            this.namePoss['linestart'] = true;
            return true;
        }
        let self = this;
        let pos = cp.indexOf(stnId) % 2; // -1, 0 or 1;
        if (pos === -1) {
            let parId = stnList[stnId].parents[0];
            if (stnList[parId].children.length === 2) {
                let res = self.getNamePos(parId, stnList, cp);
                this.namePoss[stnId] = res;
                return res;
            }
            let res = !self.getNamePos(parId, stnList, cp);
            this.namePoss[stnId] = res;
            return res;
        }
        this.namePoss[stnId] = pos === 1;
        return pos === 1;
    }

    static getNamePos(stnList, cp) {
        console.log('computing name position');
        let stations = new Stations;

        Object.keys(stnList).forEach(stnId => {
            if (['linestart', 'lineend'].includes(stnId)) return;
            if (stnId in stations.namePoss) return;
            stations.getNamePos(stnId, stnList, cp);
        });

        return stations.namePoss;
    }
}

/**
 * Critical path and corresponding length from a station to another. 
 * @param from ID of station on the left
 * @param to ID of station on the left
 */
const cpm = (
    from: string, to: string,
    stnList: { [stnId: string]: StationInfo },
    pathWeight: (stnId1: string, stnId2: string, stnList: { [stnId: string]: StationInfo }) => number
) => {
    if (from == to) {
        return { len: 0, nodes: [from] };
    }
    let allLengths: number[] = [];
    let criticalPaths: string[][] = [];
    stnList[from].children.forEach(child => {
        let cp = cpm(child, to, stnList, pathWeight);
        if (cp.len < 0) { return; }
        allLengths.push(pathWeight(from, child, stnList) + cp.len); // TODO
        // allLengths.push(1 + cp.len);
        cp.nodes.unshift(from);
        criticalPaths.push(cp.nodes);
    });
    let maxLength = Math.max(...allLengths);
    return {
        'len': maxLength,
        'nodes': criticalPaths[allLengths.indexOf(maxLength)]
    };
}

/**
 * Getter of critical path (from left to right) and corresponding length of the entire line. 
 */
const getCriticalPath = (stnList: { [stnId: string]: StationInfo }) => {
    console.log('computing critical path');
    let allLengths: number[] = [];
    let criticalPaths: string[][] = [];
    stnList.linestart.children.forEach(ld => {
        stnList.lineend.parents.forEach(rd => {
            let cp = cpm(ld, rd, stnList, (new Stations).pathWeight);
            allLengths.push(cp.len);
            criticalPaths.push(cp.nodes);
        });
    });
    let maxLen = Math.max(...allLengths);
    return ({
        len: maxLen,
        nodes: criticalPaths[allLengths.indexOf(maxLen)]
    });
};


/**
 * Parameters of the arcs involved in the `<path>` element. 
 */
const pathTurnParams = (branchSpacing: number) => {
    let tr = 35; // turning radius
    let dx_a = tr / 2; // dx of a
    let dy_a = tr - dx_a * Math.sqrt(3); // dy of a
    let dy_l = branchSpacing - 2 * dy_a; // dy of l
    let dx_l = dy_l * Math.sqrt(3) // dx of l
    return { tr, dx_a, dy_a, dx_l, dy_l };
};

/**
 * Path segment from a station towards its southeast (lower-right). 
 */
const pathTurnSE = (branchSpacing: number) => {
    let { tr, dx_a, dy_a, dx_l, dy_l } = pathTurnParams(branchSpacing);
    return `a ${tr},${tr} 0 0,1 ${dx_a},${dy_a} l ${dx_l},${dy_l} a ${tr},${tr} 0 0,0 ${dx_a},${dy_a}`;
}

/**
 * Path segment from a station towards its northeast (upper-right). 
 */
const pathTurnNE = (branchSpacing: number) => {
    let { tr, dx_a, dy_a, dx_l, dy_l } = pathTurnParams(branchSpacing);
    return `a ${tr},${tr} 0 0,0 ${dx_a},${-dy_a} l ${dx_l},${-dy_l} a ${tr},${tr} 0 0,1 ${dx_a},${-dy_a}`;
}

const linePath = (
    stnIds: string[],
    stnList: { [stnId: string]: StationInfo },
    lineXs: [number, number],
    branches: string[][],
    realXs: { [stnId: string]: number },
    realYs: { [stnId: string]: number },
    branchSpacing: number,
    cp: { len: number, nodes: string[] }
) => {
    var [prevId, prevY, prevX]: [string?, number?, number?] = [];
    var path = [];

    let { dx_a, dx_l } = pathTurnParams(branchSpacing);
    let stnDX = dx_a + dx_l / 2;
    let stnExtraH = (lineXs[1] - lineXs[0]) / cp.len * 0.8;
    let stnSpareH = ((lineXs[1] - lineXs[0]) / cp.len - 2 * stnDX) / 2;
    if ((stnSpareH + stnExtraH) < 0) {
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
                path.push(`M ${x},${y}`)
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
                y === 0 ? `h ${x - prevX - stnExtraH * (new Stations).leftWideFactor(stnId, stnList) - stnSpareH - stnDX * 2}` : `h ${stnExtraH * (new Stations).rightWideFactor(prevId, stnList) + stnSpareH}`
            );
            path.push(pathTurnSE(branchSpacing));
        } else if (y < prevY) {
            path.push(
                y === 0 ? `h ${x - prevX - stnExtraH * (new Stations).leftWideFactor(stnId, stnList) - stnSpareH - stnDX * 2}` : `h ${stnExtraH * (new Stations).rightWideFactor(prevId, stnList) + stnSpareH}`
            );
            path.push(pathTurnNE(branchSpacing));
        }
        path.push(`H ${x}`);
        [prevId, prevX, prevY] = [stnId, x, y];
    });

    // simplify path
    return path.join(' ').replace(/( H ([\d.]+))+/g, ' H $2');
}