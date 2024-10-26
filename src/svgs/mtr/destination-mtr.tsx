import { memo, useEffect, useRef, useState } from 'react';
import StripMTR from './strip-mtr';
import { CanvasType, Name, ShortDirection } from '../../constants/constants';
import { useRootSelector } from '../../redux';
import SvgWrapper from '../svg-wrapper';
import PlatformNumber from './platform-number';

const CANVAS_TYPE = CanvasType.Destination;

export default function DestinationMTR() {
    const { canvasScale } = useRootSelector(state => state.app);
    const { svgWidth: svgWidths, svg_height: svgHeight, theme } = useRootSelector(state => state.param);

    const svgWidth = svgWidths[CANVAS_TYPE];

    return (
        <SvgWrapper
            type={CANVAS_TYPE}
            svgWidth={svgWidth}
            svgHeight={svgHeight}
            canvasScale={canvasScale}
            theme={theme}
        >
            <DefsMTR />
            <StripMTR />
            <InfoMTR />
        </SvgWrapper>
    );
}

const DefsMTR = memo(function DefsMTR() {
    return (
        <defs>
            <path id="arrow" d="M60,60L0,0L60-60H100L55-15H160V15H55L100,60z" fill="var(--rmg-black,#000)" />
        </defs>
    );
});

const InfoMTR = () => {
    const routes = useRootSelector(store => store.helper.routes);

    const svgWidths = useRootSelector(store => store.param.svgWidth);
    const direction = useRootSelector(store => store.param.direction);
    const customisedMTRDestination = useRootSelector(store => store.param.customiseMTRDest);
    const platformNumber = useRootSelector(store => store.param.platform_num);
    const lineName = useRootSelector(store => store.param.line_name);

    const currentStationIndex = useRootSelector(store => store.param.current_stn_idx);
    const stationList = useRootSelector(store => store.param.stn_list);

    const validDestinationIds = [
        ...new Set(
            routes
                .filter(route => route.includes(currentStationIndex))
                .map(
                    route =>
                        route
                            .filter(stnId => !['linestart', 'lineend'].includes(stnId))
                            .slice(direction === ShortDirection.left ? 0 : -1)[0]
                )
                .filter(id => id !== currentStationIndex)
        ),
    ];
    const isTerminal = validDestinationIds.length === 0;

    const destNames: Name =
        customisedMTRDestination.terminal !== false
            ? customisedMTRDestination.terminal
            : [
                  validDestinationIds.map(stnId => stationList[stnId].name[0]).join('/'),
                  validDestinationIds
                      .map(stnId => stationList[stnId].name[1])
                      .join('/')
                      .replace('\\', ' '),
              ];

    const destNameEl = useRef<SVGGElement | null>(null);
    const [bBox, setBBox] = useState({ width: 0 } as DOMRect);
    useEffect(() => {
        if (destNameEl.current) setBBox(destNameEl.current.getBBox());
    }, [destNames.toString(), customisedMTRDestination.isLegacy]);

    const flagLength = 126 + 120 + bBox.width + 30 + 60;
    const arrowX = (svgWidths[CanvasType.Destination] - (direction === ShortDirection.left ? 1 : -1) * flagLength) / 2;
    const platformNumX = arrowX + (direction === ShortDirection.left ? 1 : -1) * (126 + 60 + 60);
    const terminalPlatformNumX = svgWidths.destination / 2;
    const destNameX = platformNumX + (direction === ShortDirection.left ? 1 : -1) * (60 + 30);

    return (
        <g style={{ transform: 'translateY(calc(var(--rmg-svg-height) / 2 - 5px))' }}>
            {!isTerminal && (
                <use
                    xlinkHref="#arrow"
                    transform={`translate(${arrowX},0)scale(0.8)rotate(${direction === ShortDirection.left ? 0 : 180})`}
                    data-testid="mtr-arrow"
                />
            )}
            <g
                transform={`translate(${isTerminal ? terminalPlatformNumX : platformNumX},0)`}
                data-testid="mtr-platform"
            >
                <PlatformNumber num={platformNumber} />
            </g>
            {!isTerminal && (
                <g
                    ref={destNameEl}
                    textAnchor={direction === ShortDirection.left ? 'start' : 'end'}
                    transform={`translate(${destNameX},-25)`}
                    fill="var(--rmg-black)"
                    data-testid="mtr-destination"
                >
                    <text className="rmg-name__zh" fontSize={72} letterSpacing={1.5}>
                        {(customisedMTRDestination.isLegacy ? lineName[0] : '') + '往' + destNames[0]}
                    </text>
                    <text className="rmg-name__en" fontSize={42} dy={66}>
                        {(customisedMTRDestination.isLegacy ? lineName[1] + ' ' : '') + 'to ' + destNames[1]}
                    </text>
                </g>
            )}
        </g>
    );
};
