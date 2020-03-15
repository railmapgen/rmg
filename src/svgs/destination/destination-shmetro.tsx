import * as React from 'react';
import { ParamContext } from '../../context';

const DestinationSHMetro = () => {
    return (
        <>
            <DefsSHMetro />
            <InfoSHMetro />
        </>
    );
};

export default DestinationSHMetro;

const DefsSHMetro = React.memo(() => (
    <defs>
        <path id="arrow_left" d="M 60,60 L 0,0 L 60,-60 H 100 L 55,-15 H 160 V 15 H 55 L 100,60z" fill="black" />
    </defs>
));

const InfoSHMetro = () => {
    const { param, routes } = React.useContext(ParamContext);

    const destTextEl = React.createRef<SVGGElement>();
    const [bcr, setBcr] = React.useState({ width: 0 } as DOMRect);
    // Chito: bcr.width = 0 or based on dest_text?
    // React.useEffect(() => setBcr(destTextEl.current.getBoundingClientRect()), []);
    const flagLength = 160 + 150 + bcr.width + 45 + 50;

    // get the height
    const dh = param.svg_height - 300;

    // arrow
    const isLeft = param.direction == 'l' ? 1 : -1;
    let arrowX = (param.svg_dest_width - isLeft * flagLength) / 20;
    arrowX = param.direction == 'l' ? arrowX : param.svg_dest_width - 20;
    const arrowRotate = 90 * (1 - isLeft);

    // not in use now
    const platformNumX = arrowX + isLeft * (160 + 50 + 75);

    // for each left valid destinations, get the name from id
    const validDests = Array.from(
        new Set(
            routes
                .filter(route => route.includes(param.current_stn_idx))
                .map(route => {
                    let res = route.filter(stnId => !['linestart', 'lineend'].includes(stnId));
                    return param.direction === 'l' ? res[0] : res.reverse()[0];
                })
        )
    );

    // prepare for the line name
    let lineNameX = param.direction === 'l' ? param.svg_dest_width : 360;
    let [lineNameZH, lineNameEN] = param.line_name;

    // line starts with numbers or letters
    const lineNumber = lineNameZH.match(/(\d*)\w+/);
    if (lineNumber) {
        lineNameX -= 180;
        lineNameZH = '号线';
    } else {
        lineNameX -= 280;
    }

    // the platform screen doors flash light
    // #20
    // $('g#station_info_shmetro > rect').attr({ transform: `translate(${this._svgDestWidth / 2},${250 + dh})` })

    return (
        <g id="station_info_shmetro">
            <path
                id="line_shmetro_use"
                fill="var(--rmg-theme-colour)"
                d={
                    param.direction === 'l'
                        ? `M38,10 H ${param.svg_dest_width - 20} l 0,12 H 24 Z`
                        : `M24,10 H ${param.svg_dest_width - 30} l 12,12 H 24 Z`
                }
                transform={`translate(0,${220 + dh})`}
            />
            <use
                id="arrow_left_use"
                xlinkHref="#arrow_left"
                transform={`translate(${arrowX},${135 + dh})rotate(${arrowRotate})`}
            />
            {/* <!-- Todo: fix this absolute position --> */}
            {/* Todo: fix svg_dest_width*0.8, this has only been tested on 1000 width */}
            <g
                ref={destTextEl}
                id="dest_text"
                style={{
                    textAnchor: param.direction === 'l' ? 'start' : 'end',
                    transform: `translate(${param.svg_dest_width * (param.direction === 'l' ? 0.2 : 0.8)}px,${135 +
                        dh}px)`,
                }}
            >
                <text className="rmg-name__zh rmg-name__shmetro--dest" fontSize="400%">
                    {'往' + validDests.map(id => param.stn_list[id].name[0]).join('，')}
                </text>
                <text className="rmg-name__en rmg-name__shmetro--dest" fontSize="150%" dy={40}>
                    {'To ' +
                        validDests
                            .map(id => param.stn_list[id].name[1])
                            .join(', ')
                            .replace('\\', ' ')}
                </text>
            </g>
            <g id="line_number">
                <rect
                    fill="var(--rmg-theme-colour)"
                    transform={
                        lineNumber
                            ? `translate(${lineNameX - 150},${70 + dh})`
                            : `translate(${lineNameX - 10},${60 + dh})`
                    }
                    width={lineNumber ? 125 : 260}
                    height={lineNumber ? 125 : 150}
                />
                {lineNumber && (
                    <text
                        className="rmg-name__zh rmg-name__shmetro--line_number"
                        fill="var(--rmg-theme-fg)"
                        fontSize="700%"
                        textAnchor="middle"
                        dominantBaseline="central"
                        transform={`translate(${lineNameX - 87.5},${132.5 + dh})`}
                        style={{ letterSpacing: '-5px' }}
                    >
                        {lineNumber[0]}
                    </text>
                )}
            </g>
            <g
                id="line_name_text"
                fill={lineNumber ? 'black' : 'var(--rmg-theme-fg)'}
                transform={`translate(${lineNameX},${135 + dh})`}
                textAnchor="start"
            >
                <text className="rmg-name__zh rmg-name__shmetro--line_name" fontSize="500%">
                    {lineNameZH}
                </text>
                {/* // Todo: set the eng in the middle */}
                <text
                    className="rmg-name__en rmg-name__shmetro--line_name"
                    fontSize="200%"
                    dy={60}
                    dx={lineNumber ? 0 : 50}
                >
                    {lineNameEN}
                </text>
            </g>
            {/* <!-- # 20 <rect width="40" height="30" fill="orange"/> --> */}
        </g>
    );
};
