import { RMGStation, IntInfoTag, InterchangeInfo } from './Station.js';
import { ID, Name, BranchInfo, StationInfo } from '../utils.js';

const station_id = 'stn_sh'

class RMGStationSH extends RMGStation {
    constructor(id: ID, data: StationInfo) {
        super(id, data);
        this.stnNum = data.num;
    }

    get _nameShift() { return false; }
    get _tickRotation() { return this.y > 0 ? 180 : 0; }

    get iconHTML() {
        var [iconType, numClass] = (this.state == -1) ? [station_id + '_pass', 'Pass'] : [station_id, 'Future'];
        return $('<g>', { transform: `translate(${this.x},${this.y})` })
            .append($('<use>', { 'xlink:href': '#' + iconType, class: 'rmg-stn' }));
    }

    get nameHTML() {
        var nameENLn = this.name[1].split('\\').length;
        let dx: number;
        if (this._nameShift) {
            dx = this._tickRotation === 0 ? -9 : 16 + (nameENLn - 1) * 12 * Math.cos(-45);
        } else {
            dx = this._tickRotation === 0 ? (24 + (nameENLn - 1) * 12) * Math.cos(-45) : -6;
        }
        // let dx = this._nameShift ? -8 : (24 + (nameENLn-1)*12) * Math.cos(-45);
        let dy = this._tickRotation === 0 ? (-4 - 21.921875 - (nameENLn - 1) * 12 * Math.cos(-45)) : 17.5;
        // var dy = (-4 - 21.921875 - (nameENLn-1)*12*Math.cos(-45)) * (this._tickRotation === 0 ? 1 : -1);
        return $('<g>', {
            'transform': `translate(${this.x - dx},${this.y + dy})rotate(-45)`,
            'text-anchor': this._tickRotation === 0 ? 'start' : 'end',
            // class: `Name ${this.nameClass}`
            class: `Name Future`  // todo: fix this
        }).append(
            $('<text>').addClass('rmg-name__zh rmg-name__shmetro--station').text(this.name[0])
        ).append(
            $('<text>', {
                dy: 15, class: 'rmg-name__en rmg-name__shmetro--station'
            }).text(this.name[1].split('\\')[0]).append(
                $('<tspan>', {
                    'x': 0, 'dy': 12
                }).text(this.name[1].split('\\')[1])
            )
        );
    }
}

class IntStationSH extends RMGStationSH {
    private _intInfos: InterchangeInfo[];

    constructor(id: ID, data: StationInfo) {
        super(id, data);
        this._intInfos = data.interchange[0];
    }
}

export { RMGStationSH, IntStationSH, station_id };
