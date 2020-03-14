import { RMGParam, StationInfo } from "../types";

export class RMGLine {
    param: RMGParam;
    stnList: {
        [stnId: string]: StationInfo;
    };
    constructor(param: RMGParam) {
        this.param = param;

        this.stnList = this.param.stn_list;
    }

    /**
     * Increment of the weight of out-bound edge of a station, which increases the horizontal interval from its children. 
     */
    protected _rightWideFactor(stnId: string) {
        return 0;
    }

    /**
     * Increment of the weight of in-bound edge of a station, which increases the horizontal interval from its parents. 
     */
    protected _leftWideFactor(stnId: string) {
        return 0;
    }

    /**
     * Path weight from station 1 to station 2 (station 2 must be a child of station 1, otherwise return `-Infinity`).
     */
    protected _pathWeight(stnId1: string, stnId2: string) {
        if (!this.stnList[stnId1].children.includes(stnId2)) {return -Infinity;}
        return 1 + this._rightWideFactor(stnId1) + this._leftWideFactor(stnId2);
    }

    /**
     * Critical path and corresponding length from a station to another. 
     * @param from ID of station on the left
     * @param to ID of station on the left
     */
    protected _cp(from: string, to: string) {
        let self = this;
        if (from == to) {
            return { len: 0, nodes: [from] };
        }
        let allLengths: number[] = [];
        let criticalPaths: string[][] = [];
        this.stnList[from].children.forEach(child => {
            let cp = self._cp(child, to);
            if (cp.len < 0) {return;}
            allLengths.push(this._pathWeight(from, child) + cp.len);
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
    get criticalPath() {
        let allLengths: number[] = [];
        let criticalPaths: string[][] = [];
        this.leftDests.forEach(ld => {
            this.rightDests.forEach(rd => {
                let cp = this._cp(ld, rd);
                allLengths.push(cp.len);
                criticalPaths.push(cp.nodes);
            });
        });
        let maxLen = Math.max(...allLengths);
        return {
            'len': maxLen,
            'nodes': criticalPaths[allLengths.indexOf(maxLen)]
        };
    }

    get leftDests() {return this.stnList.linestart.children;}
    get rightDests() {return this.stnList.lineend.parents;}

    get lineXs() {
        return [
            this.param.svg_width * this.param.padding / 100, 
            this.param.svg_width * (1 - this.param.padding/100)
        ];
    }

    /**
     * Horizontal position (in shares) of station icon. 
     */
    _stnXShare(stnId: string) {
        var self = this;

        var cp = this.criticalPath;
        if (cp.nodes.includes(stnId)) {return this._cp(cp.nodes[0], stnId).len;}

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

        var lengthToSource = this._cp(partSource, stnId).len;
        var lengthToSink = this._cp(stnId, partSink).len;
        if (leftOpenJaw) {
            var actualPartLength = this._cp(cp.nodes[0], partSink).len;
            return self._stnXShare(partSink) - lengthToSink / (lengthToSource + lengthToSink) * actualPartLength;
        } else if (rightOpenJaw) {
            var actualPartLength = this._cp(partSource, cp.nodes.slice(-1)[0]).len;
        } else {
            var actualPartLength = this._cp(partSource, partSink).len;
        }
        return self._stnXShare(partSource) + lengthToSource / (lengthToSource + lengthToSink) * actualPartLength;
    }

    /**
     * Horizontal position (in pixels) of station icon. 
     */
    _stnRealX(stnId: string) {
        console.log(stnId)
        let [lineStart, lineEnd] = this.lineXs;
        return lineStart + this._stnXShare(stnId) / this.criticalPath.len * (lineEnd - lineStart);
    }

    /**
     * Vertical position (in shares) of station icon if using MTR style (for consistency of method `RMGLine.newStnPossibleLoc()`). 
     */
    _stnYShare(stnId: string) {
        if (['linestart', 'lineend'].includes(stnId) || 
            this.stnList[stnId].parents.length > 1 || 
            this.stnList[stnId].children.length > 1) {
            return 0;
        }
        var stnPred = this.stnList[stnId].parents[0];
        let self = this;
        if (stnPred) {
            // parent exist
            if (this.stnList[stnPred].children.length == 1) {
                // no sibling, then y same as parent
                return self._stnYShare(stnPred);
            } else {
                // sibling exists, then y depends on its idx of being children
                return (this.stnList[stnPred].children.indexOf(stnId) == 0) ? 1 : -1;
            }
        } else {
            // no parent, must be linestart
            return 0;
        }
    }

    /**
     * Vertical position (in pixels) of station icon related to vertical position of line. 
     */
    _stnRealY(stnId: string) {
        return -this._stnYShare(stnId) * this.param.branch_spacing;
    }
}