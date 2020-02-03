import { RMGLine } from './Line.js';
import { RMGStationSH, IntStationSH, station_id } from '../Station/StationSH.js';
export class RMGLineSH extends RMGLine {
    constructor(param) {
        super(param);
    }
    _initStnInstance(stnId, stnInfo) {
        switch (stnInfo.change_type) {
            case 'int2':
                return new IntStationSH(stnId, stnInfo);
            default:
                return new RMGStationSH(stnId, stnInfo);
        }
    }
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
                }
                else if (lineMainStns[0] === branch[0] && lineMainStns[lineMainStns.length - 1] === branch[branch.length - 1] && linePassStns.length) {
                    linePassStns = branch;
                    lineMainStns = [];
                }
                else {
                    // 1 1 -1 -1
                    linePassStns.unshift(lineMainStns[lineMainStns.length - 1]);
                }
            }
            // stretch the main line
            var path = this._linePath(lineMainStns);
            var paths = path.match(/[\d.]+/g);
            path = `M ${paths[0]},${paths[1]} H ${Number(paths[2]) + 30}`;
            // draw the main line
            $('#line_main').append($('<path>', { d: path }));
            // stretch the pass line
            var path = this._linePath(linePassStns);
            var paths = path.match(/[\d.]+/g);
            path = `M ${Number(paths[0]) - 30},${paths[1]} H ${paths[2]}`;
            // draw the pass line
            $('#line_pass').append($('<path>', { d: path }));
        });
        $('#line_main').html($('#line_main').html());
        $('#line_pass').html($('#line_pass').html());
    }
    fillThemeColour() {
        super.fillThemeColour();
        // this will add the stroke of the circle
        // however the stroke path is defined in index.html
        // which made changing station style strange
        $('path#' + station_id).attr('stroke', this._themeColour);
        // pass stroke should be added somewhere else
        // but I can't figure it out
        $('path#stn_sh_pass').attr('stroke', '#aaa');
    }
    updateStnNameBg() {
        $('#current_bg').hide(); // fix the mysterious black rect
    }
}
