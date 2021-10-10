import React, { memo, useMemo, forwardRef, useRef, useState, useEffect } from 'react';
import { useAppSelector } from '../../redux';

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
    const { routes } = useAppSelector(store => store.helper);
    const param = useAppSelector(store => store.param);

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
    const destNames: string[][] = [
        validDests.map(id => param.stn_list[id].name[0]),
        validDests.map(id => param.stn_list[id].name[1]),
    ];

    const terminalEl = useRef<SVGGElement | null>(null);
    const [terminalBBox, setTerminalBBox] = useState({ width: 0 } as SVGRect);
    useEffect(
        () => setTerminalBBox(terminalEl.current!.getBBox()),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [...destNames.flat()]
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

const Terminal = forwardRef((props: { destNames: string[][] }, ref: React.Ref<SVGGElement>) => {
    const param = useAppSelector(store => store.param);

    return (
        <g ref={ref} transform={`translate(${param.direction === 'l' ? 36 : param.svgWidth.destination - 36},145)`}>
            {useMemo(
                () => (
                    <>
                        {/* translate is not a generalized implementation, only dest length of 1 and 2 are supported */}
                        <g transform={`translate(0,${props.destNames[0].length === 2 ? -20 : 20})`}>
                            <path
                                d="M60,60L0,0L60-60H100L55-15H160V15H55L100,60z"
                                fill="black"
                                transform={`rotate(${param.direction === 'l' ? 0 : 180})scale(0.8)`}
                            />
                        </g>
                        <g
                            textAnchor={param.direction === 'l' ? 'start' : 'end'}
                            transform={`translate(${param.direction === 'l' ? 128 + 20 : -128 - 20},25)`}
                        >
                            {props.destNames[0].map((name, i) => (
                                <text className="rmg-name__zh" fontSize={70} dy={i * -100 + 7} key={i}>
                                    {'往' + name}
                                </text>
                            ))}
                            {props.destNames[1].map((name, i) => (
                                <text className="rmg-name__en" fontSize={25} dy={i * -100 + 40} key={i}>
                                    {'To ' + name}
                                </text>
                            ))}
                        </g>
                    </>
                ),
                // eslint-disable-next-line react-hooks/exhaustive-deps
                [param.direction, ...props.destNames.flat()]
            )}
        </g>
    );
});

const PlatformNum = () => {
    const param = useAppSelector(store => store.param);

    // Total width: 325
    return useMemo(
        ()=>(
            <g transform={`translate(${-325 / 2 + 60},150)`}>
                <circle r={60} fill="none" stroke="black" strokeWidth={2} />
                <text className="rmg-name__en" dominantBaseline="central" fontSize={120} textAnchor="middle">
                    {param.platform_num}
                </text>
                <text className="rmg-name__zh" fontSize={100} dominantBaseline="central" x={65}>
                    站台
                </text>
            </g>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [param.platform_num]
    );
};

const LineNameBoxText = () => {
    const { line_name, direction, svgWidth } = useAppSelector(store => store.param);

    const boxX = direction === 'l' ? svgWidth.destination - 42 : 42;

    // get the exact station name width so that the
    // line color rectangle can be the right width.
    const stnNameEl = useRef<SVGGElement | null>(null);
    // the original name position
    const [bBox, setBBox] = React.useState({ width: 0 } as DOMRect);
    React.useEffect(
        () => setBBox(stnNameEl.current!.getBBox()),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [...line_name]
    );

    const rectDx = (direction === 'l' ? -bBox.width : 0) - 6
    const stnNameEnDx = (direction === 'l' ? -1 : 1) * bBox.width / 2

    return useMemo(
        () => (
            <g transform={`translate(${boxX},92)`}>
                <rect fill="var(--rmg-theme-colour)" x={rectDx} width={bBox.width + 10} height={120} />
                <g textAnchor={direction === 'r' ? 'start' : 'end'} transform="translate(0,68)" fill="var(--rmg-theme-fg)">
                    <g ref={stnNameEl}>
                        <text className="rmg-name__zh" fontSize={68}>
                            {line_name[0]}
                        </text>
                    </g>
                    <text className="rmg-name__en" fontSize={30} textAnchor="middle" x={stnNameEnDx} dy={42}>
                        {line_name[1]}
                    </text>
                </g>
            </g>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [bBox, boxX, direction, line_name]
    )
};

const LineNameBoxNumber = () => {
    const param = useAppSelector(store => store.param);

    const [lineNumber, lineNameRes] = param.line_name[0].match(/^[\w\d]+|.+/g) as string[];

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
