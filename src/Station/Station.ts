import { ID, Name, BranchInfo, StationInfo } from '../utils';

export class RMGStation {
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
    public services: Set<'local' | 'express'>;

    constructor (id: ID, data: StationInfo) {
        this.id = id;
        this.parents = data.parents;
        this.children = data.children;
        this.name = data.name;
        this.branch = data.branch;
        this.services = new Set(data.services);
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

