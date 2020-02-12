import { RMGLine } from './Line';
import { RMGStationSH, IntStationSH, station_id } from '../Station/StationSH';
import { RMGStation } from '../Station/Station';

import { ID, Name, StationInfo, RMGParam, setParams, DirectionLong } from '../utils';

export class RMGLineSH extends RMGLine {
    constructor(param) {
        super(param);
    }

    _initStnInstance(stnId: ID, stnInfo: StationInfo): RMGStation {
        switch (stnInfo.change_type) {
            case 'int2':
            case 'int3_l':
            case 'int3_r':
                return new IntStationSH(stnId, stnInfo);
            case 'osi11_ul':
            case 'osi11_pl':
            case 'osi11_ur':
            case 'osi11_pr':
            case 'osi12_ul':
            case 'osi12_pl':
            case 'osi12_ur':
            case 'osi12_pr':
            case 'osi21_ul':
            case 'osi21_pl':
            case 'osi21_ur':
            case 'osi21_pr':
            case 'osi22_ul':
            case 'osi22_pl':
            case 'osi22_ur':
            case 'osi22_pr':
            default:
                return new RMGStationSH(stnId, stnInfo);
        }
    }

    // draw the destination
    drawDestInfo() {
        $('#station_info_shmetro > #platform > text').text(this._platformNum);

        var bcr = $('#station_info_shmetro > #dest_text')[0].getBoundingClientRect();
        var flagLength = 160 + 150 + bcr.width + 45 + 50;



        // arrow
        var isLeft = (this._direction == 'l') ? 1 : -1;
        var arrowX = (this._svgDestWidth - isLeft * flagLength) / 20;
        arrowX = (this._direction == 'l') ? arrowX : this._svgDestWidth - 20;
        var arrowRotate = 90 * (1 - isLeft);
        $('#station_info_shmetro > #arrow_left_use').attr('transform', `translate(${arrowX},135)rotate(${arrowRotate})`);

        // not in use now
        var platformNumX = arrowX + isLeft * (160 + 50 + 75);
        $('#station_info_shmetro > #platform').attr('transform', `translate(${platformNumX},130)`);

        // list the destination text
        // Todo: fix svg_dest_width*0.8, this has only been tested on 1000 width
        if (this._direction === 'r') {
            var txtAnchor = 'end';
            var destNameX = this._svgDestWidth * 0.8;
        } else {
            var txtAnchor = 'start';
            var destNameX = this._svgDestWidth * 0.2;
        }
        $('#station_info_shmetro > #dest_text').attr({
            transform: `translate(${destNameX},135)`,
            'text-anchor': txtAnchor
        });

        // for each left valid destinations, get the name from id
        var [destinations_zh, destinations_en]: String[][] = [[], []]
        this[`${this._direction}ValidDests`].forEach(stn => {
            destinations_zh.push(this.stations[stn].name[0])
            destinations_en.push(this.stations[stn].name[1])
        });
        $('#station_info_shmetro > #dest_text > text:first-child').text(`往${destinations_zh.join("，")}`)
        $('#station_info_shmetro > #dest_text > text:last-child').text(`To ${destinations_en.join(", ")}`)

        // prepare for the line name
        let lineNameX = this._direction === 'l' ? this._svgDestWidth : 320
        var [lineNameZH, lineNameEN] = this._lineNames;

        // line starts with numbers or letters
        var lineNumber = lineNameZH.match(/(\d*)\w+/)
        if (lineNumber) {
            lineNameX -= 180;
            lineNameZH = "号线"
            $('#station_info_shmetro > #line_number > rect').attr({
                fill: this._themeColour,
                'transform': `translate(${lineNameX - 120},70)`, 
                width: 100, height: 125
            })
            $('#station_info_shmetro > #line_number > text')
                .show().text(lineNumber[0])
                .attr('transform', `translate(${lineNameX - 70},170)`);
            
            // Chito: If match format X号线, "号线" always black
            // ignore inherit style from g#line_name_text
            $('#station_info_shmetro > #line_name_text text').attr('fill', 'black');
        } else {
            lineNameX -= 280;
            $('#station_info_shmetro > #line_number > rect').attr({
                fill: this._themeColour, 
                'transform': `translate(${lineNameX - 10},60)`,
                'width': 260,
                'height': 150
            })
            $('#station_info_shmetro > #line_number > text').hide()

            // Chito: If not match format X号线, use inherit style
            $('#station_info_shmetro > #line_name_text text').removeAttr('fill');

            // Todo: set the eng in the middle
            $('#station_info_shmetro > #line_name_text > text:last-child').attr('dx', 10)
        }

        // set the line name
        $('#station_info_shmetro > #line_name_text > text:first-child').text(lineNameZH)
        $('#station_info_shmetro > #line_name_text > text:last-child').text(lineNameEN)
        $('#station_info_shmetro > #line_name_text').attr({
            transform: `translate(${lineNameX},135)`,
            'text-anchor': 'start'
        });

        // the last decoration line
        let path = ''
        if (this._direction == 'l') {
            path = `M30,10 H ${this._svgDestWidth - 20} V 20 H 20 Z`
        } else {
            path = `M20,10 H ${this._svgDestWidth - 30} l 10,10 H 20 Z`
        }
        $('#line_shmetro_use').attr({
            transform: `translate(0,220)`,
            d: path,
        })
    }

