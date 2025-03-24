import { useRootSelector } from '../../../redux';
import { CanvasType, ShortDirection } from '../../../constants/constants';
import ArrowGzmtr, { ARROW_WIDTH } from '../arrow-gzmtr';
import {
    COACH_NUMBER_WIDTH,
    COACH_NUMBER_X_PERCENTAGE,
    getNextViaStations,
    LOOP_NEXT_ARROW_SCALE,
} from './runin-utils';
import ViaStations from './via-stations';

const NEXT_ZH_NAME_FONT_SIZE = 44;
const NEXT_EN_NAME_FONT_SIZE = 25;

type NextViaStationsProps = {
    nameBBox: DOMRect;
};

export default function NextViaStations({ nameBBox }: NextViaStationsProps) {
    const param = useRootSelector(store => store.param);
    const {
        svg_height: svgHeight,
        svgWidth: svgWidths,
        direction,
        current_stn_idx: currentStation,
        stn_list: stationList,
    } = param;
    const { branches } = useRootSelector(store => store.helper);

    const svgWidth = svgWidths[CanvasType.RunIn];

    const {
        nextStations: [nextStation],
        viaStations,
    } = getNextViaStations(param, branches);

    const {
        localisedName: { en: currentEnName = '' },
        localisedSecondaryName,
    } = stationList[currentStation];
    const {
        localisedName: { zh: zhName = '', en: enName = '' },
    } = stationList[nextStation];
    const enNameRows = enName.split('\\').length;
    const nameBcrX = (svgWidth - nameBBox.width) / 2;

    const transforms = {
        next: {
            x: 80,
        },
        nextName: {
            x: 80 + NEXT_ZH_NAME_FONT_SIZE * 1.7,
        },
        via: {
            dy: 75 + 25 * (enNameRows - 1),
        },
        arrow: {
            x:
                direction === ShortDirection.left
                    ? (115 + 50 * (0.5 + zhName.length) + nameBcrX) / 2 - 20
                    : ((svgWidth + nameBBox.width) / 2 +
                          (svgWidth * COACH_NUMBER_X_PERCENTAGE - COACH_NUMBER_WIDTH / 2)) /
                          2 +
                      (ARROW_WIDTH * LOOP_NEXT_ARROW_SCALE) / 2,
            y: 0.5 * svgHeight - (currentEnName.split('\\').length - 2) * 18 - (localisedSecondaryName ? 58 / 2 : 0),
            rotate: direction === ShortDirection.left ? 0 : 180,
        },
    };

    return (
        <>
            <g transform={`translate(0,${svgHeight / 2 + 5 - transforms.via.dy})`}>
                <g textAnchor="middle" transform={`translate(${transforms.next.x},0)`}>
                    <g fontWeight="bold">
                        <text className="rmg-name__zh" fontSize={NEXT_ZH_NAME_FONT_SIZE}>
                            下站
                        </text>
                        <text className="rmg-name__en" fontSize={NEXT_EN_NAME_FONT_SIZE} dy={40}>
                            Next
                        </text>
                    </g>
                    <g transform={`translate(0,${transforms.via.dy})`}>
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
                        <text className="rmg-name__zh" fontSize={NEXT_ZH_NAME_FONT_SIZE}>
                            {zhName}
                        </text>
                        <g fontSize={NEXT_EN_NAME_FONT_SIZE}>
                            {enName.split('\\').map((txt, i) => (
                                <text className="rmg-name__en" dy={40 + i * NEXT_EN_NAME_FONT_SIZE} key={i}>
                                    {txt}
                                </text>
                            ))}
                        </g>
                    </g>
                    {viaStations && (
                        <g transform={`translate(0,${transforms.via.dy})`}>
                            <ViaStations viaStations={viaStations} stationList={stationList} />
                        </g>
                    )}
                </g>
            </g>
            <ArrowGzmtr
                transform={`translate(${transforms.arrow.x},${transforms.arrow.y})scale(${LOOP_NEXT_ARROW_SCALE})rotate(${transforms.arrow.rotate})`}
            />
        </>
    );
}
