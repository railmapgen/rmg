import React, { memo, useContext, useMemo, forwardRef, useRef, useState, useEffect } from 'react';
import { ParamContext } from '../../context';

export default memo(function DestinationSHMetro() {
    return (
        <>
            <DefsSHMetro />
            <InfoSHMetro />
        </>
    );
});

const DefsSHMetro = memo(() => (
    <defs>
        {/* An extension of the line/path. Remember to minus the stroke-width.  */}
        <marker id="slope" viewBox="-1.5 0 3 1.5" refY={0.5}>
            <path d="M0,0L1,1H-1z" fill="var(--rmg-theme-colour)" />
        </marker>
    </defs>
));

const InfoSHMetro = () => {
    const { param, routes } = useContext(ParamContext);

    // for each left valid destinations, get the name from id
    const validDests = [
        ...new Set(
            routes
                .filter(route => route.includes(param.current_stn_idx))
                .map(route => {
                    let res = route.filter(stnId => !['linestart', 'lineend'].includes(stnId));
                    return param.direction === 'l' ? res[0] : res.reverse()[0];
                })
        ),
    ];
    const destNames: Name = [
        validDests.map(id => param.stn_list[id].name[0]).join('，'),
        validDests
            .map(id => param.stn_list[id].name[1])
            .join(', ')
            .replace('\\', ' '),
    ];

    const terminalEl = useRef<SVGGElement | null>(null);
    const [terminalBBox, setTerminalBBox] = useState({ width: 0 } as SVGRect);
    useEffect(
        () => setTerminalBBox(terminalEl.current!.getBBox()),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [...destNames]
    );

    const [middle, MARGIN, PADDING, LINEBOX_WIDTH, PLATFORM_WIDTH] = [param.svgWidth.destination / 2, 10, 36, 264, 325];
    // Alignment Priority:
    // 1. Centre of canvas
    // 2. Centre of remaining
    const platformX =
        middle - MARGIN - PADDING - terminalBBox.width >= PLATFORM_WIDTH / 2 &&
        middle - MARGIN - PADDING - LINEBOX_WIDTH >= PLATFORM_WIDTH / 2
            ? middle
            : param.direction === 'l'
            ? (param.svgWidth.destination + terminalBBox.width - LINEBOX_WIDTH) / 2
            : (param.svgWidth.destination - terminalBBox.width + LINEBOX_WIDTH) / 2;

    // the platform screen doors flash light
    // #20
    // $('g#station_info_shmetro > rect').attr({ transform: `translate(${this._svgDestWidth / 2},${250 + dh})` })

    return (
        <g transform={`translate(0,${param.svg_height - 300})`}>
            <path
                stroke="var(--rmg-theme-colour)"
                strokeWidth={12}
                d={
                    param.direction === 'l'
                        ? `M${param.svgWidth.destination - 24},16 H 36`
                        : `M24,16 H ${param.svgWidth.destination - 36}`
                }
                transform="translate(0,220)"
                markerEnd="url(#slope)"
            />

            <Terminal ref={terminalEl} destNames={destNames} />
            {param.platform_num !== false && (
                <g transform={`translate(${platformX},0)`}>
                    <PlatformNum />
                </g>
            )}
            {/* <!-- Todo: fix this absolute position --> */}
            {/* Todo: fix svgWidth.destination*0.8, this has only been tested on 1000 width */}

            {param.line_name[0].match(/^[\w\d]+/) ? <LineNameBoxNumber /> : <LineNameBoxText />}
        </g>
    );
};

const Terminal = forwardRef((props: { destNames: Name }, ref: React.Ref<SVGGElement>) => {
    const { param } = useContext(ParamContext);

    return (
        <g ref={ref} transform={`translate(${param.direction === 'l' ? 36 : param.svgWidth.destination - 36},145)`}>
            {useMemo(
                () => (
                    <>
                        <path
                            d="M60,60L0,0L60-60H100L55-15H160V15H55L100,60z"
                            fill="black"
                            transform={`rotate(${param.direction === 'l' ? 0 : 180})scale(0.8)`}
                        />
                        <g
                            textAnchor={param.direction === 'l' ? 'start' : 'end'}
                            transform={`translate(${param.direction === 'l' ? 128 + 20 : -128 - 20},15)`}
                        >
                            <text className="rmg-name__zh" fontSize={90}>
                                {'往' + props.destNames[0]}
                            </text>
                            <text className="rmg-name__en" fontSize={30} dy={44}>
                                {'To ' + props.destNames[1]}
                            </text>
                        </g>
                    </>
                ),
                // eslint-disable-next-line react-hooks/exhaustive-deps
                [param.direction, ...props.destNames]
            )}
        </g>
    );
});

const PlatformNum = () => {
    const { param } = useContext(ParamContext);

    // Total width: 325
    return (
        <g transform={`translate(${-325 / 2 + 60},130)`}>
            <circle r={60} fill="none" stroke="black" strokeWidth={2} />
            <text className="rmg-name__en" dominantBaseline="central" fontSize={120} textAnchor="middle">
                {param.platform_num}
            </text>
            <text className="rmg-name__zh" fontSize={100} dominantBaseline="central" x={65}>
                站台
            </text>
        </g>
    );
};

const LineNameBoxText = () => {
    const { param } = useContext(ParamContext);
    const { line_name } = param;

    const boxX = param.direction === 'l' ? param.svgWidth.destination - 36 - 132 : 36 + 132;

    // Total width: 264
    return useMemo(
        () => (
            <g transform={`translate(${boxX},92)`}>
                <rect fill="var(--rmg-theme-colour)" x={-132} width={264} height={120} />
                <g textAnchor="middle" transform="translate(0,68)" fill="var(--rmg-theme-fg)">
                    <text className="rmg-name__zh" fontSize={68}>
                        {line_name[0]}
                    </text>
                    <text className="rmg-name__en" fontSize={30} dy={42}>
                        {line_name[1]}
                    </text>
                </g>
            </g>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [boxX, ...line_name]
    );
};

const LineNameBoxNumber = () => {
    const { param } = useContext(ParamContext);

    const [lineNumber, lineNameRes] = param.line_name[0].match(/^[\w\d]+|.+/g);

    // Number width: 108
    // Text width: 136
    // Gap: 20
    // Left: 108/2 + 20 + 136 = 210
    // Right: 108/2 = 54
    const boxX = param.direction === 'l' ? param.svgWidth.destination - 36 - 210 : 36 + 54;

    // Total width: 264
    return useMemo(
        () => (
            <g transform={`translate(${boxX},92)`}>
                <rect fill="var(--rmg-theme-colour)" x={-54} width={108} height={120} />
                <text
                    className="rmg-name__zh"
                    fill="var(--rmg-theme-fg)"
                    fontSize={96}
                    textAnchor="middle"
                    dominantBaseline="central"
                    transform="translate(0,60)"
                    letterSpacing={-5}
                >
                    {lineNumber}
                </text>
                <g textAnchor="start" transform="translate(74,68)">
                    <text className="rmg-name__zh" fontSize={68}>
                        {lineNameRes}
                    </text>
                    <text className="rmg-name__en" fontSize={30} dy={42}>
                        {param.line_name[1]}
                    </text>
                </g>
            </g>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [boxX, ...param.line_name]
    );
};
