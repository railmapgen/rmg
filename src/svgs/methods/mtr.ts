import { Stations } from './share';
import { StationDict, StationInfo } from '../../constants/constants';
import { getSidingPath } from '../mtr/line-diagram-utils';

export const leftWideFactor = (stnList: StationDict, stnId: string) => {
    let res = 0;
    const { transfer } = stnList[stnId];
    const ls = transfer.groups.map(val => val.lines?.length || 0);
    if (transfer.tick_direc === 'l') {
        // int3 or above
        if (!ls[1] && ls[0] > 1) res += 0.4;
        // osi except osi22
        if (ls[1] && (ls[0] !== 1 || ls[1] !== 2)) res += 0.4;
    }
    if (ls[0] === 1 && ls[1] === 2) {
        // osi22 not end
        if (stnList[stnId].parents[0] !== 'linestart' && stnList[stnId].children[0] !== 'lineend') res += 0.8;
    }
    // let { type, tick_direc } = stnList[stnId].transfer;
    // if (tick_direc === 'l' && ['int3', 'osi11', 'osi12', 'osi21', 'osi31'].includes(type)) res += 0.8;
    if (stnList[stnId].parents.length === 2) res += 0.2;
    if (stnList[stnList[stnId].parents[0]].children.length === 2) res += 0.4;
    return res;
};

export const rightWideFactor = (stnList: StationDict, stnId: string) => {
    let res = 0;
    const { transfer } = stnList[stnId];
    const ls = transfer.groups.map(val => val.lines?.length || 0);
    if (transfer.tick_direc === 'r') {
        // int3 or above
        if (!ls[1] && ls[0] > 1) res += 0.4;
        // osi except osi22
        if (ls[1] && (ls[0] !== 1 || ls[1] !== 2)) res += 0.4;
    }
    if (ls[0] === 1 && ls[1] === 2) {
        if (stnList[stnId].parents[0] !== 'linestart' && stnList[stnId].children[0] !== 'lineend') res += 0.8;
    }
    // let { type, tick_direc } = stnList[stnId].transfer;
    // if (tick_direc === 'r' && ['int3', 'osi11', 'osi12', 'osi21', 'osi31'].includes(type)) res += 0.8;
    if (stnList[stnId].children.length === 2) res += 0.2;
    if (stnList[stnList[stnId].children[0]].parents.length === 2) res += 0.4;
    return res;
};

export class StationsMTR extends Stations {
    protected leftWideFactor = (stnId: string) => {
        return leftWideFactor(this.stnList, stnId);
    };

    protected rightWideFactor = (stnId: string) => {
        return rightWideFactor(this.stnList, stnId);
    };

    static drawLine(
        branches: string[][],
        stnStates: { [stnId: string]: -1 | 0 | 1 },
        stnList: { [stnId: string]: StationInfo },
        lineXs: [number, number],
        xs: { [stnId: string]: number },
        ys: { [stnId: string]: number },
        branchSpacing: number,
        cp: { len: number; nodes: string[] },
        e = 0
    ) {
        const linePaths = {
            main: [] as string[],
            pass: [] as string[],
            sidingMain: [] as string[],
            sidingPass: [] as string[],
        };

        branches.forEach(branch => {
            const isSiding = branch[0] !== 'linestart' && branch.slice(-1)[0] !== 'lineend';

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

            if (isSiding) {
                linePaths.sidingMain.push(getSidingPath(lineMainStns.map(id => [xs[id], ys[id]])));
                linePaths.sidingPass.push(getSidingPath(linePassStns.map(id => [xs[id], ys[id]])));
            } else {
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
            }
        });

        return linePaths;
    }
}

export class StationsSHMetro extends StationsMTR {
    static drawLine(
        branches: string[][],
        stnStates: { [stnId: string]: -1 | 0 | 1 },
        stnList: { [stnId: string]: StationInfo },
        lineXs: [number, number],
        xs: { [stnId: string]: number },
        ys: { [stnId: string]: number },
        branchSpacing: number,
        cp: { len: number; nodes: string[] },
        e = 0
    ) {
        const linePaths = {
            main: [] as string[],
            pass: [] as string[],
            sidingMain: [] as string[],
            sidingPass: [] as string[],
        };

        branches.forEach(branch => {
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
