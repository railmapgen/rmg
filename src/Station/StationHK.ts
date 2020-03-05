import { RMGStation } from './Station';
import { StationInfo, InterchangeInfo, IntInfoTag, Name } from '../types';
import { joinIntName } from '../utils'

export class RMGStationHK extends RMGStation {
    /**
     * Top (in pixels) of station's Chinese name. 
     */
    NAME_ZH_TOP = -10.8125;
    /**
     * Height (in pixels) of station's Chinese name.
     */
    NAME_ZH_HEIGHT = 21.625;
    /**
     * Top (in pixels) of station's English name (1 line).
     */
    NAME_EN_TOP = -8;
    /**
     * Height (in pixels) of station's English name (1 line).
     */
    NAME_EN_HEIGHT = 13.21875;
    /**
     * Difference of `y`s of station's Chinese name and English name (1 line). (This number should used as the `dy` of the English `text` element after Chinese `text` elements. )
     */
    NAME_ZH_EN_GAP = 17;
    /**
     * Height (in pixels) from the top of station's Chinese name to the bottom of English name (1 line).
     */
    NAME_FULL_HEIGHT = -this.NAME_ZH_TOP + this.NAME_ZH_EN_GAP + this.NAME_EN_HEIGHT + this.NAME_EN_TOP;
    /**
     * Height (in pixels) of the gap between the centre of the line and the top of station's Chinese name. 
     */
    STN_NAME_LINE_GAP = 14;
    public namePos: boolean;
    public usage: 'airport' | 'disney' | 'hsr' | '';

    constructor (id: string, data: StationInfo) {
        super(id, data);
        this.usage = data.usage || '';
    }

    /**
     * Arrays of directions of the branches a station has. 
     */
    get _branchPos() {
        let pos: ('SE' | 'NE' | 'SW' | 'NW')[] = [];
        if (this.outDegree === 2) {
            pos.push(this.children.indexOf(this.branch.right[1]) === 1 ? 'SE' : 'NE');
        }
        if (this.inDegree === 2) {
            pos.push(this.parents.indexOf(this.branch.left[1]) === 1 ? 'SW' : 'NW');
        }
        return pos;
    }

    /**
     * Affix added to station icon's `href`. 
     */
    get _branchAffix() {
        let pos = this._branchPos;
        if (pos.length === 0) {return '';}
        if (pos.includes('NW') && pos.includes('SE')) {return '_bb';}
        if (pos.includes('NE') && pos.includes('SW')) {return '_bb';}
        return '_b';
    }

    /**
     * Changes of vertical position of station icon due to branching shift (11px/line width). Icon rotation should also be applied when using this property. 
     */
    get _branchDy() {
        let affix = this._branchAffix;
        if (affix === '') {
            return 0;
        } else if (affix === '_bb') {
            return this.namePos ? 9.68 : -9.68;
        } else {
            let pos = this._branchPos;
            if (pos.includes('SE') || pos.includes('SW')) {return this.namePos ? 9.68 : 0;}
            if (pos.includes('NE') || pos.includes('NW')) {return this.namePos ? 0 : -9.68;}
        }
    }

    /**
     * Changes of vertical position of other elements such as intTick or intName. The result of the ternary operator is the opposite of `this._branchDy`
     */
    get _branchElDy() {
        let affix = this._branchAffix;
        if (affix === '') {
            return 0;
        } else if (affix === '_bb') {
            return this.namePos ? -9.68 : 9.68;
        } else {
            let pos = this._branchPos;
            if (pos.includes('SE') || pos.includes('SW')) {return this.namePos ? 0 : 9.68;}
            if (pos.includes('NE') || pos.includes('NW')) {return this.namePos ? -9.68 : 0;}
        }
    }

    /**
     * Rotation of a station icon. 
     */
    get _iconRotation() {
        // do not rotate if station name is above the line
        return !this.namePos ? 0 :180;
    }

    get iconHTML() {
        return $('<use>', {
            'xlink:href': '#stn_hk' + this._branchAffix, 
            transform: `translate(${this.x},${this.y + this._branchDy})rotate(${this._iconRotation})`, 
            class: this.iconClass
        });
    }

    get _nameDX() {return 0;}

