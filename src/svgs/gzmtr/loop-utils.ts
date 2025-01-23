import { StationState } from '../../constants/constants';

export const getLineXs = (
    width: number,
    paddingPercentage: number,
    halfStationCount: number,
    yGap: number
): [number, number] => {
    const paddedWidth = width * (1 - (2 * paddingPercentage) / 100); // w(1-2p)
    const discountedWidth = (paddedWidth * (halfStationCount - 1)) / halfStationCount; // w' * (n-1)/n
    const reducedWidth = discountedWidth - yGap;
    const diff = width - reducedWidth;
    return [diff / 2, width - diff / 2];
};

export const getLoopPath = (xs: Record<string, number>, ys: Record<string, number>, xGap: number) => {
    const minX = Math.min(...Object.values(xs));
    const maxX = Math.max(...Object.values(xs));
    const minY = Math.min(...Object.values(ys));
    const maxY = Math.max(...Object.values(ys));
    const yGap = maxY - minY;
    const r = yGap / 2;
    return `M${maxX},${minY} H${minX} h-${xGap / 2} a${r},${r} 0 0,0 0,${yGap} H${maxX} h${xGap / 2} a${r},${r} 0 0,0 0,-${yGap}Z`;
};

export const getStationStates = (
    orderedStations: string[],
    clockwise: boolean,
    currentStation: string,
    midpointStation?: string
): Record<string, StationState> => {
    const currentIndex = orderedStations.indexOf(currentStation);
    const midpointIndex = orderedStations.indexOf(midpointStation ?? currentStation);
    let reachableStations: string[];
    if (midpointIndex < 0) {
        reachableStations = orderedStations;
    } else if (clockwise) {
        reachableStations =
            currentIndex <= midpointIndex
                ? [...orderedStations.slice(0, currentIndex + 1), ...orderedStations.slice(midpointIndex)]
                : orderedStations.slice(midpointIndex, currentIndex + 1);
    } else {
        reachableStations =
            currentIndex < midpointIndex
                ? orderedStations.slice(currentIndex, midpointIndex + 1)
                : [...orderedStations.slice(currentIndex), ...orderedStations.slice(0, midpointIndex + 1)];
    }
    return orderedStations.reduce<Record<string, StationState>>((acc, cur, idx) => {
        if (currentIndex === idx) {
            return { ...acc, [cur]: StationState.CURRENT };
        } else if (reachableStations.includes(cur)) {
            return { ...acc, [cur]: StationState.FUTURE };
        } else {
            return { ...acc, [cur]: StationState.PASSED };
        }
    }, {});
};
