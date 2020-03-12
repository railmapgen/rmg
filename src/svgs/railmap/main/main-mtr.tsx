import * as React from 'react';
import { ParamContext } from '../../../context';
import { getCriticalPath } from '../methods/share';
import { StationsMTR } from '../methods/mtr';
import StationMTR from './station/station-mtr';

const MainMTR = () => {
    const { param, branches, routes } = React.useContext(ParamContext);

    let deps = {};
    Object.keys(param.stn_list).forEach(stnId => {
        let { parents, children, branch } = param.stn_list[stnId];
        deps[stnId] = { parents, children, branch };
    });

    const criticalPath = React.useMemo(() => getCriticalPath(param.stn_list), [JSON.stringify(deps)]);
    const xShares = React.useMemo(() => StationsMTR.getXShares(param.stn_list, criticalPath, branches), [
        JSON.stringify(deps),
    ]);
    const lineXs: [number, number] = [
        (param.svg_width * param.padding) / 100,
        param.svg_width * (1 - param.padding / 100),
    ];

    const yShares = React.useMemo(() => StationsMTR.getYShares(param.stn_list, branches), [JSON.stringify(deps)]);
    const xs = xShare2RealX(xShares, criticalPath, lineXs);
    const ys = yShare2RealY(yShares, param.branch_spacing, branches);

    let stnStates = {} as { [stnId: string]: -1 | 0 | 1 };
    Object.keys(param.stn_list).forEach(
        stnId => (stnStates[stnId] = StationsMTR.getStnState(stnId, param.current_stn_idx, param.direction, routes))
    );

    const namePoss = React.useMemo(() => StationsMTR.getNamePos(param.stn_list, criticalPath), [
        JSON.stringify(deps),
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
        <>
            <Lines paths={linePaths} />
            <StationGroup xs={xs} ys={ys} stnStates={stnStates} namePoss={namePoss} />
        </>
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
        realYs[stnId] = -yShares[stnId] * branchSpacing;
    });
    return realYs;
};