    get nameHTML() {
        var nameENs = this.name[1].split('\\');

        if (this.namePos) {
            var dy = this.STN_NAME_LINE_GAP - this.NAME_ZH_TOP;
        } else {
            var dy = -this.STN_NAME_LINE_GAP - this.NAME_ZH_TOP - this.NAME_FULL_HEIGHT - (nameENs.length-1)*11;
        }
        // dy -= this.STN_NAME_BG_ADJUST;

        let usageDX: number;
        if (this.usage === '') {
            usageDX = 0
        } else {
            if (this._nameDX === 0) {
                usageDX = (this.NAME_FULL_HEIGHT + 2 + 3) / 2;
                // 2: padding top and bottom
                // 3: margin
            } else if (this._nameDX < 0) {
                usageDX = 0;
            } else {
                usageDX = this.NAME_FULL_HEIGHT + 2 + 3 + this._nameDX;
            }
        }

        if (this.state === 0) {
            $('#current_bg').attr({
                y: this.y + dy + this.NAME_ZH_TOP + this._nameDY + this._branchDy - 1, 
                height: this.NAME_FULL_HEIGHT + (nameENs.length-1)*11 + 2
            });
        }

        var nameENp = nameENs.shift();

        var nameENElem = $('<text>', {
            x: usageDX, dy: this.NAME_ZH_EN_GAP, class: 'rmg-name__en rmg-name__mtr--station'
        }).text(nameENp);
        while (nameENp = nameENs.shift()) {
            nameENElem.append(
                $('<tspan>', { x: usageDX, dy: 11, 'alignment-baseline':'middle' }).text(nameENp)
            );
        }

        return $('<g>', {
            id: 'stn_name',
            transform: `translate(${this.x + this._nameDX},${this.y + dy + this._nameDY + this._branchDy})`, 
            'text-anchor': this._nameTxtAnchor, 
            'class': `Name ${this.nameClass}`
        }).append(
            $('<text>', {x:usageDX}).addClass('rmg-name__zh rmg-name__mtr--station').text(this.name[0])
        ).append(
            nameENElem
        );
    }

    get usageIconHTML() {
        if (this.usage === '') {return false;}
        let stnNameDim = ($(`#stn_icons #${this.id} g#stn_name`)[0] as Element as SVGGElement).getBBox();
        let x: number;
        if (this._nameDX === 0) {
            x = - (stnNameDim.width + 3) / 2;
        } else if (this._nameDX < 0) {
            x = - (this.NAME_FULL_HEIGHT + 2)/2 - stnNameDim.width + this._nameDX;
        } else {
            x = this._nameDX + (this.NAME_FULL_HEIGHT + 2) /2;
        }
        return $('<use>', {
            fill: this.state===-1 ? 'var(--rmg-grey)' : 'var(--rmg-black)',
            'xlink:href': '#' + this.usage, 
            y: this.NAME_ZH_TOP - 1 + (this.name[1].split('\\').length-1)*5.5,
            x: x
        });
    }
}

export class Int2StationHK extends RMGStationHK {
    private _intInfo: InterchangeInfo;

    constructor (id: string, data: StationInfo) {
        super(id, data);
        this._intInfo = data.transfer.info[0][0];
        // this._intInfo = data.interchange[0][0];
    }

    get _dy() {return 0;}

    get intTickHTML() {
        var tickColour = this._intInfo[IntInfoTag.colour];
        var tick = $('<use>', {
            'xlink:href': '#inttick_hk', 
            stroke: tickColour, 
            transform: `translate(${this.x},${this.y+this._dy+this._branchElDy})rotate(${this._iconRotation})`, 
            class: 'rmg-line rmg-line__mtr rmg-line__change'
        });
        if (this.state == -1) {
            tick.addClass('rmg-line__pass');
        }
        return tick;
    }

    get _nameClass() {
        return (this.state == -1) ? 'Pass' : 'Future';
    }

