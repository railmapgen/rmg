import { joinIntName } from '../utils';
import { ID, Name, BranchInfo, StationInfo } from '../utils';

export enum IntInfoTag {
    city, line, colour, fg, nameZH, nameEN
};
export type InterchangeInfo = {
    [T in IntInfoTag]: string;
};

class RMGStation {
    STN_NAME_Y = -10.5;
    STN_NAME_BASE_HEIGHT = 30.390625;
    STN_NAME_LINE_GAP = 14;
    STN_NAME_BG_ADJUST = 0.5;

    public id: ID;
    public x: number;
    public y: number;
    public state: -1 | 0 | 1;
    public parents: ID[];
    public children: ID[];
    public namePos: boolean;
    public name: Name;
    public branch: BranchInfo;
    public stnNum: string;

    constructor (id: ID, data: StationInfo) {
        this.id = id;
        this.parents = data.parents;
        this.children = data.children;
        this.name = data.name;
        this.branch = data.branch;
    }

    get inDegree() {return this.parents.length;}
    get outDegree() {return this.children.length;}

    get nameClass(): string {
        switch (this.state) {
            case -1:
                return 'Pass';
            case 0:
                return 'Current';
            default:
                return 'Future';
        }
    }

    get _nameTxtAnchor() {return 'middle';}
    get _nameDX() {return 0;}
    get _nameDY() {return 0;}

    get nameHTML() {
        var nameENs = this.name[1].split('\\');

        if (this.namePos) {
            var dy = this.STN_NAME_LINE_GAP - this.STN_NAME_Y - this.STN_NAME_BG_ADJUST;
        } else {
            var dy = -this.STN_NAME_LINE_GAP - this.STN_NAME_Y - this.STN_NAME_BASE_HEIGHT - (nameENs.length-1)*10;
        }
        // dy -= this.STN_NAME_BG_ADJUST;

        if (this.state === 0) {
            $('#current_bg').attr({
                y: this.y + dy + this.STN_NAME_Y - 1.5 + this._nameDY, 
                height: this.STN_NAME_BASE_HEIGHT + (nameENs.length-1)*10 +2 +1.5
            });
        }

        var nameENp = nameENs.shift();

        var nameENElem = $('<text>', {
            dy: 15, class: 'rmg-name__en rmg-name__mtr--station'
        }).text(nameENp);
        while (nameENp = nameENs.shift()) {
            nameENElem.append(
                $('<tspan>', { x: 0, dy: 10, 'alignment-baseline':'middle' }).text(nameENp)
            );
        }

        return $('<g>', {
            transform: `translate(${this.x + this._nameDX},${this.y + dy + this._nameDY})`, 
            'text-anchor': this._nameTxtAnchor, 
            'class': `Name ${this.nameClass}`
        }).append(
            $('<text>').addClass('rmg-name__zh rmg-name__mtr--station').text(this.name[0])
        ).append(
            nameENElem
        );
    }

    get iconClass() {return this.state == -1 ? 'rmg-stn__mtr--pass' : 'rmg-stn__mtr--future';}

    get iconHTML() {
        return $('<use>', {
            'xlink:href': '#stn_hk', 
            x: this.x, y: this.y, 
            class: this.iconClass
        });
    }

    get ungrpHTML() {
        return [this.iconHTML, this.nameHTML];
    }

    get html() {
        return $('<g>', {id:this.id}).append(...this.ungrpHTML);
    }
}

class Int2Station extends RMGStation {
    private _intInfo: InterchangeInfo;

    constructor (id: ID, data: StationInfo) {
        super(id, data);
        this._intInfo = data.interchange[0][0];
    }

    get _dy() {return 0;}

