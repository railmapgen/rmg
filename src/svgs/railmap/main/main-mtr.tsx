import * as React from 'react';
import { ParamContext } from '../../../context';
import { getCriticalPath } from '../methods/share';
import { StationsMTR } from '../methods/mtr';
import StationMTR from './station/station-mtr';

const MainMTR = () => {
    const { param, branches, routes, deps } = React.useContext(ParamContext);

    const criticalPath = React.useMemo(() => getCriticalPath(param.stn_list, StationsMTR), [deps]);
    const xShares = React.useMemo(() => StationsMTR.getXShares(param.stn_list, criticalPath, branches), [deps]);
    const lineXs: [number, number] = [
        (param.svg_width * param.padding) / 100,
        param.svg_width * (1 - param.padding / 100),
    ];

    const yShares = React.useMemo(() => StationsMTR.getYShares(param.stn_list, branches), [deps]);
    const xs = Object.keys(xShares).reduce(
        (acc, cur) => ({ ...acc, [cur]: lineXs[0] + (xShares[cur] / criticalPath.len) * (lineXs[1] - lineXs[0]) }),
        {} as typeof xShares
    );
    const ys = Object.keys(yShares).reduce(
        (acc, cur) => ({
            ...acc,
            [cur]:
                -yShares[cur] * param.branch_spacing +
                (branches[0].includes(cur) ? 0 : yShares[cur] > 0 ? -9.68 : 9.68),
        }),
        {} as typeof yShares
    );

    let stnStates = {} as { [stnId: string]: -1 | 0 | 1 };
    Object.keys(param.stn_list).forEach(
        stnId => (stnStates[stnId] = StationsMTR.getStnState(stnId, param.current_stn_idx, param.direction, routes))
    );

    const namePoss = React.useMemo(() => StationsMTR.getNamePos(param.stn_list, criticalPath), [
        deps,
        JSON.stringify(criticalPath),
    ]);

    const linePaths = StationsMTR.drawLine(
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
            <Lines paths={linePaths} />
            <StationGroup xs={xs} ys={ys} stnStates={stnStates} namePoss={namePoss} />
        </g>
    );
};

export default MainMTR;

const Lines = React.memo(
    (props: { paths: { main: string[]; pass: string[] } }) => {
        return (
            <g style={{ fill: 'none', strokeWidth: 9.68 }}>
                <g style={{ stroke: 'var(--rmg-grey)' }}>
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
    },
    (prevProps, nextProps) => JSON.stringify(prevProps.paths) === JSON.stringify(nextProps.paths)
);

interface StationGroupProps {
    xs: { [stnId: string]: number };
    ys: { [stnId: string]: number };
    stnStates: { [stnId: string]: -1 | 0 | 1 };
    namePoss: { [stnId: string]: boolean };
}

const StationGroup = (props: StationGroupProps) => {
    const { param } = React.useContext(ParamContext);

    let correctedNamePoss = {} as { [stnId: string]: boolean };
    Object.keys(props.namePoss).forEach(
        stnId => (correctedNamePoss[stnId] = param.txt_flip ? !props.namePoss[stnId] : props.namePoss[stnId])
    );

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
                        <StationMTR
                            stnId={stnId}
                            stnState={props.stnStates[stnId]}
                            namePos={correctedNamePoss[stnId]}
                        />
                    </g>
                );
            })}
        </g>
    );
};