    get intNameHTML() {
        var [nameHTML, nameZHLn, nameENLn] = joinIntName([this._intInfo[IntInfoTag.nameZH], this._intInfo[IntInfoTag.nameEN]], 10, 7);
        var dy = (!this.namePos) ? 25 + 5.953125 : -25 + 5.953125 - 18.65625 - 13*(nameZHLn-1) - 7*(nameENLn-1);
        dy += this._dy;
        // var nameClass = (this.state == -1) ? 'Pass' : 'Future';
        return $('<g>', {
            'text-anchor': 'middle', 
            'transform': `translate(${this.x},${this.y + dy + this._branchElDy})`, 
            'class': `Name ${this._nameClass}`
        }).html(nameHTML[0]);
    }

    get ungrpHTML() {
        return [this.intTickHTML, this.iconHTML, this.nameHTML, this.intNameHTML];
    }
}

class Int3StationHK extends RMGStationHK {
    private _intInfos: InterchangeInfo[];

    constructor (id: string, data: StationInfo) {
        super(id, data);
        this._intInfos = data.transfer.info[0];
    }

    get iconHTML() {
        let n = Math.min(this._intInfos.length+1, 5);
        return $('<use>', {
            'xlink:href': '#int' + n + '_hk' + this._branchAffix, 
            transform: `translate(${this.x},${this.y+this._branchDy})rotate(${this._iconRotation})`, 
            class: this.iconClass
        });
    }

    get _tickRotation() {return 0;}
    get _dy() {return 0;}
    get _dx() {return 0;}
    get _tickFlip() {return 1;}

    get intTickHTML() {
        let elems: JQuery<HTMLElement>[] = [];
        this._intInfos
            .map(info => info[IntInfoTag.colour])
            .forEach((c, i) => {
                if (i >= 4) {return;}
                let tickColour = (this.state === -1) ? '#aaa' : c;
                let dy = (!this.namePos) ? 18*(i+1) : -18*(this._intInfos.length-i);
                dy += this._dy;
                dy *= this._tickFlip;
                elems.push(
                    $('<use>', {
                        'xlink:href': '#inttick_hk', 
                        stroke: tickColour, 
                        transform: `translate(${this.x + this._dx},${this.y + dy + this._branchElDy})rotate(${this._tickRotation})`, 
                        class: 'rmg-line rmg-line__mtr rmg-line__change'
                    })
                );
            });
        return elems;
    }

    get _txtAnchor() {return 'middle';}
    get _intNameDX() {return 0;}
    get _nameClass() {return (this.state == -1) ? 'Pass' : 'Future';}

    get intNameHTML() {
        // var str = '';
        let elems: JQuery<HTMLElement>[] = [];
        let nameClass = this._nameClass;

        this._intInfos
            .map(info => [info[IntInfoTag.nameZH], info[IntInfoTag.nameEN]] as Name)
            .forEach((names, i) => {
                if (i >=4) {return;}
                let [nameHTML, nameZHLn, nameENLn] = joinIntName(names, 10, 7);
                var dy = (!this.namePos) ? 18*(i+1) : -18*(this._intInfos.length-i);
                dy += this._dy;
                dy *= this._tickFlip;
                dy += 5.953125 - (19.65625 + 13*(nameZHLn-1) + 7*(nameENLn-1))/2;
                elems.push(
                    $('<g>', {
                        'text-anchor': this._txtAnchor, 
                        transform: `translate(${this.x + this._intNameDX},${this.y + dy + this._branchElDy})`, 
                        class: 'Name ' + nameClass
                    }).html(nameHTML[0])
                );
            });
        return elems;
    }

    get ungrpHTML() {
        return [...this.intTickHTML, this.iconHTML, this.nameHTML, ...this.intNameHTML];
    }
}

export class Int3LStationHK extends Int3StationHK {
    get _tickRotation() {return 90;}
    get _txtAnchor() {return 'end';}
    get _intNameDX() {return -24;}
}

export class Int3RStationHK extends Int3StationHK {
    get _tickRotation() {return -90;}
    get _txtAnchor() {return 'start';}
    get _intNameDX() {return 24;}
}

class OSI11StationHK extends Int2StationHK {
    private _osiNames: Name;
    private _osiType: 'u' | 'p';

