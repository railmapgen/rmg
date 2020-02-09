import { getTxtBoxDim, setParams, getParams, putParams, getRandomId, getNameFromId } from '../utils';
import { RMGStation, Int2Station, Int3LStation, Int3RStation, OSI11LStation, OSI11RStation, OSI12LStation, OSI12RStation, OSI22Station, OSI22LStation, OSI22RStation, OSI22EndStation } from '../Station/Station';

import { ID, Name, StationInfo, RMGParam, DirectionLong } from '../utils';

interface StationDict {
    [index: string]: RMGStation;
}

export class RMGLine {
    protected _svgHeight: number;
    protected _svgWidth: number;
    protected _svgDestWidth: number;
    private _showOuter: boolean;
    themeCity; themeLine; _themeColour; _fgColour;
    private _yPc: number;
    private _stripPc: number;
    protected _padding: number;
    private _longInterval = 1;
    private _branchSpacing: number;
    private _txtFlip: boolean;
    public stations = {} as StationDict;
    protected _currentStnId;
    protected _direction;
    protected _platformNum: string;
    protected _charForm: string;
    protected _lineNames: Name;
    private _destLegacy: boolean; 

    constructor (param: RMGParam) {
        this._svgHeight = param['svg_height'];
        this._svgWidth = param['svg_width'];
        this._svgDestWidth = param['svg_dest_width'];
        this._showOuter = param['show_outer'];

        [this.themeCity, this.themeLine, this._themeColour, this._fgColour] = param.theme;

        this.yPc = param['y_pc'];
        this._padding = param['padding'];
        this._stripPc = param['strip_pc'];
        this._branchSpacing = param.branch_spacing;
        this._txtFlip = param['txt_flip'];

        this._lineNames = param['line_name'];
        
        for (let [stnId, stnInfo] of Object.entries(param.stn_list)) {
            this.stations[stnId] = this._initStnInstance(stnId, stnInfo);
        }
        this._currentStnId = param['current_stn_idx'];
        this._direction = param['direction'];
        this._platformNum = param['platform_num'];
        
        this._destLegacy = param['dest_legacy'];

        this._charForm = param.char_form;

        // Calculate other properties of stations
        for (let [stnId, stnInstance] of Object.entries(this.stations)) {
            if (['linestart', 'lineend'].includes(stnId)) {continue;}
            stnInstance.x = this._stnRealX(stnId);
            stnInstance.y = this._stnRealY(stnId);
            stnInstance.state = this._stnState(stnId);
            stnInstance.namePos = this._txtFlip ? !this._stnNamePos(stnId) : this._stnNamePos(stnId);
        }
    }

    _initStnInstance(stnId: ID, stnInfo: StationInfo) {
        switch (stnInfo.change_type) {
            case 'int2':
                return new Int2Station(stnId, stnInfo);
            case 'int3_l':
                return new Int3LStation(stnId, stnInfo);
            case 'int3_r':
                return new Int3RStation(stnId, stnInfo);
            case 'osi11_ul':
            case 'osi11_pl':
                return new OSI11LStation(stnId, stnInfo);
            case 'osi11_ur':
            case 'osi11_pr':
                return new OSI11RStation(stnId, stnInfo);
            case 'osi12_ul':
            case 'osi12_pl':
                return new OSI12LStation(stnId, stnInfo);
            case 'osi12_ur':
            case 'osi12_pr':
                return new OSI12RStation(stnId, stnInfo);
            case 'osi22_pl':
            case 'osi22_ul':
                if (stnInfo.parents[0] == 'linestart' || stnInfo.children[0] == 'lineend') {
                    return new OSI22EndStation(stnId, stnInfo);
                } else {
                    return new OSI22LStation(stnId, stnInfo);
                }
            case 'osi22_pr':
            case 'osi22_ur':
                if (stnInfo.parents[0] == 'linestart' || stnInfo.children[0] == 'lineend') {
                    return new OSI22EndStation(stnId, stnInfo);
                } else {
                    return new OSI22RStation(stnId, stnInfo);
                }
            default:
                return new RMGStation(stnId, stnInfo);
        }
    }

    set svgDestWidth(val: number) {
        if (isNaN(val) || val <= 0) {return;}
        this._svgDestWidth = val;
        setParams('svg_dest_width', val);

        this.drawSVGFrame();
        this.drawStrip();
        this.drawDestInfo();
        this.loadFonts();
    }

    set svgWidth(val: number) {
        if (isNaN(val) || val <= 0) {return;}
        this._svgWidth = val;
        setParams('svg_width', val);

        this.drawSVGFrame();

        for (let [stnId, stnInstance] of Object.entries(this.stations)) {
            if (['linestart', 'lineend'].includes(stnId)) {continue;}
            stnInstance.x = this._stnRealX(stnId);
            stnInstance.y = this._stnRealY(stnId);
        }
        RMGLine.clearSVG();
        this.drawStns();
        this.drawLine();
        this.drawStrip();

        this.loadFonts();

        this.updateStnNameBg();
    }

    /**
     * Setter of vertical position of line (y).
     * @param val Percentage of vertical position, given fixed `svgHeight`
     */
    set yPc(val: number) {
        this._yPc = val;
        setParams('y_pc', val);

        let y = val * this._svgHeight / 100;
        $('g#main').attr('transform', `translate(0,${y})`);
    }

    set padding(val: number) {
        val = Number(val);
        this._padding = val;
        setParams('padding', val);

        for (let [stnId, stnInstance] of Object.entries(this.stations)) {
            if (['linestart', 'lineend'].includes(stnId)) {continue;}
            stnInstance.x = this._stnRealX(stnId);
        }
        RMGLine.clearSVG();
        this.drawStns();
        this.drawLine();

        this.loadFonts();

        this.updateStnNameBg();
    }

    set branchSpacing(val: number) {
        this._branchSpacing = val;
        setParams('branch_spacing', val);

        for (let [stnId, stnInstance] of Object.entries(this.stations)) {
            if (['linestart', 'lineend'].includes(stnId)) {continue;}
            stnInstance.x = this._stnRealX(stnId);
            stnInstance.y = this._stnRealY(stnId);
        }
        RMGLine.clearSVG();
        this.drawStns();
        this.drawLine();

        this.loadFonts();

        this.updateStnNameBg();
    }

    set txtFlip(val) {
        this._txtFlip = val;
        setParams('txt_flip', val);

        for (let [stnId, stnInstance] of Object.entries(this.stations)) {
            if (['linestart', 'lineend'].includes(stnId)) {continue;}
            stnInstance.namePos = this._txtFlip ? !this._stnNamePos(stnId) : this._stnNamePos(stnId);
        }

        $('#stn_icons').empty();
        this.drawStns();

        this.loadFonts();

        this.updateStnNameBg();
    }

    set themeColour(hexs: string[]) {
        this._themeColour = hexs[0];
        this._fgColour = hexs[1];

        var param = getParams();
        param.theme[2] = hexs[0];
        param.theme[3] = hexs[1];
        putParams(param);

        this.fillThemeColour();
    }

