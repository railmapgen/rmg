import { useRootSelector } from '../../../redux';
import { useEffect, useRef, useState } from 'react';
import { CanvasType, ShortDirection } from '../../../constants/constants';
import ArrowGzmtr from '../arrow-gzmtr';
import NextStationSecondary from './next-station-secondary';
import { NAME_NUM_GAP, NUM_WIDTH } from './runin-utils';

type NextStationProps = {
    nextId: string;
    nameBBox: DOMRect;
    ignoreNumWidth?: boolean;
};

export default function NextStation({ nextId, nameBBox, ignoreNumWidth }: NextStationProps) {
    const svgWidths = useRootSelector(store => store.param.svgWidth);
    const direction = useRootSelector(store => store.param.direction);
    const nextInfo = useRootSelector(store => store.param.stn_list[nextId]);
    const { localisedName, currentLocalisedSecondaryName } = nextInfo;
    const { zh: zhName = '', en: enName = '' } = localisedName;

    const [nextBBox, setNextBBox] = useState({ width: 0 } as DOMRect);
    const nextNameEl = useRef<SVGGElement | null>(null);
    useEffect(() => {
        if (nextNameEl.current) setNextBBox(nextNameEl.current.getBBox());
    }, [zhName, enName]);

    const nextNameZHCount = zhName.length;
    const nameBcrX = (svgWidths[CanvasType.RunIn] - nameBBox.width) / 2;

    return (
        <>
            <g id="big_next">
                <g
                    textAnchor="middle"
                    style={{
                        ['--translate-x' as any]:
                            direction === ShortDirection.left
                                ? '80px'
                                : nextNameZHCount <= 2
                                  ? `${svgWidths[CanvasType.RunIn] - 45 - nextBBox.width - 70}px`
                                  : `${svgWidths[CanvasType.RunIn] - 45 - nextBBox.width - 35 * 1.5}px`,
                    }}
                >
                    <text className="rmg-name__zh" fontSize={35}>
                        下站
                    </text>
                    <text className="rmg-name__en" fontSize={17} dy={30}>
                        Next
                    </text>
                </g>
                <g
                    textAnchor="start"
                    ref={nextNameEl}
                    style={{
                        ['--translate-x' as any]:
                            direction === ShortDirection.left
                                ? nextNameZHCount <= 2
                                    ? `${115 + 35}px`
                                    : `${115 + 35 / 2}px`
                                : `${svgWidths[CanvasType.RunIn] - 45 - nextBBox.width}px`,
                    }}
                >
                    <text className="rmg-name__zh" fontSize={35}>
                        {zhName}
                    </text>
                    <g fontSize={17}>
                        {enName.split('\\').map((txt: string, i: number) => (
                            <text className="rmg-name__en" dy={30 + i * 17} key={i}>
                                {txt}
                            </text>
                        ))}
                    </g>
                </g>
                {currentLocalisedSecondaryName && (
                    <g
                        textAnchor="middle"
                        style={{
                            ['--translate-x' as any]:
                                direction === ShortDirection.left
                                    ? nextNameZHCount <= 2
                                        ? `${115 + 35}px`
                                        : `${115 + 35 / 2}px`
                                    : `${svgWidths[CanvasType.RunIn] - 45 - nextBBox.width}px`,
                        }}
                    >
                        <NextStationSecondary
                            secName={currentLocalisedSecondaryName}
                            transform={`translate(${nextBBox.width / 2},${30 + enName.split('\\').length * 17 + 5})`}
                        />
                    </g>
                )}
            </g>
            <ArrowGzmtr
                id="arrow"
                style={{
                    ['--translate-x' as any]:
                        direction === ShortDirection.left
                            ? `${
                                  (115 + 35 * ((nextNameZHCount <= 2 ? 1 : 0.5) + nextNameZHCount) + nameBcrX) / 2 - 20
                              }px`
                            : `${
                                  (svgWidths[CanvasType.RunIn] -
                                      45 -
                                      nextBBox.width -
                                      (nextNameZHCount <= 2 ? 70 + 35 : 35 * 2.5) +
                                      nameBcrX +
                                      nameBBox.width +
                                      (ignoreNumWidth ? 0 : NAME_NUM_GAP + NUM_WIDTH)) /
                                      2 +
                                  20
                              }px`,
                    ['--rotate' as any]: direction === ShortDirection.left ? '0deg' : '180deg',
                }}
            />
        </>
    );
}
