import { getTxtBoxDim, setParams, getParams, putParams, getRandomId, DirectionLong } from '../utils';
import { RMGStationGZ, IntStationGZ, BranchStationGZ, OSIStationGZ, getIntBoxGZ } from '../Station/StationGZ';
import { RMGLine } from './Line';

import { ID, Name, StationInfo, RMGParam, InterchangeInfo } from '../utils';

interface StationDictGZ {
    [index: string]: RMGStationGZ;
}

export class RMGLineGZ extends RMGLine {
    private _psdNum: string;
    private _lineNum: string;
    private _infoPanelType: string;
    private _directionGZX: number;
    private _directionGZY: number;
    stations: StationDictGZ;

    constructor (param: RMGParam) {
        super(param);

        this._psdNum = param.psd_num;
        this._lineNum = param.line_num;
        this._infoPanelType = param.info_panel_type;
        this._directionGZX = param.direction_gz_x;
        this._directionGZY = param.direction_gz_y;
    }

    _initStnInstance(stnId: ID, stnInfo: StationInfo) {
        if (stnInfo.children.length === 2 || stnInfo.parents.length === 2) {
            return new BranchStationGZ(stnId, stnInfo, [this.themeCity, this.themeLine, this._themeColour, this._fgColour, ...this._lineNames]);
        }
        switch (stnInfo.transfer.type) {
            case 'int2':
            case 'int3':
                return new IntStationGZ(stnId, stnInfo);
            case 'osi11':
            case 'osi12':
            case 'osi13':
            case 'osi21':
            case 'osi22':
            case 'osi31':
                return new OSIStationGZ(stnId, stnInfo);
            default:
                return new RMGStationGZ(stnId, stnInfo);
        }
    }

    get lineXs() {
        if (this._direction == 'r') {
            return [
                this._svgWidth * this._padding / 100 + 65, 
                this._svgWidth * (1 - this._padding/100)
            ];
        } else {
            return [
                this._svgWidth * this._padding / 100, 
                this._svgWidth * (1 - this._padding/100) - 65
            ];
        }
    }

    set svgWidth(val: number) {
        super.svgWidth = val;
        this.loadLineNum();
        this.loadLineName();
        this.loadDirection();
    }

    set padding(val: number) {
        super.padding = val;
        this.loadLineNum();
        this.loadLineName();
    }

    set branchSpacing(val: number) {
        super.branchSpacing = val;
        this.loadLineNum();
    }

    set direction(val) {
        this._direction = val;
        setParams('direction', val);

        for (let [stnId, stnInstance] of Object.entries(this.stations)) {
            if (['linestart', 'lineend'].includes(stnId)) {continue;}
            this._updateStnInstance(stnId);
        }

        RMGLineGZ.clearSVG();
        this.drawStns();
        this.drawLine();
        this.drawDestInfo();
        this.loadLineNum();
        this.loadLineName();
        this.loadDirection();
    }

    set currentStnId(val: ID) {
        super.currentStnId = val;
        this.loadLineNum();
        this.loadDirection();
    }

    set lineNum(val: string) {
        this._lineNum = val;
        setParams('line_num', val);
        this.loadLineNum();
    }

    set lineNames(val: Name) {
        this._lineNames = val;
        setParams('line_name', val);

        this.loadLineName();
        // (to be fixed) redraw branching station
    }

    set psdNum(val: string) {
        this._psdNum = val;
        setParams('psd_num', val);
        $('.rmg-psd-num').text(val);
    }

    set infoPanelType(val: string) {
        this._infoPanelType = val;
        setParams('info_panel_type', val);
        $('#station_info_gzmtr #indicator_light').attr('xlink:href', '#indicator_'+val);
        // $('#dest_strip, #strip').removeAttr('class').addClass(`rmg-strip__gzmtr--${this._infoPanelType}`);
        this.drawStrip();
        this.fillThemeColour();
        this.drawPSD();
    }

    set directionGZX(val: number) {
        this._directionGZX = val;
        setParams('direction_gz_x', val);

        let x = this._svgWidth * this._directionGZX / 100;
        let y = this._svgHeight * this._directionGZY / 100;
        $('#direction_gz').attr('transform', `translate(${x},${y})`);
    }

