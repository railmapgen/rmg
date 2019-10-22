'use strict';

class Station {
    _x; _y; _id; _state; 
    _namePos;

    constructor (id, data) {
        this._id = id;
        this._parents = data.parents;
        this._children = data.children;
        [this._nameZH, this._nameEN] = data.name;
    }

    set x(val) {this._x = val;}
    // get x() {return this._x;}

    set y(val) {this._y = val;}
    // get y() {return this._y;}

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
        var nameENLn = this._nameEN.split('\\').length;
        var dy = (this._namePos == 1) ? 12 + 11.843775 : -12 - 21.921875 - ((nameENLn == 2) ? 10 : 0);
        switch (this._state) {
            case -1:
                var nameClass = 'Pass';
                break;
            case 0:
                var nameClass = 'Current';
                break;
            default:
                var nameClass = 'Future';
        }
        return `<g text-anchor="middle" class="Name ${nameClass}" transform="translate(${this._x},${this._y + dy})">
                <text class="StnNameZH"> ${this._nameZH} </text> 
                <text dy="15" class="StnNameEN">${this._nameEN.split('\\')[0]}
                <tspan x="0" dy="12">${(nameENLn==2)?this._nameEN.split('\\')[1]:''}</tspan></text> 
                </g>`;
    }

    get iconHTML() {
        var iconType = (this._state == -1) ? 'stn_hk_pass' : 'stn_hk';
        return `<use xlink:href="#${iconType}" transform="translate(${this._x},${this._y})"/>`;
    }

    get ungrpHTML() {
        return this.iconHTML + this.nameHTML;
    }

    get html() {
        return `<g id="${this._id}"> ${this.ungrpHTML} </g>`;
    }
}

class Int2Station extends Station {
    #intCity; #intLine; #intColour;
    #intNameZH; #intNameEN;
    // constructor (id, par, child, names, int2) {
    //     super(id, par, child, names);
    //     [this.#intCity, this.#intLine, this.#intColour, this.#intNameZH, this.#intNameEN] = int2;
    //     // this.#intColour = colours[this.#intCity]['line'][this.#intLine]['colour'];
    // }

