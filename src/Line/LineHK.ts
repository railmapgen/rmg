import { RMGLine } from './Line';
import { RMGParam, getTxtBoxDim, setParams, Name, ID, DirectionLong } from '../utils';

export class RMGLineHK extends RMGLine {
    private _charForm: 'trad' | 'cn' | 'tw' | 'jp';
    private _destLegacy: boolean; 

    constructor (param: RMGParam) {
        super(param);

        this._charForm = param.char_form;
        this._destLegacy = param.dest_legacy;
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
        super.txtFlip = flag;
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

    set currentStnId(val: ID) {
        super.currentStnId = val;
        this.loadFonts();
        this.updateStnNameBg();
    }

    loadFonts() {
        $('.rmg-name__zh').addClass(`rmg-name__char-${this._charForm}`);
    }

    /**
     * Update background of current station name. `y` and `height` are changed while station icon is re-drawn and `RMGStation.nameHTML` is loaded. 
     */
    updateStnNameBg() {
        var stnNameDim = getTxtBoxDim(
            $(`#stn_icons > #${this._currentStnId} g.Name`)[0] as Element as SVGGraphicsElement,
            'railmap'
        );
        $('#current_bg').attr({
            x: stnNameDim.x-3, 
            width: stnNameDim.width+6, 
        });
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

    updateStnName(stnId: ID, names: Name, stnNum: string) {
        super.updateStnName(stnId, names, stnNum);

        this.loadFonts();
        if (stnId == this._currentStnId) {this.updateStnNameBg();}
    }

    updateStnTransfer(stnId: ID, type, info=null) {
        super.updateStnTransfer(stnId, type, info);
        this.loadFonts();
        this.updateStnNameBg();
    }

    addStn(prep: 'before' | 'after', stnId: ID, loc, end: ID) {
        let res = super.addStn(prep, stnId, loc, end);

        this.loadFonts();
        this.updateStnNameBg();

        return res;
    }

    removeStn(stnId: ID) {
        if (!super.removeStn(stnId)) {return false;}
        this.loadFonts();
        this.updateStnNameBg();
        return true;
    }

    updateBranchType(stnId: ID, direction: DirectionLong, type: 'through' | 'nonthrough') {
        if (!super.updateBranchType(stnId, direction, type)) {return false;}
        this.loadFonts();
        return true;
    }

    updateBranchFirst(stnId: ID, direction: DirectionLong, first: ID) {
        if (!super.updateBranchFirst(stnId, direction, first)) {return false;}
        this.loadFonts();
        return true;
    }

    updateBranchPos(stnId: ID, direction: DirectionLong, pos: 0 | 1) {
        if (!super.updateBranchPos(stnId, direction, pos)) {return false;}
        this.loadFonts();
        return true;
    }

    static initSVG(line) {
        super.initSVG(line);
        line.loadFonts();
        line.updateStnNameBg();
    }
}