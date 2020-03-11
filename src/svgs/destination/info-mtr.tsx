import * as React from 'react';
import { ParamContext } from '../../context';

const InfoMTR = () => {
    const { param, routes } = React.useContext(ParamContext);

    const validDests = Array.from(
        new Set(
            routes
                .filter(route => route.includes(param.current_stn_idx))
                .map(route => {
                    let res = route.filter(stnId => !['linestart', 'lineend'].includes(stnId))
                    return param.direction === 'l' ? res[0] : res.reverse()[0]
                })
        )
    );

    const destNameEl = React.createRef<SVGGElement>();
    const [bBox, setBBox] = React.useState({ width: 0 } as DOMRect);
    React.useEffect(() => setBBox(destNameEl.current.getBBox()), []);

    const flagLength = 160 + 150 + bBox.width + 45 + 50;
    const arrowX = (param.svg_dest_width - (param.direction === 'l' ? 1 : -1) * flagLength) / 2;
    const platformNumX = arrowX + (param.direction === 'l' ? 1 : -1) * (160 + 50 + 75);
    const destNameX = platformNumX + (param.direction === 'l' ? 1 : -1) * (75 + 45);

    return (
        <g id="dest_name">
            <use xlinkHref="#arrow" style={{ transform: `translateX(${arrowX}px)rotate(${param.direction === 'l' ? 0 : 180}deg)` }} />
            <g id="platform" style={{ transform: `translateX(${platformNumX}px)` }}>
                <circle cx={0} cy={0} r={75} />
                <text className="rmg-name__zh" dy={0}>{param.platform_num}</text>
            </g>
            <g ref={destNameEl} style={{
                transform: `translate(${destNameX}px,-25px)`,
                textAnchor: (param.direction === 'l' ? 'start' : 'end')
            }}>
                <text className="rmg-name__zh" fontSize="90px">
                    {(param.dest_legacy ? param.line_name[0] : '') +
                        '往' +
                        validDests.map(stnId => param.stn_list[stnId].name[0]).join('/')}
                </text>
                <text className="rmg-name__en" fontSize="45px" dy={80}>
                    {(param.dest_legacy ? param.line_name[1] + ' ' : '') +
                        'to ' +
                        validDests.map(stnId => param.stn_list[stnId].name[1]).join('/').replace('\\', ' ')}
                </text>
            </g>
        </g>
    );
};

export default InfoMTR;