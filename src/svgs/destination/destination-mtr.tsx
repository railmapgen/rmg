import React, { memo } from 'react';
import StripMTR from '../strip/strip-mtr';
import { CanvasType, Name, RmgStyle, ShortDirection } from '../../constants/constants';
import { useRootSelector } from '../../redux';
import SvgWrapper from '../svg-wrapper';

const CANVAS_TYPE = CanvasType.Destination;
const STYLE = RmgStyle.MTR;

export default function DestinationMTR() {
    const { canvasScale } = useRootSelector(state => state.app);
    const { svgWidth: svgWidths, svg_height: svgHeight, theme } = useRootSelector(state => state.param);

    const svgWidth = svgWidths[CANVAS_TYPE];

    return (
        <SvgWrapper
            type={CANVAS_TYPE}
            style={STYLE}
            svgWidth={svgWidth}
            svgHeight={svgHeight}
            canvasScale={canvasScale}
            theme={theme}
        >
            <DefsMTR />
            <StripMTR stripPc={90} />
            <InfoMTR />
        </SvgWrapper>
    );
}

const DefsMTR = memo(() => (
    <defs>
        <path id="arrow" d="M60,60L0,0L60-60H100L55-15H160V15H55L100,60z" fill="var(--rmg-black,#000)" />
    </defs>
));

const InfoMTR = () => {
    const routes = useRootSelector(store => store.helper.routes);

    const svgWidths = useRootSelector(store => store.param.svgWidth);
    const direction = useRootSelector(store => store.param.direction);
    const customisedMTRDestination = useRootSelector(store => store.param.customiseMTRDest);
    const platformNumber = useRootSelector(store => store.param.platform_num);
    const lineName = useRootSelector(store => store.param.line_name);

    const currentStationIndex = useRootSelector(store => store.param.current_stn_idx);
    const stationList = useRootSelector(store => store.param.stn_list);

    let destNames: Name;
    if (customisedMTRDestination.terminal !== false) {
        destNames = customisedMTRDestination.terminal;
    } else {
        const validDests = [
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
        destNames = [
            validDests.map(stnId => stationList[stnId].name[0]).join('/'),
            validDests
                .map(stnId => stationList[stnId].name[1])
                .join('/')
                .replace('\\', ' '),
        ];
    }

    const destNameEl = React.useRef<SVGGElement | null>(null);
    const [bBox, setBBox] = React.useState({ width: 0 } as DOMRect);
    React.useEffect(
        () => setBBox(destNameEl.current!.getBBox()),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [destNames.toString(), customisedMTRDestination.isLegacy]
    );

    const flagLength = 160 + 150 + bBox.width + 45 + 50;
    const arrowX = (svgWidths[CanvasType.Destination] - (direction === ShortDirection.left ? 1 : -1) * flagLength) / 2;
    const platformNumX = arrowX + (direction === ShortDirection.left ? 1 : -1) * (160 + 50 + 75);
    const destNameX = platformNumX + (direction === ShortDirection.left ? 1 : -1) * (75 + 45);

    return (
        <g id="dest_name" style={{ transform: 'translateY(calc(var(--rmg-svg-height) / 2 - 20px))' }}>
            <use
                xlinkHref="#arrow"
                transform={`translate(${arrowX},0)rotate(${direction === ShortDirection.left ? 0 : 180})`}
            />
            <PlatformNum num={platformNumber} transform={`translate(${platformNumX},0)`} />
            <g
                ref={destNameEl}
                textAnchor={direction === ShortDirection.left ? 'start' : 'end'}
                transform={`translate(${destNameX},-25)`}
                fill="var(--rmg-black)"
            >
                <text className="rmg-name__zh" fontSize={90}>
                    {(customisedMTRDestination.isLegacy ? lineName[0] : '') + '往' + destNames[0]}
                </text>
                <text className="rmg-name__en" fontSize={45} dy={80}>
                    {(customisedMTRDestination.isLegacy ? lineName[1] + ' ' : '') + 'to ' + destNames[1]}
                </text>
            </g>
        </g>
    );
};

const PlatformNum = (props: { num: string | false } & React.SVGProps<SVGGElement>) => {
    const { num, ...others } = props;

    return (
        <g id="platform" {...others}>
            {React.useMemo(
                () => (
                    <>
                        <circle cx={0} cy={0} r={75} fill="var(--rmg-theme-colour)" />
                        <text className="rmg-name__zh" dy={0} textAnchor="middle" fontSize={135} fill="#fff">
                            {num}
                        </text>
                    </>
                ),
                [num]
            )}
        </g>
    );
};
