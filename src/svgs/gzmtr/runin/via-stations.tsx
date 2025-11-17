import { StationInfo } from '../../../constants/constants';
import ViaStation from './via-station';
import { useCallback, useEffect, useRef, useState } from 'react';

type ViaStationsProps = {
    viaStations: string[];
    stationList: Record<string, StationInfo>;
};

export default function ViaStations({ viaStations, stationList }: ViaStationsProps) {
    const stationsRef = useRef<(SVGGElement | null)[]>([]);
    const [stationHeights, setStationHeights] = useState<number[]>([]);

    useEffect(() => {
        setStationHeights(stationsRef.current.map(el => el?.getBBox()?.height ?? 0));
    }, [viaStations, stationsRef.current]);

    const getHeightsUpTo = useCallback(
        (index: number) => {
            return stationHeights.slice(0, index).reduce((sum, x) => sum + x + 4, 0);
        },
        [stationHeights]
    );

    return (
        <>
            {viaStations.map((stationId, i) => (
                <ViaStation
                    key={stationId}
                    ref={el => (stationsRef.current[i] = el)}
                    stationInfo={stationList[stationId]}
                    transform={`translate(0,${getHeightsUpTo(i)})`}
                />
            ))}
        </>
    );
}
