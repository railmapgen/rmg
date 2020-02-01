import { RMGLine } from './Line.js';
import { RMGStationSH, IntStationSH, station_id } from '../Station/StationSH.js';
export class RMGLineSH extends RMGLine {
    constructor(param) {
        super(param);
    }
    _initStnInstance(stnId, stnInfo) {
        switch (stnInfo.change_type) {
            case 'int2':
                return new IntStationSH(stnId, stnInfo);
            default:
                return new RMGStationSH(stnId, stnInfo);
        }
    }
    fillThemeColour() {
        super.fillThemeColour();
        $('path#' + station_id).attr('stroke', this._themeColour); // why log is undefined but has right color in html
    }
}