    set direction(val) {
        this._direction = val;
        setParams('direction', val);

        for (let [stnId, stnInstance] of Object.entries(this.stations)) {
            if (['linestart', 'lineend'].includes(stnId)) {continue;}
            stnInstance.state = this._stnState(stnId);
        }

        RMGLine.clearSVG();
        this.drawStns();
        this.drawLine();

        this.drawDestInfo();

        this.loadFonts();
    }

    /**
     * Setter of platform number (can be string). 
     */
    set platformNum(val: string) {
        this._platformNum = val;
        setParams('platform_num', val);
        $('.rmg-name__platformnum').text(val);
    }

    /**
     * Setter of character form. 
     * @param val 'trad', 'cn', 'tw' or 'jp'
     */
    set charForm(val: string) {
        this._charForm = val;
        setParams('char_form', val);

        $('.rmg-name__char-trad, .rmg-name__char-cn, .rmg-name__char-tw, .rmg-name__char-jp')
            .removeClass('rmg-name__char-trad rmg-name__char-cn rmg-name__char-tw rmg-name__char-jp')
            .addClass(`rmg-name__char-${val}`);
    }
    
    /**
     * Setter of names of line. 
     */
    set lineNames(val: Name) {
        this._lineNames = val;
        setParams('line_name', val);

        this.drawDestInfo();
        this.loadFonts();
    }

    set destLegacy(val: boolean) {
        this._destLegacy = val;
        setParams('dest_legacy', val);

        this.drawDestInfo();
        this.loadFonts();
    }

    set currentStnId(val: string) {
        this._currentStnId = val;
        setParams('current_stn_idx', val);

        for (let [stnId, stnInstance] of Object.entries(this.stations)) {
            if (['linestart', 'lineend'].includes(stnId)) {continue;}
            stnInstance.state = this._stnState(stnId);
        }
        RMGLine.clearSVG();
        this.drawStns();
        this.drawLine();

        this.drawDestInfo();

        this.loadFonts();

        this.updateStnNameBg();
    }

    /**
     * Increment of the weight of out-bound edge of a station, which increases the horizontal interval from its children. 
     */
    protected _rightWideFactor(stnId: ID) {
        var res = 0;
        let stnInstance = this.stations[stnId];
        if (stnInstance instanceof Int3RStation) {res += this._longInterval;}
        if (stnInstance instanceof OSI11RStation) {res += this._longInterval;}
        if (stnInstance instanceof OSI12RStation) {res += this._longInterval;}
        if (stnInstance instanceof OSI22Station) {res += this._longInterval;}
        var stnClasses = ['Int3RStation', 'OSI11RStation', 'OSI12RStation', 'OSI22LStation', 'OSI22RStation'];
        if (stnClasses.includes(this.stations[stnId].constructor.name)) {res += this._longInterval;}
        if (this._stnOutdegree(stnId) == 2) {res += this._longInterval/2;}
        if (this._stnIndegree(this.stations[stnId].children[0]) == 2) {res += this._longInterval/2;}
        return res;
    }

    /**
     * Increment of the weight of in-bound edge of a station, which increases the horizontal interval from its parents. 
     */
    protected _leftWideFactor(stnId: ID) {
        var res = 0;
        let stnInstance = this.stations[stnId];
        if (stnInstance instanceof Int3LStation) {res += this._longInterval;}
        if (stnInstance instanceof OSI11LStation) {res += this._longInterval;}
        if (stnInstance instanceof OSI12LStation) {res += this._longInterval;}
        if (stnInstance instanceof OSI22Station) {res += this._longInterval;}
        if (this._stnIndegree(stnId) == 2) {res += this._longInterval/2;}
        if (this._stnOutdegree(this.stations[stnId].parents[0]) == 2) {res += this._longInterval/2;}
        return res;
    }

    /**
     * Path weight from station 1 to station 2 (station 2 must be a child of station 1, otherwise return `-Infinity`).
     */
    protected _pathWeight(stnId1: ID, stnId2: ID) {
        if (!this.stations[stnId1].children.includes(stnId2)) {return -Infinity;}
        return 1 + this._rightWideFactor(stnId1) + this._leftWideFactor(stnId2);
    }