    // rewrite this to append dom and then getBoundingClientRect
    // to get the exact position where int icon can be fit
    drawStns() {
        for (let [stnId, stnInstance] of Object.entries(this.stations)) {
            if (['linestart', 'lineend'].includes(stnId)) { continue; }
            $('#stn_icons').append(stnInstance.html);
        }
        $('#stn_icons').html($('#stn_icons').html()); // Refresh DOM

        for (let [stnId, stnInstance] of Object.entries(this.stations)
            .filter(stn => stn[1] instanceof IntStationSH) as [ID, IntStationSH][]) {
            $(`#rmg-name__shmetro--${stnId}`).parent().append(stnInstance.ungrpIconHTML)
        }
        $('#stn_icons').html($('#stn_icons').html()); // Refresh DOM
    }

    // rewrite this to change the y of branch station
    _stnYShare(stnId): number {
        if (this.branches[0].includes(stnId)) return 0;
        else return 3
    }

    _linePath(stnIds: ID[], type?: 'main' | 'pass'): string {
        var [prevId, prevY, prevX]: [string?, number?, number?] = []
        var path: { [key: string]: number[] } = {}
        const e = 30

        stnIds.forEach(stnId => {
            var [x, y] = ['_stnRealX', '_stnRealY'].map(fun => this[fun](stnId))
            if (!prevY && prevY !== 0) {
                [prevId, prevX, prevY] = [stnId, x, y];
                path['start'] = [x, y];
                return
            }
            if (y === 0) {
                // merge back to main line
                if (y != prevY) {
                    path['bifurcate'] = [prevX, prevY]
                }
            } else {
                // on the branch line
                if (y != prevY) {
                    path['bifurcate'] = [x, y]
                }
            }
            path['end'] = [x, y];
            [prevId, prevX, prevY] = [stnId, x, y];
        });

        // generate path
        if (!path.hasOwnProperty('start')) {
            // no line generated
            // keys in path: none
            return ''
        } else if (!path.hasOwnProperty('end')) {
            // litte line (only beyond terminal station)
            // keys in path: start
            let [x, y] = path['start']
            if (type === 'main') {
                // current at terminal(end) station, draw the litte main line
                if (this._direction === 'l') {
                    return `M ${x},${y - 6} L ${x - e},${y - 6} l -12,12 L ${x},${y + 6} Z`
                } else {
                    return `M ${x},${y - 6} L ${x + e},${y - 6} l 12,12 L ${x},${y + 6} Z`
                }
            } else {
                // type === 'pass'
                // current at terminal(start) station, draw the litte pass line
                if (this._direction === 'l') {
                    return `M ${x},${y - 6} L ${x + e},${y - 6} l 0,12 L ${x - e},${y + 6} Z`
                } else {
                    return `M ${x - e},${y - 6} L ${x},${y - 6} l 0,12 L ${x - e},${y + 6} Z`
                }
            }
        }
        else if (!path.hasOwnProperty('bifurcate')) {
            // general main line
            // keys in path: start, end
            let [x, y] = path['start'], h = path['end'][0]
            if (type === 'main') {
                if (this._direction === 'l') {
                    return `M ${x - e},${y - 6} H ${h} l 0,12 L ${x - 42},${y + 6} Z`
                } else {
                    return `M ${x},${y - 6} H ${h + e} l 12,12 L ${x},${y + 6} Z`
                }
            } else {
                // type === 'pass'
                if (this._direction === 'l') {
                    return `M ${x - e},${y - 6} H ${h + e} l 0,12 L ${x - e},${y + 6} Z`
                } else {
                    return `M ${x - e},${y - 6} H ${h + e} l 0,12 L ${x - e},${y + 6} Z`
                }
            }
        } else {
            // main line bifurcate here to become the branch line
            // and path return here are only branch line
            // keys in path: start, bifurcate, end

            // Todo: disable lower branch
            let [x, y] = path['start'], h = path['end'][0]
            let [xb, yb] = path['bifurcate'], [xm, ym] = path['end']
            if (type === 'main') {
                if (this._direction === 'l') {
                    if (ym > y) {
                        // main line, left direction, center to upper
                        return `M ${x - e},${y - 6} H ${xb + e} L ${xm},${ym - 6} l 0,12 L ${xb + e},${yb + 6} L ${x - e - 12},${y + 6} Z`
                    } else {
                        // main line, left direction, upper to center
                        // this same as the other, but replace x with xm and xm with x
                        return `M ${xm},${ym - 6} H ${xb - e} L ${x},${y - 6} l 0,12 L ${xb - e},${yb + 6} L ${xm},${ym + 6} Z`
                    }
                } else {
                    if (ym > y) {
                        // main line, right direction, upper to center
                        return `M ${x},${y - 6} H ${xb + e} L ${xm},${ym - 6} l 0,12 L ${xb + e},${yb + 6} L ${x},${y + 6} Z`
                    } else {
                        // main line, right direction, center to upper
                        // this same as the other, but replace x with xm and xm with x
                        return `M ${xm + e},${ym - 6} H ${xb - e} L ${x},${y - 6} l 0,12 L ${xb - e},${yb + 6} L ${xm + e + 12},${ym + 6} Z`
                    }
                }
            } else {
                // type === 'pass'
                if (this._direction === 'l') {
                    if (ym > y) {
                        // pass line, left direction, center to upper
                        return `M ${x - e},${y - 6} H ${xb + e} L ${xm},${ym - 6} l 0,12 L ${xb + e},${yb + 6} L ${x - e},${y + 6} Z`
                    } else {
                        // pass line, left direction, upper to center
                        // this same as the other, but replace x with xm and xm with x
                        return `M ${x},${y - 6} L ${xb - e},${yb - 6} H ${xm + e} l 0,12 L ${xb - e},${yb + 6} L ${x},${y + 6} Z`
                    }
                } else {
                    if (ym > y) {
                        // pass line, right direction, upper to center
                        return `M ${x - e},${y - 6} H ${xb + e} L ${xm},${ym - 6} l 0,12 L ${xb + e},${yb + 6} L ${x - e},${y + 6} Z`
                    } else {
                        // pass line, right direction, center to upper
                        // this same as the other, but replace x with xm and xm with x
                        return `M ${x},${y - 6} L ${xb - e},${yb - 6} H ${xm + e} l 0,12 L ${xb - e},${yb + 6} L ${x},${y + 6} Z`
                    }
                }
            }
        }
    }

