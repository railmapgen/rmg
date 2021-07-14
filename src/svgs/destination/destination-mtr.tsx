import React from 'react';

import { ParamContext } from '../../context';
import StripMTR from '../strip/strip-mtr';
import { Name } from "../../constants/constants";

export default React.memo(function DestinationMTR() {
    return (
        <>
            <DefsMTR />
            <StripMTR stripPc={90} />
            <InfoMTR />
        </>
    );
});

const DefsMTR = React.memo(() => (
    <defs>
        <path id="arrow" d="M60,60L0,0L60-60H100L55-15H160V15H55L100,60z" fill="var(--rmg-black,#000)" />
    </defs>
));

const InfoMTR = () => {
    const { param, routes } = React.useContext(ParamContext);

    let destNames: Name;
    if (param.customiseMTRDest.terminal !== false) {
        destNames = param.customiseMTRDest.terminal;
    } else {
        const validDests = [
            ...new Set(
                routes
                    .filter(route => route.includes(param.current_stn_idx))
                    .map(
                        route =>
                            route
                                .filter(stnId => !['linestart', 'lineend'].includes(stnId))
                                .slice(param.direction === 'l' ? 0 : -1)[0]
                    )
                    .filter(id => id !== param.current_stn_idx)
            ),
        ];
        destNames = [
            validDests.map(stnId => param.stn_list[stnId].name[0]).join('/'),
            validDests
                .map(stnId => param.stn_list[stnId].name[1])
                .join('/')
                .replace('\\', ' '),
        ];
    }

    const destNameEl = React.useRef<SVGGElement | null>(null);
    const [bBox, setBBox] = React.useState({ width: 0 } as DOMRect);
    React.useEffect(
        () => setBBox(destNameEl.current!.getBBox()),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [destNames.toString(), param.customiseMTRDest.isLegacy]
    );

    const flagLength = 160 + 150 + bBox.width + 45 + 50;
    const arrowX = (param.svgWidth.destination - (param.direction === 'l' ? 1 : -1) * flagLength) / 2;
    const platformNumX = arrowX + (param.direction === 'l' ? 1 : -1) * (160 + 50 + 75);
    const destNameX = platformNumX + (param.direction === 'l' ? 1 : -1) * (75 + 45);

    return (
        <g id="dest_name" style={{ transform: 'translateY(calc(var(--rmg-svg-height) / 2 - 20px))' }}>
            <use xlinkHref="#arrow" transform={`translate(${arrowX},0)rotate(${param.direction === 'l' ? 0 : 180})`} />
            <PlatformNum num={param.platform_num} transform={`translate(${platformNumX},0)`} />
            <g
                ref={destNameEl}
                textAnchor={param.direction === 'l' ? 'start' : 'end'}
                transform={`translate(${destNameX},-25)`}
                fill="var(--rmg-black)"
            >
                <text className="rmg-name__zh" fontSize={90}>
                    {(param.customiseMTRDest.isLegacy ? param.line_name[0] : '') + '往' + destNames[0]}
                </text>
                <text className="rmg-name__en" fontSize={45} dy={80}>
                    {(param.customiseMTRDest.isLegacy ? param.line_name[1] + ' ' : '') + 'to ' + destNames[1]}
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