    constructor (id, data) {
        super(id, data);
        [this.#intCity, this.#intLine, this.#intColour, this.#intNameZH, this.#intNameEN] = data.transfer[1];
    }

    get _dy() {return 0;}

    get intTickHTML() {
        var tickDirection = (this._namePos == 1) ? 'up' : 'down';
        var tickColour = (this._state == -1) ? '#aaa' : this.#intColour;
        return `<use xlink:href="#intline_${tickDirection}" class="LineDiagram HK Change" stroke="${tickColour}" x="${this._x}" y="${this._y + this._dy}"/>`;
    }

    get _nameClass() {
        return (this._state == -1) ? 'Pass' : 'Future';
    }

    get intNameHTML() {
        var [nameHTML, nameZHLn, nameENLn] = joinIntName([this.#intNameZH, this.#intNameEN], 15, 7);
        var dy = (this._namePos == 0) ? 25 + 5.953125 : -25 + 5.953125 - 18.65625 - 13*(nameZHLn-1) - 7*(nameENLn-1);
        dy += this._dy;
        // var nameClass = (this._state == -1) ? 'Pass' : 'Future';
        return `<g text-anchor="middle" class="Name ${this._nameClass}" transform="translate(${this._x},${this._y + dy})">
                ${nameHTML}
                </g>`;
    }

    get ungrpHTML() {
        return this.intTickHTML + this.iconHTML + this.nameHTML + this.intNameHTML;
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

        data.transfer.slice(1).forEach(intInfo => {
            this.#intCity.push(intInfo[0]);
            this.#intLine.push(intInfo[1]);
            this.#intColour.push(intInfo[2]);
            // this.#intColour.push(colours[intInfo[0]]['line'][intInfo[1]]['colour']);

            this.#intNameZH.push(intInfo[3]);
            this.#intNameEN.push(intInfo[4]);
        });

        this._int3Type = data.change_type.substring(5);
    }

    get iconHTML() {
        var iconType = (this._state == -1) ? 'int3_hk_pass' : 'int3_hk';
        var iconRotation = (this._namePos != 1) ? 0 : 180;
        return `<use xlink:href="#${iconType}" transform="translate(${this._x},${this._y})rotate(${iconRotation})"/>`;
    }

    get _tickRotation() {return 0;}
    get _dy() {return 0;}

    get intTickHTML() {
        // var tickRotation = (this._int3Type == 'r') ? -90 : 90;
        var str = '';
        [0, 1].forEach(i => {
            var tickColour = (this._state == -1) ? '#aaa' : this.#intColour[i];
            var dy = (this._namePos != 1) ? 18*(i+1) : -18*(i+1);
            dy += this._dy;
            str += `<use xlink:href="#intline_down" class="LineDiagram HK Change" stroke="${tickColour}"
            transform="translate(${this._x},${this._y + dy})rotate(${this._tickRotation})"/>`
        });
        return str;
    }

    get _txtAnchor() {return 'middle';}
    get _intNameDX() {return 0;}

    get intNameHTML() {
        var str = '';
        var nameClass = (this._state == -1) ? 'Pass' : 'Future';

        [0, 1].forEach(i => {
            var [nameHTML, nameZHLn, nameENLn] = joinIntName([this.#intNameZH[i], this.#intNameEN[i]], 15, 7)
            // var dy = (this._namePos == 0) ? 25 + 5.953125 : -25 + 5.953125 - 19.65625 - 13*(nameZHLn-1) - 7*(nameENLn-1);
            var dy = ( (this._namePos == 0) ? 18*(i+1) : -18*(i+1) ) + 5.953125 - (19.65625 + 13*(nameZHLn-1) + 7*(nameENLn-1))/2;
            dy += this._dy;
            str += `<g text-anchor="${this._txtAnchor}" class="Name ${nameClass}" transform="translate(${this._x + this._intNameDX},${this._y + dy})">
                    ${nameHTML}
                    </g>`
        });
        return str;
    }

    get ungrpHTML() {
        return this.intTickHTML + this.iconHTML + this.nameHTML + this.intNameHTML;
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
    // #intCity; #intLine; #intColour; 
    // #intNameZH; #intNameEN;
    #osiType; #osiDirection;
    constructor (id, data) {
        // data.int2 = data.osi11;
        super(id, data);

        [this.#osiNameZH, this.#osiNameEN] = data.transfer[0];

        this.#osiType = data.change_type.substring(6,7); // u(npaid) or p(aid);
        this.#osiDirection = data.change_type.substring(7); // l or r;
    }

    get iconHTML() {
        var iconType = `osi11${this.#osiType}_hk${(this._state == -1) ? '_pass' : ''}`;
        var iconRotation = (this._namePos != 1) ? 0 : 180;
        return `<use xlink:href="#${iconType}" transform="translate(${this._x},${this._y})rotate(${iconRotation})"/>`;
    }

    get _dy() {return (this._namePos == 0) ? 26 : -26;}
    get _txtAnchor() {return 'middle';}
    get _osiNameDX() {return 0;}

    get osiNameHTML() {
        var dy = this._dy + 8.34375 - 25.03125/2;
        return `<g text-anchor="${this._txtAnchor}" transform="translate(${this._x+this._osiNameDX},${this._y+dy})" class="Name ${this._nameClass}">
                <text class="OSINameZH"> ${this.#osiNameZH} </text>
                <text x="0" dy="12" class="OSINameEN"> ${this.#osiNameEN} </text>
                </g>`;
    }

    get ungrpHTML() {
        return this.intTickHTML + this.iconHTML + this.nameHTML + this.intNameHTML + this.osiNameHTML;
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
        super(id, data);

        [this.#osiNameZH, this.#osiNameEN] = data.transfer[0];

        this.#osiType = data.change_type.substring(6,7); // u(npaid) or p(aid);
        this.#osiDirection = data.change_type.substring(7); // l or r;
    }

    get iconHTML() {
        var iconType = `osi12${this.#osiType}_hk${(this._state == -1) ? '_pass' : ''}`;
        var iconRotation = (this._namePos != 1) ? 0 : 180;
        return `<use xlink:href="#${iconType}" transform="translate(${this._x},${this._y})rotate(${iconRotation})"/>`;
    }

    get _dy() {return (this._namePos == 0) ? (26-18) : -8;}

    get osiNameHTML() {
        var dy = (this._namePos == 0) ? (26+18+10) + 8.34375  : -(26+18+10) + 8.34375 - 25.03125;
        var nameClass = (this._state == -1) ? 'Pass' : 'Future';
        return `<g text-anchor="middle" transform="translate(${this._x},${this._y+dy})" class="Name ${nameClass}">
                <text class="OSINameZH"> ${this.#osiNameZH} </text>
                <text x="0" dy="12" class="OSINameEN"> ${this.#osiNameEN} </text>
                </g>`;
    }

    get ungrpHTML() {
        return this.intTickHTML + this.iconHTML + this.nameHTML + this.intNameHTML + this.osiNameHTML;
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