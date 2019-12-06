'use strict';

class Station {
    STN_NAME_Y = -10.5;
    STN_NAME_BASE_HEIGHT = 30.390625;
    STN_NAME_LINE_GAP = 14;
    STN_NAME_BG_ADJUST = 0.5;

    _x; _y; _id; _state; 
    _namePos; _branch;

    constructor (id, data) {
        this._id = id;
        this._parents = data.parents;
        this._children = data.children;
        [this._nameZH, this._nameEN] = data.name;
        this._branch = data.branch;
    }

    set x(val) {this._x = val;}
    set y(val) {this._y = val;}
    set _state(val) {this._state = val;}

    set namePos(pos) {
        // 0: upper, 1: lower
        this._namePos = pos;
    }

    get inDegree() {return this._parents.length;}
    get outDegree() {return this._children.length;}

    get nameClass() {
        switch (this._state) {
            case -1:
                return 'Pass';
            case 0:
                return 'Current';
            default:
                return 'Future';
        }
    }

    get nameHTML() {
        var nameENs = this._nameEN.split('\\');
        
        if (this._namePos == 1) {
            var dy = this.STN_NAME_LINE_GAP - this.STN_NAME_Y;
        } else {
            var dy = -this.STN_NAME_LINE_GAP - this.STN_NAME_Y - this.STN_NAME_BASE_HEIGHT - (nameENs.length-1)*10;
        }
        dy -= this.STN_NAME_BG_ADJUST;

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
            transform: `translate(${this._x},${this._y + dy})`, 
            'text-anchor': 'middle', 
            'class': `Name ${this.nameClass}`
        }).append(
            $('<text>').addClass('rmg-name__zh rmg-name__mtr--station').text(this._nameZH)
        ).append(
            nameENElem
        );
    }

    get iconClass() {return this._state == -1 ? 'rmg-stn__mtr--pass' : 'rmg-stn__mtr--future';}

    get iconHTML() {
        return $('<use>', {
            'xlink:href': '#stn_hk', 
            x: this._x, y: this._y, 
            class: this.iconClass
        });
    }

    get ungrpHTML() {
        return [this.iconHTML, this.nameHTML];
    }

    get html() {
        return $('<g>', {'id':this._id}).append(...this.ungrpHTML);
    }
}

class Int2Station extends Station {
    #intCity; #intLine; #intColour;
    #intNameZH; #intNameEN;

