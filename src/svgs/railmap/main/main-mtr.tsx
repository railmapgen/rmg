import * as React from 'react';
import { ParamContext } from '../../../context';
import { adjacencyList, criticalPathMethod, getXShareMTR, getStnState } from '../methods/share';
import { StationsMTR } from '../methods/mtr';
import StationMTR from './station/station-mtr';
import { StationInfo } from '../../../types';

const leftWideFactor = (stnList: { [stnId: string]: StationInfo }, stnId: string) => {
    var res = 0;
    let { type, tick_direc } = stnList[stnId].transfer;
    if (tick_direc === 'l') {
        if (['int3', 'osi11', 'osi12', 'osi21', 'osi31'].includes(type)) {
            res += 0.8;
        }
    }
    if (type === 'osi22') res += 0.8;
    if (stnList[stnId].parents.length === 2) res += 0.4;
    if (stnList[stnList[stnId].parents[0]].children.length === 2) res += 0.4;
    return res;
};

const rightWideFactor = (stnList: { [stnId: string]: StationInfo }, stnId: string) => {
    var res = 0;
    let { type, tick_direc } = stnList[stnId].transfer;
    if (tick_direc === 'r') {
        if (['int3', 'osi11', 'osi12', 'osi21', 'osi31'].includes(type)) {
            res += 0.8;
        }
    }
    if (type === 'osi22') res += 0.8;
    if (stnList[stnId].children.length === 2) res += 0.4;
    if (stnList[stnList[stnId].children[0]].parents.length === 2) res += 0.4;
    return res;
};

const MainMTR = () => {
    const { param, branches, routes, deps } = React.useContext(ParamContext);

    const adjMat = adjacencyList(param.stn_list, leftWideFactor, rightWideFactor);

    const criticalPath = React.useMemo(() => criticalPathMethod('linestart', 'lineend', adjMat), [
        JSON.stringify(adjMat),
    ]);
    const realCP = React.useMemo(
        () => criticalPathMethod(criticalPath.nodes[1], criticalPath.nodes.slice(-2)[0], adjMat),
        [JSON.stringify(adjMat)]
    );

    const xShares = React.useMemo(() => {
        console.log('computing x shares');
        return Object.keys(param.stn_list).reduce(
            (acc, cur) => ({ ...acc, [cur]: getXShareMTR(cur, adjMat, branches) }),
            {}
        );
    }, [branches.toString(), JSON.stringify(adjMat)]);
    const lineXs: [number, number] = [
        (param.svgWidth.railmap * param.padding) / 100,
        param.svgWidth.railmap * (1 - param.padding / 100),
    ];
    const xs = Object.keys(xShares).reduce(
        (acc, cur) => ({ ...acc, [cur]: lineXs[0] + (xShares[cur] / realCP.len) * (lineXs[1] - lineXs[0]) }),
        {} as typeof xShares
    );

    const yShares = React.useMemo(() => StationsMTR.getYShares(param.stn_list, branches), [deps]);
    const ys = Object.keys(yShares).reduce(
        (acc, cur) => ({
            ...acc,
            [cur]:
                -yShares[cur] * param.branch_spacing +
                (branches[0].includes(cur) ? 0 : yShares[cur] > 0 ? -9.68 : 9.68),
        }),
        {} as typeof yShares
    );

    const stnStates = React.useMemo(() => getStnState(param.current_stn_idx, routes, param.direction), [
        param.current_stn_idx,
        param.direction,
        routes.toString(),
    ]);

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