    constructor (id: string, data: StationInfo) {
        // data.int2 = data.osi11;
        let newData = {
            ...data, 
            transfer: {
                ...data.transfer, 
                info: data.transfer.info
                    .map((inf, idx) => idx===0 ? inf.concat([data.transfer.info[1][0]]) : inf)
            }
        }
        // data.transfer.info[0].push(data.transfer.info[1][0]);
        // data.interchange[0].push(data.interchange[1][1]);
        super(id, newData);

        this._osiNames = data.transfer.osi_names[0];
        this._osiType = data.transfer.paid_area ? 'p' : 'u'; // u(npaid) or p(aid);
    }
    
    get osiClass() {return this._osiType == 'u' ? 'rmg-stn__mtr--unpaid-osi' : 'rmg-stn__mtr--paid-osi';}
    get iconHTML() {
        return $('<use>', {
            'xlink:href': '#osi11_hk' + this._branchAffix, 
            'transform': `translate(${this.x},${this.y+this._branchDy})rotate(${this._iconRotation})`, 
            class: [this.iconClass, this.osiClass].join(' ')
        });
    }

    get _dy() {return (!this.namePos) ? 26 : -26;}
    get _txtAnchor() {return 'middle';}
    get _osiNameDX() {return 0;}

    get osiNameHTML() {
        var dy = this._dy + 8.34375 - 25.03125/2 - (!this.namePos ? 0 : 10*(this._osiNames[1].split('\\').length-1));
        let el = $('<g>', {
            'text-anchor': this._txtAnchor, 
            'transform': `translate(${this.x+this._osiNameDX},${this.y+dy+this._branchElDy})`, 
            'class': 'Name ' + this._nameClass
        }).append(
            $('<text>').addClass('rmg-name__zh rmg-name__mtr--osi').text(this._osiNames[0])
        )

        this._osiNames[1].split('\\').forEach((txt, i) => {
            el.append(
                $('<text>', {
                    x: 0, dy: 12+i*10, class: 'rmg-name__en rmg-name__mtr--osi'
                }).text(txt)
            );
        });

        return el;
    }

    get ungrpHTML() {
        return [this.intTickHTML, this.iconHTML, this.nameHTML, this.intNameHTML, this.osiNameHTML];
    }
}

export class OSI11LStationHK extends OSI11StationHK {
    // OSI name on left
    get _txtAnchor() {return 'end';}
    get _osiNameDX() {return -13;}
}

export class OSI11RStationHK extends OSI11StationHK {
    // OSI name on right
    get _txtAnchor() {return 'start';}
    get _osiNameDX() {return 13;}
}

class OSI12StationHK extends Int3StationHK {
    protected _osiNames: Name;
    private _osiType: 'u' | 'p';
    
    constructor (id: string, data: StationInfo) {
        // data.int3 = data.osi12;
        let newData = {
            ...data, 
            transfer: {
                ...data.transfer, 
                info: data.transfer.info
                    .map((inf,idx) => idx===0 ? data.transfer.info[1].slice(0,2) : inf),
            }
        }
        // data.transfer.info[0].unshift(...data.transfer.info[1].slice(0,2));
        // data.interchange[0].unshift(...data.interchange[1].slice(1,3));
        super(id, newData);

        this._osiNames = data.transfer.osi_names[0];
        this._osiType = data.transfer.paid_area ? 'p' : 'u';
    }

    get osiClass() {return this._osiType == 'u' ? 'rmg-stn__mtr--unpaid-osi' : 'rmg-stn__mtr--paid-osi';}
    get iconHTML() {
        return $('<use>', {
            'xlink:href': '#osi12_hk' + this._branchAffix, 
            transform: `translate(${this.x},${this.y+this._branchDy})rotate(${this._iconRotation})`,
            class: [this.iconClass, this.osiClass].join(' ')
        });
    }

    get _dy() {return (!this.namePos) ? (26-18) : -8;}
    get _osiDY() {return (!this.namePos) ? (26+18+10) + 8.34375  : -(26+18+10) + 8.34375 - 25.03125 - 10*(this._osiNames[1].split('\\').length-1);}
    get _osiTxtAnchor() {return 'middle';}
    get _osiDX() {return 0;}

