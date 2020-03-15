import * as React from 'react';

import { ParamContext } from '../../context';
import StripMTR from '../strip/strip-mtr';

const DestinationMTR = () => {
    const { param } = React.useContext(ParamContext);

    return (
        <>
            <DefsMTR />
            <StripMTR stripPc={param.strip_pc} />
            <InfoMTR />
        </>
    );
};

export default DestinationMTR;

const DefsMTR = React.memo(() => (
    <defs>
        <path
            id="arrow"
            d="M 60,60 L 0,0 L 60,-60 H 100 L 55,-15 H 160 V 15 H 55 L 100,60z"
            fill="var(--rmg-black,#000)"
        />
    </defs>
));

const InfoMTR = () => {
    const { param, routes } = React.useContext(ParamContext);

    let destNames = ['', ''];
    if (param.customiseMTRDest.terminal !== false) {
        destNames = param.customiseMTRDest.terminal;
    } else {
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
        destNames = [
            validDests.map(stnId => param.stn_list[stnId].name[0]).join('/'),
            validDests
                .map(stnId => param.stn_list[stnId].name[1])
                .join('/')
                .replace('\\', ' '),
        ];
    }

    const destNameEl = React.createRef<SVGGElement>();
    const [bBox, setBBox] = React.useState({ width: 0 } as DOMRect);
    React.useEffect(() => setBBox(destNameEl.current.getBBox()), [
        destNames.toString(),
        param.customiseMTRDest.isLegacy,
    ]);

    const flagLength = 160 + 150 + bBox.width + 45 + 50;
    const arrowX = (param.svg_dest_width - (param.direction === 'l' ? 1 : -1) * flagLength) / 2;
    const platformNumX = arrowX + (param.direction === 'l' ? 1 : -1) * (160 + 50 + 75);
    const destNameX = platformNumX + (param.direction === 'l' ? 1 : -1) * (75 + 45);

    return (
        <g id="dest_name">
            <use
                xlinkHref="#arrow"
                style={{ transform: `translateX(${arrowX}px)rotate(${param.direction === 'l' ? 0 : 180}deg)` }}
            />
            <g id="platform" style={{ transform: `translateX(${platformNumX}px)` }}>
                <circle cx={0} cy={0} r={75} />
                <text className="rmg-name__zh" dy={0}>
                    {param.platform_num}
                </text>
            </g>
            <g
                ref={destNameEl}
                style={{
                    transform: `translate(${destNameX}px,-25px)`,
                    textAnchor: param.direction === 'l' ? 'start' : 'end',
                }}
            >
                <text className="rmg-name__zh" fontSize="90px">
                    {(param.dest_legacy ? param.line_name[0] : '') + '往' + destNames[0]}
                </text>
                <text className="rmg-name__en" fontSize="45px" dy={80}>
                    {(param.dest_legacy ? param.line_name[1] + ' ' : '') + 'to ' + destNames[1]}
                </text>
            </g>
        </g>
    );
};