    set directionGZY(val: number) {
        this._directionGZY = val;
        setParams('direction_gz_y', val);

        let x = this._svgWidth * this._directionGZX / 100;
        let y = this._svgHeight * this._directionGZY / 100;
        $('#direction_gz').attr('transform', `translate(${x},${y})`);
    }

    _stnXShare(stnId: ID) {
        let { criticalPath, branches } = this;
        let self = this;
        if (criticalPath.nodes.includes(stnId)) {return super._stnXShare(stnId);}
        if (this.criticalPath.nodes.join(',') !== branches[0].join(',')) {
            return super._stnXShare(stnId);
        } else {
            let branchWithStn = branches.slice(1).filter(branch => branch.includes(stnId))[0];
            let lenToLeft = this._cp(branchWithStn[0], stnId).len;
            let lenToRight = this._cp(stnId, branchWithStn[branchWithStn.length-1]).len;

            if (branches[0].includes(branchWithStn[0]) && branches[0].includes(branchWithStn[branchWithStn.length-1])) {
                return ( self._stnXShare(branchWithStn[0]) * lenToRight + self._stnXShare(branchWithStn[branchWithStn.length-1]) * lenToLeft ) / (lenToLeft + lenToRight);
            } else if (branches[0].includes(branchWithStn[0])) {
                return self._stnXShare(branchWithStn[0]) + lenToLeft;
            } else {
                return self._stnXShare(branchWithStn[branchWithStn.length-1]) - lenToRight;
            }
        }
    }

    /**
     * Vertical position (in shares) of station icon. 
     */
    _stnYShare(stnId: ID) {
        if (['linestart', 'lineend'].includes(stnId)) {
            return 0;
        }
        var branches = this.branches;
        if (branches[0].includes(stnId)) {
            return 0; 
        } else {
            let i = 1;
            while (i < branches.length) {
                if (branches[i].includes(stnId)) {break;}
                i++;
            }
            if (branches[0].includes(branches[i][0])) {
                var branchingStnId = branches[i][0];
                var neToFind = 'children';
                if (this.stations[branchingStnId][neToFind].indexOf(branches[i][1]) == 0) {
                    return 2;
                } else {
                    return -2;
                }
            } else {
                var branchingStnId = branches[i].slice().reverse()[0];
                var neToFind = 'parents';
                if (this.stations[branchingStnId][neToFind].indexOf(branches[i].slice().reverse()[1]) == 0) {
                    return 2;
                } else {
                    return -2;
                }
            }
        }
    }

    drawStrip() {
        let stripHeight = (type => {
            switch (type) {
                case 'gz28':
                case 'gzgf':
                    return 60;
                case 'gz3':
                    return 40;
                case 'gz1421':
                    return 20;
            }
        })(this._infoPanelType);
        $('#dest_strip_gz, #strip_gz').attr({
            y: this._svgHeight - stripHeight, 
            height: stripHeight
        });
    }

    _rightWideFactor(stnId: ID) {
        if (this.stations[stnId] instanceof BranchStationGZ && this.stations[stnId]._tickRotation === 0) {
            return 0.25;
        } else {
            return 0;
        }
    }

    _leftWideFactor(stnId: ID) {
        if (this.stations[stnId] instanceof BranchStationGZ && this.stations[stnId]._tickRotation !== 0) {
            return 0.25;
        } else {
            return 0;
        }
    }

    _pathWeight(stnId1: ID, stnId2: ID) {
        if (!this.stations[stnId1].children.includes(stnId2)) {return -Infinity;}

        return 1 + this._rightWideFactor(stnId1) + this._leftWideFactor(stnId2);
        // return 1;
    }

    /**
     * Set width for colour strips. (Height of strips are controlled by `RMGLineGZ.drawStrip`. )
     */
    drawSVGFrame() {
        super.drawSVGFrame();
        $('#dest_strip_gz').attr('width', this._svgDestWidth);
        $('#strip_gz').attr('width', this._svgWidth);
    }

    drawStns() {
        for (let [stnId, stnInstance] of Object.entries(this.stations)) {
            if (['linestart', 'lineend'].includes(stnId)) {continue;}
            $('#stn_icons').append(stnInstance.html);
        }
        $('#stn_icons').html($('#stn_icons').html()); // Refresh DOM

        for (let [stnId, stnInstance] of Object.entries(this.stations)) {
            if (['linestart', 'lineend'].includes(stnId)) {continue;}
            $(`#stn_icons #${stnId} g#stn_name`).append(stnInstance.expressTagHTML(this._themeColour));
        }
        $('#stn_icons').html($('#stn_icons').html()); // Refresh DOM
    }