    constructor (id, data) {
        super(id, data);
        [this.#intCity, this.#intLine, this.#intColour, this.#intNameZH, this.#intNameEN] = data.interchange[0][0];
    }

    get _dy() {return 0;}

    get intTickHTML() {
        var tickRotation = (this._namePos == 1) ? 180 : 0;
        var tickColour = this.#intColour;
        var tick = $('<use>', {
            'xlink:href': '#inttick_hk', 
            'stroke': tickColour, 
            transform: `translate(${this._x},${this._y+this._dy})rotate(${tickRotation})`, 
            'class': 'rmg-line rmg-line__mtr rmg-line__change'
        });
        if (this._state == -1) {
            tick.addClass('rmg-line__pass');
        }
        return tick;
    }

    get _nameClass() {
        return (this._state == -1) ? 'Pass' : 'Future';
    }

    get intNameHTML() {
        var [nameHTML, nameZHLn, nameENLn] = joinIntName([this.#intNameZH, this.#intNameEN], 15, 7);
        var dy = (this._namePos == 0) ? 25 + 5.953125 : -25 + 5.953125 - 18.65625 - 13*(nameZHLn-1) - 7*(nameENLn-1);
        dy += this._dy;
        // var nameClass = (this._state == -1) ? 'Pass' : 'Future';
        return $('<g>', {
            'text-anchor': 'middle', 
            'transform': `translate(${this._x},${this._y + dy})`, 
            'class': `Name ${this._nameClass}`
        }).html(nameHTML);
    }

    get ungrpHTML() {
        return [this.intTickHTML, this.iconHTML, this.nameHTML, this.intNameHTML];
    }
}

class Int3Station extends Station {
    #intCity = []; 
    #intLine = []; 
    #intColour = [];
    #intNameZH = []; 
    #intNameEN = [];
    _int3Type;

    constructor (id, data) {
        super(id, data);

        data.interchange[0].forEach(intInfo => {
            this.#intCity.push(intInfo[0]);
            this.#intLine.push(intInfo[1]);
            this.#intColour.push(intInfo[2]);

            this.#intNameZH.push(intInfo[3]);
            this.#intNameEN.push(intInfo[4]);
        });

        this._int3Type = data.change_type.substring(5);
    }

    get iconHTML() {
        // var iconType = (this._state == -1) ? 'int3_hk_pass' : 'int3_hk';
        // var iconClass = this._state == -1 ? 'rmg-stn__mtr--pass' : 'rmg-stn__mtr--future';
        var iconRotation = (this._namePos != 1) ? 0 : 180;
        return $('<use>', {
            'xlink:href': '#int3_hk', 
            'transform': `translate(${this._x},${this._y})rotate(${iconRotation})`, 
            class: this.iconClass
        });
    }

    get _tickRotation() {return 0;}
    get _dy() {return 0;}
    get _dx() {return 0;}
    get _tickFlip() {return 1;}

    get intTickHTML() {
        var elems = [];
        [0, 1].forEach(i => {
            var tickColour = (this._state == -1) ? '#aaa' : this.#intColour[i];
            var dy = (this._namePos != 1) ? 18*(i+1) : -18*(i+1);
            dy += this._dy;
            dy *= this._tickFlip;
            elems.push(
                $('<use>', {
                    'xlink:href': '#inttick_hk', 
                    stroke: tickColour, 
                    transform: `translate(${this._x + this._dx},${this._y + dy})rotate(${this._tickRotation})`, 
                    class: 'rmg-line rmg-line__mtr rmg-line__change'
                })
            );
        });
        return elems;
    }

    get _txtAnchor() {return 'middle';}
    get _intNameDX() {return 0;}
    get _nameClass() {return (this._state == -1) ? 'Pass' : 'Future';}

    get intNameHTML() {
        // var str = '';
        var elems = [];
        var nameClass = this._nameClass;

        [0, 1].forEach(i => {
            var [nameHTML, nameZHLn, nameENLn] = joinIntName([this.#intNameZH[i], this.#intNameEN[i]], 15, 7)
            // var dy = (this._namePos == 0) ? 25 + 5.953125 : -25 + 5.953125 - 19.65625 - 13*(nameZHLn-1) - 7*(nameENLn-1);
            var dy = (this._namePos == 0) ? 18*(i+1) : -18*(i+1)
            dy += this._dy;
            dy *= this._tickFlip;
            dy += 5.953125 - (19.65625 + 13*(nameZHLn-1) + 7*(nameENLn-1))/2;
            // dy += this._dy;
            elems.push(
                $('<g>', {
                    'text-anchor': this._txtAnchor, 
                    'transform': `translate(${this._x + this._intNameDX},${this._y + dy})`, 
                    'class': 'Name ' + nameClass
                }).html(nameHTML)
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
    #osiNameZH; #osiNameEN; 
    #osiType; #osiDirection;
    constructor (id, data) {
        // data.int2 = data.osi11;
        data.interchange[0].push(data.interchange[1][1]);
        super(id, data);

        // [this.#osiNameZH, this.#osiNameEN] = data.transfer[0];
        [this.#osiNameZH, this.#osiNameEN] = data.interchange[1][0];

        this.#osiType = data.change_type.substring(6,7); // u(npaid) or p(aid);
        this.#osiDirection = data.change_type.substring(7); // l or r;
    }
    
    get osiClass() {return this.#osiType == 'u' ? 'rmg-stn__mtr--unpaid-osi' : 'rmg-stn__mtr--paid-osi';}
    get iconHTML() {
        var iconRotation = (this._namePos != 1) ? 0 : 180;
        return $('<use>', {
            'xlink:href': '#osi11_hk', 
            'transform': `translate(${this._x},${this._y})rotate(${iconRotation})`, 
            class: [this.iconClass, this.osiClass].join(' ')
        });
    }

    get _dy() {return (this._namePos == 0) ? 26 : -26;}
    get _txtAnchor() {return 'middle';}
    get _osiNameDX() {return 0;}

    get osiNameHTML() {
        var dy = this._dy + 8.34375 - 25.03125/2;
        return $('<g>', {
            'text-anchor': this._txtAnchor, 
            'transform': `translate(${this._x+this._osiNameDX},${this._y+dy})`, 
            'class': 'Name ' + this._nameClass
        }).append(
            $('<text>').addClass('rmg-name__zh rmg-name__mtr--osi').text(this.#osiNameZH)
        ).append(
            $('<text>', {
                'x':0, 'dy':12, 'class':'rmg-name__en rmg-name__mtr--osi'
            }).text(this.#osiNameEN)
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
    #osiNameZH; #osiNameEN; 
    #osiType; #osiDirection;
    constructor (id, data) {
        // data.int3 = data.osi12;
        data.interchange[0].unshift(...data.interchange[1].slice(1,3));
        super(id, data);

        // [this.#osiNameZH, this.#osiNameEN] = data.transfer[0];
        [this.#osiNameZH, this.#osiNameEN] = data.interchange[1][0];

        // this.#osiType = data.change_type.substring(6,7); // u(npaid) or p(aid);
        this.#osiType = data.change_type.split('_').reverse()[0];
        this.#osiDirection = data.change_type.substring(7); // l or r;
    }

    get osiClass() {return this.#osiType == 'u' ? 'rmg-stn__mtr--unpaid-osi' : 'rmg-stn__mtr--paid-osi';}
    get iconHTML() {
        var iconRotation = (this._namePos != 1) ? 0 : 180;
        return $('<use>', {
            'xlink:href': '#osi12_hk', 
            'transform': `translate(${this._x},${this._y})rotate(${iconRotation})`,
            class: [this.iconClass, this.osiClass].join(' ')
        });
    }

    get _dy() {return (this._namePos == 0) ? (26-18) : -8;}
    get _osiDY() {return (this._namePos == 0) ? (26+18+10) + 8.34375  : -(26+18+10) + 8.34375 - 25.03125;}
    get _osiTxtAnchor() {return 'middle';}
    get _osiDX() {return 0;}

    get osiNameHTML() {
        var nameClass = (this._state == -1) ? 'Pass' : 'Future';
        return $('<g>', {
            'text-anchor': this._osiTxtAnchor, 
            'transform': `translate(${this._x+this._dx+this._osiDX},${this._y+this._osiDY})`, 
            'class': `Name ${nameClass}`
        }).append(
            $('<text>').addClass('rmg-name__zh rmg-name__mtr--osi').text(this.#osiNameZH)
        ).append(
            $('<text>', {
                'x':0, 'dy':12, 'class':'rmg-name__en rmg-name__mtr--osi'
            }).text(this.#osiNameEN.split('\\')[0]).append(
                $('<tspan>', {'x':0, 'dy':10}).text(this.#osiNameEN.split('\\')[1] || '')
            )
        );
    }

    get ungrpHTML() {
        return [this.intTickHTML, this.iconHTML, this.nameHTML, this.intNameHTML, this.osiNameHTML];
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

class OSI22EndStation extends OSI12Station {
    #origIntCity; #origIntLine; #origIntColour;
    #origIntNameZH; #origIntNameEN;

    constructor (id, data) {
        super(id, data);
        // data mutated by OSI12Station!!!
        [this.#origIntCity, this.#origIntLine, this.#origIntColour, this.#origIntNameZH, this.#origIntNameEN] = data.interchange[0][2];
    }

    get origIntTickHTML() {
        var tickRotation = (this._namePos == 1) ? 180 : 0;
        var tickColour = this.#origIntColour;
        var tick = $('<use>', {
            'xlink:href': '#inttick_hk', 
            stroke: tickColour, 
            transform: `translate(${this._x},${this._y})rotate(${tickRotation})`,
            'class': 'rmg-line rmg-line__mtr rmg-line__change'
        });
        if (this._state == -1) {
            tick.addClass('rmg-line__pass');
        }
        return tick;
    }

    get origIntNameHTML() {
        var [nameHTML, nameZHLn, nameENLn] = joinIntName([this.#origIntNameZH, this.#origIntNameEN], 15, 7);
        var dy = (this._namePos == 0) ? 25 + 5.953125 : -25 + 5.953125 - 18.65625 - 13*(nameZHLn-1) - 7*(nameENLn-1);
        // dy += this._dy;
        // var nameClass = (this._state == -1) ? 'Pass' : 'Future';
        return $('<g>', {
            'text-anchor': 'middle', 
            'transform': `translate(${this._x},${this._y + dy})`, 
            'class': `Name ${this._nameClass}`
        }).html(nameHTML);
    }

    get iconHTML() {
        var iconYFlip = (this._namePos == 1) ? 1 : -1;
        var iconXFlip = (this._children == 'lineend') ? 1 : -1;
        var iconRotation = (this._children == 'lineend') ? 0 : 180;
        return $('<use>', {
            'xlink:href': '#osi22end_hk', 
            'transform': `translate(${this._x},${this._y})scale(${iconXFlip},${iconYFlip})`, 
            class: [this.iconClass, this.osiClass].join(' ')
        });
    }

    get _tickRotation() {return (this._children == 'lineend') ? -90 : 90;}
    get _tickFlip() {return -1;}
    get _dx() {return (this._children == 'lineend') ? 41 : -41;}
    get _dy() {return (this._namePos == 0) ? -18 : 18;}
    get _intNameDX() {return (this._children == 'lineend') ? 24+41 : -(24+41);}
    get _txtAnchor() {return (this._children == 'lineend') ? 'start' : 'end';}
    get _osiDY() {return (this._namePos == 0) ? (10) + 8.34375  : -(10) + 8.34375 - 25.03125;}
    get _osiTxtAnchor() {return (this._children == 'lineend') ? 'start' : 'end';}
    get _osiDX() {return (this._children == 'lineend') ? -9 : 9;}

    get ungrpHTML() {
        return [
            this.intTickHTML, this.origIntTickHTML, 
            this.iconHTML, this.nameHTML, 
            this.intNameHTML, this.origIntNameHTML, this.osiNameHTML
        ]
    }
}

class StationGZ extends Station {
    constructor(id, data) {
        super(id, data);
    }

    get nameClass() {
        switch (this._state) {
            case -1:
                return 'Pass';
            case 0:
                return 'CurrentGZ';
            default:
                return 'Future';
        }
    }

    get iconHTML() {
        var iconType = (this._state == -1) ? 'stn_gz_pass' : 'stn_gz';
        return $('<use>', {
            'xlink:href': '#' + iconType, 
            'x': this._x, 
            'y': this._y
        });
    }

    get nameHTML() {
        var nameENLn = 1
        var dx = 30 * Math.cos(-45) * 0.8
        var dy = -4 - 21.921875;
        return $('<g>', {
            'transform': `translate(${this._x - dx},${this._y + dy})rotate(-45)`, 
            'text-anchor': 'start', 
            'class': `Name ${this.nameClass}`
        }).append(
            $('<text>').addClass('rmg-name__zh rmg-name__gzmtr--station').text(this._nameZH)
        ).append(
            $('<text>', {
                'dy': 14, 'class': 'rmg-name__en rmg-name__gzmtr--station'
            }).text(this._nameEN.replace('\\', ' ')).append(
                $('<tspan>', {
                    'x': 0, 'dy': 12
                }).text()
            )
        );
    }
}

class Int2StationGZ extends StationGZ {
    constructor(id, data) {
        super(id, data);
    }
}