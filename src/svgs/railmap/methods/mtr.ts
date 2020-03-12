import { Stations } from './share';
import { StationInfo } from '../../../types';

export class StationsMTR extends Stations {
    protected leftWideFactor = (stnId: string) => {
        var res = 0;
        let { type, tick_direc } = this.stnList[stnId].transfer;
        if (tick_direc === 'l') {
            if (['int3', 'osi11', 'osi12'].includes(type)) {
                res += 0.8;
            }
        }
        if (type === 'osi22') res += 0.8;
        if (this.stnList[stnId].parents.length === 2) res += 0.4;
        if (this.stnList[this.stnList[stnId].parents[0]].children.length === 2) res += 0.4;
        return res;
    };

    protected rightWideFactor = (stnId: string) => {
        var res = 0;
        let { type, tick_direc } = this.stnList[stnId].transfer;
        if (tick_direc === 'r') {
            if (['int3', 'osi11', 'osi12'].includes(type)) {
                res += 0.8;
            }
        }
        if (type === 'osi22') res += 0.8;
        if (this.stnList[stnId].children.length === 2) res += 0.4;
        if (this.stnList[this.stnList[stnId].children[0]].parents.length === 2) res += 0.4;
        return res;
    };
}
