import { RMGStation } from './Station';
import { IntInfoTag, InterchangeInfo, StationInfo } from '../types';

export function getIntBoxGZ(intInfo: InterchangeInfo, state: 0 | 1 | -1) {
    let bg = intInfo[IntInfoTag.colour];
    let fg = intInfo[IntInfoTag.fg];
    let names = [
        intInfo[IntInfoTag.nameZH], 
        intInfo[IntInfoTag.nameEN]
    ];
    let nameZHs = names[0].match(/[\d]+|[\D]+/g) || [''];
    let intNameSplitOk = false;
    if (nameZHs.length == 2) {
        if (!isNaN(Number(nameZHs[0])) && isNaN(Number(nameZHs[1]))) {
            intNameSplitOk = true;
        }
    }
    let boxEl = $('<g>')
        .append(
            $('<use>', { 
                'xlink:href': '#intbox_gz', 
                fill: state===-1 ? '#aaa' : bg
            })
        )
        .append(
            $('<text>', { y: 8.5, class: 'rmg-name__zh rmg-name__gzmtr--int' })
                .append($('<tspan>', { 'font-size':'16px', 'dominant-baseline': 'central' }).text(intNameSplitOk ? nameZHs[0] : ''))
                .append($('<tspan>', { dy:-1, 'dominant-baseline': 'central' }).text(intNameSplitOk ? nameZHs[1] : nameZHs.join('')))
        )
        .append(
            $('<text>', { 
                y: 19.5, 
                class: 'rmg-name__en'
            })
                .addClass(names[1].length > 10 ? 'rmg-name__gzmtr--int-small' : 'rmg-name__gzmtr--int')
                .text(names[1])
        );
    if (fg === '#fff' || state === -1) {
        $(boxEl).find('text').attr('fill', '#fff');
    } else {
        $(boxEl).find('text').attr('fill', fg);
    }

    return boxEl;
}

class RMGStationGZ extends RMGStation {
    constructor(id: string, data: StationInfo) {
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
        var [iconClass, numClass] = (this.state == -1) ? ['rmg-stn--pass','Pass'] : ['rmg-stn--future','Future'];
        return $('<g>', { transform:`translate(${this.x},${this.y})` })
            .append($('<use>', { 'xlink:href': '#stn_gz', class: iconClass }))
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
        let nameGEl = $('<g>', { class: 'Name ' + this.nameClass }).append(
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
        return $('<g>', {
            'id': 'stn_name', 
            'transform': `translate(${this.x - dx},${this.y + dy})rotate(-45)`, 
            'text-anchor': this._tickRotation === 0 ? 'start' : 'end'
        }).append(nameGEl);
    }

    get expressTagHTML() {
        if (!this.services.has('express')) {
            return $('<g>');
        }
        let stnNameDim = ($(`#stn_icons #${this.id} g#stn_name g`)[0] as Element as SVGGElement).getBBox();
        return $('<g>', { 
            transform: `translate(${(stnNameDim.width+35)*(this._tickRotation===0?1:-1)},${2+5*(this.name[1].split('\\').length-1)})`, 
            fill: this.state===-1 ? '#aaa' : 'var(--rmg-theme-colour)', 
            'text-anchor': 'middle'
        })
            .append(
                $('<text>', { class: 'rmg-name__zh rmg-name__gzmtr--express' }).text('快车停靠站')
            )
            .append(
                $('<text>', {y:10, class: 'rmg-name__en rmg-name__gzmtr--express' }).text('Express Station')
            );
    }
}

class IntStationGZ extends RMGStationGZ {
    protected _intInfos: InterchangeInfo[];

    constructor(id: string, data: StationInfo) {
        super(id, data);
        this._intInfos = data.transfer.info[0];
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
        let intBoxEls = this._intInfos.map(info => getIntBoxGZ(info, this.state));
        intBoxEls.forEach((el, i) => {
            $(el).attr('transform', `translate(0,${i*28 * (this._tickRotation===0 ? 1 : -1)})`);
        });

        return $('<g>', {
            'text-anchor': 'middle', 
            transform: `translate(${this.x},${this.y + (this._tickRotation === 0 ? 23 : -47)})`
        }).append(...intBoxEls);
    }

    get ungrpHTML() {
        return [this.intTickHTML, this.iconHTML, this.nameHTML, this.intNameHTML];
    }
}

class BranchStationGZ extends IntStationGZ {
    constructor (id: string, data: StationInfo, lineInf) {
        let newData = {
            ...data, 
            transfer: {
                ...data.transfer, 
                info: data.transfer.info.map((inf, idx) => idx===0 ? [lineInf].concat(inf) : inf)
            }
        }
        // data.transfer.info[0].unshift(lineInf);
        // if (data.transfer.info[1]) {
        //     data.transfer.info[0].push(...data.transfer.info[1]);
        // }
        super(id, newData);
    }

    set lineInfo(info: InterchangeInfo) {
        this._intInfos[0] = info;
    }

    get _nameShift() {return true;}
    get _tickRotation() {
        return (this.parents.indexOf(this.branch.left[1]) === 0 || this.children.indexOf(this.branch.right[1]) === 0) ? 0 : 180;
    }
}

class OSIStationGZ extends IntStationGZ {
    constructor (id: string, data: StationInfo) {
        // data.transfer.info[0].push(...data.transfer.info[1]);
        super(id, data);
    }
}

export { RMGStationGZ, IntStationGZ, BranchStationGZ, OSIStationGZ };