    // draw the line in railmap
    drawLine() {
        $('.rmg-line').removeClass('rmg-line__mtr').addClass('rmg-line__shmetro');
        super.drawLine()
    }

    fillThemeColour() {
        super.fillThemeColour();

        // this will add the stroke of the station circle
        // however the stroke path is defined in index.html
        // which made changing station style strange
        $('circle#' + station_id).attr('stroke', this._themeColour);
        $('path#int2_sh').attr('stroke', this._themeColour);

        // pass stroke should be added somewhere else
        // but I can't figure it out
        // Chito: path#stn_sh now have stroke attribute #aaa, no need to change. 

        // the railmap line
        $('#line_main').children().attr('fill', this._themeColour)
        $('#line_pass').children().attr('fill', '#aaa')

        // the last decoration line
        $(`#line_shmetro_use`).attr('fill', this._themeColour)

        // if (this._lineNames[0].match(/(\d*)\w+/)) {
        //     // the line starts with number
        //     $('#station_info_shmetro > #line_number > text').attr('fill', '#fff')
        // } else {
        //     // the line starts with letter
        //     $('#station_info_shmetro > #line_name_text').attr('fill', '#fff')
        // }
        // Chito: g#line_name_text's fill always equal to the foreground colour, 
        // while inner text elements may have different fill, see drawDestInfo()

        $('#station_info_shmetro > #line_name_text').attr('fill', this._fgColour);

        // dest info line color (both background and foreground)
        $('#station_info_shmetro > #line_number > rect').attr('fill', this._themeColour);
        $('#station_info_shmetro > #line_number > text').attr('fill', this._fgColour);
    }

    updateStnNameBg() {
        $('#current_bg').hide();  // fix the mysterious black rect
    }

    loadFonts() {
        //Chito: empty this method, avoid adding MTR specific class, which is for displaying country-variant character form. 
    }

    // rewrite this to make sure the line is draw before color
    static initSVG(line) {
        line.drawSVGFrame();
        line.showFrameOuter();
        line.drawStns();

        // change the func call here
        line.drawLine();
        line.fillThemeColour();
        // change the func call here

        line.drawStrip();
        line.drawDestInfo();
        line.loadFonts();
        line.updateStnNameBg();
    }

    // rewrite this to call fillThemeColour when flip direction
    set direction(val) {
        super.direction = val

        this.fillThemeColour()
    }

    // rewrite this to call fillThemeColour when set current station
    set currentStnId(val) {
        super.currentStnId = val

        this.fillThemeColour()
    }

    // rewrite this to get drawStns and recalled
    updateStnTransfer(stnId: ID, type, info = null) {
        super.updateStnTransfer(stnId, type, info)

        this.fillThemeColour()

        // clear the original stations
        $('#stn_icons').empty()
        this.drawStns()
    }

    // rewrite this to call fillThemeColour when add station
    addStn(prep: 'before' | 'after', stnId: ID, loc, end: ID): [ID, StationInfo] {
        let [newId, newInfo] = super.addStn(prep, stnId, loc, end)
        this.fillThemeColour()
        return [newId, newInfo]
    }

    // rewrite this to change the railmap position
    set yPc(val) {
        super.yPc = val

        let y = val * this._svgHeight / 50;
        $('g#main').attr('transform', `translate(0,${y})`);
    }

    updateBranchFirst(stnId: ID, direction: DirectionLong, first: ID) {
        if (super.updateBranchFirst(stnId, direction, first)) {
            this.fillThemeColour();
            return true;
        } else {
            return false;
        }
    }

}
