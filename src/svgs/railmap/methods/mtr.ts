import { Stations } from './share';

export class StationsMTR extends Stations {
    protected leftWideFactor = (stnId: string) => {
        var res = 0;
        let { transfer } = this.stnList[stnId];
        let ls = transfer.info.map(val => val.length);
        if (transfer.tick_direc === 'l') {
            // int3 or above
            if (!ls[1] && ls[0] > 1) res += 0.8;
            // osi except osi22
            if (ls[1] && (ls[0] !== 1 || ls[1] !== 2)) res += 0.8;
        }
        if (ls[0] === 1 && ls[1] === 2) {
            // osi22 not end
            if (this.stnList[stnId].parents[0] !== 'linestart' && this.stnList[stnId].children[0] !== 'lineend')
                res += 0.8;
        }
        if (this.stnList[stnId].parents.length === 2) res += 0.4;
        if (this.stnList[this.stnList[stnId].parents[0]].children.length === 2) res += 0.4;
        return res;
    };

    protected rightWideFactor = (stnId: string) => {
        var res = 0;
        let { transfer } = this.stnList[stnId];
        let ls = transfer.info.map(val => val.length);
        if (transfer.tick_direc === 'r') {
            // int3 or above
            if (!ls[1] && ls[0] > 1) res += 0.8;
            // osi except osi22
            if (ls[1] && (ls[0] !== 1 || ls[1] !== 2)) res += 0.8;
        }
        if (ls[0] === 1 && ls[1] === 2) {
            // osi22 not end
            if (this.stnList[stnId].parents[0] !== 'linestart' && this.stnList[stnId].children[0] !== 'lineend')
                res += 0.8;
        }
        if (this.stnList[stnId].children.length === 2) res += 0.4;
        if (this.stnList[this.stnList[stnId].children[0]].parents.length === 2) res += 0.4;
        return res;
    };
}

export class StationsSHMetro extends StationsMTR {}
