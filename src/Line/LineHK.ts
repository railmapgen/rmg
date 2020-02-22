import { RMGLine } from './Line';
import { RMGParam, Name, DirectionLong, StationInfo } from '../types';
import { getTxtBoxDim, setParams, getParams, putParams } from '../utils';
import { RMGStationHK, Int2StationHK, Int3LStationHK, Int3RStationHK, OSI11LStationHK, OSI12LStationHK, OSI12RStationHK, OSI22EndStationHK, OSI22LStationHK, OSI22RStationHK, OSI11RStationHK, OSI22StationHK } from '../Station/StationHK';

export class RMGLineHK extends RMGLine {
    public stations: {
        [index: string]: RMGStationHK;
    }
    private _txtFlip: boolean;
    private _charForm: 'trad' | 'cn' | 'tw' | 'jp';
    private _destLegacy: boolean; 

    constructor (param: RMGParam) {
        super(param);

        this._txtFlip = param.txt_flip;
        this._charForm = param.char_form;
        this._destLegacy = param.dest_legacy;
    }

    _initStnInstance(stnId: string, stnInfo: StationInfo) {
        switch (stnInfo.transfer.type) {
            case 'int2':
            case 'osi21':
                return new Int2StationHK(stnId, stnInfo);
            case 'int3':
            case 'osi31':
                return stnInfo.transfer.tick_direc==='l' ?
                    new Int3LStationHK(stnId, stnInfo) : 
                    new Int3RStationHK(stnId, stnInfo);
            case 'osi11':
                return stnInfo.transfer.tick_direc==='l' ?
                    new OSI11LStationHK(stnId, stnInfo) : 
                    new OSI11RStationHK(stnId, stnInfo);
            case 'osi12':
            case 'osi13':
                return stnInfo.transfer.tick_direc==='l' ?
                    new OSI12LStationHK(stnId, stnInfo) : 
                    new OSI12RStationHK(stnId, stnInfo);
            case 'osi22':
                if (stnInfo.parents[0]==='linestart' || stnInfo.children[0]==='lineend') {
                    return new OSI22EndStationHK(stnId, stnInfo);
                } else {
                    return stnInfo.transfer.tick_direc==='l' ?
                        new OSI22LStationHK(stnId, stnInfo) :
                        new OSI22RStationHK(stnId, stnInfo);
                }
            default:
                return new RMGStationHK(stnId, stnInfo);
        }
    }

    _updateStnInstance(stnId: string) {
        super._updateStnInstance(stnId);
        this.stations[stnId].namePos = this._txtFlip ? !this._stnNamePos(stnId) : this._stnNamePos(stnId);
    }

    set svgDestWidth(val: number) {
        super.svgDestWidth = val;
        this.loadFonts();
    }

    set svgWidth(val: number) {
        super.svgWidth = val;
        this.loadFonts();
        this.updateStnNameBg();
    }

    set padding(val: number) {
        super.padding = val;
        this.loadFonts();
        this.updateStnNameBg();
    }

    set branchSpacing(val: number) {
        super.branchSpacing = val;
        this.loadFonts();
        this.updateStnNameBg();
    }

    set txtFlip(flag: boolean) {
        this._txtFlip = flag;
        setParams('txt_flip', flag);

        for (let [stnId, stnInstance] of Object.entries(this.stations)) {
            if (['linestart', 'lineend'].includes(stnId)) {continue;}
            stnInstance.namePos = this._txtFlip ? !this._stnNamePos(stnId) : this._stnNamePos(stnId);
        }

        $('#stn_icons').empty();
        this.drawStns();
        this.loadFonts();
        this.updateStnNameBg();
    }

    set direction(val: 'l' | 'r') {
        super.direction = val;
        this.loadFonts();
    }

    /**
     * Setter of character form. 
     * @param val 'trad', 'cn', 'tw' or 'jp'
     */
    set charForm(val: 'trad' | 'cn' | 'tw' | 'jp') {
        this._charForm = val;
        setParams('char_form', val);

        $('.rmg-name__char-trad, .rmg-name__char-cn, .rmg-name__char-tw, .rmg-name__char-jp')
            .removeClass('rmg-name__char-trad rmg-name__char-cn rmg-name__char-tw rmg-name__char-jp')
            .addClass(`rmg-name__char-${val}`);
    }

    set lineNames(val: Name) {
        super.lineNames = val;
        if (this._destLegacy) {
            this.drawDestInfo();
            this.loadFonts();
        }
    }

    /**
     * Setter of legacy style of destination information panel. 
     */
    set destLegacy(val: boolean) {
        this._destLegacy = val;
        setParams('dest_legacy', val);

        this.drawDestInfo();
        this.loadFonts();
    }

    set currentStnId(val: string) {
        super.currentStnId = val;
        this.loadFonts();
        this.updateStnNameBg();
    }

    _stnRealY(stnId: string) {
        let y = super._stnRealY(stnId);
        if (this.branches[0].includes(stnId)) {
            // on main line
            return y;
        } else {
            // shift 11px
            y += y>0 ? 9.68 : -9.68;
            return y;
        }
    }

