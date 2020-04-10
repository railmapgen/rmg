import React, { memo, useContext, useMemo } from 'react';
import { ParamContext } from '../../context';

export default memo(function DestinationSHMetro() {
    return (
        <>
            {/* <DefsSHMetro /> */}
            <InfoSHMetro />
        </>
    );
});

const InfoSHMetro = () => {
    const { param, routes } = useContext(ParamContext);

    const destTextEl = React.createRef<SVGGElement>();
    const [bcr] = React.useState({ width: 0 } as DOMRect);
    // Chito: bcr.width = 0 or based on dest_text?
    // React.useEffect(() => setBcr(destTextEl.current.getBoundingClientRect()), []);
    const flagLength = 160 + 150 + bcr.width + 45 + 50;

    // get the height
    const dh = param.svg_height - 300;

    // arrow
    const isLeft = param.direction === 'l' ? 1 : -1;
    let arrowX = (param.svgWidth.destination - isLeft * flagLength) / 20;
    arrowX = param.direction === 'l' ? arrowX : param.svgWidth.destination - 20;
    const arrowRotate = 90 * (1 - isLeft);

    // not in use now
    // const platformNumX = arrowX + isLeft * (160 + 50 + 75);

    // for each left valid destinations, get the name from id
    const validDests = Array.from(
        new Set(
            routes
                .filter((route) => route.includes(param.current_stn_idx))
                .map((route) => {
                    let res = route.filter((stnId) => !['linestart', 'lineend'].includes(stnId));
                    return param.direction === 'l' ? res[0] : res.reverse()[0];
                })
        )
    );

    const isLineNumber = Boolean(param.line_name[0].match(/^[\w\d]+/));

    // the platform screen doors flash light
    // #20
    // $('g#station_info_shmetro > rect').attr({ transform: `translate(${this._svgDestWidth / 2},${250 + dh})` })

    return (
        <g transform={`translate(0,${dh})`}>
            <path
                fill="var(--rmg-theme-colour)"
                d={
                    param.direction === 'l'
                        ? `M36,10 H ${param.svgWidth.destination - 24} l 0,12 H 24 Z`
                        : `M24,10 H ${param.svgWidth.destination - 36} l 12,12 H 24 Z`
                }
                transform="translate(0,220)"
            />
            <path
                d="M60,60L0,0L60-60H100L55-15H160V15H55L100,60z"
                fill="black"
                transform={`translate(${arrowX},135)rotate(${arrowRotate})`}
            />

            {/* <!-- Todo: fix this absolute position --> */}
            {/* Todo: fix svgWidth.destination*0.8, this has only been tested on 1000 width */}
            <g
                ref={destTextEl}
                textAnchor={param.direction === 'l' ? 'start' : 'end'}
                transform={`translate(${param.svgWidth.destination * (param.direction === 'l' ? 0.2 : 0.8)},135)`}
            >
                <text className="rmg-name__zh" fontSize="400%">
                    {'往' + validDests.map((id) => param.stn_list[id].name[0]).join('，')}
                </text>
                <text className="rmg-name__en" fontSize="150%" dy={40}>
                    {'To ' +
                        validDests
                            .map((id) => param.stn_list[id].name[1])
                            .join(', ')
                            .replace('\\', ' ')}
                </text>
            </g>
            {isLineNumber ? <LineNameBoxNumber /> : <LineNameBoxText />}
        </g>
    );
};

const LineNameBoxText = () => {
    const { param } = useContext(ParamContext);

    const boxX = param.direction === 'l' ? param.svgWidth.destination - 24 - 130 : 24 + 130;

    return useMemo(
        () => (
            <g transform={`translate(${boxX},60)`}>
                <rect fill="var(--rmg-theme-colour)" x={-130} width={260} height={150} />
                <g textAnchor="middle" transform="translate(0,75)" fill="var(--rmg-theme-fg)">
                    <text className="rmg-name__zh" fontSize={80}>
                        {param.line_name[0]}
                    </text>
                    <text className="rmg-name__en" fontSize={32} dy={60}>
                        {param.line_name[1]}
                    </text>
                </g>
            </g>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [boxX, param.line_name.toString()]
    );
};

const LineNameBoxNumber = () => {
    const { param } = useContext(ParamContext);

    const [lineNumber, lineNameRes] = param.line_name[0].match(/^[\w\d]+|.+/g);

    // Number width: 135
    // Text width: 160
    // Gap: 20
    // Left: 135/2 + 20 + 160 = 247.5
    // Right: 135/2 =
    const boxX = param.direction === 'l' ? param.svgWidth.destination - 24 - 247.5 : 24 + 67.5;

    return useMemo(
        () => (
            <g transform={`translate(${boxX},60)`}>
                <rect fill="var(--rmg-theme-colour)" x={-67.5} width={135} height={150} />
                <text
                    className="rmg-name__zh"
                    fill="var(--rmg-theme-fg)"
                    fontSize={112}
                    textAnchor="middle"
                    dominantBaseline="central"
                    transform="translate(0,75)"
                    letterSpacing={-5}
                >
                    {lineNumber}
                </text>
                <g textAnchor="start" transform="translate(87.5,75)">
                    <text className="rmg-name__zh" fontSize={80}>
                        {lineNameRes}
                    </text>
                    <text className="rmg-name__en" fontSize={32} dy={60}>
                        {param.line_name[1]}
                    </text>
                </g>
            </g>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [boxX, param.line_name.toString()]
    );
};