    /**
     * Critical path and corresponding length from a station to another. 
     * @param from ID of station on the left
     * @param to ID of station on the left
     */
    protected _cp(from: ID, to: ID) {
        let self = this;
        if (from == to) {
            return { len: 0, nodes: [from] };
        }
        let allLengths: number[] = [];
        let criticalPaths: ID[][] = [];
        this.stations[from].children.forEach(child => {
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
        let criticalPaths: ID[][] = [];
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

    _topoOrder(from: ID, tpo: ID[] = []) {
        var self = this;
        tpo.push(from);
        this.stations[from].children.forEach(child => {
            if (this._stnIndegree(child) == 2 && this.stations[child].parents.indexOf(from)==0) {
                // wait the other branch
                return;
            } 
            tpo.concat(self._topoOrder(child, tpo));
        });
        return tpo;
    }

    get tpo() {
        let res = this._topoOrder('linestart');
        return res.slice(1, res.length-1);
    }

    // get y() {
    //     // return this._yPc * this._svgHeight / 100; 
    //     return 0;
    // }
    get stripY() {return this._stripPc * this._svgHeight / 100;}
    get turningRadius() {return this._branchSpacing/2 * (Math.sqrt(2) / (Math.sqrt(2)-1));}

    get lineXs() {
        return [
            this._svgWidth * this._padding / 100, 
            this._svgWidth * (1 - this._padding/100)
        ];
    }

    get leftDests() {return this.stations.linestart.children;}
    get rightDests() {return this.stations.lineend.parents;}

    get lValidDests() {
        return Array.from(
            new Set(
                this.routes
                    .filter(route => route.indexOf(this._currentStnId) !== -1)
                    .map(route => route.filter(stnId => stnId !== 'lineend' && stnId !== 'linestart')[0])
            )
        );
    }

    get rValidDests() {
        return Array.from(
            new Set(
                this.routes
                    .filter(route => route.indexOf(this._currentStnId) !== -1)
                    .map(route => route.filter(stnId => stnId !== 'lineend' && stnId !== 'linestart').reverse()[0])
            )
        );
    }

    /**
     * Indegree of a station node.
     */
    _stnIndegree(stnId: ID) {return this.stations[stnId].inDegree;}

    /**
     * Outdegree of a station node. 
     */
    _stnOutdegree(stnId: ID) {return this.stations[stnId].outDegree;}

    /**
     * Horizontal position (in shares) of station icon. 
     */
    _stnXShare(stnId: ID) {
        var self = this;

        var cp = this.criticalPath;
        if (cp.nodes.includes(stnId)) {return this._cp(cp.nodes[0], stnId).len;}

        var partSource = stnId;
        var partSink = stnId;
        var leftOpenJaw = false;
        var rightOpenJaw = false;

        while (true) {
            var parent = this.stations[partSource].parents[0];
            if (parent == 'linestart') {
                leftOpenJaw = true;
                break;
            }
            partSource = parent;
            if (this._stnOutdegree(partSource) > 1) {
                break;
            }
        }

        while (true) {
            var children = this.stations[partSink].children;
            if (children[0] != 'lineend') {
                partSink = children[0];
            } else {
                rightOpenJaw = true;
                break;
            }
            if (this._stnIndegree(partSink) > 1) {
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
    _stnRealX(stnId: ID) {
        let [lineStart, lineEnd] = this.lineXs;
        return lineStart + this._stnXShare(stnId) / this.criticalPath.len * (lineEnd - lineStart);
    }

    /**
     * Mirror `_stnYShareMTR`. 
     */
    _stnYShare(stnId: ID) {
        return this._stnYShareMTR(stnId);
    }

    /**
     * Vertical position (in shares) of station icon if using MTR style (for consistency of method `RMGLine.newStnPossibleLoc()`). 
     */
    _stnYShareMTR(stnId: ID) {
        if (['linestart', 'lineend'].includes(stnId) || this._stnIndegree(stnId) > 1 || this._stnOutdegree(stnId) > 1) {
            return 0;
        }
        var stnPred = this.stations[stnId].parents[0];
        let self = this;
        if (stnPred) {
            // parent exist
            if (this._stnOutdegree(stnPred) == 1) {
                // no sibling, then y same as parent
                return self._stnYShareMTR(stnPred);
            } else {
                // sibling exists, then y depends on its idx of being children
                return (this.stations[stnPred].children.indexOf(stnId) == 0) ? 1 : -1;
            }
        } else {
            // no parent, must be linestart
            return 0;
        }
    }

    /**
     * Vertical position (in pixels) of station icon related to vertical position of line. 
     */
    _stnRealY(stnId: ID) {
        return -this._stnYShare(stnId) * this._branchSpacing;
    }

    /**
     * Return true if station 2 is a successor of station 1, false otherwise. 
     */
    private _isSuccessor(stnId1: ID, stnId2: ID) {
        for (let route of this.routes) {
            let idx1 = route.indexOf(stnId1);
            let idx2 = route.indexOf(stnId2);
            if (idx1 !== -1 && idx2 !== -1 && idx1 < idx2) {
                return true;
            }
        }
        return false;
    }

    /**
     * Return true if station 2 is a predecessor of station 1, false otherwise. 
     */
    private _isPredecessor(stnId1: ID, stnId2: ID) {
        for (let route of this.routes) {
            let idx1 = route.indexOf(stnId1);
            let idx2 = route.indexOf(stnId2);
            if (idx1 !== -1 && idx2 !== -1 && idx2 < idx1) {
                return true;
            }
        }
        return false;
    }

    /**
     * Return state of a station (-1: passed, 0: current, 1: future).
     */
    protected _stnState(stnId: ID) {
        if (stnId == this._currentStnId) {return 0;}
        if (this._direction == 'r') {
            return this._isSuccessor(this._currentStnId, stnId) ? 1 : -1;
        } else {
            return this._isPredecessor(this._currentStnId, stnId) ? 1 : -1;
        }
    }

    /**
     * Station name position (`false`: above line, `true`: below line, given `txtFlip` is `false`).
     */
    private _stnNamePos(stnId: ID): boolean {
        if (stnId === 'linestart') {return true;}
        let self = this;
        let cp = this.criticalPath.nodes;
        let pos = cp.indexOf(stnId) % 2; // -1, 0 or 1;
        if (pos === -1) {
            let parId = this.stations[stnId].parents[0];
            if (this._stnOutdegree(parId) === 2) {
                return self._stnNamePos(parId);
            }
            return !self._stnNamePos(parId);
        }
        return pos === 1;
    }

    /**
     * Set height and width for both `svg`s. 
     */
    drawSVGFrame() {
        $('#railmap, #outer').attr({
            width: this._svgWidth, 
            height: this._svgHeight
        });
        $('#destination, #dest_outer').attr({
            width: this._svgDestWidth, 
            height: this._svgHeight
        });
    }

    showFrameOuter() {
        // var outerColour = this._showOuter ? 'black' : 'none';
        // $('#outer, #dest_outer').attr('stroke', outerColour);
        if (this._showOuter) {
            $('#outer, #dest_outer').show();
        } else {
            $('#outer, #dest_outer').hide();
        }
    }

    /**
     * Draw all stations. (Previously drawn station icons are not removed. )
     */
    drawStns() {
        for (let [stnId, stnInstance] of Object.entries(this.stations)) {
            if (['linestart', 'lineend'].includes(stnId)) {continue;}
            $('#stn_icons').append(stnInstance.html);
        }
        $('#stn_icons').html($('#stn_icons').html()); // Refresh DOM
    }

    /**
     * Update background of current station name. `y` and `height` are changed while station icon is re-drawn and `RMGStation.nameHTML` is loaded. 
     */
    updateStnNameBg() {
        var stnNameDim = getTxtBoxDim(
            $(`#stn_icons > #${this._currentStnId} > .Name`)[0] as Element as SVGGraphicsElement,
            'railmap'
        );
        $('#current_bg').attr({
            x: stnNameDim.x-3, 
            width: stnNameDim.width+6, 
        });
    }

    get stnDX() {return this.turningRadius - this._branchSpacing/2};
    get stnDY() {return this._branchSpacing/2};
    get stnExtraH() {
        var [lineStart, lineEnd] = this.lineXs;
        return (lineEnd - lineStart) / this.criticalPath.len * this._longInterval;
    }
    get stnSpareH() {
        var [lineStart, lineEnd] = this.lineXs;
        var dh = ( (lineEnd-lineStart)/this.criticalPath.len - 2*this.stnDX ) / 2;
        if (dh < 0) {
            console.warn(`SVG width too small! ${dh}`);
        }
        return dh;
    }
    get pathTurnENE() {return `a ${this.turningRadius},${this.turningRadius} 0 0,0 ${this.stnDX},${-this.stnDY}`};
    get pathTurnNEE() {return `a ${this.turningRadius},${this.turningRadius} 0 0,1 ${this.stnDX},${-this.stnDY}`};
    get pathTurnESE() {return `a ${this.turningRadius},${this.turningRadius} 0 0,1 ${this.stnDX},${this.stnDY}`};
    get pathTurnSEE() {return `a ${this.turningRadius},${this.turningRadius} 0 0,0 ${this.stnDX},${this.stnDY}`};

    /**
     * Generate `d` attribute of `<path>` element through all stations input. 
     */
    _linePath(stnIds: ID[]) {
        var [prevId, prevY, prevX]: [string?, number?, number?] = [];
        var path = [];

        var { stnExtraH, stnSpareH, pathTurnESE, pathTurnSEE, pathTurnENE, pathTurnNEE, stnDX } = this;

        stnIds.forEach(stnId => {
            var [x,y] = ['_stnRealX', '_stnRealY'].map(fun => this[fun](stnId));
            if (!prevY && prevY !== 0) {
                [prevId, prevX, prevY] = [stnId, x, y];
                path.push(`M ${x},${y}`);
                return;
            }
            if (y > prevY) {
                path.push(
                    y===0 ? `h ${x - prevX - stnExtraH*this._leftWideFactor(stnId) - stnSpareH - stnDX*2}` : `h ${stnExtraH * this._rightWideFactor(prevId) + stnSpareH}`
                );
                path.push(pathTurnESE, pathTurnSEE);
            } else if (y < prevY) {
                path.push(
                    y===0 ? `h ${x - prevX - stnExtraH*this._leftWideFactor(stnId) - stnSpareH - stnDX*2}` : `h ${stnExtraH * this._rightWideFactor(prevId) + stnSpareH}`
                );
                path.push(pathTurnENE, pathTurnNEE);
            }
            path.push(`H ${x}`);
            [prevId, prevX, prevY] = [stnId, x, y];
        });

        // simplify path
        return path.join(' ').replace(/( H ([\d.]+))+/g, ' H $2');
    }

    drawLine() {
        this.branches.map(branch => {
            var lineMainStns = branch.filter(stnId => this.stations[stnId].state >= 0);
            var linePassStns = branch.filter(stnId => this.stations[stnId].state <= 0);

            if (lineMainStns.length === 1) {
                linePassStns = branch;
            }

            if (lineMainStns.filter(stnId => linePassStns.indexOf(stnId) !== -1).length == 0 && lineMainStns.length) {
                // if two set disjoint
                if (linePassStns[0] === branch[0]) {
                    // -1 -1 1 1
                    linePassStns.push(lineMainStns[0]);
                } else if (lineMainStns[0] === branch[0] && lineMainStns[lineMainStns.length-1] === branch[branch.length-1] && linePassStns.length) {
                    linePassStns = branch;
                    lineMainStns = [];
                } else {
                    // 1 1 -1 -1
                    linePassStns.unshift(lineMainStns[lineMainStns.length-1]);
                }
            }

            $('#line_main').append(
                $('<path>', {d:this._linePath(lineMainStns)})
            );
            $('#line_pass').append(
                $('<path>', {d:this._linePath(linePassStns)})
            );
        });

        $('#line_main').html($('#line_main').html());
        $('#line_pass').html($('#line_pass').html());
    }

    drawStrip() {
        // $('#strip, #dest_strip').attr('d', `M 0,${this.stripY} H ${this._svgWidth}`)
        $('#strip').attr('d', `M 0,${this.stripY} H ${this._svgWidth}`);
        $('#dest_strip').attr('d', `M 0,${this.stripY} H ${this._svgDestWidth}`);
    }

    fillThemeColour() {
        $('#line_main, #strip, #dest_strip').attr('stroke', this._themeColour);
        $('#dest_name > #platform > circle').attr('fill', this._themeColour);
    }

    drawDestInfo() {
        $('#dest_name > #platform > text').text(this._platformNum);

        let validDest: ID[] = this[this._direction + 'ValidDests'];
        let txtAnchor = this._direction==='l' ? 'start' : 'end';

        var [destNameZH, destNameEN] = [0,1].map(idx => {
            return validDest.map(stnId => this.stations[stnId].name[idx].replace(/\\/g, ' ')).join('/');
        })

        if (this._destLegacy) {
            var [lineNameZH, lineNameEN] = this._lineNames;
            lineNameEN += ' ';
        } else {
            var lineNameZH = lineNameEN = '';
        }

        $('#dest_name > g:last-child text').eq(0).text(`${lineNameZH}往${destNameZH}`);
        $('#dest_name > g:last-child text').eq(1).text(`${lineNameEN}to ${destNameEN}`);

        var bcr = $('#dest_name > g:last-child')[0].getBoundingClientRect();
        var flagLength = 160 + 150 + bcr.width + 45 + 50;
        var isLeft = (this._direction == 'l') ? 1 : -1;
        var arrowX = (this._svgDestWidth - isLeft * flagLength) / 2;
        var arrowRotate = 90 * (1 - isLeft);
        var platformNumX = arrowX + isLeft * (160 + 50 + 75);
        var destNameX = platformNumX + isLeft * (75 + 45);
        $('#dest_name > use').attr('transform', `translate(${arrowX},130)rotate(${arrowRotate})`);
        $('#dest_name > #platform').attr('transform', `translate(${platformNumX},130)`);
        $('#dest_name > g:last-child').attr({
            transform: `translate(${destNameX},105)`, 
            'text-anchor': txtAnchor
        });
    }

    loadFonts() {
        $('.rmg-name__zh').addClass(`rmg-name__char-${this._charForm}`);
    }

    updateStnName(stnId: ID, names: Name, stnNum: string) {
        let param = getParams();
        param.stn_list[stnId].name = names;
        param.stn_list[stnId].num = stnNum;
        putParams(param);

        this.stations[stnId].name = names;
        // this.stations[stnId]._nameZH = nameZH;
        // this.stations[stnId]._nameEN = nameEN;
        this.stations[stnId].stnNum = stnNum;

        $(`#stn_icons #${stnId}`).remove();
        $('#stn_icons').append(this.stations[stnId].html);
        $('#stn_icons').html($('#stn_icons').html());

        if (this.leftDests.includes(stnId) && this._direction == 'l') {
            this.drawDestInfo();
        } else if (this.rightDests.includes(stnId) && this._direction == 'r') {
            this.drawDestInfo();
        }

        this.loadFonts();
        if (stnId == this._currentStnId) {this.updateStnNameBg();}
    }

    updateStnTransfer(stnId: ID, type, info=null) {
        var prevClass = this.stations[stnId].constructor.name;

        // V2.6 data structure
        let changeType = type.split('_')[0];
        let tick_direc = (type === 'none' || type === 'int2') ? 'r' : type.split('_')[1].split('').slice().reverse()[0];
        let paid_area = (type.indexOf('osi')!==-1) ? type.split('_')[1][0]==='p' : true;
        let osi_names = (type.indexOf('osi')!==-1) ? [info[1][0]] : [];
        let transferInfo = info.length===2 ? [info[0], info[1].slice(1)] : info;

        var param = getParams();
        param.stn_list[stnId].change_type = type;
        if (type == 'none') {
            param.stn_list[stnId].interchange = [[]];
            param.stn_list[stnId].transfer = {
                type: changeType, 
                tick_direc: tick_direc, 
                paid_area: paid_area,
                osi_names: [], 
                info: [[]]
            };
        } else {
            // param.stn_list[stnId].transfer = info;
            param.stn_list[stnId].interchange = info;
            param.stn_list[stnId].transfer = {
                type: changeType, 
                tick_direc: tick_direc, 
                paid_area: paid_area,
                osi_names: osi_names, 
                info: transferInfo
            };
        }
        putParams(param);

        this.stations[stnId] = this._initStnInstance(stnId, param.stn_list[stnId]);

        if (prevClass != this.stations[stnId].constructor.name) {
            // Not sure position, redraw all
            for (let [stnId, stnInstance] of Object.entries(this.stations)) {
                if (['linestart', 'lineend'].includes(stnId)) {continue;}
                stnInstance.x = this._stnRealX(stnId);
                stnInstance.y = this._stnRealY(stnId);
                stnInstance.namePos = this._txtFlip ? !this._stnNamePos(stnId) : this._stnNamePos(stnId);
                stnInstance.state = this._stnState(stnId);
            }
            RMGLine.clearSVG();
            this.drawStns();
            this.drawLine();
            this.drawStrip();
        } else {
            this.stations[stnId].x = this._stnRealX(stnId);
            this.stations[stnId].y = this._stnRealY(stnId);
            this.stations[stnId].namePos = this._txtFlip ? !this._stnNamePos(stnId) : this._stnNamePos(stnId);
            this.stations[stnId].state = this._stnState(stnId);
            $(`#stn_icons #${stnId}`).remove();
            $('#stn_icons').append(this.stations[stnId].html);
            $('#stn_icons').html($('#stn_icons').html());
        }
        this.loadFonts();

        this.updateStnNameBg();
    }

    removeStn(stnId: ID) {
        var param = getParams();

        var parents = this.stations[stnId].parents;
        var children = this.stations[stnId].children;

        var isLastMainBranchStn = true;
        for (let id in this.stations) {
            if ([stnId, 'linestart', 'lineend'].includes(id)) {continue;}
            if (this._stnYShareMTR(id) == 0) {
                isLastMainBranchStn = false;
                break;
            }
        }

        if (parents.length == 2 && children.length == 2) {
            // To be rewritten, join two branches
            return false;
        } else if (isLastMainBranchStn) {
            // Last main line station
            return false;
        } else if (Object.keys(param.stn_list).length == 4) {
            // Last two stations
            return false;
        } else if (parents.length == 2 || children.length == 2) {
            parents.forEach(parId => {
                param.stn_list[parId].children = children;
                this.stations[parId].children = children;
            });
            children.forEach(childId => {
                param.stn_list[childId].parents = parents;
                this.stations[childId].parents = parents;
            });
            if (parents.length == 1) {
                param.stn_list[parents[0]].branch.right = this.stations[stnId].branch.right;
                this.stations[parents[0]].branch.right = this.stations[stnId].branch.right;
            }
            if (children.length == 1) {
                param.stn_list[children[0]].branch.left = this.stations[stnId].branch.left;
                this.stations[children[0]].branch.left = this.stations[stnId].branch.left;
            }
        } else if (this._stnOutdegree(parents[0])==2 && this._stnIndegree(children[0])==2) {
            // 1 par 1 child, last station on upper/lower branch
            // branch disappear
            var childIdxOfPar = this.stations[parents[0]].children.indexOf(stnId);
            var parIdxOfChild = this.stations[children[0]].parents.indexOf(stnId);
            param.stn_list[parents[0]].children.splice(childIdxOfPar, 1);
            this.stations[parents[0]].children.splice(childIdxOfPar, 1);
            param.stn_list[children[0]].parents.splice(parIdxOfChild, 1);
            this.stations[children[0]].parents.splice(parIdxOfChild, 1);

            param.stn_list[parents[0]].branch.right = [];
            this.stations[parents[0]].branch.right = [];
            param.stn_list[children[0]].branch.left = [];
            this.stations[children[0]].branch.left = [];
        } else {
            // 1 par 1 child
            parents.forEach(parId => {
                var idx = param.stn_list[parId].children.indexOf(stnId);
                if (children.length) {
                    param.stn_list[parId].children[idx] = children[0];
                    this.stations[parId].children[idx] = children[0];
                } else {
                    // Right dest
                    param.stn_list[parId].children.splice(idx, 1);
                    this.stations[parId].children.splice(idx, 1);
                }

                if (this.stations[parId].branch.right[1] === stnId) {
                    this.stations[parId].branch.right[1] = children[0];
                    param.stn_list[parId].branch.right[1] = children[0];
                }
            });
            children.forEach(childId => {
                var idx = param.stn_list[childId].parents.indexOf(stnId);
                if (parents.length) {
                    param.stn_list[childId].parents[idx] = parents[0];
                    this.stations[childId].parents[idx] = parents[0];
                } else {
                    // Left dest
                    param.stn_list[childId].parents.splice(idx, 1);
                    this.stations[childId].parents.splice(idx, 1);
                }

                if (this.stations[childId].branch.left[1] === stnId) {
                    this.stations[childId].branch.left[1] = parents[0];
                    param.stn_list[childId].branch.left[1] = parents[0];
                }
            })
        }

        delete param.stn_list[stnId];
        delete this.stations[stnId];

        var isCurrentStnChanged = false;
        if (this._currentStnId == stnId) {
            var newCurrentStnId = Object.keys(this.stations)[2];
            this._currentStnId = newCurrentStnId;
            param.current_stn_idx = newCurrentStnId;
            isCurrentStnChanged = true;
        }
        putParams(param);

        parents.concat(children).forEach(neId => {
            if (['linestart', 'lineend'].includes(neId)) {return;}
            this.stations[neId] = this._initStnInstance(neId, param.stn_list[neId]);
        });


        for (let [stnId, stnInstance] of Object.entries(this.stations)) {
            if (['linestart', 'lineend'].includes(stnId)) {continue;}
            stnInstance.x = this._stnRealX(stnId);
            stnInstance.y = this._stnRealY(stnId);
            stnInstance.namePos = this._txtFlip ? !this._stnNamePos(stnId) : this._stnNamePos(stnId);
            stnInstance.state = this._stnState(stnId);
        }
        RMGLine.clearSVG();
        this.drawStns();
        this.drawLine();
        this.drawStrip();

        this.drawDestInfo();

        this.loadFonts();

        this.updateStnNameBg();
        return true;
    }

    newStnPossibleLoc(prep: 'before' | 'after', stnId: ID): [number, number, number, ID[], ID[]] {
        var deg = (prep == 'before') ? this._stnIndegree(stnId) : this._stnOutdegree(stnId);
        switch (deg) {
            case 2:
                // 1 -> 2
                return [1,1,1,[],[]];
            case 1:
                if (this._stnYShareMTR(stnId) == 0) {
                    // 1 -> 1
                    let state: ID[] | 0 = this.newBranchPossibleEnd(prep, stnId);
                    state = (state.length) ? state : [];
                    return [1,0,0,state,state];
                    // [1,0,0,1,1];
                } else if (this._stnYShareMTR(stnId) < 0) {
                    if (prep == 'before') {
                        return [this._stnOutdegree(this.stations[stnId].parents[0])-1, 
                            0,1,[],[]
                        ];
                    } else {
                        return [this._stnIndegree(this.stations[stnId].children[0])-1, 
                            0,1,[],[]
                        ];
                    }
                } else {
                    if (prep == 'before') {
                        return [this._stnOutdegree(this.stations[stnId].parents[0])-1, 
                            1,0,[],[]
                        ];
                    } else {
                        return [this._stnIndegree(this.stations[stnId].children[0])-1, 
                            1,0,[],[]
                        ];
                    }
                }
        }
        return [0,0,0,[],[]];
    }

    newBranchPossibleEnd(prep: 'before' | 'after', stnId: ID) {
        let res: ID[] = [];
        if (prep == 'before') {
            while (this._stnIndegree(stnId) == 1) {
                stnId = this.stations[stnId].parents[0];
                res.unshift(stnId);
            }
            res.pop();
        } else {
            while (this._stnOutdegree(stnId) == 1) {
                stnId = this.stations[stnId].children[0];
                res.push(stnId);
            }
            res.shift();
        }
        return res;
    }

    addStn(prep: 'before' | 'after', stnId: ID, loc, end: ID): [ID, StationInfo] {
        let newId = getRandomId();
        while (Object.keys(this.stations).includes(newId)) {
            newId = getRandomId();
        }

        let param = getParams();
        let newInfo = {} as StationInfo;

        if (prep == 'before') {
            if (loc == 'centre') {
                

                newInfo.parents = this.stations[stnId].parents;
                if (this._stnIndegree(stnId)==0 && this._stnYShareMTR(stnId) != 0) {
                    newInfo.children = this.leftDests;
                } else if (this._stnYShareMTR(stnId) != 0) {
                    // pivot on branch
                    newInfo.children = this.stations[this.stations[stnId].parents[0]].children;

                    newInfo.branch = {
                        left: [], 
                        right: this.stations[newInfo.parents[0]].branch.right
                    };
                    this.stations[newInfo.parents[0]].branch.right = [];
                    param.stn_list[newInfo.parents[0]].branch.right = [];
                } else {
                    // pivot on main
                    newInfo.children = [stnId];

                    newInfo.branch = {
                        left: this.stations[stnId].branch.left, 
                        right: []
                    };
                    this.stations[stnId].branch.left = [];
                    param.stn_list[stnId].branch.left = [];
                }
                newInfo.parents.forEach(par => {
                    this.stations[par].children = [newId];
                    param.stn_list[par].children = [newId];
                });
                newInfo.children.forEach(child => {
                    this.stations[child].parents = [newId];
                    param.stn_list[child].parents = [newId];
                });
            } else if (loc == 'upper') {
                newInfo.branch = { left:[], right:[] };
                if (this._stnIndegree(stnId) == 2) {
                    if (this.stations[stnId].branch.left[1] == this.stations[stnId].parents[0]) {
                        this.stations[stnId].branch.left[1] = newId;
                        param.stn_list[stnId].branch.left[1] = newId;
                    }

                    newInfo.parents = this.stations[stnId].parents.slice(0,1);
                    newInfo.children = [stnId];
                    newInfo.parents.forEach(par => {
                        this.stations[par].children = [newId];
                        param.stn_list[par].children = [newId];
                    });
                    this.stations[stnId].parents[0] = newId;
                    param.stn_list[stnId].parents[0] = newId;
                } else {
                    // already on branch
                    newInfo.parents = this.stations[stnId].parents;
                    newInfo.children = [stnId];
                    newInfo.parents.forEach(par => {
                        this.stations[par].children[0] = newId;
                        param.stn_list[par].children[0] = newId;

                        if (this.stations[par].branch.right[1] === stnId) {
                            this.stations[par].branch.right[1] = newId;
                            param.stn_list[par].branch.right[1] = newId;
                        }
                    });
                    newInfo.children.forEach(child => {
                        this.stations[child].parents = [newId];
                        param.stn_list[child].parents = [newId];
                    });
                }
            } else if (loc == 'lower') {
                newInfo.branch = { left:[], right:[] };
                if (this._stnIndegree(stnId) == 2) {
                    if (this.stations[stnId].branch.left[1] == this.stations[stnId].parents[1]) {
                        this.stations[stnId].branch.left[1] = newId;
                        param.stn_list[stnId].branch.left[1] = newId;
                    }

                    newInfo.parents = this.stations[stnId].parents.slice(1);
                    newInfo.children = [stnId];
                    newInfo.parents.forEach(par => {
                        this.stations[par].children = [newId];
                        param.stn_list[par].children = [newId];
                    });
                    this.stations[stnId].parents[1] = newId;
                    param.stn_list[stnId].parents[1] = newId;
                } else {
                    // already on branch
                    newInfo.parents = this.stations[stnId].parents;
                    newInfo.children = [stnId];
                    newInfo.parents.forEach(par => {
                        let parChildLen = this.stations[par].children.length;
                        this.stations[par].children[parChildLen-1] = newId;
                        param.stn_list[par].children[parChildLen-1] = newId;

                        if (this.stations[par].branch.right[1] === stnId) {
                            this.stations[par].branch.right[1] = newId;
                            param.stn_list[par].branch.right[1] = newId;
                        }
                    });
                    newInfo.children.forEach(child => {
                        this.stations[child].parents = [newId];
                        param.stn_list[child].parents = [newId];
                    });
                }
            } else if (loc == 'newupper') {
                newInfo.branch = { left:[], right:[] };
                this.stations[stnId].branch.left = ['through', newId];
                param.stn_list[stnId].branch.left = ['through', newId];
                this.stations[end].branch.right = ['through', newId];
                param.stn_list[end].branch.right = ['through', newId];

                newInfo.parents = [end];
                newInfo.children = [stnId];
                
                this.stations[end].children.unshift(newId);
                param.stn_list[end].children.unshift(newId);

                this.stations[stnId].parents.unshift(newId);
                param.stn_list[stnId].parents.unshift(newId);
            } else if (loc == 'newlower') {
                newInfo.branch = { left:[], right:[] };
                this.stations[stnId].branch.left = ['through', newId];
                param.stn_list[stnId].branch.left = ['through', newId];
                this.stations[end].branch.right = ['through', newId];
                param.stn_list[end].branch.right = ['through', newId];

                newInfo.parents = [end];
                newInfo.children = [stnId];
                
                this.stations[end].children.push(newId);
                param.stn_list[end].children.push(newId);

                this.stations[stnId].parents.push(newId);
                param.stn_list[stnId].parents.push(newId);
            }
        } else {
            if (loc == 'centre') {
                

                newInfo.children = this.stations[stnId].children;
                if (this._stnOutdegree(stnId)==0 && this._stnYShareMTR(stnId) != 0) {
                    newInfo.parents = this.rightDests;
                } else if (this._stnYShareMTR(stnId) != 0) {
                    // pivot on branch
                    newInfo.parents = this.stations[this.stations[stnId].children[0]].parents;

                    newInfo.branch = {
                        left: this.stations[newInfo.children[0]].branch.left,
                        right: []
                    };
                    this.stations[newInfo.children[0]].branch.left = [];
                    param.stn_list[newInfo.children[0]].branch.left = [];
                } else {
                    // pivot on main
                    newInfo.parents = [stnId];

                    newInfo.branch = {
                        left: [],
                        right: this.stations[stnId].branch.right
                    };
                    this.stations[stnId].branch.right = [];
                    param.stn_list[stnId].branch.right = [];
                }
                newInfo.children.forEach(child => {
                    this.stations[child].parents = [newId];
                    param.stn_list[child].parents = [newId];
                });
                newInfo.parents.forEach(par => {
                    this.stations[par].children = [newId];
                    param.stn_list[par].children = [newId];
                });
            } else if (loc == 'upper') {
                newInfo.branch = { left:[], right:[] }
                if (this._stnOutdegree(stnId) == 2) {
                    if (this.stations[stnId].branch.right[1] == this.stations[stnId].children[0]) {
                        this.stations[stnId].branch.right[1] = newId;
                        param.stn_list[stnId].branch.right[1] = newId;
                    }

                    newInfo.children = this.stations[stnId].children.slice(0,1);
                    newInfo.parents = [stnId];
                    newInfo.children.forEach(child => {
                        this.stations[child].parents = [newId];
                        param.stn_list[child].parents = [newId];
                    });
                    this.stations[stnId].children[0] = newId;
                    param.stn_list[stnId].children[0] = newId;
                } else {
                    // already on branch
                    newInfo.children = this.stations[stnId].children;
                    newInfo.parents = [stnId];
                    newInfo.children.forEach(child => {
                        this.stations[child].parents[0] = newId;
                        param.stn_list[child].parents[0] = newId;

                        if (this.stations[child].branch.left[1] === stnId) {
                            this.stations[child].branch.left[1] = newId;
                            param.stn_list[child].branch.left[1] = newId;
                        }
                    });
                    newInfo.parents.forEach(par => {
                        this.stations[par].children = [newId];
                        param.stn_list[par].children = [newId];
                    });
                }
            } else if (loc == 'lower') {
                newInfo.branch = { left:[], right:[] }
                if (this._stnOutdegree(stnId) == 2) {
                    if (this.stations[stnId].branch.right[1] == this.stations[stnId].children[1]) {
                        this.stations[stnId].branch.right[1] = newId;
                        param.stn_list[stnId].branch.right[1] = newId;
                    }

                    newInfo.children = this.stations[stnId].children.slice(1);
                    newInfo.parents = [stnId];
                    newInfo.children.forEach(child => {
                        this.stations[child].parents = [newId];
                        param.stn_list[child].parents = [newId];
                    });
                    this.stations[stnId].children[1] = newId;
                    param.stn_list[stnId].children[1] = newId;
                } else {
                    // already on branch
                    newInfo.children = this.stations[stnId].children;
                    newInfo.parents = [stnId];
                    newInfo.children.forEach(child => {
                        if (this._stnIndegree(child) === 1) {
                            this.stations[child].parents[0] = newId;
                            param.stn_list[child].parents[0] = newId;
                        } else {
                            this.stations[child].parents[1] = newId;
                            param.stn_list[child].parents[1] = newId;
                        }

                        if (this.stations[child].branch.left[1] === stnId) {
                            this.stations[child].branch.left[1] = newId;
                            param.stn_list[child].branch.left[1] = newId;
                        }
                    });
                    newInfo.parents.forEach(par => {
                        this.stations[par].children = [newId];
                        param.stn_list[par].children = [newId];
                    });
                }
            } else if (loc == 'newupper') {
                newInfo.branch = { left:[], right:[] };
                this.stations[stnId].branch.right = ['through', newId];
                param.stn_list[stnId].branch.right = ['through', newId];
                this.stations[end].branch.left = ['through', newId];
                param.stn_list[end].branch.left = ['through', newId];

                newInfo.children = [end];
                newInfo.parents = [stnId];
                
                this.stations[end].parents.unshift(newId);
                param.stn_list[end].parents.unshift(newId);

                this.stations[stnId].children.unshift(newId);
                param.stn_list[stnId].children.unshift(newId);
            } else if (loc == 'newlower') {
                newInfo.branch = { left:[], right:[] };
                this.stations[stnId].branch.right = ['through', newId];
                param.stn_list[stnId].branch.right = ['through', newId];
                this.stations[end].branch.left = ['through', newId];
                param.stn_list[end].branch.left = ['through', newId];

                newInfo.children = [end];
                newInfo.parents = [stnId];
                
                this.stations[end].parents.push(newId);
                param.stn_list[end].parents.push(newId);

                this.stations[stnId].children.push(newId);
                param.stn_list[stnId].children.push(newId);
            }
        }

        newInfo.name = getNameFromId(newId);
        newInfo.change_type = 'none';
        newInfo.num = '00';
        newInfo.interchange = [[]];
        newInfo.transfer = {
            info: [[]], 
            type: 'none', 
            osi_names: [], 
            paid_area: true, 
            tick_direc: 'r'
        };
        
        param.stn_list[newId] = newInfo;
        putParams(param);

        this.stations[newId] = this._initStnInstance(newId, newInfo);
        this.stations[stnId] = this._initStnInstance(stnId, getParams().stn_list[stnId]);

        for (let [stnId, stnInstance] of Object.entries(this.stations)) {
            if (['linestart', 'lineend'].includes(stnId)) {continue;}
            stnInstance.x = this._stnRealX(stnId);
            stnInstance.y = this._stnRealY(stnId);
            stnInstance.state = this._stnState(stnId);
            stnInstance.namePos = this._txtFlip ? !this._stnNamePos(stnId) : this._stnNamePos(stnId);
        }

        RMGLine.clearSVG();
        this.drawStns();
        this.drawLine();
        this.drawStrip();

        this.drawDestInfo();

        this.loadFonts();

        this.updateStnNameBg();

        return [newId, newInfo];
    }

    reverseStns() {
        var param = getParams();
        for (let [stnId, stnInstance] of Object.entries(this.stations)) {
            if (stnId === 'linestart') {
                param.stn_list['lineend'].parents = stnInstance.children.reverse();
                param.stn_list['lineend'].branch = {
                    left: stnInstance.branch.right, 
                    right: []
                };
            } else if (stnId === 'lineend') {
                param.stn_list['linestart'].children = stnInstance.parents.reverse();
                param.stn_list['linestart'].branch = {
                    left: [], 
                    right: stnInstance.branch.left
                }
            } else {
                var tmpArr = stnInstance.children.reverse().map(id => {
                    switch (id) {
                        case 'linestart': return 'lineend';
                        case 'lineend': return 'linestart';
                        default: return id;
                    }
                });
                param.stn_list[stnId].children = stnInstance.parents.reverse().map(id => {
                    switch (id) {
                        case 'linestart': return 'lineend';
                        case 'lineend': return 'linestart';
                        default: return id;
                    }
                });
                param.stn_list[stnId].parents = tmpArr;
                param.stn_list[stnId].branch.left = stnInstance.branch.right;
                param.stn_list[stnId].branch.right = stnInstance.branch.left;
            }
        }
        putParams(param);
        location.reload(true);
    }

    updateBranchType(stnId: ID, direction: DirectionLong, type: 'through' | 'nonthrough') {
        let direc = DirectionLong[direction];
        // no change
        if (this.stations[stnId].branch[direc][0] === type) {return;}

        this.stations[stnId].branch[direc][0] = type;
        let param = getParams();
        param.stn_list[stnId].branch[direc][0] = type;
        putParams(param);

        for (let [stnId, stnInstance] of Object.entries(this.stations)) {
            if (['linestart', 'lineend'].includes(stnId)) {continue;}
            stnInstance.state = this._stnState(stnId);
        }
        RMGLine.clearSVG();
        this.drawStns();
        this.drawLine();
        this.drawDestInfo();
        this.loadFonts();
    }

    updateBranchFirst(stnId: ID, direction: DirectionLong, first: ID) {
        let direc = DirectionLong[direction];
        // no change
        if (this.stations[stnId].branch[direc][1] === first) {return false;}

        let branchEndId = first;
        let param = getParams();
        if (direc === 'right') {
            while (this.stations[branchEndId].inDegree === 1) {
                branchEndId = this.stations[branchEndId].children[0];
            }
            let branchFirstIdx = this.stations[stnId].children.indexOf(first);
            
            this.stations[stnId].branch.right[1] = param.stn_list[stnId].branch.right[1] = first;
            this.stations[branchEndId].branch.left[1] = param.stn_list[branchEndId].branch.left[1] = this.stations[branchEndId].parents[branchFirstIdx];
        } else {
            while (this.stations[branchEndId].outDegree === 1) {
                branchEndId = this.stations[branchEndId].parents[0];
            }
            let branchFirstIdx = this.stations[stnId].parents.indexOf(first);

            this.stations[stnId].branch.left[1] = param.stn_list[stnId].branch.left[1] = first;
            this.stations[branchEndId].branch.right[1] = param.stn_list[branchEndId].branch.right[1] = this.stations[branchEndId].children[branchFirstIdx];
        }
        putParams(param);

        for (let [stnId, stnInstance] of Object.entries(this.stations)) {
            if (['linestart', 'lineend'].includes(stnId)) {continue;}
            stnInstance.x = this._stnRealX(stnId);
            stnInstance.y = this._stnRealY(stnId);
            stnInstance.state = this._stnState(stnId);
        }
        RMGLine.clearSVG();
        this.drawStns();
        this.drawLine();
        this.drawDestInfo();
        this.loadFonts();

        return true;
    }

    updateBranchPos(stnId: ID, direction: DirectionLong, pos: 0 | 1) {
        let direc = DirectionLong[direction];
        // no change
        if (direc === 'right') {
            if (this.stations[stnId].children.indexOf(this.stations[stnId].branch.right[1]) === pos) {return;}
        } else {
            if (this.stations[stnId].parents.indexOf(this.stations[stnId].branch.left[1]) === pos) {return;}
        }

        let branchEndId = this.stations[stnId].branch[direc][1];
        let param = getParams();
        if (direc === 'right') {
            while (this.stations[branchEndId].inDegree === 1) {
                branchEndId = this.stations[branchEndId].children[0];
            }
            this.stations[stnId].children.reverse();
            param.stn_list[stnId].children.reverse();
            this.stations[branchEndId].parents.reverse();
            param.stn_list[branchEndId].parents.reverse();
        } else {
            while (this.stations[branchEndId].outDegree === 1) {
                branchEndId = this.stations[branchEndId].parents[0];
            }
            this.stations[stnId].parents.reverse();
            param.stn_list[stnId].parents.reverse();
            this.stations[branchEndId].children.reverse();
            param.stn_list[branchEndId].children.reverse();
        }
        putParams(param);

        for (let [stnId, stnInstance] of Object.entries(this.stations)) {
            if (['linestart', 'lineend'].includes(stnId)) {continue;}
            stnInstance.x = this._stnRealX(stnId);
            stnInstance.y = this._stnRealY(stnId);
        }
        RMGLine.clearSVG();
        this.drawStns();
        this.drawLine();
        this.drawDestInfo();
        this.loadFonts();
    }

    static clearSVG() {
        $('#stn_icons, #line_main, #line_pass').empty();
    }

    static initSVG(line) {
        line.drawSVGFrame();
        line.showFrameOuter();
        line.drawStns();
        line.fillThemeColour();
        line.drawLine();
        line.drawStrip();
        line.drawDestInfo();
        line.loadFonts();
        line.updateStnNameBg();
    }

    get branches() {
        var stack = ['linestart'];
        var branches = [[]];
        var branchCount = 0;
        
        while (stack.length) {
            var curId = stack.shift();
            var prevId = branches[branchCount][0] || null;
            var curBranch = [curId];
            if (prevId) {curBranch.unshift(prevId);}
            while (true) {
                if (curId == 'lineend') {break;}
                if (curId != 'linestart' && prevId == this.stations[curId].branch.left[1]) {
                    // branch ends
                    break;
                } else {
                    prevId = curId;
                    var children = this.stations[prevId].children;
                    switch (children.length) {
                        case 1:
                            curId = children[0];
                            break;
                        case 2:
                            branches.push([prevId]);
                            if (prevId == 'linestart') {
                                var branchNextId = this.stations[prevId].branch.right[1];
                            } else {
                                var branchNextId = this.stations[prevId].branch.right[1];
                            }
                            // var branchNextId = getParams().stn_list[prevId].branch.right[1];
                            stack.push(branchNextId);
                            curId = children.filter(stnId => stnId != branchNextId)[0];
                            break;
                    }
                    curBranch.push(curId);
                }
            }
            branches[branchCount] = curBranch;
            branchCount++;
        }

        return branches.map(branch => {
            return branch.filter(stnId => !['linestart', 'lineend'].includes(stnId));
        });
    }

    /**
     * Getter of routes (行車交路) of the line. The first route must be the main line. 
     */
    get routes() {
        var stack = ['linestart'];
        var branches = [['linestart']];
        var branchCount = 0;
        
        while (stack.length) {
            var curId = stack.shift();
            var prevId = branches[branchCount].slice().reverse()[0] || null;
            if (prevId && curId !== 'linestart') {
                branches[branchCount].push(curId);
            } else {
                branches[branchCount] = [curId];
            }
            while (curId !== 'lineend') {
                prevId = curId;
                var children = this.stations[prevId].children;
                switch (children.length) {
                    case 1:
                        curId = children[0];
                        break;
                    case 2:
                        var branchNextId = this.stations[prevId].branch.right[1];
                        // if (branchCount === 0) {
                        if (this.stations[prevId].branch.right[0] === 'through') {
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
                        curId = children.filter(stnId => stnId != branchNextId)[0];
                        break;
                }
                branches[branchCount].push(curId);

                if (prevId === this.stations[curId].branch.left[1] && this.stations[curId].branch.left[0] === 'nonthrough') {
                    break;
                }
            }
            // branches[branchCount] = curBranch;
            branchCount++;
        }

        return branches;
    }
}