    _linePath(stnIds: ID[]) {
        let prevY: number;
        var path = [];

        stnIds.forEach(stnId => {
            var [x,y] = ['_stnRealX', '_stnRealY'].map(fun => this[fun](stnId));
            if (!prevY && prevY !== 0) {
                prevY = y;
                path.push(`M ${x},${y}`);
                return;
            }
            if (y === 0) {
                if (y < prevY) {
                    path.push(`H ${x-30}`, 'a 30,30 0 0,0 30,-30', `V ${y}`)
                }
                if (y > prevY) {
                    path.push(`H ${x-30}`, 'a 30,30 0 0,1 30,30', `V ${y}`)
                }
            } else {
                if (y < prevY) {
                    path.push(`V ${y+30}`, 'a 30,30 0 0,1 30,-30', `H ${x}`)
                }
                if (y > prevY) {
                    path.push(`V ${y-30}`, 'a 30,30 0 0,0 30,30', `H ${x}`)
                }
            }
            path.push(`H ${x}`);
            prevY = y;
        });

        // simplify path
        return path.join(' ').replace(/( H ([\d.]+))+/g, ' H $2');
    }

    drawLine() {
        $('.rmg-line').removeClass('rmg-line__mtr').addClass('rmg-line__gzmtr');
        super.drawLine();
    }

    initFonts() {
        let styleSheet = (<HTMLLinkElement>$('link#css_share')[0]).sheet as CSSStyleSheet;
        let idx: number[] = [];
        Array.from(styleSheet.cssRules).forEach((rule, i) => {
            if (rule.cssText.indexOf('.rmg-name__zh') !== -1) {
                idx.push(i);
            } else if (rule.cssText.indexOf('.rmg-name__en') !== -1) {
                idx.push(i);
            }
        });
        idx.forEach(i => styleSheet.deleteRule(i));
        styleSheet.insertRule('.rmg-name__zh {alignment-baseline: central; font-family: Arial, SimHei, STHeiti, PingFangSC-Regular, sans-serif;}');
        styleSheet.insertRule('.rmg-name__en {alignment-baseline: middle; font-family: Arial, sans-serif;}');
    }

    fillThemeColour() {
        super.fillThemeColour();
        $('#dest_strip_gz, #strip_gz').attr('fill', this._themeColour);
        if (['gz3', 'gz1421'].includes(this._infoPanelType)) {
            $('#big_psd use').attr('fill', this._themeColour);
            if (this._fgColour === '#fff') {
                $('#big_psd text').addClass('rmg-name__gzmtr--white-fg');
            } else {
                $('#big_psd text').removeClass('rmg-name__gzmtr--white-fg');
            }
        } else {
            $('#big_psd use').attr('fill', 'white');
            $('#big_psd text').removeClass('rmg-name__gzmtr--white-fg');
        }

        $('path#stn_gz').attr('stroke', this._themeColour);
        $('#station_info_gzmtr > #platform > circle').attr('fill', this._themeColour);
        $('#line_name use').attr('fill', this._themeColour);
        if (this._fgColour === '#fff') {
            $('#station_info_gzmtr > #platform text').addClass('rmg-name__gzmtr--white-fg');
            $('#line_name text').addClass('rmg-name__gzmtr--white-fg');
        } else {
            $('#station_info_gzmtr > #platform text').removeClass('rmg-name__gzmtr--white-fg');
            $('#line_name text').removeClass('rmg-name__gzmtr--white-fg');
        }
        
    }

