import * as React from 'react';
import { ParamContext } from '../../../context';
import { getCriticalPath } from '../methods/share';
import { StationsGZMTR } from '../methods/gzmtr';
import StationGZMTR from './station/station-gzmtr';

const MainGZMTR = () => {
    const { param, branches, routes } = React.useContext(ParamContext);

    let deps = {};
    Object.keys(param.stn_list).forEach(stnId => {
        let { parents, children, branch } = param.stn_list[stnId];
        deps[stnId] = { parents, children, branch };
    });

    const criticalPath = React.useMemo(() => getCriticalPath(param.stn_list), [JSON.stringify(deps)]);
    const xShares = React.useMemo(() => StationsGZMTR.getXShares(param.stn_list, criticalPath, branches), [
        JSON.stringify(deps),
    ]);
    const lineXs: [number, number] =
        param.direction === 'r'
            ? [(param.svg_width * param.padding) / 100 + 65, param.svg_width * (1 - param.padding / 100) - 20]
            : [(param.svg_width * param.padding) / 100, param.svg_width * (1 - param.padding / 100) - 65];

    const yShares = React.useMemo(() => StationsGZMTR.getYShares(param.stn_list, branches), [JSON.stringify(deps)]);
    const xs = xShare2RealX(xShares, criticalPath, lineXs);
    const ys = yShare2RealY(yShares, param.branch_spacing, branches);

    let stnStates = {} as { [stnId: string]: -1 | 0 | 1 };
    Object.keys(param.stn_list).forEach(
        stnId => (stnStates[stnId] = StationsGZMTR.getStnState(stnId, param.current_stn_idx, param.direction, routes))
    );

    const linePaths = StationsGZMTR.drawLine(
        branches,
        stnStates,
        param.stn_list,
        lineXs,
        xs,
        ys,
        param.branch_spacing,
        criticalPath
    );

    return (
        <>
            <Line paths={linePaths} />
            <StationGroup xs={xs} ys={ys} stnStates={stnStates} />
        </>
    );
};

export default MainGZMTR;

const xShare2RealX = (
    xShares: { [stnId: string]: number },
    cp: { len: number; nodes: string[] },
    lineXs: [number, number]
) => {
    let realXs = {} as { [stnId: string]: number };
    Object.keys(xShares).forEach(stnId => {
        realXs[stnId] = lineXs[0] + (xShares[stnId] / cp.len) * (lineXs[1] - lineXs[0]);
    });
    return realXs;
};

const yShare2RealY = (yShares: { [stnId: string]: number }, branchSpacing: number, branches: string[][]) => {
    let realYs = {} as { [stnId: string]: number };
    Object.keys(yShares).forEach(stnId => {
        let res = -yShares[stnId] * branchSpacing;
        if (branches[0].includes(stnId)) {
            // on main line
            realYs[stnId] = res;
        } else {
            // shift 9.68px
            res += res > 0 ? 9.68 : -9.68;
            realYs[stnId] = res;
        }
    });
    return realYs;
};

const Line = (props: { paths: { main: string[]; pass: string[] } }) => {
    return (
        <g style={{ fill: 'none', strokeWidth: 4 }}>
            <g style={{ stroke: '#aaa', strokeDasharray: 4 }}>
                {props.paths.pass.map((path, i) => (
                    <path key={i} d={path} />
                ))}
            </g>
            <g style={{ stroke: 'var(--rmg-theme-colour)' }}>
                {props.paths.main.map((path, i) => (
                    <path key={i} d={path} />
                ))}
            </g>
        </g>
    );
};

interface StationGroupProps {
    xs: { [stnId: string]: number };
    ys: { [stnId: string]: number };
    stnStates: { [stnId: string]: -1 | 0 | 1 };
}

const StationGroup = (props: StationGroupProps) => {
    const { param } = React.useContext(ParamContext);

    return (
        <g id="stn_icons">
            {Object.keys(param.stn_list).map(stnId => {
                if (['linestart', 'lineend'].includes(stnId)) return;
                return (
                    <g
                        key={stnId}
                        style={{
                            transform: `translate(${props.xs[stnId]}px,${props.ys[stnId]}px)`,
                        }}
                    >
                        <StationGZMTR stnId={stnId} stnState={props.stnStates[stnId]} stnY={props.ys[stnId]} />
                    </g>
                );
            })}
        </g>
    );
};
