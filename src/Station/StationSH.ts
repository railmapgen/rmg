import { RMGStation } from './Station';
import { Name, BranchInfo, StationInfo, IntInfoTag, InterchangeInfo } from '../types';

class RMGStationSH extends RMGStation {
    constructor(id: string, data: StationInfo) {
        super(id, data);
        this.stnNum = data.num;
    }

    get _nameShift() { return false; }
    get _tickRotation() { return this.y > 0 ? 180 : 0; }
    get _dxdy() {
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
        return [dx, dy]
    }

    get iconHTML() {
        var [iconType, numClass] = (this.state == -1) ? ['stn_sh_pass', 'Pass'] : ['stn_sh', 'Future'];
        return $('<g>', { transform: `translate(${this.x},${this.y})` })
            .append($('<use>', { 'xlink:href': '#' + iconType, class: 'rmg-stn' }));
    }

    get nameHTML() {
        let [dx, dy] = this._dxdy
        let dx_branch = [...this.branch.left, ...this.branch.right].length == 0 ? 0 : 30
        return $('<g>', {
            'transform': `translate(${this.x - dx + dx_branch},${this.y + dy})rotate(-50)`,
            'text-anchor': this._tickRotation === 0 ? 'start' : 'end',
            class: `Name Future`  // todo: fix this
        }).append(
            $('<text>').addClass('rmg-name__zh rmg-name__shmetro--station').text(this.name[0])
        ).append(
            $('<text>', {
                class: 'rmg-name__en rmg-name__shmetro--station',
                'font-size': '60%',
                dy: 12,
            }).text(this.name[1].split('\\')[0]).append(
                $('<tspan>', {
                    'x': 0, 'dy': 12
                }).text(this.name[1].split('\\')[1])
            )
        );
    }
}

class IntStationSH extends RMGStationSH {
    protected _intInfos: InterchangeInfo[];

    constructor(id: string, data: StationInfo) {
        super(id, data);
        this._intInfos = data.transfer.info[0];
    }

    // rewrite this to append dom and then getBoundingClientRect
    // to get the exact position where int icon can be fit
    get html() {
        return $('<g>', { id: this.id }).append(...this.ungrpHTML);
    }

    // rewrite this to get all drawing function to be called
    get ungrpHTML() {
        return [this.iconHTML, this.nameHTML];
    }

    get ungrpIconHTML() {
        return [...this.intTickHTML]
    }

    // interchange station icon on main line
    get iconHTML() {
        var [iconType, numClass] = (this.state == -1) ? ['int2_sh_pass', 'Pass'] : ['int2_sh', 'Future'];
        return $('<g>', { transform: `translate(${this.x},${this.y})` })
            .append($('<use>', { 'xlink:href': '#' + iconType, class: 'rmg-stn', stroke: this._intInfos[IntInfoTag.colour] }));
    }

    // regular station name
    get nameHTML() {
        let [dx, dy] = this._dxdy;
        let dx_branch = [...this.branch.left, ...this.branch.right].length == 0 ? 0 : 30
        // wrap the name, decro_line and int_line under g in order to rotate at once
        return $('<g>', {
            transform: `translate(${this.x - dx + dx_branch},${this.y + dy})`,
        }).append(
            // the original name text
            $('<g>', {
                id: `rmg-name__shmetro--${this.id}`,
                'text-anchor': this._tickRotation === 0 ? 'start' : 'end',
                class: `Name Future`  // todo: fix this
            }).append(
                $('<text>').addClass('rmg-name__zh rmg-name__shmetro--station').text(this.name[0])
            ).append(
                $('<text>', {
                    class: 'rmg-name__en rmg-name__shmetro--station',
                    'font-size': '60%',
                    dy: 12,
                }).text(this.name[1].split('\\')[0]).append(
                    $('<tspan>', {
                        'x': 0, 'dy': 12
                    }).text(this.name[1].split('\\')[1])
                )
            )
        )
    }