    loadLineNum() {
        const LINE_NUM_MAX_WIDTH = 15.59375;
        $('.rmg-name__gzmtr--line-num').text(this._lineNum).attr('transform', `translate(-9.25,0)`);

        var lineNumDim = getTxtBoxDim($('.rmg-name__gzmtr--line-num')[1] as Element as SVGGraphicsElement, 'railmap');
        if (this._lineNum.length === 2) {
            var lineNumScale = lineNumDim.width>LINE_NUM_MAX_WIDTH ? LINE_NUM_MAX_WIDTH/lineNumDim.width : 1;
            $('.rmg-name__gzmtr--line-num').attr('transform', `translate(-9.25,0)scale(${lineNumScale})`);
            $('.rmg-name__gzmtr--station-num').attr('transform', `translate(9.25,0)scale(${lineNumScale})`);
        } else {
            var lineNumScale = lineNumDim.width>LINE_NUM_MAX_WIDTH ? LINE_NUM_MAX_WIDTH/lineNumDim.width : 1;
            $('.rmg-name__gzmtr--line-num').attr('transform', `translate(-9.25,0)scale(${lineNumScale})`);
            $('.rmg-name__gzmtr--station-num').attr('transform', `translate(9.25,0)`);
        }
    }

    loadLineName() {
        // simulate interchange info
        let info = [this.themeCity, this.themeLine, this._themeColour, this._fgColour, this._lineNames[0], this._lineNames[1]] as InterchangeInfo;

        $('#line_name')
            .empty()
            .append(getIntBoxGZ(info, 1));
        $('#line_name').html($('#line_name').html());

        var lineNameX = this._direction=='r' ? this.lineXs[0]-65 : this.lineXs[1]+65;

        $('#line_name')
            .attr({
                transform: `translate(${lineNameX},-18)scale(1.5)`
            });
    }

    loadDirection() {
        let validDest: ID[];
        let x = this._svgWidth * this._directionGZX / 100;
        let y = this._svgHeight * this._directionGZY / 100;
        $('#direction_gz').attr('transform', `translate(${x},${y})`);
        // to be fixed: validDest ordering
        if (this._direction == 'l') {
            $('#direction_gz use').attr('transform', `scale(0.35)`);
            $('#direction_gz g').attr({
                'text-anchor': 'start', 
                transform: 'translate(65,-5)'
            });
            validDest = this.lValidDests;
        } else {
            $('#direction_gz use').attr('transform', `scale(0.35)rotate(180)`);
            $('#direction_gz g').attr({
                'text-anchor': 'end', 
                transform: 'translate(-65,-5)'
            });
            validDest = this.rValidDests;
        }
        if (validDest.length !== 2) {
            var [destNameZH, destNameEN] = [0,1].map(idx => {
                return validDest.map(stnId => this.stations[stnId].name[idx].replace(/\\/g, ' ')).join('/');
            });
            $('#direction_gz g').eq(0).find('text').eq(0).text(destNameZH + '方向');
            $('#direction_gz g').eq(0).find('text').eq(1).text('Towards ' + destNameEN.replace('\\', ' '));

            $('#direction_gz g').eq(0).show();
            $('#direction_gz g').eq(1).hide();
        } else {
            // flatMap and flat are not supported by some browsers!
            // however targeting ES5 caused other issues?
            validDest
                .map(stnId => this.stations[stnId].name)
                .reduce((acc, val) => acc.concat(val), [])
                .forEach((txt, i) => {
                    if (i%2) {
                        txt = 'Towards ' + txt.replace('\\', ' ');
                    }
                    $('#direction_gz g').eq(1).find('text').eq(i).text(txt);
                });
            $('#direction_gz g').eq(1).find('text').css('letter-spacing', 0);

            let charCounts = validDest.map(stnId => this.stations[stnId].name[0].length);
            let minCharCounts = Math.min(...charCounts);
            if (minCharCounts > 1 && charCounts[0] !== charCounts[1]) {
                let charSpacing = Math.abs(charCounts[0] - charCounts[1]) / (minCharCounts - 1);
                $('#direction_gz g').eq(1).find('text')
                    .eq(charCounts[0] > charCounts[1] ? 2 : 0)
                    .css('letter-spacing', `${charSpacing}em`);
            }

            if (this._direction === 'l') {
                let maxCharCount = Math.max(...charCounts);
                $('#direction_gz g').eq(1).find('text').eq(4).attr('x', 25*(maxCharCount+1));
                $('#direction_gz g').eq(1).find('text').slice(0,4).removeAttr('x');
            } else {
                $('#direction_gz g').eq(1).find('text').eq(4).removeAttr('x');
                $('#direction_gz g').eq(1).find('text').slice(0,4).attr('x', '-75');
            }
            
            $('#direction_gz g').eq(0).hide();
            $('#direction_gz g').eq(1).show();
        }
    }

