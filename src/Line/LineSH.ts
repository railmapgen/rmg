import { RMGLine } from './Line.js';
import { RMGStationSH, IntStationSH, station_id } from '../Station/StationSH.js';
import { RMGStation } from '../Station.js';

import { ID, Name, StationInfo, RMGParam } from '../utils.js';

export class RMGLineSH extends RMGLine {
    constructor(param) {
        super(param);
    }

    _initStnInstance(stnId: ID, stnInfo: StationInfo): RMGStation {
        switch (stnInfo.change_type) {
            case 'int2':
                return new IntStationSH(stnId, stnInfo);
            default:
                return new RMGStationSH(stnId, stnInfo);
        }
    }

    fillThemeColour() {
        super.fillThemeColour();

        // why log this._themeColour is undefined but has the right color in html
        // and remove this will remove the stroke of the circle
        $('path#' + station_id).attr('stroke', this._themeColour);
    }

    updateStnNameBg() {
        $('#current_bg').hide();  // fix the mysterious black rect
    }

}
