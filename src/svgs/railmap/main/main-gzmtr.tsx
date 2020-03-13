import * as React from 'react';
import { ParamContext } from '../../../context';
import { getCriticalPath } from '../methods/share';
import { StationsGZMTR } from '../methods/gzmtr';
import StationGZMTR from './station/station-gzmtr';
import LineBox from './line-box-gzmtr';

const MainGZMTR = () => {
    const { param, branches, routes, deps } = React.useContext(ParamContext);

    const criticalPath = React.useMemo(() => getCriticalPath(param.stn_list, StationsGZMTR), [deps]);
    const xShares = React.useMemo(() => StationsGZMTR.getXShares(param.stn_list, criticalPath, branches), [deps]);
    const lineXs: [number, number] =
        param.direction === 'r'
            ? [(param.svg_width * param.padding) / 100 + 65, param.svg_width * (1 - param.padding / 100) - 20]
            : [(param.svg_width * param.padding) / 100, param.svg_width * (1 - param.padding / 100) - 65];
    const xs = Object.keys(xShares).reduce(
        (acc, cur) => ({ ...acc, [cur]: lineXs[0] + (xShares[cur] / criticalPath.len) * (lineXs[1] - lineXs[0]) }),
        {} as typeof xShares
    );

    const yShares = React.useMemo(() => {
        console.log('computing y shares');
        return Object.keys(param.stn_list).reduce((acc, cur) => {
            if (branches[0].includes(cur)) {
                return { ...acc, [cur]: 0 };
            } else {
                let branchOfStn = branches.slice(1).filter(branch => branch.includes(cur))[0];
                return { ...acc, [cur]: param.stn_list[branchOfStn[0]].children.indexOf(branchOfStn[1]) ? -2 : 2 };
            }
        }, {} as { [stnId: string]: number });
    }, [deps]);
    const ys = Object.keys(yShares).reduce(
        (acc, cur) => ({ ...acc, [cur]: -yShares[cur] * param.branch_spacing }),
        {} as typeof yShares
    );

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
        <g
            id="main"
            style={{
                ['--y-percentage' as any]: param.y_pc,
                transform: 'translateY(calc(var(--y-percentage) * var(--rmg-svg-height) / 100))',
            }}
        >
            <Line paths={linePaths} />
            <StationGroup xs={xs} ys={ys} stnStates={stnStates} />
            <g
                id="line_name"
                style={{
                    ['--translate-x' as any]: param.direction == 'r' ? `${lineXs[0] - 65}px` : `${lineXs[1] + 65}px`,
                }}
            >
                <LineBox
                    info={[
                        ,
                        ,
                        'var(--rmg-theme-colour)',
                        'var(--rmg-theme-fg)',
                        param.line_name[0],
                        param.line_name[1],
                    ]}
                    stnState={1}
                />
            </g>
        </g>
    );
};

export default MainGZMTR;

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
