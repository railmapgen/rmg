import { Name, BranchInfo, StationInfo } from '../types';

export class RMGStation {
    public id: string;
    public x: number;
    public y: number;
    public state: -1 | 0 | 1;
    public parents: string[];
    public children: string[];
    public name: Name;
    public branch: BranchInfo;
    public stnNum: string;
    public services: Set<'local' | 'express'>;

    constructor (id: string, data: StationInfo) {
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
        return $('<g>');
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