    updateStnName(stnId: ID, names: Name, stnNum: string) {
        super.updateStnName(stnId, names, stnNum);

        $(`#stn_icons #${stnId} g#stn_name`).append(this.stations[stnId].expressTagHTML(this._themeColour));
        $('#stn_icons').html($('#stn_icons').html());

        this.loadLineNum();

        if (this.stations[this._currentStnId].parents.includes(stnId) || this.stations[this._currentStnId].children.includes(stnId)) {
            this.drawDestInfo();
        }

        if (this._currentStnId === stnId) {
            this.drawDestInfo(); 
        }

        if (this.leftDests.includes(stnId) || this.rightDests.includes(stnId)) {
            this.loadDirection();
        }
    }

    updateStnServices(stnId: ID, detail: {chipId: 'local'|'express', selected: boolean}) {
        super.updateStnServices(stnId, detail);

        $(`#stn_icons #${stnId}`).remove();
        $('#stn_icons').append(this.stations[stnId].html);
        $('#stn_icons').html($('#stn_icons').html());
        $(`#stn_icons #${stnId} g#stn_name`).append(this.stations[stnId].expressTagHTML(this._themeColour));
        $('#stn_icons').html($('#stn_icons').html());
        this.loadLineNum();
    }
    
    drawDestInfo() {
        $('#station_info_gzmtr #big_stn_num text').eq(1).text(this.stations[this._currentStnId].stnNum);

        $('#station_info_gzmtr > #platform > text').eq(0).text(this._platformNum);
        $('#station_info_gzmtr > #big_psd text').eq(0).text(this._psdNum);

        $('#station_info_gzmtr #big_name').empty()
            .attr('transform', `translate(${this._svgDestWidth/2},${100 - (this.stations[this._currentStnId].name[1].split('\\').length - 1)*20})`)
            .append(
                $('<text>', { class:'rmg-name__zh rmg-name__gzmtr--dest' })
                    .text(this.stations[this._currentStnId].name[0])
            )
            .append(
                $('<text>', { dy:70, class:'rmg-name__en rmg-name__gzmtr--dest' })
                    .text(this.stations[this._currentStnId].name[1].split('\\')[0])
                    .append(
                        $('<tspan>', { x:0, dy:40, 'alignment-baseline':'middle' }).text(this.stations[this._currentStnId].name[1].split('\\')[1] || '')
                    )
            );
        
        $('#terminus_gz').attr('transform', `translate(${this._svgWidth/2},100)`);

        let nextStnId = this
            .stations[this._currentStnId][this._direction === 'l' ? 'parents' : 'children']
            .filter(stnId => {
                let branchTmp = this.stations[this._currentStnId].branch[this._direction === 'l' ? 'left' : 'right']
                if (branchTmp.length) {
                    return true;
                    // return branchTmp[0] === 'through' ? true : stnId !== branchTmp[1];
                } else {
                    return true;
                }
            });

        if (['linestart', 'lineend'].includes(nextStnId[0])) {
            $('#station_info_gzmtr').find('#big_next, #big_next_2').hide();
            $('#station_info_gzmtr > use').eq(0).hide();
            $('#line_main, #line_pass, #line_name, #stn_icons, #direction_gz').hide();
            $('#terminus_gz').show();
        } else {
            if (nextStnId.length === 1) {
                $('#station_info_gzmtr #big_next').show();
                $('#station_info_gzmtr #big_next_2').hide();
            } else {
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
                .append($('<tspan>', { x:0, dy:17, 'alignment-baseline':'middle' }).text(nextNameEN.split('\\')[1] || ''));
        } else {
            nextStnId.forEach((stnId, idx) => {
                let nextStnInfo = this.stations[stnId];
                [nextNameZH, nextNameEN] = nextStnInfo.name;
                if (nextNameZH.length > nextNameZHCount) {
                    nextNameZHCount = nextNameZH.length;
                }

                $(`#station_info_gzmtr #big_next_2 g:nth-child(${2*(idx+1)}) text`).eq(2).text(nextNameZH);
                $(`#station_info_gzmtr #big_next_2 g:nth-child(${2*(idx+1)}) text`).eq(3).text(nextNameEN.split('\\')[0])
                    .append($('<tspan>', { x:0, dy:13, 'alignment-baseline':'middle' }).text(nextNameEN.split('\\')[1] || ''));

                let validRoutes = this.routes
                    .filter(route => route.indexOf(stnId) !== -1)
                    .map(route => route.filter(s => s !== 'linestart' && s !== 'lineend'));
                let validEnds: ID[];
                if (this._direction === 'l') {
                    validEnds = Array.from(
                        new Set(validRoutes.map(route => route[0]))
                    ).reverse();
                } else {
                    validEnds = Array.from(
                        new Set(validRoutes.map(route => route.reverse()[0]))
                    );
                }
                $(`#station_info_gzmtr #big_next_2 g:nth-child(${2*(idx+1)}) text`).eq(0)
                    .text(validEnds.map(s => this.stations[s].name[0]).join('/') + '方向');
                $(`#station_info_gzmtr #big_next_2 g:nth-child(${2*(idx+1)}) text`).eq(1)
                    .text('Towards ' + validEnds.map(s => this.stations[s].name[1]).join('/'));
            });
        }
        
        $('#station_info_gzmtr').html($('#station_info_gzmtr').html());

        // Position big name
        var bigNameDim = getTxtBoxDim(
            $('#station_info_gzmtr #big_name text')[0] as Element as SVGGraphicsElement, 
            'destination'
        );
        $('#station_info_gzmtr #big_stn_num')
            .attr('transform', `translate(${(this._svgDestWidth+bigNameDim.width)/2+55},${120 - (this.stations[this._currentStnId].name[1].split('\\').length - 1)*20})scale(1.4)`);

        let bigNextDim = {x:0, y:0, width:0, height:0};
        if (nextStnId.length === 1) {
            bigNextDim = getTxtBoxDim(
                $('#station_info_gzmtr #big_next g:nth-child(2)')[0] as Element as SVGGraphicsElement,
                'destination'
            );
        } else {
            let bigNextDims = [
                getTxtBoxDim(
                    $('#station_info_gzmtr #big_next_2 g:nth-child(2)')[0] as Element as SVGGraphicsElement,
                    'destination'
                ), 
                getTxtBoxDim(
                    $('#station_info_gzmtr #big_next_2 g:nth-child(4)')[0] as Element as SVGGraphicsElement,
                    'destination'
                )
            ];
            if (bigNextDims[0].width > bigNextDims[1].width) {
                bigNextDim = bigNextDims[0];
            } else {
                bigNextDim = bigNextDims[1];
            }
        }
        // var nextNameZHCount = nextNameZH.length;

        if (this._direction == 'l') {
            $('#station_info_gzmtr #platform').attr('transform', `translate(${this._svgDestWidth-100},120)`);
            if (nextStnId.length === 1) {
                if (nextNameZHCount <= 2) {
                    $('#station_info_gzmtr #big_next g:nth-child(2)').attr('transform', `translate(${115+35},110)`);
                    $('#station_info_gzmtr > use').eq(0).attr('transform', `translate(${(115+35*(1+nextNameZHCount)+bigNameDim.x)/2-20},120)scale(0.25)`);
                } else {
                    $('#station_info_gzmtr #big_next g:nth-child(2)').attr('transform', `translate(${115+35*0.5},110)`);
                    $('#station_info_gzmtr > use').eq(0).attr('transform', `translate(${(115+35*(0.5+nextNameZHCount)+bigNameDim.x)/2-20},120)scale(0.25)`);
                }
            } else {
                $('#station_info_gzmtr #big_next_2 g:nth-child(2)').attr('transform', `translate(113,80)`);
                $('#station_info_gzmtr #big_next_2 g:nth-child(4)').attr('transform', `translate(113,190)`);
                $('#station_info_gzmtr > use').eq(0).attr('transform', `translate(${(99+27*(1+nextNameZHCount)+bigNameDim.x)/2-20},120)scale(0.25)`);
            }

            $('#station_info_gzmtr #big_next g:first-child').attr('transform', `translate(80,110)`);
            $('#station_info_gzmtr #big_next_2 g:first-child').attr('transform', `translate(72,80)`);
            $('#station_info_gzmtr #big_next_2 g:nth-child(3)').attr('transform', `translate(72,190)`);
        } else {
            $('#station_info_gzmtr #platform').attr('transform', `translate(100,120)`);

            if (nextStnId.length === 1) {
                $('#station_info_gzmtr #big_next g:nth-child(2)').attr('transform', `translate(${this._svgDestWidth-45-bigNextDim.width},110)`);

                if (nextNameZHCount <= 2) {
                    $('#station_info_gzmtr #big_next g:first-child').attr('transform', `translate(${this._svgDestWidth-45-bigNextDim.width-70},110)`);
                    $('#station_info_gzmtr > use').eq(0).attr('transform', `translate(${(this._svgDestWidth-45-bigNextDim.width-70-35+bigNameDim.x+bigNameDim.width+55+18.5*1.4)/2+20},120)scale(0.25)rotate(180)`);
                } else {
                    $('#station_info_gzmtr #big_next g:first-child').attr('transform', `translate(${this._svgDestWidth-45-bigNextDim.width-35*1.5},110)`);
                    $('#station_info_gzmtr > use').eq(0).attr('transform', `translate(${(this._svgDestWidth-45-bigNextDim.width-35*2.5+bigNameDim.x+bigNameDim.width+55+18.5*1.4)/2+20},120)scale(0.25)rotate(180)`);
                }
            } else {
                $('#station_info_gzmtr #big_next_2 g:nth-child(2)').attr('transform', `translate(${this._svgDestWidth-45-bigNextDim.width},80)`);
                $('#station_info_gzmtr #big_next_2 g:nth-child(4)').attr('transform', `translate(${this._svgDestWidth-45-bigNextDim.width},190)`);

                $('#station_info_gzmtr #big_next_2 g:first-child').attr('transform', `translate(${this._svgDestWidth-45-bigNextDim.width-41},80)`);
                $('#station_info_gzmtr #big_next_2 g:nth-child(3)').attr('transform', `translate(${this._svgDestWidth-45-bigNextDim.width-41},190)`);

                $('#station_info_gzmtr > use').eq(0).attr('transform', `translate(${(this._svgDestWidth-45-bigNextDim.width-41-27+bigNameDim.x+bigNameDim.width+55+18.5*1.4)/2+20},120)scale(0.25)rotate(180)`);
            }
        }

        $('#station_info_gzmtr #indicator_light').attr({
            x:this._svgDestWidth/2, y:270, 
            'xlink:href': '#indicator_' + this._infoPanelType
        });
        
        this.drawPSD();
    }

    drawPSD() {
        $('#station_info_gzmtr #big_psd').attr('transform', `translate(${this._svgDestWidth/2+80},${
            (type => {
                switch (type) {
                    case 'gz3': return 218;
                    case 'gz1421': return 238;
                    default: return 242;
                }
            })(this._infoPanelType)
        })`);
    }

    addStn(prep, stnId: ID, loc, end) {
        var res = super.addStn(prep, stnId, loc, end);
        this.loadLineNum();
        this.loadDirection();
        return res;
    }

    removeStn(stnId: ID) {
        if (super.removeStn(stnId)) {
            this.loadLineNum();
            this.loadDirection();
            return true;
        } else {
            return false;
        }
    }

    updateStnTransfer(stnId: ID, type, info=null) {
        super.updateStnTransfer(stnId, type, info);
        this.loadLineNum();
    }

    updateBranchType(stnId: ID, direction: DirectionLong, type: 'through' | 'nonthrough') {
        if (!super.updateBranchType(stnId, direction, type)) {return false;}
        this.loadLineNum();
        this.loadDirection();
        return true;
    }

    updateBranchFirst(stnId: ID, direction: DirectionLong, first: ID) {
        if (!super.updateBranchFirst(stnId, direction, first)) {
            return false;
        }
        this.loadLineNum();
        this.loadDirection();
        return true;
    }

    updateBranchPos(stnId: ID, direction: DirectionLong, pos: 0 | 1) {
        if (!super.updateBranchPos(stnId, direction, pos)) {return false;}
        this.loadLineNum();
        this.loadDirection();
        return  true;
    }

    static initSVG(line) {
        super.initSVG(line);
        line.loadLineNum();
        line.loadLineName();
        line.loadDirection();
    }
}
