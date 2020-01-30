import { getTxtBoxDim, setParams } from '../utils.js';
import { RMGStationGZ, IntStationGZ, BranchStationGZ, OSIStationGZ } from '../Station/StationGZ.js';
import { RMGLine } from './Line.js';
class RMGLineGZ extends RMGLine {
    constructor(param) {
        super(param);
        this._psdNum = param.psd_num;
        this._lineNum = param.line_num;
        this._infoPanelType = param.info_panel_type;
    }
    _initStnInstance(stnId, stnInfo) {
        if (stnInfo.children.length === 2 || stnInfo.parents.length === 2) {
            return new BranchStationGZ(stnId, stnInfo, [this.themeCity, this.themeLine, this._themeColour, this._fgColour, ...this._lineNames]);
        }
        switch (stnInfo.change_type) {
            case 'int2':
            // return new Int2StationGZ(stnId, stnInfo);
            case 'int3_l':
            case 'int3_r':
                return new IntStationGZ(stnId, stnInfo);
            case 'osi11_ul':
            case 'osi11_pl':
            case 'osi11_ur':
            case 'osi11_pr':
            // return new OSI11StationGZ(stnId, stnInfo);
            case 'osi12_ul':
            case 'osi12_pl':
            case 'osi12_ur':
            case 'osi12_pr':
            case 'osi22_ul':
            case 'osi22_pl':
            case 'osi22_ur':
            case 'osi22_pr':
                return new OSIStationGZ(stnId, stnInfo);
            case 'osi22_end_p':
            case 'osi22_end_u':
                if (stnInfo.parents[0] == 'linestart' || stnInfo.children[0] == 'lineend') {
                    return new OSIStationGZ(stnId, stnInfo);
                }
            default:
                return new RMGStationGZ(stnId, stnInfo);
        }
    }
    get lineXs() {
        if (this._direction == 'r') {
            return [
                this._svgWidth * this._padding / 100 + 65,
                this._svgWidth * (1 - this._padding / 100)
            ];
        }
        else {
            return [
                this._svgWidth * this._padding / 100,
                this._svgWidth * (1 - this._padding / 100) - 65
            ];
        }
    }
    set svgWidth(val) {
        super.svgWidth = val;
        this.loadLineNum();
        this.loadLineName();
        this.loadDirection();
    }
    // set yPc(val: number) {
    //     super.yPc = val;
    //     // this.loadLineNum();
    //     // this.loadLineName();
    // }
    set padding(val) {
        super.padding = val;
        this.loadLineNum();
        this.loadLineName();
    }
    set branchSpacing(val) {
        super.branchSpacing = val;
        this.loadLineNum();
    }
    set direction(val) {
        this._direction = val;
        setParams('direction', val);
        for (let [stnId, stnInstance] of Object.entries(this.stations)) {
            if (['linestart', 'lineend'].includes(stnId)) {
                continue;
            }
            stnInstance.x = this._stnRealX(stnId);
            stnInstance.y = this._stnRealY(stnId);
            stnInstance.state = this._stnState(stnId);
        }
        RMGLineGZ.clearSVG();
        this.drawStns();
        this.drawLine();
        this.drawDestInfo();
        this.loadLineNum();
        this.loadLineName();
        this.loadDirection();
        this.loadFonts();
    }
    set txtFlip(val) {
        super.txtFlip = val;
        this.loadLineNum();
    }
    set currentStnId(val) {
        super.currentStnId = val;
        this.loadLineNum();
        this.loadDirection();
    }
    set lineNum(val) {
        this._lineNum = val;
        setParams('line_num', val);
        this.loadLineNum();
        this.loadFonts();
    }
    set lineNames(val) {
        this._lineNames = val;
        setParams('line_name', val);
        this.loadLineName();
        // (to be fixed) redraw branching station
        this.loadFonts();
    }
    set psdNum(val) {
        this._psdNum = val;
        setParams('psd_num', val);
        $('.rmg-psd-num').text(val);
    }
    set infoPanelType(val) {
        this._infoPanelType = val;
        setParams('info_panel_type', val);
        $('#station_info_gzmtr #indicator_light').attr('xlink:href', '#indicator_' + val);
        // $('#dest_strip, #strip').removeAttr('class').addClass(`rmg-strip__gzmtr--${this._infoPanelType}`);
        this.drawStrip();
        this.fillThemeColour();
        this.drawPSD();
    }
    _stnYShare(stnId) {
        if (['linestart', 'lineend'].includes(stnId)) {
            return 0;
        }
        var branches = this.branches;
        if (branches[0].includes(stnId)) {
            return 0;
        }
        else {
            let i = 1;
            while (!branches[i].includes(stnId)) {
                i++;
            }
            if (branches[0].includes(branches[i][0])) {
                var branchingStnId = branches[i][0];
                var neToFind = 'children';
                if (this.stations[branchingStnId][neToFind].indexOf(branches[i][1]) == 0) {
                    return 2;
                }
                else {
                    return -2;
                }
            }
            else {
                var branchingStnId = branches[i].slice().reverse()[0];
                var neToFind = 'parents';
                if (this.stations[branchingStnId][neToFind].indexOf(branches[i].slice().reverse()[1]) == 0) {
                    return 2;
                }
                else {
                    return -2;
                }
            }
        }
    }
    drawStrip() {
        // $('#strip, #dest_strip').attr('d', `M 0,${this.stripY} H ${this._svgWidth}`)
        // super.drawStrip();
        // $('#dest_strip, #strip').removeAttr('class').addClass(`rmg-strip__gzmtr--${this._infoPanelType}`);
        // $('#dest_strip_gz')
        switch (this._infoPanelType) {
            case 'panasonic':
            case 'gz_2':
                $('#dest_strip_gz, #strip_gz').attr({
                    y: this._svgHeight - 60,
                    height: 60
                });
                break;
            case 'gz_3':
                $('#dest_strip_gz, #strip_gz').attr({
                    y: this._svgHeight - 40,
                    height: 40
                });
        }
    }
    _rightWideFactor(stnId) {
        if (this.stations[stnId].constructor.name === 'BranchStationGZ' && this.stations[stnId]._tickRotation === 0) {
            return 0.25;
        }
        else {
            return 0;
        }
    }
    _leftWideFactor(stnId) {
        if (this.stations[stnId].constructor.name === 'BranchStationGZ' && this.stations[stnId]._tickRotation !== 0) {
            return 0.5;
        }
        else {
            return 0;
        }
    }
    _pathWeight(stnId1, stnId2) {
        if (!this.stations[stnId1].children.includes(stnId2)) {
            return -Infinity;
        }
        return 1 + this._rightWideFactor(stnId1) + this._leftWideFactor(stnId2);
        // return 1;
    }
    _linePath(stnIds) {
        var [prevId, prevY, prevX] = [];
        var path = [];
        var { stnExtraH, stnSpareH, pathTurnESE, pathTurnSEE, pathTurnENE, pathTurnNEE, stnDX } = this;
        stnIds.forEach(stnId => {
            var [x, y] = ['_stnRealX', '_stnRealY'].map(fun => this[fun](stnId));
            if (!prevY && prevY !== 0) {
                [prevId, prevX, prevY] = [stnId, x, y];
                path.push(`M ${x},${y}`);
                return;
            }
            if (y === this.y) {
                if (y < prevY) {
                    path.push(`H ${x - 25}`, 'a 25,25 0 0,0 25,-25', `V ${y}`);
                }
                if (y > prevY) {
                    path.push(`H ${x - 25}`, 'a 25,25 0 0,1 25,25', `V ${y}`);
                }
            }
            else {
                if (y < prevY) {
                    path.push(`V ${y + 25}`, 'a 25,25 0 0,1 25,-25', `H ${x}`);
                }
                if (y > prevY) {
                    path.push(`V ${y - 25}`, 'a 25,25 0 0,0 25,25', `H ${x}`);
                }
            }
            // if (y != prevY && y == this.y) {
            //     path.push(
            //         `H ${x}`, `V ${y}`
            //     )
            // } else if (y != prevY && y != this.y) {
            //     path.push(
            //         `V ${y}`, `H ${x}`
            //     )
            // }
            path.push(`H ${x}`);
            [prevId, prevX, prevY] = [stnId, x, y];
        });
        // simplify path
        return path.join(' ').replace(/( H ([\d.]+))+/g, ' H $2');
    }
    drawLine() {
        $('.rmg-line').removeClass('rmg-line__mtr').addClass('rmg-line__gzmtr');
        super.drawLine();
    }
    loadFonts() {
        $('.rmg-name__zh, .rmg-name__en').addClass('rmg-name__gzmtr');
    }
    fillThemeColour() {
        super.fillThemeColour();
        $('#dest_strip_gz, #strip_gz').attr('fill', this._themeColour);
        if (this._infoPanelType === 'gz_3') {
            $('#big_psd use').attr('fill', this._themeColour);
            if (this._fgColour === '#fff') {
                $('#big_psd text').addClass('rmg-name__gzmtr--white-fg');
            }
            else {
                $('#big_psd text').removeClass('rmg-name__gzmtr--white-fg');
            }
        }
        else {
            $('#big_psd use').attr('fill', 'white');
            $('#big_psd text').removeClass('rmg-name__gzmtr--white-fg');
        }
        $('path#stn_gz').attr('stroke', this._themeColour);
        $('#station_info_gzmtr > #platform > circle').attr('fill', this._themeColour);
        $('#line_name use').attr('fill', this._themeColour);
        if (this._fgColour === '#fff') {
            $('#station_info_gzmtr > #platform text').addClass('rmg-name__gzmtr--white-fg');
            $('#line_name text').addClass('rmg-name__gzmtr--white-fg');
        }
        else {
            $('#station_info_gzmtr > #platform text').removeClass('rmg-name__gzmtr--white-fg');
            $('#line_name text').removeClass('rmg-name__gzmtr--white-fg');
        }
    }
    updateStnNameBg() {
        $('#current_bg').hide();
    }
    loadLineNum() {
        const LINE_NUM_MAX_WIDTH = 15.59375;
        $('.rmg-name__gzmtr--line-num').text(this._lineNum).attr('transform', `translate(-9.25,0)`);
        var lineNumDim = getTxtBoxDim($('.rmg-name__gzmtr--line-num')[1], 'railmap');
        if (this._lineNum.length === 2) {
            var lineNumScale = lineNumDim.width > LINE_NUM_MAX_WIDTH ? LINE_NUM_MAX_WIDTH / lineNumDim.width : 1;
            $('.rmg-name__gzmtr--line-num').attr('transform', `translate(-9.25,0)scale(${lineNumScale})`);
            $('.rmg-name__gzmtr--station-num').attr('transform', `translate(9.25,0)scale(${lineNumScale})`);
        }
        else {
            var lineNumScale = lineNumDim.width > LINE_NUM_MAX_WIDTH ? LINE_NUM_MAX_WIDTH / lineNumDim.width : 1;
            $('.rmg-name__gzmtr--line-num').attr('transform', `translate(-9.25,0)scale(${lineNumScale})`);
            $('.rmg-name__gzmtr--station-num').attr('transform', `translate(9.25,0)`);
        }
    }
    loadLineName() {
        var lineNameZHs = this._lineNames[0].match(/[\d]+|[\D]+/g) || '';
        var lineNameSplitOk = false;
        if (lineNameZHs.length == 2) {
            if (!isNaN(Number(lineNameZHs[0])) && isNaN(Number(lineNameZHs[1]))) {
                lineNameSplitOk = true;
            }
        }
        if (lineNameSplitOk) {
            $('#line_name tspan').eq(0).text(lineNameZHs[0]);
            $('#line_name tspan').eq(1).text(lineNameZHs[1]);
            $('#line_name tspan').eq(1).attr('dy', '-0.5');
        }
        else {
            $('#line_name tspan').eq(0).text('');
            $('#line_name tspan').eq(1).text(this._lineNames[0]);
            $('#line_name tspan').eq(1).attr('dy', '-0.5');
        }
        // $('#line_name tspan').eq(1).text(lineNameZHs[lineNameZHs.length-1])
        $('#line_name text:last-child').text(this._lineNames[1]);
        if (this._lineNames[1].length > 10) {
            $('#line_name text:last-child')
                .text(this._lineNames[1])
                .addClass('rmg-name__gzmtr--int-small')
                .removeClass('rmg-name__gzmtr--int');
        }
        else {
            $('#line_name text:last-child')
                .text(this._lineNames[1])
                .removeClass('rmg-name__gzmtr--int-small')
                .addClass('rmg-name__gzmtr--int');
        }
        if (this._fgColour == '#fff') {
            $('#line_name text').addClass('rmg-name__gzmtr--white-fg');
        }
        var lineNameX = this._direction == 'r' ? this.lineXs[0] - 65 : this.lineXs[1] + 65;
        $('#line_name')
            .attr({
            transform: `translate(${lineNameX},${this.y - 18})scale(1.5)`
        });
    }
    loadDirection() {
        let validDest;
        if (this._direction == 'l') {
            $('#direction_gz use').attr('transform', `translate(${this._svgWidth / 2 - 65},205)scale(0.35)`);
            $('#direction_gz g').attr('text-anchor', 'start');
            validDest = this.lValidDests;
        }
        else {
            $('#direction_gz use').attr('transform', `translate(${this._svgWidth / 2 + 65},205)scale(0.35)rotate(180)`);
            $('#direction_gz g').attr('text-anchor', 'end');
            validDest = this.rValidDests;
        }
        var [destNameZH, destNameEN] = [0, 1].map(idx => {
            return validDest.map(stnId => this.stations[stnId].name[idx].replace(/\\/g, ' ')).join('/');
        });
        $('#direction_gz text').eq(0).text(destNameZH + '方向');
        $('#direction_gz text').eq(1).text('Towards ' + destNameEN);
        $('#direction_gz g').attr('transform', `translate(${this._svgWidth / 2},200)`);
    }
    updateStnName(stnId, names, stnNum) {
        super.updateStnName(stnId, names, stnNum);
        this.loadLineNum();
        if (this.stations[this._currentStnId].parents.includes(stnId) || this.stations[this._currentStnId].children.includes(stnId)) {
            this.drawDestInfo();
            this.loadFonts();
        }
        if (this._currentStnId === stnId) {
            this.drawDestInfo();
            this.loadFonts();
        }
        if (this.leftDests.includes(stnId) || this.rightDests.includes(stnId)) {
            this.loadDirection();
        }
    }
    drawDestInfo() {
        $('#station_info_gzmtr #big_stn_num text').eq(1).text(this.stations[this._currentStnId].stnNum);
        $('#station_info_gzmtr > #platform > text').eq(0).text(this._platformNum);
        $('#station_info_gzmtr > #big_psd text').eq(0).text(this._psdNum);
        $('#station_info_gzmtr #big_name').empty()
            .attr('transform', `translate(${this._svgDestWidth / 2},${100 - (this.stations[this._currentStnId].name[1].split('\\').length - 1) * 20})`)
            .append($('<text>', { class: 'rmg-name__zh rmg-name__gzmtr--dest' })
            .text(this.stations[this._currentStnId].name[0]))
            .append($('<text>', { dy: 70, class: 'rmg-name__en rmg-name__gzmtr--dest' })
            .text(this.stations[this._currentStnId].name[1].split('\\')[0])
            .append($('<tspan>', { x: 0, dy: 40, 'alignment-baseline': 'middle' }).text(this.stations[this._currentStnId].name[1].split('\\')[1] || '')));
        $('#terminus_gz').attr('transform', `translate(${this._svgWidth / 2},100)`);
        let nextStnId = this
            .stations[this._currentStnId][this._direction === 'l' ? 'parents' : 'children']
            .filter(stnId => {
            let branchTmp = this.stations[this._currentStnId].branch[this._direction === 'l' ? 'left' : 'right'];
            if (branchTmp.length) {
                return true;
                // return branchTmp[0] === 'through' ? true : stnId !== branchTmp[1];
            }
            else {
                return true;
            }
        });
        if (['linestart', 'lineend'].includes(nextStnId[0])) {
            $('#station_info_gzmtr').find('#big_next, #big_next_2').hide();
            $('#station_info_gzmtr > use').eq(0).hide();
            $('#line_main, #line_pass, #line_name, #stn_icons, #direction_gz').hide();
            $('#terminus_gz').show();
        }
        else {
            if (nextStnId.length === 1) {
                $('#station_info_gzmtr #big_next').show();
                $('#station_info_gzmtr #big_next_2').hide();
            }
            else {
                $('#station_info_gzmtr #big_next').hide();
                $('#station_info_gzmtr #big_next_2').show();
            }
            $('#station_info_gzmtr > use').eq(0).show();
            $('#line_main, #line_pass, #line_name, #stn_icons, #direction_gz').show();
            $('#terminus_gz').hide();
        }
        let [nextNameZH, nextNameEN] = ['', ''];
        let nextNameZHCount = 0;
        if (nextStnId.length === 1) {
            var nextStnInfo = this.stations[nextStnId[0]];
            [nextNameZH, nextNameEN] = nextStnInfo.name;
            nextNameZHCount = nextNameZH.length;
            $('#station_info_gzmtr #big_next g:nth-child(2) text').eq(0).text(nextNameZH);
            $('#station_info_gzmtr #big_next g:nth-child(2) text').eq(1).text(nextNameEN.split('\\')[0])
                .append($('<tspan>', { x: 0, dy: 17, 'alignment-baseline': 'middle' }).text(nextNameEN.split('\\')[1] || ''));
        }
        else {
            nextStnId.forEach((stnId, idx) => {
                let nextStnInfo = this.stations[stnId];
                [nextNameZH, nextNameEN] = nextStnInfo.name;
                if (nextNameZH.length > nextNameZHCount) {
                    nextNameZHCount = nextNameZH.length;
                }
                $(`#station_info_gzmtr #big_next_2 g:nth-child(${2 * (idx + 1)}) text`).eq(2).text(nextNameZH);
                $(`#station_info_gzmtr #big_next_2 g:nth-child(${2 * (idx + 1)}) text`).eq(3).text(nextNameEN.split('\\')[0])
                    .append($('<tspan>', { x: 0, dy: 13, 'alignment-baseline': 'middle' }).text(nextNameEN.split('\\')[1] || ''));
                let validRoutes = this.routes
                    .filter(route => route.indexOf(stnId) !== -1)
                    .map(route => route.filter(s => s !== 'linestart' && s !== 'lineend'));
                let validEnds;
                if (this._direction === 'l') {
                    validEnds = Array.from(new Set(validRoutes.map(route => route[0]))).reverse();
                }
                else {
                    validEnds = Array.from(new Set(validRoutes.map(route => route.reverse()[0])));
                }
                $(`#station_info_gzmtr #big_next_2 g:nth-child(${2 * (idx + 1)}) text`).eq(0)
                    .text(validEnds.map(s => this.stations[s].name[0]).join('/') + '方向');
                $(`#station_info_gzmtr #big_next_2 g:nth-child(${2 * (idx + 1)}) text`).eq(1)
                    .text('Towards ' + validEnds.map(s => this.stations[s].name[1]).join('/'));
            });
        }
        $('#station_info_gzmtr').html($('#station_info_gzmtr').html());
        // Position big name
        var bigNameDim = getTxtBoxDim($('#station_info_gzmtr #big_name text')[0], 'destination');
        $('#station_info_gzmtr #big_stn_num')
            .attr('transform', `translate(${(this._svgDestWidth + bigNameDim.width) / 2 + 55},${120 - (this.stations[this._currentStnId].name[1].split('\\').length - 1) * 20})scale(1.4)`);
        let bigNextDim = { x: 0, y: 0, width: 0, height: 0 };
        if (nextStnId.length === 1) {
            bigNextDim = getTxtBoxDim($('#station_info_gzmtr #big_next g:nth-child(2)')[0], 'destination');
        }
        else {
            let bigNextDims = [
                getTxtBoxDim($('#station_info_gzmtr #big_next_2 g:nth-child(2)')[0], 'destination'),
                getTxtBoxDim($('#station_info_gzmtr #big_next_2 g:nth-child(4)')[0], 'destination')
            ];
            if (bigNextDims[0].width > bigNextDims[1].width) {
                bigNextDim = bigNextDims[0];
            }
            else {
                bigNextDim = bigNextDims[1];
            }
        }
        // var nextNameZHCount = nextNameZH.length;
        if (this._direction == 'l') {
            $('#station_info_gzmtr #platform').attr('transform', `translate(${this._svgDestWidth - 100},120)`);
            if (nextStnId.length === 1) {
                if (nextNameZHCount <= 2) {
                    $('#station_info_gzmtr #big_next g:nth-child(2)').attr('transform', `translate(${115 + 35},110)`);
                    $('#station_info_gzmtr > use').eq(0).attr('transform', `translate(${(115 + 35 * (1 + nextNameZHCount) + bigNameDim.x) / 2 - 20},120)scale(0.25)`);
                }
                else {
                    $('#station_info_gzmtr #big_next g:nth-child(2)').attr('transform', `translate(${115 + 35 * 0.5},110)`);
                    $('#station_info_gzmtr > use').eq(0).attr('transform', `translate(${(115 + 35 * (0.5 + nextNameZHCount) + bigNameDim.x) / 2 - 20},120)scale(0.25)`);
                }
            }
            else {
                $('#station_info_gzmtr #big_next_2 g:nth-child(2)').attr('transform', `translate(113,80)`);
                $('#station_info_gzmtr #big_next_2 g:nth-child(4)').attr('transform', `translate(113,190)`);
                $('#station_info_gzmtr > use').eq(0).attr('transform', `translate(${(99 + 27 * (1 + nextNameZHCount) + bigNameDim.x) / 2 - 20},120)scale(0.25)`);
            }
            $('#station_info_gzmtr #big_next g:first-child').attr('transform', `translate(80,110)`);
            $('#station_info_gzmtr #big_next_2 g:first-child').attr('transform', `translate(72,80)`);
            $('#station_info_gzmtr #big_next_2 g:nth-child(3)').attr('transform', `translate(72,190)`);
        }
        else {
            $('#station_info_gzmtr #platform').attr('transform', `translate(100,120)`);
            if (nextStnId.length === 1) {
                $('#station_info_gzmtr #big_next g:nth-child(2)').attr('transform', `translate(${this._svgDestWidth - 45 - bigNextDim.width},110)`);
                if (nextNameZHCount <= 2) {
                    $('#station_info_gzmtr #big_next g:first-child').attr('transform', `translate(${this._svgDestWidth - 45 - bigNextDim.width - 70},110)`);
                    $('#station_info_gzmtr > use').eq(0).attr('transform', `translate(${(this._svgDestWidth - 45 - bigNextDim.width - 70 - 35 + bigNameDim.x + bigNameDim.width + 55 + 18.5 * 1.4) / 2 + 20},120)scale(0.25)rotate(180)`);
                }
                else {
                    $('#station_info_gzmtr #big_next g:first-child').attr('transform', `translate(${this._svgDestWidth - 45 - bigNextDim.width - 35 * 1.5},110)`);
                    $('#station_info_gzmtr > use').eq(0).attr('transform', `translate(${(this._svgDestWidth - 45 - bigNextDim.width - 35 * 2.5 + bigNameDim.x + bigNameDim.width + 55 + 18.5 * 1.4) / 2 + 20},120)scale(0.25)rotate(180)`);
                }
            }
            else {
                $('#station_info_gzmtr #big_next_2 g:nth-child(2)').attr('transform', `translate(${this._svgDestWidth - 45 - bigNextDim.width},80)`);
                $('#station_info_gzmtr #big_next_2 g:nth-child(4)').attr('transform', `translate(${this._svgDestWidth - 45 - bigNextDim.width},190)`);
                $('#station_info_gzmtr #big_next_2 g:first-child').attr('transform', `translate(${this._svgDestWidth - 45 - bigNextDim.width - 41},80)`);
                $('#station_info_gzmtr #big_next_2 g:nth-child(3)').attr('transform', `translate(${this._svgDestWidth - 45 - bigNextDim.width - 41},190)`);
                $('#station_info_gzmtr > use').eq(0).attr('transform', `translate(${(this._svgDestWidth - 45 - bigNextDim.width - 41 - 27 + bigNameDim.x + bigNameDim.width + 55 + 18.5 * 1.4) / 2 + 20},120)scale(0.25)rotate(180)`);
            }
        }
        $('#station_info_gzmtr #indicator_light').attr({
            x: this._svgDestWidth / 2, y: 270,
            'xlink:href': '#indicator_' + this._infoPanelType
        });
        this.drawPSD();
    }
    drawPSD() {
        $('#station_info_gzmtr #big_psd').attr('transform', `translate(${this._svgDestWidth / 2 + 80},${this._infoPanelType === 'gz_3' ? 218 : 242})`);
    }
    addStn(prep, stnId, loc, end) {
        var res = super.addStn(prep, stnId, loc, end);
        this.loadLineNum();
        this.loadDirection();
        return res;
    }
    removeStn(stnId) {
        if (super.removeStn(stnId)) {
            this.loadLineNum();
            this.loadDirection();
            return true;
        }
        else {
            return false;
        }
    }
    updateStnTransfer(stnId, type, info = null) {
        super.updateStnTransfer(stnId, type, info);
        this.loadLineNum();
    }
    updateBranchType(stnId, direc, type) {
        super.updateBranchType(stnId, direc, type);
        this.loadLineNum();
        this.loadDirection();
    }
    updateBranchFirst(stnId, direc, first) {
        if (!super.updateBranchFirst(stnId, direc, first)) {
            return false;
        }
        this.loadLineNum();
        this.loadDirection();
        return true;
    }
    updateBranchPos(stnId, direc, pos) {
        super.updateBranchPos(stnId, direc, pos);
        this.loadLineNum();
        this.loadDirection();
    }
    static initSVG(line) {
        super.initSVG(line);
        line.loadLineNum();
        line.loadLineName();
        line.loadDirection();
    }
}
export { RMGLineGZ };
