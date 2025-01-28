import { useRootSelector } from '../../../redux';
import { CanvasType, ShortDirection } from '../../../constants/constants';
import ArrowGzmtr, { ARROW_WIDTH } from '../arrow-gzmtr';
import ViaStation from './via-station';
import {
    COACH_NUMBER_WIDTH,
    COACH_NUMBER_X_PERCENTAGE,
    getNextViaStations,
    LOOP_NEXT_ARROW_SCALE,
} from './runin-utils';

type NextViaStationsProps = {
    nameBBox: DOMRect;
};

export default function NextViaStations({ nameBBox }: NextViaStationsProps) {
    const {
        svg_height: svgHeight,
        svgWidth: svgWidths,
        direction,
        current_stn_idx: currentStation,
        stn_list: stationList,
        loop_info: { midpoint_station: midpointStation, clockwise },
    } = useRootSelector(store => store.param);
    const { branches } = useRootSelector(store => store.helper);

    const svgWidth = svgWidths[CanvasType.RunIn];

    const stationsInScope = branches[0].slice(1, -1);
    const { nextStation, viaStations } = getNextViaStations(
        stationsInScope,
        stationList,
        currentStation,
        midpointStation,
        clockwise
    );

    const {
        localisedName: { en: currentEnName = '' },
        currentLocalisedSecondaryName,
    } = stationList[currentStation];
    const {
        localisedName: { zh: zhName = '', en: enName = '' },
    } = stationList[nextStation];
    const nameBcrX = (svgWidth - nameBBox.width) / 2;

    const transforms = {
        next: {
            x: 80,
        },
        nextName: {
            x: 80 + 44 * 1.7,
        },
        arrow: {
            x:
                direction === ShortDirection.left
                    ? (115 + 50 * (0.5 + zhName.length) + nameBcrX) / 2 - 20
                    : ((svgWidth + nameBBox.width) / 2 +
                          (svgWidth * COACH_NUMBER_X_PERCENTAGE - COACH_NUMBER_WIDTH / 2)) /
                          2 +
                      (ARROW_WIDTH * LOOP_NEXT_ARROW_SCALE) / 2,
            y:
                0.5 * svgHeight -
                (currentEnName.split('\\').length - 2) * 18 -
                (currentLocalisedSecondaryName ? 58 / 2 : 0),
            rotate: direction === ShortDirection.left ? 0 : 180,
        },
    };

    return (
        <>
            <g transform={`translate(0,${svgHeight / 2 - 75})`}>
                <g textAnchor="middle" transform={`translate(${transforms.next.x},0)`}>
                    <g fontWeight="bold">
                        <text className="rmg-name__zh" fontSize={44}>
                            下站
                        </text>
                        <text className="rmg-name__en" fontSize={25} dy={40}>
                            Next
                        </text>
                    </g>
                    <g transform={`translate(0,75)`}>
                        <text className="rmg-name__zh" fontSize={20}>
                            途经
                        </text>
                        <text className="rmg-name__en" fontSize={12} dy={19}>
                            Via
                        </text>
                    </g>
                </g>
                <g textAnchor="start" transform={`translate(${transforms.nextName.x},0)`}>
                    <g fontWeight="bold">
                        <text className="rmg-name__zh" fontSize={44}>
                            {zhName}
                        </text>
                        <g fontSize={25}>
                            {enName.split('\\').map((txt, i) => (
                                <text className="rmg-name__en" dy={40 + i * 25} key={i}>
                                    {txt}
                                </text>
                            ))}
                        </g>
                    </g>
                    <g transform={`translate(0,75)`}>
                        {viaStations.map((stationId, i) => (
                            <ViaStation
                                key={stationId}
                                stationInfo={stationList[stationId]}
                                transform={`translate(0,${42 * i})`}
                            />
                        ))}
                    </g>
                </g>
            </g>
            <ArrowGzmtr
                transform={`translate(${transforms.arrow.x},${transforms.arrow.y})scale(${LOOP_NEXT_ARROW_SCALE})rotate(${transforms.arrow.rotate})`}
            />
        </>
    );
}
