import { StationInfo } from '../../../constants/constants';

export const NAME_NUM_GAP = 55;
export const NUM_WIDTH = 18.5 * 1.4;

export const COACH_NUMBER_R = 30;
export const COACH_NUMBER_WIDTH = COACH_NUMBER_R * 4;
export const COACH_NUMBER_X_PERCENTAGE = 0.85;

export const NEXT_ARROW_SCALE = 0.25;
export const LOOP_NEXT_ARROW_SCALE = 0.4;

export const getNextViaStations = (
    stations: string[],
    stationList: Record<string, StationInfo>,
    currentStation: string,
    midpointStation?: string,
    clockwise?: boolean
) => {
    const sortedStations = clockwise ? stations.toReversed() : stations;
    const currentStationIndex = sortedStations.indexOf(currentStation);
    const comingStations = [...sortedStations, ...sortedStations].slice(currentStationIndex + 1);
    const nextStation = comingStations[0];
    const comingInterchangeStations = comingStations.slice(1).reduce<string[]>((acc, cur) => {
        if (stationList[cur].transfer.groups[0].lines?.length) {
            return [...acc, cur];
        } else {
            return acc;
        }
    }, []);
    const viaStations = midpointStation
        ? [...comingInterchangeStations.slice(0, 2), midpointStation]
        : comingInterchangeStations.slice(0, 3);

    return { nextStation, viaStations };
};
