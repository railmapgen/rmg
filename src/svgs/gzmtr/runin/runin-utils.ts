import { RMGParam, ShortDirection, StationInfo } from '../../../constants/constants';

export const NAME_NUM_GAP = 55;
export const NUM_WIDTH = 18.5 * 1.4;

export const COACH_NUMBER_R = 30;
export const COACH_NUMBER_WIDTH = COACH_NUMBER_R * 4;
export const COACH_NUMBER_X_PERCENTAGE = 0.82;

export const NEXT_ARROW_SCALE = 0.25;
export const LOOP_NEXT_ARROW_SCALE = 0.4;

type NextViaStations = {
    nextStations: string[];
    viaStations?: string[];
};

export const getNextViaStations = (param: RMGParam, branches: string[][]): NextViaStations => {
    const {
        stn_list: stationList,
        current_stn_idx: currentStation,
        direction,
        loop,
        loop_info: { midpoint_station: midpointStation, clockwise },
    } = param;

    return loop
        ? getLoopNextViaStations(branches[0].slice(1, -1), stationList, currentStation, midpointStation, clockwise)
        : getNormalNextStations(stationList, currentStation, direction);
};

const getNormalNextStations = (
    stationList: Record<string, StationInfo>,
    currentStation: string,
    direction: ShortDirection
): NextViaStations => {
    const key = direction === 'l' ? 'parents' : 'children';
    const nextStations = stationList[currentStation][key]
        .map(station => {
            if (stationList[station].underConstruction) {
                return stationList[station][key];
            } else {
                return station;
            }
        })
        .flat();
    return { nextStations };
};

export const getLoopNextViaStations = (
    stations: string[],
    stationList: Record<string, StationInfo>,
    currentStation: string,
    midpointStation?: string,
    clockwise?: boolean
): NextViaStations => {
    const filteredStations = stations.filter(station => !stationList[station].underConstruction);
    const sortedStations = clockwise ? filteredStations.toReversed() : filteredStations;
    const currentStationIndex = sortedStations.indexOf(currentStation);
    const comingStations = [...sortedStations, ...sortedStations].slice(currentStationIndex + 1);
    const nextStations = [comingStations[0]];
    const comingInterchangeStations = comingStations.slice(1).reduce<string[]>((acc, cur) => {
        if (stationList[cur].transfer.groups[0].lines?.length) {
            // interchange station
            return [...acc, cur];
        } else if (stationList[cur].loop_pivot) {
            // pivot station (non-interchange)
            return [...acc, cur];
        } else {
            return acc;
        }
    }, []);
    const viaStations = midpointStation
        ? [...comingInterchangeStations.slice(0, 2), midpointStation]
        : comingInterchangeStations.slice(0, 3);

    return { nextStations, viaStations };
};
