import { Stations } from './share';
import { StationInfo } from '../../../types';

export class StationsGZMTR extends Stations {
    protected leftWideFactor = (stnId: string) => {
        if (this.stnList[stnId].parents.length === 2 || this.stnList[stnId].children.length === 2) {
            return 0.25;
        } else {
            return 0;
        }
    };

    protected rightWideFactor = (stnId: string) => {
        if (this.stnList[stnId].parents.length === 2 || this.stnList[stnId].children.length === 2) {
            return 0.25;
        } else {
            return 0;
        }
    };

    protected getXShare(
        stnId: string,
        cpm: (
            from: string,
            to: string,
            stnList: { [stnId: string]: StationInfo },
            pathWeight: (stnId1: string, stnId2: string, stnList: { [stnId: string]: StationInfo }) => number
        ) => { len: number; nodes: string[] },
        branches: string[][]
    ) {
        if (stnId in this.xShares) return this.xShares[stnId];

        if (this.criticalPath.nodes.includes(stnId)) {
            let res = super.getXShare(stnId, cpm);
            this.xShares[stnId] = res;
            return res;
        }
        if (this.criticalPath.nodes.toString() !== branches[0].toString()) {
            let res = super.getXShare(stnId, cpm);
            this.xShares[stnId] = res;
            return res;
        } else {
            let branchWithStn = branches.slice(1).filter(branch => branch.includes(stnId))[0];
            let lenToLeft = cpm(branchWithStn[0], stnId, this.stnList, this.pathWeight).len;
            let lenToRight = cpm(stnId, branchWithStn[branchWithStn.length - 1], this.stnList, this.pathWeight).len;

            if (
                branches[0].includes(branchWithStn[0]) &&
                branches[0].includes(branchWithStn[branchWithStn.length - 1])
            ) {
                let res =
                    (this.getXShare(branchWithStn[0], cpm, branches) * lenToRight +
                        this.getXShare(branchWithStn[branchWithStn.length - 1], cpm, branches) * lenToLeft) /
                    (lenToLeft + lenToRight);
                this.xShares[stnId] = res;
                return res;
            } else if (branches[0].includes(branchWithStn[0])) {
                let res = this.getXShare(branchWithStn[0], cpm, branches) + lenToLeft;
                this.xShares[res] = res;
                return res;
            } else {
                let res = this.getXShare(branchWithStn[branchWithStn.length - 1], cpm, branches) - lenToRight;
                this.xShares[res] = res;
                return res;
            }
        }
    }

    protected getYShare(stnId: string, branches: string[][]) {
        if (stnId in this.yShares) return this.yShares[stnId];

        if (['linestart', 'lineend'].includes(stnId)) {
            this.yShares[stnId] = 0;
            return 0;
        }
        if (branches[0].includes(stnId)) {
            this.yShares[stnId] = 0;
            return 0;
        } else {
            let i = 1;
            while (i < branches.length) {
                if (branches[i].includes(stnId)) {
                    break;
                }
                i++;
            }
            if (branches[0].includes(branches[i][0])) {
                var branchingStnId = branches[i][0];
                var neToFind = 'children';
                if (this.stnList[branchingStnId][neToFind].indexOf(branches[i][1]) == 0) {
                    this.yShares[stnId] = 2;
                    return 2;
                } else {
                    this.yShares[stnId] = -2;
                    return -2;
                }
            } else {
                var branchingStnId = branches[i].slice().reverse()[0];
                var neToFind = 'parents';
                if (this.stnList[branchingStnId][neToFind].indexOf(branches[i].slice().reverse()[1]) == 0) {
                    this.yShares[stnId] = 2;
                    return 2;
                } else {
                    this.yShares[stnId] = -2;
                    return -2;
                }
            }
        }
    }

    protected _linePath(
        stnIds: string[],
        lineXs: [number, number],
        branches: string[][],
        realXs: { [stnId: string]: number },
        realYs: { [stnId: string]: number },
        branchSpacing: number,
        cp: { len: number; nodes: string[] }
    ) {
        let prevY: number;
        var path = [];

        stnIds.forEach(stnId => {
            let x = realXs[stnId];
            let y = realYs[stnId];
            if (!prevY && prevY !== 0) {
                prevY = y;
                path.push(`M ${x},${y}`);
                return;
            }
            if (y === 0) {
                if (y < prevY) {
                    path.push(`H ${x - 30}`, 'a 30,30 0 0,0 30,-30', `V ${y}`);
                }
                if (y > prevY) {
                    path.push(`H ${x - 30}`, 'a 30,30 0 0,1 30,30', `V ${y}`);
                }
            } else {
                if (y < prevY) {
                    path.push(`V ${y + 30}`, 'a 30,30 0 0,1 30,-30', `H ${x}`);
                }
                if (y > prevY) {
                    path.push(`V ${y - 30}`, 'a 30,30 0 0,0 30,30', `H ${x}`);
                }
            }
            path.push(`H ${x}`);
            prevY = y;
        });

        // simplify path
        return path.join(' ').replace(/( H ([\d.]+))+/g, ' H $2');
    }
}