    /**
     * Station name position (`false`: above line, `true`: below line, given `txtFlip` is `false`).
     */
    private _stnNamePos(stnId: string): boolean {
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

    loadFonts() {
        // $('.rmg-name__zh').addClass(`rmg-name__char-${this._charForm}`);
    }

    drawStns() {
        super.drawStns();
        for (let [stnId, stnInstance] of Object.entries(this.stations)) {
            if (['linestart', 'lineend'].includes(stnId)) {continue;}
            let el = stnInstance.usageIconHTML;
            if (el === false) {
                continue;
            } else {
                $(`#stn_icons #${stnId} g#stn_name`).append(el);
                $(`#stn_icons #${stnId}`).html($(`#stn_icons #${stnId}`).html()); // Refresh DOM
            }
        }
    }

    /**
     * Update background of current station name. `y` and `height` are changed while station icon is re-drawn and `RMGStation.nameHTML` is loaded. 
     */
    updateStnNameBg() {
        var stnNameDim = getTxtBoxDim(
            $(`#stn_icons > #${this._currentStnId} g#stn_name`)[0] as Element as SVGGraphicsElement,
            'railmap'
        );
        $('#current_bg').attr({
            x: stnNameDim.x-3, 
            width: stnNameDim.width+6, 
        });
    }

    get stnDX() {
        // return this.turningRadius - this._branchSpacing/2;
        let {dx_a, dx_l} = this.pathTurnParams;
        return dx_a + dx_l/2;
    }
    get stnExtraH() {
        var [lineStart, lineEnd] = this.lineXs;
        return (lineEnd - lineStart) / this.criticalPath.len * this._longInterval;
    }
    get stnSpareH() {
        var [lineStart, lineEnd] = this.lineXs;
        var dh = ( (lineEnd-lineStart)/this.criticalPath.len - 2*this.stnDX ) / 2;
        if ((dh + this.stnExtraH) < 0) {
            console.warn(`SVG width too small! ${dh+this.stnExtraH}`);
        }
        return dh;
    }

    /**
     * Parameters of the arcs involved in the `<path>` element. 
     */
    get pathTurnParams() {
        let tr = 35; // turning radius
        let dx_a = tr / 2; // dx of a
        let dy_a = tr - dx_a * Math.sqrt(3); // dy of a
        let dy_l = this._branchSpacing - 2 * dy_a; // dy of l
        let dx_l = dy_l * Math.sqrt(3) // dx of l
        return {tr, dx_a, dy_a, dx_l, dy_l};
    }
    
    /**
     * Path segment from a station towards its southeast (lower-right). 
     */
    get pathTurnSE() {
        let {tr, dx_a, dy_a, dx_l, dy_l} = this.pathTurnParams;
        return `a ${tr},${tr} 0 0,1 ${dx_a},${dy_a} l ${dx_l},${dy_l} a ${tr},${tr} 0 0,0 ${dx_a},${dy_a}`;
    }

    /**
     * Path segment from a station towards its northeast (upper-right). 
     */
    get pathTurnNE() {
        let {tr, dx_a, dy_a, dx_l, dy_l} = this.pathTurnParams;
        return `a ${tr},${tr} 0 0,0 ${dx_a},${-dy_a} l ${dx_l},${-dy_l} a ${tr},${tr} 0 0,1 ${dx_a},${-dy_a}`;
    }

    _linePath(stnIds: string[]) {
        var [prevId, prevY, prevX]: [string?, number?, number?] = [];
        var path = [];

        var { stnExtraH, stnSpareH, stnDX } = this;

        stnIds.forEach(stnId => {
            var [x,y] = ['_stnRealX', '_stnRealY'].map(fun => this[fun](stnId));
            if (!prevY && prevY !== 0) {
                [prevId, prevX, prevY] = [stnId, x, y];
                if (stnIds.length === 1) {
                    path.push(`M ${x},${y}`);
                } else if (!this.branches[0].includes(stnId)) {
                    // started from branch
                    path.push(`M ${x},${y}`)
                } else if (this.branches[0].includes(stnIds[1])) {
                    // started from branching station, this is main line
                    path.push(`M ${x},${y}`);
                } else {
                    // started form branching station, this is branch line
                    if (this._stnRealY(stnIds[1]) > 0) {
                        path.push(`M ${x},${y+9.68}`);
                    }
                    if (this._stnRealY(stnIds[1]) < 0) {
                        path.push(`M ${x},${y-9.68}`);
                    }
                }
                return;
            }
            if (y > prevY) {
                path.push(
                    y===0 ? `h ${x - prevX - stnExtraH*this._leftWideFactor(stnId) - stnSpareH - stnDX*2}` : `h ${stnExtraH * this._rightWideFactor(prevId) + stnSpareH}`
                );
                path.push(this.pathTurnSE);
            } else if (y < prevY) {
                path.push(
                    y===0 ? `h ${x - prevX - stnExtraH*this._leftWideFactor(stnId) - stnSpareH - stnDX*2}` : `h ${stnExtraH * this._rightWideFactor(prevId) + stnSpareH}`
                );
                path.push(this.pathTurnNE);
            }
            path.push(`H ${x}`);
            [prevId, prevX, prevY] = [stnId, x, y];
        });

        // simplify path
        return path.join(' ').replace(/( H ([\d.]+))+/g, ' H $2');
    }

    drawDestInfo() {
        $('#dest_name > #platform > text').text(this._platformNum);

        let validDest: string[] = this[this._direction + 'ValidDests'];
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
        $('#dest_name > use').css('transform', `translateX(${arrowX}px)rotate(${arrowRotate}deg)`);
        $('#dest_name > #platform').css('transform', `translateX(${platformNumX}px)`);
        $('#dest_name > g:last-child').attr({
            transform: `translate(${destNameX},-25)`, 
            'text-anchor': txtAnchor
        });
    }

    protected _leftWideFactor(stnId: string) {
        var res = 0;
        let stnInstance = this.stations[stnId];
        if (stnInstance instanceof Int3LStationHK) {res += this._longInterval;}
        if (stnInstance instanceof OSI11LStationHK) {res += this._longInterval;}
        if (stnInstance instanceof OSI12LStationHK) {res += this._longInterval;}
        if (stnInstance instanceof OSI22StationHK) {res += this._longInterval;}
        if (this._stnIndegree(stnId) == 2) {res += this._longInterval/2;}
        if (this._stnOutdegree(this.stations[stnId].parents[0]) == 2) {res += this._longInterval/2;}
        return res;
    }

    protected _rightWideFactor(stnId: string) {
        var res = 0;
        let stnInstance = this.stations[stnId];
        if (stnInstance instanceof Int3RStationHK) {res += this._longInterval;}
        if (stnInstance instanceof OSI11RStationHK) {res += this._longInterval;}
        if (stnInstance instanceof OSI12RStationHK) {res += this._longInterval;}
        if (stnInstance instanceof OSI22StationHK) {res += this._longInterval;}
        if (this._stnOutdegree(stnId) == 2) {res += this._longInterval/2;}
        if (this._stnIndegree(this.stations[stnId].children[0]) == 2) {res += this._longInterval/2;}
        return res;
    }

    updateStnName(stnId: string, names: Name) {
        super.updateStnName(stnId, names);

        this.loadFonts();

        let stnInstance = this.stations[stnId];
        let el = stnInstance.usageIconHTML;
        if (el === false) {
            return;
        } else {
            $(`#stn_icons #${stnId} g#stn_name`).append(el);
            $(`#stn_icons #${stnId}`).html($(`#stn_icons #${stnId}`).html()); // Refresh DOM
        }

        if (stnId == this._currentStnId) {this.updateStnNameBg();}
    }

    updateStnTransfer(stnId: string, type, info=null) {
        super.updateStnTransfer(stnId, type, info);
        this.loadFonts();
        this.updateStnNameBg();
    }

    updateStnUsage(stnId: string, chipId) {
        if (this.stations[stnId].usage === chipId) {return;}

        this.stations[stnId].usage = chipId;
        let param = getParams();
        param.stn_list[stnId].usage = chipId;
        putParams(param);

        $(`#stn_icons #${stnId}`).remove();
        $('#stn_icons').append(this.stations[stnId].html);
        $('#stn_icons').html($('#stn_icons').html());
        this.loadFonts();
        let el = this.stations[stnId].usageIconHTML;
        if (el !== false) {
            $(`#stn_icons #${stnId} g#stn_name`).append(el);
            $(`#stn_icons #${stnId}`).html($(`#stn_icons #${stnId}`).html()); // Refresh DOM
        }

        if (this._currentStnId === stnId) {
            this.updateStnNameBg();
        }
    }

    addStn(prep: 'before' | 'after', stnId: string, loc, end: string) {
        let res = super.addStn(prep, stnId, loc, end);

        this.loadFonts();
        this.updateStnNameBg();

        return res;
    }

    removeStn(stnId: string) {
        if (!super.removeStn(stnId)) {return false;}
        this.loadFonts();
        this.updateStnNameBg();
        return true;
    }

    updateBranchType(stnId: string, direction: DirectionLong, type: 'through' | 'nonthrough') {
        if (!super.updateBranchType(stnId, direction, type)) {return false;}
        this.loadFonts();
        return true;
    }

    updateBranchFirst(stnId: string, direction: DirectionLong, first: string) {
        if (!super.updateBranchFirst(stnId, direction, first)) {return false;}
        this.loadFonts();
        return true;
    }

    updateBranchPos(stnId: string, direction: DirectionLong, pos: 0 | 1) {
        if (!super.updateBranchPos(stnId, direction, pos)) {return false;}
        this.loadFonts();
        return true;
    }

    static initSVG(line) {
        super.initSVG(line);
        line.txtFlip = line._txtFlip;
        line.loadFonts();
        line.updateStnNameBg();
    }
}