    get osiNameHTML() {
        var nameClass = (this.state == -1) ? 'Pass' : 'Future';
        return $('<g>', {
            'text-anchor': this._osiTxtAnchor, 
            'transform': `translate(${this.x+this._dx+this._osiDX},${this.y+this._osiDY+this._branchElDy})`, 
            'class': `Name ${nameClass}`
        }).append(
            $('<text>').addClass('rmg-name__zh rmg-name__mtr--osi').text(this._osiNames[0])
        ).append(
            $('<text>', {
                'x':0, 'dy':12, 'class':'rmg-name__en rmg-name__mtr--osi'
            }).text(this._osiNames[1].split('\\')[0]).append(
                $('<tspan>', {x:0, dy:10}).text(this._osiNames[1].split('\\')[1] || '')
            )
        );
    }

    get ungrpHTML() {
        return [...this.intTickHTML, this.iconHTML, this.nameHTML, ...this.intNameHTML, this.osiNameHTML];
    }
}

export class OSI12LStationHK extends OSI12StationHK {
    get _tickRotation() {return 90;}
    get _txtAnchor() {return 'end';}
    get _intNameDX() {return -24;}
}

export class OSI12RStationHK extends OSI12StationHK {
    get _tickRotation() {return -90;}
    get _txtAnchor() {return 'start';}
    get _intNameDX() {return 24;}
}

export class OSI22StationHK extends OSI12StationHK {
    private _origIntInfo: InterchangeInfo;

    constructor (id: string, data: StationInfo) {
        super(id, data);
        // data mutated by OSI12Station!!!
        this._origIntInfo = data.transfer.info[0][0];
    }

    get _nameTxtAnchor() {return this._osiTxtAnchor;}
    get _nameDY() {
        return this.namePos ? 11.515625 : -11.515625;
    }

    get origIntTickHTML() {
        var tickRotation = this.namePos ? 0 : 180;
        var tickColour = this._origIntInfo[IntInfoTag.colour];
        var tick = $('<use>', {
            'xlink:href': '#inttick_hk', 
            stroke: tickColour, 
            transform: `translate(${this.x},${this.y+this._branchDy})rotate(${tickRotation})`,
            'class': 'rmg-line rmg-line__mtr rmg-line__change'
        });
        if (this.state == -1) {
            tick.addClass('rmg-line__pass');
        }
        return tick;
    }

    get origIntNameHTML() {
        var [nameHTML, nameZHLn, nameENLn] = joinIntName([this._origIntInfo[IntInfoTag.nameZH], this._origIntInfo[IntInfoTag.nameEN]], 10, 7);
        var dy = this.namePos ? 25 + 5.953125 : -25 + 5.953125 - 18.65625 - 13*(nameZHLn-1) - 7*(nameENLn-1);
        // dy += this._dy;
        // var nameClass = (this.state == -1) ? 'Pass' : 'Future';
        return $('<g>', {
            'text-anchor': this._txtAnchor, 
            transform: `translate(${this.x - this._nameDX},${this.y + dy + this._branchDy})`, 
            class: `Name ${this._nameClass}`
        }).html(nameHTML[0]);
    }

    get _osiNameDX(): number {return 0;}

    get osiNameHTML() {
        var dy = this._dy - (this.namePos ? 18+9 : -27) + 8.34375 - 25.03125/2 - 5*(this._osiNames[1].split('\\').length-1);
        let el = $('<g>', {
            'text-anchor': this._osiTxtAnchor, 
            transform: `translate(${this.x+this._osiNameDX},${this.y+dy})`, 
            class: 'Name ' + this._nameClass
        }).append(
            $('<text>').addClass('rmg-name__zh rmg-name__mtr--osi').text(this._osiNames[0])
        );
        this._osiNames[1].split('\\').forEach((txt,i) => {
            el.append(
                $('<text>', {
                    x:0, dy:12+i*10, class:'rmg-name__en rmg-name__mtr--osi'
                }).text(txt)
            );
        });
        return el;
    }

    get ungrpHTML() {
        return [
            ...this.intTickHTML, this.origIntTickHTML, 
            this.iconHTML, this.nameHTML, 
            ...this.intNameHTML, this.origIntNameHTML, this.osiNameHTML
        ]
    }
}

export class OSI22LStationHK extends OSI22StationHK {
    get _nameDX() {return 3;}
    get _tickRotation() {return 90;}
    get _txtAnchor() {return 'end';}
    get _intNameDX() {return -24;}
    get _osiNameDX() {return 13;}
    get _osiTxtAnchor() {return 'start';}
}

