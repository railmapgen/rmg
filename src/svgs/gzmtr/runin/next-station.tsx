import { useRootSelector } from '../../../redux';
import { useEffect, useRef, useState } from 'react';
import { CanvasType, ShortDirection } from '../../../constants/constants';
import ArrowGzmtr from '../arrow-gzmtr';
import NextStationSecondary from './next-station-secondary';
import { NAME_NUM_GAP, NEXT_ARROW_SCALE, NUM_WIDTH } from './runin-utils';

const NEXT_ZH_NAME_FONT_SIZE = 35;
const NEXT_EN_NAME_FONT_SIZE = 17;

type NextStationProps = {
    nextId: string;
    nameBBox: DOMRect;
    ignoreNumWidth?: boolean;
};

export default function NextStation({ nextId, nameBBox, ignoreNumWidth }: NextStationProps) {
    const { svgWidth: svgWidths, svg_height: svgHeight, direction } = useRootSelector(store => store.param);
    const nextInfo = useRootSelector(store => store.param.stn_list[nextId]);
    const { localisedName, localisedSecondaryName } = nextInfo;
    const { zh: zhName = '', en: enName = '' } = localisedName;
    const svgWidth = svgWidths[CanvasType.RunIn];

    const [nextBBox, setNextBBox] = useState({ width: 0 } as DOMRect);
    const nextNameEl = useRef<SVGGElement | null>(null);
    useEffect(() => {
        if (nextNameEl.current) setNextBBox(nextNameEl.current.getBBox());
    }, [zhName, enName]);

    const nextNameZHCount = zhName.length;
    const nameBcrX = (svgWidth - nameBBox.width) / 2;

    const transforms = {
        next: {
            x:
                direction === ShortDirection.left
                    ? 80
                    : svgWidth - 45 - nextBBox.width - NEXT_ZH_NAME_FONT_SIZE * (nextNameZHCount <= 2 ? 2 : 1.5),
        },
        nextName: {
            x:
                direction === ShortDirection.left
                    ? 80 + NEXT_ZH_NAME_FONT_SIZE * (nextNameZHCount <= 2 ? 2 : 1.5)
                    : svgWidth - 45 - nextBBox.width,
        },
        arrow: {
            x:
                direction === ShortDirection.left
                    ? (115 + 35 * ((nextNameZHCount <= 2 ? 1 : 0.5) + nextNameZHCount) + nameBcrX) / 2 - 20
                    : (svgWidth -
                          45 -
                          nextBBox.width -
                          (nextNameZHCount <= 2 ? 70 + 35 : 35 * 2.5) +
                          nameBcrX +
                          nameBBox.width +
                          (ignoreNumWidth ? 0 : NAME_NUM_GAP + NUM_WIDTH)) /
                          2 +
                      20,
            y: svgHeight / 2 - 30,
            rotate: direction === ShortDirection.left ? 0 : 180,
        },
    };

    return (
        <>
            <g transform={`translate(0,${svgHeight / 2 - 40})`}>
                <g textAnchor="middle" transform={`translate(${transforms.next.x},0)`}>
                    <text className="rmg-name__zh" fontSize={NEXT_ZH_NAME_FONT_SIZE}>
                        下站
                    </text>
                    <text className="rmg-name__en" fontSize={NEXT_EN_NAME_FONT_SIZE} dy={30}>
                        Next
                    </text>
                </g>
                <g textAnchor="start" ref={nextNameEl} transform={`translate(${transforms.nextName.x},0)`}>
                    <text className="rmg-name__zh" fontSize={NEXT_ZH_NAME_FONT_SIZE}>
                        {zhName}
                    </text>
                    <g fontSize={NEXT_EN_NAME_FONT_SIZE}>
                        {enName.split('\\').map((txt, i) => (
                            <text className="rmg-name__en" dy={30 + i * NEXT_EN_NAME_FONT_SIZE} key={i}>
                                {txt}
                            </text>
                        ))}
                    </g>
                </g>
                {localisedSecondaryName && (
                    <g textAnchor="middle" transform={`translate(${transforms.nextName.x},0)`}>
                        <NextStationSecondary
                            secName={localisedSecondaryName}
                            transform={`translate(${nextBBox.width / 2},${30 + enName.split('\\').length * 17 + 5})`}
                        />
                    </g>
                )}
            </g>
            <ArrowGzmtr
                transform={`translate(${transforms.arrow.x},${transforms.arrow.y})scale(${NEXT_ARROW_SCALE})rotate(${transforms.arrow.rotate})`}
            />
        </>
    );
}
