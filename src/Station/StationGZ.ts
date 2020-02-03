import { RMGStation, IntInfoTag, InterchangeInfo } from './Station';
import { ID, Name, BranchInfo, StationInfo } from '../utils';

class RMGStationGZ extends RMGStation {
    constructor(id: ID, data: StationInfo) {
        super(id, data);
        this.stnNum = data.num;
    }

    get nameClass() {
        switch (this.state) {
            case -1:
                return 'Pass';
            case 0:
                return 'CurrentGZ';
            default:
                return 'Future';
        }
    }

    get _nameShift() {return false;}
    get _tickRotation() {return this.y > 0 ? 180 : 0;}

    get iconHTML() {
        var [iconType, numClass] = (this.state == -1) ? ['stn_gz_pass','Pass'] : ['stn_gz','Future'];
        return $('<g>', { transform:`translate(${this.x},${this.y})` })
            .append($('<use>', { 'xlink:href': '#' + iconType, class: 'rmg-stn' }))
            .append(
                $('<g>', { class: 'Name ' + numClass })
                    .append($('<text>', { class:'rmg-name__zh rmg-name__gzmtr--line-num' }))
                    .append($('<text>', { class:'rmg-name__zh rmg-name__gzmtr--station-num', x:0 }).text(this.stnNum))
            );
    }

    get nameHTML() {
        var nameENLn = this.name[1].split('\\').length;
        let dx: number;
        if (this._nameShift) {
            dx = this._tickRotation === 0 ? -9 : 16 + (nameENLn-1)*12 * Math.cos(-45);
        } else {
            dx = this._tickRotation === 0 ? (24 + (nameENLn-1)*12) * Math.cos(-45) : -6;
        }
        // let dx = this._nameShift ? -8 : (24 + (nameENLn-1)*12) * Math.cos(-45);
        let dy = this._tickRotation === 0 ? (-4 - 21.921875 - (nameENLn-1)*12*Math.cos(-45)) : 17.5;
        // var dy = (-4 - 21.921875 - (nameENLn-1)*12*Math.cos(-45)) * (this._tickRotation === 0 ? 1 : -1);
        return $('<g>', {
            'transform': `translate(${this.x - dx},${this.y + dy})rotate(-45)`, 
            'text-anchor': this._tickRotation === 0 ? 'start' : 'end', 
            class: `Name ${this.nameClass}`
        }).append(
            $('<text>').addClass('rmg-name__zh rmg-name__gzmtr--station').text(this.name[0])
        ).append(
            $('<text>', {
                dy: 15, class: 'rmg-name__en rmg-name__gzmtr--station'
            }).text(this.name[1].split('\\')[0]).append(
                $('<tspan>', {
                    'x': 0, 'dy': 10, class: 'rmg-name__en rmg-name__gzmtr--station'
                }).text(this.name[1].split('\\')[1])
            )
        );
    }
}

class IntStationGZ extends RMGStationGZ {
    private _intInfos: InterchangeInfo[];

    constructor(id: ID, data: StationInfo) {
        super(id, data);
        this._intInfos = data.interchange[0];
    }

    // get _tickRotation() {return 0;}

    get intTickHTML() {
        var ticks = this._intInfos
                        .map(info => info[IntInfoTag.colour])
                        .map((colour,idx) => {
                            let x = this.x - 2*(this._intInfos.length-1) + 4*idx;
                            return $('<use>', {
                                'xlink:href': '#inttick_gz', 
                                stroke: this.state==-1 ? '#aaa' : colour, 
                                transform: `translate(${x},${this.y})rotate(${this._tickRotation})`
                            });
                        });
        return $('<g>', {class:'rmg-line rmg-line__gzmtr rmg-line__change'})
                    .append(...ticks);
    }

    get intNameHTML() {
        var intNameZHss = this._intInfos
                            .map(info => info[IntInfoTag.nameZH])
                            .map(name => name.match(/[\d]+|[\D]+/g) || ['']);

        var intTextZHEls = intNameZHss.map(
            (names, idx) => {
                var intNameSplitOk = false;
                if (names.length == 2) {
                    if (!isNaN(Number(names[0])) && isNaN(Number(names[1]))) {
                        intNameSplitOk = true;
                    }
                }

                return $('<text>', {
                            y: 8.5 + idx*28 * (this._tickRotation === 0 ? 1 : -1), 
                            class: 'rmg-name__zh rmg-name__gzmtr--int'
                        })
                        .append(
                            $('<tspan>', {
                                'font-size':'16px', 
                                'alignment-baseline':'central'
                            })
                                .text(intNameSplitOk ? names[0] : '')
                        )
                        .append(
                            $('<tspan>', {dy:-0.5, 'alignment-baseline':'central'})
                                .text(intNameSplitOk ? names[1] : names.join(''))
                        )
            } 
        );

        var intTextENEls = this._intInfos
                            .map(info => info[IntInfoTag.nameEN])
                            .map((name,idx) => {
                                let el = $('<text>', {
                                    y: 19.5 + idx*28 * (this._tickRotation === 0 ? 1 : -1), 
                                    class: 'rmg-name__en'
                                }).text(name);
                                el.addClass(name.length>10 ? 'rmg-name__gzmtr--int-small' : 'rmg-name__gzmtr--int');
                                return el;
                            });

        this._intInfos
            .map(info => info[IntInfoTag.fg])
            .map((fg,idx) => {
                if (fg == '#fff' || this.state == -1) {
                    [intTextZHEls[idx], intTextENEls[idx]] = [intTextZHEls[idx], intTextENEls[idx]].map(el => {
                        return el.addClass('rmg-name__gzmtr--white-fg');
                    });
                }
            });

        var intBoxEls = this._intInfos.map(info => info[IntInfoTag.colour]).map((colour,idx) => {
            return $('<use>', {
                'xlink:href':'#intbox_gz', 
                fill: this.state==-1 ? '#aaa' : colour, 
                y: idx * 28 * (this._tickRotation === 0 ? 1 : -1)
            });
        });

        return $('<g>', {
            'text-anchor': 'middle', 
            transform: `translate(${this.x},${this.y + (this._tickRotation === 0 ? 23 : -47)})`
        }).append(...intBoxEls, ...intTextZHEls, ...intTextENEls);
    }

    get ungrpHTML() {
        return [this.intTickHTML, this.iconHTML, this.nameHTML, this.intNameHTML];
    }
}

class BranchStationGZ extends IntStationGZ {
    constructor (id: ID, data: StationInfo, lineInf) {
        data.interchange[0].unshift(lineInf);
        if (data.interchange[1]) {
            data.interchange[0].push(...data.interchange[1].slice(1));
        }
        super(id, data);
    }

    get _nameShift() {return true;}
    get _tickRotation() {
        return (this.parents.indexOf(this.branch.left[1]) === 0 || this.children.indexOf(this.branch.right[1]) === 0) ? 0 : 180;
    }
}

class OSIStationGZ extends IntStationGZ {
    constructor (id: ID, data: StationInfo) {
        data.interchange[0].push(...data.interchange[1].slice(1));
        super(id, data);
    }
}

export { RMGStationGZ, IntStationGZ, BranchStationGZ, OSIStationGZ };