export class OSI22RStationHK extends OSI22StationHK {
    get _nameDX() {return -3;}
    get _tickRotation() {return -90;}
    get _txtAnchor() {return 'start';}
    get _intNameDX() {return 24;}
    get _osiNameDX() {return -13;}
    get _osiTxtAnchor() {return 'end';}
}

export class OSI22EndStationHK extends OSI12StationHK {
    private _origIntCity: string; 
    private _origIntLine: string;
    private _origIntColour: string;
    private _origIntFg: string;
    private _origIntNameZH: string;
    private _origIntNameEN: string;

    constructor (id, data) {
        super(id, data);
        // data mutated by OSI12Station!!!
        [this._origIntCity, this._origIntLine, this._origIntColour, this._origIntFg, this._origIntNameZH, this._origIntNameEN] = data.transfer.info[0][0];
    }

    get origIntTickHTML() {
        var tickRotation = this.namePos ? 180 : 0;
        var tickColour = this._origIntColour;
        var tick = $('<use>', {
            'xlink:href': '#inttick_hk', 
            stroke: tickColour, 
            transform: `translate(${this.x},${this.y+this._branchElDy})rotate(${tickRotation})`,
            'class': 'rmg-line rmg-line__mtr rmg-line__change'
        });
        if (this.state == -1) {
            tick.addClass('rmg-line__pass');
        }
        return tick;
    }

    get origIntNameHTML() {
        var [nameHTML, nameZHLn, nameENLn] = joinIntName([this._origIntNameZH, this._origIntNameEN], 10, 7);
        var dy = !this.namePos ? 25 + 5.953125 : -25 + 5.953125 - 18.65625 - 13*(nameZHLn-1) - 7*(nameENLn-1);
        // dy += this._dy;
        // var nameClass = (this.state == -1) ? 'Pass' : 'Future';
        return $('<g>', {
            'text-anchor': 'middle', 
            'transform': `translate(${this.x},${this.y + dy + this._branchElDy})`, 
            'class': `Name ${this._nameClass}`
        }).html(nameHTML[0]);
    }

    get iconHTML() {
        var iconYFlip = this.namePos ? 1 : -1;
        var iconXFlip = (this.children[0] == 'lineend') ? 1 : -1;
        var iconRotation = (this.children[0] == 'lineend') ? 0 : 180;
        return $('<use>', {
            'xlink:href': '#osi22end_hk' + this._branchAffix,
            'transform': `translate(${this.x},${this.y+this._branchElDy})scale(${iconXFlip},${iconYFlip})`, 
            class: [this.iconClass, this.osiClass].join(' ')
        });
    }

    get _tickRotation() {return (this.children[0] == 'lineend') ? -90 : 90;}
    get _tickFlip() {return -1;}
    get _dx() {return (this.children[0] == 'lineend') ? 41 : -41;}
    get _dy() {
        let affix = this._branchAffix;
        if (affix === '') {
            return !this.namePos ? -18 : 18;
        } else {
            return !this.namePos ? -18 + 9.68 : 18 - 9.68;
        }
    }
    get _intNameDX() {return (this.children[0] == 'lineend') ? 24+41 : -(24+41);}
    get _txtAnchor() {return (this.children[0] == 'lineend') ? 'start' : 'end';}
    get _osiDY() {
        let affix = this._branchAffix;
        if (affix === '') {
            return !this.namePos ? (10) + 8.34375  : -(10) + 8.34375 - 25.03125 - 10*(this._osiNames[1].split('\\').length-1);
        } else {
            return !this.namePos ? (10) + 8.34375 - 9.68  : -(10) + 8.34375 - 25.03125 + 9.68 - 10*(this._osiNames[1].split('\\').length-1);
        }
    }
    get _osiTxtAnchor() {return (this.children[0] == 'lineend') ? 'start' : 'end';}
    get _osiDX() {return (this.children[0] == 'lineend') ? -9 : 9;}

    get ungrpHTML() {
        return [
            ...this.intTickHTML, this.origIntTickHTML, 
            this.iconHTML, this.nameHTML, 
            ...this.intNameHTML, this.origIntNameHTML, this.osiNameHTML
        ]
    }
}
