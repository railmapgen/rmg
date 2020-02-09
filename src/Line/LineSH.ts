import { RMGLine } from './Line';
import { RMGStationSH, IntStationSH, station_id } from '../Station/StationSH';
import { RMGStation } from '../Station/Station';

import { ID, Name, StationInfo, RMGParam, setParams } from '../utils';

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
        var [destinations_zh, destinations_en] = ["", ""]
        this[`${this._direction}ValidDests`].forEach(stn => {
            destinations_zh += this.stations[stn].name[0]
            destinations_en += this.stations[stn].name[1]
        });
        $('#station_info_shmetro > #dest_text > text:first-child').text(`往${destinations_zh}`)
        $('#station_info_shmetro > #dest_text > text:last-child').text(`To ${destinations_en}`)

        // prepare for the line name
        let lineNameX = this._direction === 'l' ? this._svgDestWidth : 320
        var [lineNameZH, lineNameEN] = this._lineNames;

        // line starts with numbers or letters
        var lineNumber = lineNameZH.match(/(\d*)\w+/)
        if (lineNumber) {
            lineNameX -= 180;
            lineNameZH = "号线"
            $('#station_info_shmetro > #line_number > rect').attr({
                'style': `fill:${this._themeColour}`,
                'transform': `translate(${lineNameX - 120},70)`
            })
            $('#station_info_shmetro > #line_number > text')
                .text(lineNumber[0])
                .attr('transform', `translate(${lineNameX - 100},170)`)
        } else {
            lineNameX -= 280;
            $('#station_info_shmetro > #line_number > rect').attr({
                'style': `fill:${this._themeColour}`,
                'transform': `translate(${lineNameX - 10},60)`,
                'width': 260,
                'height': 150
            })
            $('#station_info_shmetro > #line_number > text').hide()

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
        let direction = this._direction == 'l' ? 'left' : 'right'
        $('#line_shmetro_use').attr({
            'xlink:href': `#line_shmetro_${direction}`,
            transform: `translate(0,220)`,
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

    // draw the line in railmap
    drawLine() {
        $('.rmg-line').removeClass('rmg-line__mtr').addClass('rmg-line__shmetro');

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
                } else if (lineMainStns[0] === branch[0] && lineMainStns[lineMainStns.length - 1] === branch[branch.length - 1] && linePassStns.length) {
                    linePassStns = branch;
                    lineMainStns = [];
                } else {
                    // 1 1 -1 -1
                    linePassStns.unshift(lineMainStns[lineMainStns.length - 1]);
                }
            }

            // stretch the main line
            var path = this._linePath(lineMainStns)
            var [x, y, h] = path.match(/[\d.]+/g).map(pos => Number(pos))
            if (this._direction === 'r') {
                path = `M ${x},${y - 6} H ${h + 30} l 12,12 L ${x},${y + 6} Z`
            } else {
                path = `M ${x - 30},${y - 6} H ${h} l 0,12 L ${x - 42},${y + 6} Z`
            }

            // draw the main line
            $('#line_main').append($('<path>', { id: 'line_main_path', d: path }));

            // stretch the pass line
            var path = this._linePath(linePassStns)
            var [x, y, h] = path.match(/[\d.]+/g).map(pos => Number(pos))
            if (this._direction === 'r') {
                path = `M ${x - 30},${y - 6} H ${h} l 0,12 L ${x - 30},${y + 6} Z`
            } else {
                path = `M ${x},${y - 6} H ${h + 30} l 0,12 L ${x},${y + 6} Z`
            }

            // draw the pass line
            $('#line_pass').append($('<path>', { id: 'line_pass_path', d: path }));
        });

        $('#line_main').html($('#line_main').html());
        $('#line_pass').html($('#line_pass').html());
    }

    fillThemeColour() {
        super.fillThemeColour();

        // this will add the stroke of the station circle
        // however the stroke path is defined in index.html
        // which made changing station style strange
        $('path#' + station_id).attr('stroke', this._themeColour);
        $('path#int2_sh').attr('stroke', this._themeColour);

        // pass stroke should be added somewhere else
        // but I can't figure it out
        $('path#stn_sh_pass').attr('stroke', '#aaa');
        $('path#int2_sh_pass').attr('stroke', '#aaa');

        // the railmap main line
        $('path#line_main_path').attr('fill', this._themeColour)
        $('path#line_pass_path').attr('fill', '#aaa')

        // the last decoration line
        let direction = this._direction == 'l' ? 'left' : 'right'
        $(`#line_shmetro_${direction}`).attr('fill', this._themeColour)

        if (this._lineNames[0].match(/(\d*)\w+/)) {
            // the line starts with number
            $('#station_info_shmetro > #line_number > text').attr('fill', '#fff')
        } else {
            // the line starts with letter
            $('#station_info_shmetro > #line_name_text').attr('fill', '#fff')
        }
    }

    updateStnNameBg() {
        $('#current_bg').hide();  // fix the mysterious black rect
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

    // rewrite this to get drawStns recalled
    updateStnTransfer(stnId: ID, type, info = null) {
        super.updateStnTransfer(stnId, type, info)

        // clear the original stations
        $('#stn_icons').empty()
        this.drawStns()
    }

    // rewrite this to change the railmap position
    set yPc(val) {
        super.yPc = val
        
        let y = val * this._svgHeight / 50;
        $('g#main').attr('transform', `translate(0,${y})`);
    }

}
