import { Stations } from './share';
import { StationDict } from '../../../constants/constants';

export const leftWideFactor = (stnList: StationDict, stnId: string) => {
    var res = 0;
    let { transfer } = stnList[stnId];
    let ls = transfer.info.map(val => val.length);
    if (transfer.tick_direc === 'l') {
        // int3 or above
        if (!ls[1] && ls[0] > 1) res += 0.8;
        // osi except osi22
        if (ls[1] && (ls[0] !== 1 || ls[1] !== 2)) res += 0.8;
    }
    if (ls[0] === 1 && ls[1] === 2) {
        // osi22 not end
        if (stnList[stnId].parents[0] !== 'linestart' && stnList[stnId].children[0] !== 'lineend') res += 0.8;
    }
    // let { type, tick_direc } = stnList[stnId].transfer;
    // if (tick_direc === 'l' && ['int3', 'osi11', 'osi12', 'osi21', 'osi31'].includes(type)) res += 0.8;
    if (stnList[stnId].parents.length === 2) res += 0.2;
    if (stnList[stnList[stnId].parents[0]].children.length === 2) res += 0.4;
    return res;
};

export const rightWideFactor = (stnList: StationDict, stnId: string) => {
    var res = 0;
    let { transfer } = stnList[stnId];
    let ls = transfer.info.map(val => val.length);
    if (transfer.tick_direc === 'r') {
        // int3 or above
        if (!ls[1] && ls[0] > 1) res += 0.8;
        // osi except osi22
        if (ls[1] && (ls[0] !== 1 || ls[1] !== 2)) res += 0.8;
    }
    if (ls[0] === 1 && ls[1] === 2) {
        if (stnList[stnId].parents[0] !== 'linestart' && stnList[stnId].children[0] !== 'lineend') res += 0.8;
    }
    // let { type, tick_direc } = stnList[stnId].transfer;
    // if (tick_direc === 'r' && ['int3', 'osi11', 'osi12', 'osi21', 'osi31'].includes(type)) res += 0.8;
    if (stnList[stnId].children.length === 2) res += 0.2;
    if (stnList[stnList[stnId].children[0]].parents.length === 2) res += 0.4;
    return res;
};

export class StationsMTR extends Stations {
    protected leftWideFactor = (stnId: string) => {
        return leftWideFactor(this.stnList, stnId);
    };

    protected rightWideFactor = (stnId: string) => {
        return rightWideFactor(this.stnList, stnId);
    };
}

export class StationsSHMetro extends StationsMTR {}
