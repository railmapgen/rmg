import * as React from 'react';

import { ParamContext } from '../../context';
import StripMTR from '../strip/strip-mtr';
import StripGZMTR from '../strip/strip-gzmtr';
import Main from './main';
import Defs from './defs';

const RailMap = () => {
    const { param } = React.useContext(ParamContext);
    return (
        <svg
            id="railmap"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            style={{
                width: 'var(--rmg-svg-width)',
                height: 'var(--rmg-svg-height)',
                ['--rmg-svg-width' as any]: param.svg_width + 'px',
                ['--rmg-svg-height' as any]: param.svg_height + 'px',
                ['--rmg-theme-colour' as any]: param.theme[2],
            }}
        >
            <React.Suspense fallback="loading">
                <Defs />
            </React.Suspense>

            <rect id="outer" x={0} y={0} />

            {window.urlParams.get('style') === 'mtr' && <StripMTR stripPc={param.strip_pc} />}
            {window.urlParams.get('style') === 'gzmtr' && (
                <StripGZMTR variant={param.info_panel_type} isShowLight={false} isShowPSD={false} />
            )}

            <Main />
            {window.urlParams.get('style') === 'gzmtr' && <DirectionIndicator />}
        </svg>
    );
};

export default RailMap;

const DirectionIndicator = () => {
    const { param, routes } = React.useContext(ParamContext);

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

    return (
        <g
            id="direction_gz"
            style={{ ['--x-percentage' as any]: param.direction_gz_x, ['--y-percentage' as any]: param.direction_gz_y }}
        >
            <use
                xlinkHref="#arrow_direction"
                style={{ ['--rotate' as any]: param.direction === 'l' ? '0deg' : '180deg' }}
            />
            <g
                style={{
                    textAnchor: param.direction === 'l' ? 'start' : 'end',
                    transform: `translate(${param.direction === 'l' ? 65 : -65}px,-5px)`,
                }}
            >
                {validDests.length !== 2 ? (
                    <DirectionIndicatorTextGroup destIds={validDests} />
                ) : (
                    <DirectionIndicatorTextGroup2 destIds={validDests} />
                )}
            </g>
        </g>
    );
};

const DirectionIndicatorTextGroup = (props: { destIds: string[] }) => {
    const { param } = React.useContext(ParamContext);
    return (
        <>
            <text className="rmg-name__zh rmg-name__gzmtr--direc">
                {props.destIds.map(stnId => param.stn_list[stnId].name[0]).join('/') + '方向'}
            </text>
            <text className="rmg-name__en rmg-name__gzmtr--direc" dy={22}>
                {'Towards ' + props.destIds.map(stnId => param.stn_list[stnId].name[1].replace('\\', ' ')).join('/')}
            </text>
        </>
    );
};

const DirectionIndicatorTextGroup2 = (props: { destIds: string[] }) => {
    const { param } = React.useContext(ParamContext);

    const charCounts = props.destIds.map(stnId => param.stn_list[stnId].name[0].length);
    const minCharCounts = Math.min(...charCounts);
    const charSpacing =
        minCharCounts > 1 && charCounts[0] !== charCounts[1]
            ? Math.abs(charCounts[0] - charCounts[1]) / (minCharCounts - 1)
            : 0;

    return (
        <>
            {props.destIds.map((id, i) => (
                <React.Fragment key={i}>
                    <text
                        className="rmg-name__zh rmg-name__gzmtr--direc2"
                        x={param.direction === 'l' ? 0 : -75}
                        y={-21 + 42 * i}
                        style={{ letterSpacing: charCounts[i] > charCounts[1 - i] ? '0em' : `${charSpacing}em` }}
                    >
                        {param.stn_list[id].name[0]}
                    </text>
                    <text
                        className="rmg-name__en rmg-name__gzmtr--direc2"
                        x={param.direction === 'l' ? 0 : -75}
                        y={-1 + 42 * i}
                    >
                        {'Towards ' + param.stn_list[id].name[1].replace('\\', ' ')}
                    </text>
                </React.Fragment>
            ))}
            <text
                className="rmg-name__zh rmg-name__gzmtr--direc"
                x={param.direction === 'l' ? 25 * (Math.max(...charCounts) + 1) : 0}
                y={5}
            >
                方向
            </text>
        </>
    );
};