    get intTickHTML() {
        var tickRotation = (this.namePos) ? 180 : 0;
        var tickColour = this._intInfo[IntInfoTag.colour];
        var tick = $('<use>', {
            'xlink:href': '#inttick_hk', 
            stroke: tickColour, 
            transform: `translate(${this.x},${this.y+this._dy})rotate(${tickRotation})`, 
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
        var [nameHTML, nameZHLn, nameENLn] = joinIntName([this._intInfo[IntInfoTag.nameZH], this._intInfo[IntInfoTag.nameEN]], 15, 7);
        var dy = (!this.namePos) ? 25 + 5.953125 : -25 + 5.953125 - 18.65625 - 13*(nameZHLn-1) - 7*(nameENLn-1);
        dy += this._dy;
        // var nameClass = (this.state == -1) ? 'Pass' : 'Future';
        return $('<g>', {
            'text-anchor': 'middle', 
            'transform': `translate(${this.x},${this.y + dy})`, 
            'class': `Name ${this._nameClass}`
        }).html(nameHTML[0]);
    }

    get ungrpHTML() {
        return [this.intTickHTML, this.iconHTML, this.nameHTML, this.intNameHTML];
    }
}

class Int3Station extends RMGStation {
    private _intInfos: InterchangeInfo[];
    private _intCity = []; 
    private _intLine = []; 
    private _intColour = [];
    private _intNameZH = []; 
    private _intNameEN = [];
    // _int3Type;

    constructor (id: ID, data) {
        super(id, data);
        this._intInfos = data.interchange[0];

        data.interchange[0].forEach(intInfo => {
            this._intCity.push(intInfo[0]);
            this._intLine.push(intInfo[1]);
            this._intColour.push(intInfo[2]);

            this._intNameZH.push(intInfo[4]);
            this._intNameEN.push(intInfo[5]);
        });

        // this._int3Type = data.change_type.substring(5);
    }

    get iconHTML() {
        let iconRotation = (!this.namePos) ? 0 : 180;
        return $('<use>', {
            'xlink:href': '#int3_hk', 
            transform: `translate(${this.x},${this.y})rotate(${iconRotation})`, 
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
                if (i >= 2) {return;}
                let tickColour = (this.state === -1) ? '#aaa' : c;
                let dy = (!this.namePos) ? 18*(i+1) : -18*(2-i);
                dy += this._dy;
                dy *= this._tickFlip;
                elems.push(
                    $('<use>', {
                        'xlink:href': '#inttick_hk', 
                        stroke: tickColour, 
                        transform: `translate(${this.x + this._dx},${this.y + dy})rotate(${this._tickRotation})`, 
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
                if (i >=2) {return;}
                let [nameHTML, nameZHLn, nameENLn] = joinIntName(names, 15, 7);
                var dy = (!this.namePos) ? 18*(i+1) : -18*(2-i);
                dy += this._dy;
                dy *= this._tickFlip;
                dy += 5.953125 - (19.65625 + 13*(nameZHLn-1) + 7*(nameENLn-1))/2;
                elems.push(
                    $('<g>', {
                        'text-anchor': this._txtAnchor, 
                        transform: `translate(${this.x + this._intNameDX},${this.y + dy})`, 
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

class Int3LStation extends Int3Station {
    get _tickRotation() {return 90;}
    get _txtAnchor() {return 'end';}
    get _intNameDX() {return -24;}
}

class Int3RStation extends Int3Station {
    get _tickRotation() {return -90;}
    get _txtAnchor() {return 'start';}
    get _intNameDX() {return 24;}
}

class OSI11Station extends Int2Station {
    private _osiNames: Name;
    private _osiType: 'u' | 'p';

    constructor (id: ID, data: StationInfo) {
        // data.int2 = data.osi11;
        data.interchange[0].push(data.interchange[1][1]);
        super(id, data);

        this._osiNames = data.interchange[1][0];
        this._osiType = data.change_type.substring(6,7); // u(npaid) or p(aid);
    }
    
    get osiClass() {return this._osiType == 'u' ? 'rmg-stn__mtr--unpaid-osi' : 'rmg-stn__mtr--paid-osi';}
    get iconHTML() {
        var iconRotation = (!this.namePos) ? 0 : 180;
        return $('<use>', {
            'xlink:href': '#osi11_hk', 
            'transform': `translate(${this.x},${this.y})rotate(${iconRotation})`, 
            class: [this.iconClass, this.osiClass].join(' ')
        });
    }

    get _dy() {return (!this.namePos) ? 26 : -26;}
    get _txtAnchor() {return 'middle';}
    get _osiNameDX() {return 0;}

    get osiNameHTML() {
        var dy = this._dy + 8.34375 - 25.03125/2;
        return $('<g>', {
            'text-anchor': this._txtAnchor, 
            'transform': `translate(${this.x+this._osiNameDX},${this.y+dy})`, 
            'class': 'Name ' + this._nameClass
        }).append(
            $('<text>').addClass('rmg-name__zh rmg-name__mtr--osi').text(this._osiNames[0])
        ).append(
            $('<text>', {
                'x':0, 'dy':12, 'class':'rmg-name__en rmg-name__mtr--osi'
            }).text(this._osiNames[1])
        );
    }

    get ungrpHTML() {
        return [this.intTickHTML, this.iconHTML, this.nameHTML, this.intNameHTML, this.osiNameHTML];
    }
}

class OSI11LStation extends OSI11Station {
    // OSI name on left
    get _txtAnchor() {return 'end';}
    get _osiNameDX() {return -13;}
}

class OSI11RStation extends OSI11Station {
    // OSI name on right
    get _txtAnchor() {return 'start';}
    get _osiNameDX() {return 13;}
}

class OSI12Station extends Int3Station {
    protected _osiNames: Name;
    private _osiType: 'u' | 'p';
    
    constructor (id: ID, data: StationInfo) {
        // data.int3 = data.osi12;
        data.interchange[0].unshift(...data.interchange[1].slice(1,3));
        super(id, data);

        this._osiNames = data.interchange[1][0];
        this._osiType = data.change_type.split('_').reverse()[0][0];
    }

    get osiClass() {return this._osiType == 'u' ? 'rmg-stn__mtr--unpaid-osi' : 'rmg-stn__mtr--paid-osi';}
    get iconHTML() {
        var iconRotation = (!this.namePos) ? 0 : 180;
        return $('<use>', {
            'xlink:href': '#osi12_hk', 
            transform: `translate(${this.x},${this.y})rotate(${iconRotation})`,
            class: [this.iconClass, this.osiClass].join(' ')
        });
    }

    get _dy() {return (!this.namePos) ? (26-18) : -8;}
    get _osiDY() {return (!this.namePos) ? (26+18+10) + 8.34375  : -(26+18+10) + 8.34375 - 25.03125;}
    get _osiTxtAnchor() {return 'middle';}
    get _osiDX() {return 0;}

    get osiNameHTML() {
        var nameClass = (this.state == -1) ? 'Pass' : 'Future';
        return $('<g>', {
            'text-anchor': this._osiTxtAnchor, 
            'transform': `translate(${this.x+this._dx+this._osiDX},${this.y+this._osiDY})`, 
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

class OSI12LStation extends OSI12Station {
    get _tickRotation() {return 90;}
    get _txtAnchor() {return 'end';}
    get _intNameDX() {return -24;}
}

class OSI12RStation extends OSI12Station {
    get _tickRotation() {return -90;}
    get _txtAnchor() {return 'start';}
    get _intNameDX() {return 24;}
}

class OSI22Station extends OSI12Station {
    private _origIntInfo: InterchangeInfo;

    constructor (id: ID, data: StationInfo) {
        super(id, data);
        // data mutated by OSI12Station!!!
        this._origIntInfo = data.interchange[0][2];
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
            transform: `translate(${this.x},${this.y})rotate(${tickRotation})`,
            'class': 'rmg-line rmg-line__mtr rmg-line__change'
        });
        if (this.state == -1) {
            tick.addClass('rmg-line__pass');
        }
        return tick;
    }

    get origIntNameHTML() {
        var [nameHTML, nameZHLn, nameENLn] = joinIntName([this._origIntInfo[IntInfoTag.nameZH], this._origIntInfo[IntInfoTag.nameEN]], 15, 7);
        var dy = this.namePos ? 25 + 5.953125 : -25 + 5.953125 - 18.65625 - 13*(nameZHLn-1) - 7*(nameENLn-1);
        // dy += this._dy;
        // var nameClass = (this.state == -1) ? 'Pass' : 'Future';
        return $('<g>', {
            'text-anchor': this._txtAnchor, 
            transform: `translate(${this.x - this._nameDX},${this.y + dy})`, 
            class: `Name ${this._nameClass}`
        }).html(nameHTML[0]);
    }

    get _osiNameDX(): number {return 0;}

    get osiNameHTML() {
        var dy = this._dy - (this.namePos ? 18+9 : -27) + 8.34375 - 25.03125/2;
        return $('<g>', {
            'text-anchor': this._osiTxtAnchor, 
            transform: `translate(${this.x+this._osiNameDX},${this.y+dy})`, 
            class: 'Name ' + this._nameClass
        }).append(
            $('<text>').addClass('rmg-name__zh rmg-name__mtr--osi').text(this._osiNames[0])
        ).append(
            $('<text>', {
                x:0, dy:12, class:'rmg-name__en rmg-name__mtr--osi'
            }).text(this._osiNames[1])
        );
    }

    get ungrpHTML() {
        return [
            ...this.intTickHTML, this.origIntTickHTML, 
            this.iconHTML, this.nameHTML, 
            ...this.intNameHTML, this.origIntNameHTML, this.osiNameHTML
        ]
    }
}

class OSI22LStation extends OSI22Station {
    get _nameDX() {return 3;}
    get _tickRotation() {return 90;}
    get _txtAnchor() {return 'end';}
    get _intNameDX() {return -24;}
    get _osiNameDX() {return 13;}
    get _osiTxtAnchor() {return 'start';}
}

class OSI22RStation extends OSI22Station {
    get _nameDX() {return -3;}
    get _tickRotation() {return -90;}
    get _txtAnchor() {return 'start';}
    get _intNameDX() {return 24;}
    get _osiNameDX() {return -13;}
    get _osiTxtAnchor() {return 'end';}
}

class OSI22EndStation extends OSI12Station {
    private _origIntCity: string; 
    private _origIntLine: string;
    private _origIntColour: string;
    private _origIntFg: string;
    private _origIntNameZH: string;
    private _origIntNameEN: string;

    constructor (id, data) {
        super(id, data);
        // data mutated by OSI12Station!!!
        [this._origIntCity, this._origIntLine, this._origIntColour, this._origIntFg, this._origIntNameZH, this._origIntNameEN] = data.interchange[0][2];
    }

    get origIntTickHTML() {
        var tickRotation = this.namePos ? 180 : 0;
        var tickColour = this._origIntColour;
        var tick = $('<use>', {
            'xlink:href': '#inttick_hk', 
            stroke: tickColour, 
            transform: `translate(${this.x},${this.y})rotate(${tickRotation})`,
            'class': 'rmg-line rmg-line__mtr rmg-line__change'
        });
        if (this.state == -1) {
            tick.addClass('rmg-line__pass');
        }
        return tick;
    }

    get origIntNameHTML() {
        var [nameHTML, nameZHLn, nameENLn] = joinIntName([this._origIntNameZH, this._origIntNameEN], 15, 7);
        var dy = !this.namePos ? 25 + 5.953125 : -25 + 5.953125 - 18.65625 - 13*(nameZHLn-1) - 7*(nameENLn-1);
        // dy += this._dy;
        // var nameClass = (this.state == -1) ? 'Pass' : 'Future';
        return $('<g>', {
            'text-anchor': 'middle', 
            'transform': `translate(${this.x},${this.y + dy})`, 
            'class': `Name ${this._nameClass}`
        }).html(nameHTML[0]);
    }

    get iconHTML() {
        var iconYFlip = this.namePos ? 1 : -1;
        var iconXFlip = (this.children[0] == 'lineend') ? 1 : -1;
        var iconRotation = (this.children[0] == 'lineend') ? 0 : 180;
        return $('<use>', {
            'xlink:href': '#osi22end_hk', 
            'transform': `translate(${this.x},${this.y})scale(${iconXFlip},${iconYFlip})`, 
            class: [this.iconClass, this.osiClass].join(' ')
        });
    }

    get _tickRotation() {return (this.children[0] == 'lineend') ? -90 : 90;}
    get _tickFlip() {return -1;}
    get _dx() {return (this.children[0] == 'lineend') ? 41 : -41;}
    get _dy() {return !this.namePos ? -18 : 18;}
    get _intNameDX() {return (this.children[0] == 'lineend') ? 24+41 : -(24+41);}
    get _txtAnchor() {return (this.children[0] == 'lineend') ? 'start' : 'end';}
    get _osiDY() {return !this.namePos ? (10) + 8.34375  : -(10) + 8.34375 - 25.03125;}
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

export { RMGStation, Int2Station, Int3LStation, Int3RStation, OSI11LStation, OSI11RStation, OSI12LStation, OSI12RStation, OSI22Station, OSI22LStation, OSI22RStation, OSI22EndStation };