    // interchange station icon after the station name
    get intTickHTML() {
        let lineElems: JQuery<HTMLElement>[] = []

        // get the exact station name width so that the
        // interchange station icon can be right after the station name
        let stnNameElem = $(`#rmg-name__shmetro--${this.id}`)

        // the original name position
        let bcr = stnNameElem.get(0).getBoundingClientRect()
        // the original name position's right x
        let x = bcr.right - bcr.left + 5
        // the int icon dx for each int station
        let dx = 0

        for (const [_, stn] of Object.entries(this._intInfos)) {
            // interchange line icon after station name
            let lineIconColour = stn[IntInfoTag.colour];
            let lineIconElem = $('<use>', {
                fill: lineIconColour,
                class: 'rmg-line__shmetro rmg-line__change',
            });
            if (this.state == -1) {
                lineIconElem.addClass('rmg-line__pass');
            }

            // interchange line name
            let lineNameElem = $('<text>', {
                class: 'rmg-name__zh rmg-name__shmetro--line_name',
                'text-anchor': 'middle',
                fill: stn[IntInfoTag.fg],
            })

            // line starts with numbers or letters
            let lineNumber = String(stn[IntInfoTag.nameZH]).match(/(\d*)\w+/)
            if (lineNumber) {
                // number line
                var lineName = lineNumber[0]
                lineIconElem.attr({
                    'xlink:href': '#int_sh_number',
                    transform: `translate(${x + dx},-12)`,
                })
                lineNameElem.attr({
                    // Todo: fix this hard-coded center(10) position
                    transform: `translate(${x + 10 + dx},8)`,
                }).text(lineName)

                dx += 25  // 20 + 5(margin) for number line
            } else {
                // letter line
                var lineName = String(stn[IntInfoTag.nameZH])
                lineIconElem.attr({
                    'xlink:href': '#int_sh_letter',
                    transform: `translate(${x + dx},-12)`,
                })
                lineNameElem.attr({
                    // Todo: fix this hard-coded center(30) position
                    transform: `translate(${x + 30 + dx},8)`,
                }).text(lineName)

                dx += 65  // 60 + 5(margin) for letter line
            }

            lineElems.push(lineIconElem, lineNameElem)
        }

        // rotate the station info now
        // other wise the bcr will be inaccurate due to the rotation
        let stnInfoElem = stnNameElem.parent();
        stnInfoElem.attr('transform', `${stnInfoElem.attr('transform')}rotate(-50)`)

        return lineElems;
    }

    get _nameClass() {
        return (this.state == -1) ? 'Pass' : 'Future';
    }
}

class OSIStationSH extends IntStationSH {
    protected _intInfos: InterchangeInfo[];
    private _osiInfos: InterchangeInfo[];

    constructor(id: string, data: StationInfo) {
        super(id, data);
        this._intInfos = data.transfer.info.flat();
        this._osiInfos = data.transfer.info[1];
    }

    get ungrpIconHTML() {
        return [...this.intTickHTML, this.OSIHTML]
    }

    get OSIHTML() {
        // get the exact station name width so that the
        // interchange station icon can be right after the station name
        let stnNameElem = $(`#rmg-name__shmetro--${this.id}`)
        let bcr = stnNameElem.get(0).getBoundingClientRect()
        let dx = bcr.right - bcr.left + 5

        // get the all names from the out of station changes
        let lineNames: string[] = []
        this._osiInfos.map((stn) => lineNames.push(stn[IntInfoTag.nameZH]))

        return $('<g>', {
            class: `Name Future`,  // todo: fix this
            transform: `translate(${dx + this._intInfos.length * 15},-30)`,
            id: `rmg-name__shmetro--${this.id}`,
            'text-anchor': 'middle',
            'font-size': '50%',
        }).append(
            $('<text>').addClass('rmg-name__zh rmg-name__shmetro--station').text(`换乘${lineNames.join('，')}`)
        ).append(
            $('<text>', {
                dy: 10, class: 'rmg-name__en rmg-name__shmetro--station'
            }).text('仅限公共交通卡'))
    }
}

export { RMGStationSH, IntStationSH, OSIStationSH };
