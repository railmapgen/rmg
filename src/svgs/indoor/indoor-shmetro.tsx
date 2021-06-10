import React, { memo, useContext, useMemo, forwardRef, useRef, useState, useEffect } from 'react';
import { ParamContext } from '../../context';
import { adjacencyList, getXShareMTR, criticalPathMethod, drawLine, getStnState } from '../railmap/methods/share';
import { servicesPath, _linePath } from '../railmap/main/main-shmetro';
import StationSHMetro from './station-shmetro';
import {getXShare} from '../railmap/main/main-gzmtr';

export default memo(function IndoorWrapperSHMetro() {
    return (
        <>
            <DefsSHMetro />
            <IndoorSHMetro />
        </>
    );
});

export const DefsSHMetro = React.memo(() => (
    <defs>
        <circle id="stn_indoor_sh" fill="white" strokeWidth={5} stroke="var(--rmg-theme-colour)" r={8} />
        <path id="int2_indoor_sh" fill="white" strokeWidth={4} d="M -5,0 a 5,5 0 1 1 10,0 V10 a 5,5 0 1 1 -10,0Z"
            stroke="black" transform="translate(0, -6.5)scale(1.33)" />
        <path id="express_sh" fill="white" strokeWidth={2} d="M -5,0 a 5,5 0 1 1 10,0 V25 a 5,5 0 1 1 -10,0Z" />
        <path id="direct_sh" fill="whitef" strokeWidth={2} d="M -5,0 a 5,5 0 1 1 10,0 V50 a 5,5 0 1 1 -10,0Z" />
        <path id="int_indoor_arrow_sh" stroke="black" strokeWidth={1} d="M -7.5,0 v -30 h -7.5 l 15,-15 l 15,15 h -7.5 v 30 Z " />
    </defs>
));

// refactor the same code here and main-shmetro
const IndoorSHMetro = () => {
    const { param, routes, branches, deps } = useContext(ParamContext);

    const adjMat = adjacencyList(
        param.stn_list,
        () => 0,
        () => 0
    );

    const criticalPath = criticalPathMethod('linestart', 'lineend', adjMat);
    const realCP = criticalPathMethod(criticalPath.nodes[1], criticalPath.nodes.slice(-2)[0], adjMat);

    const xShares = React.useMemo(
        () => {
            console.log('computing x shares');
            return Object.keys(param.stn_list).reduce(
                (acc, cur) => ({ ...acc, [cur]: getXShare(cur, adjMat, branches) }),
                {} as { [stnId: string]: number }
            );
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [branches.toString(), JSON.stringify(adjMat)]
    );
    const lineXs: [number, number] = [
        (param.svgWidth.railmap * param.padding) / 100,
        param.svgWidth.railmap * (1 - param.padding / 100),
    ];
    const xs = Object.keys(xShares).reduce(
        (acc, cur) => ({ ...acc, [cur]: lineXs[0] + (xShares[cur] / realCP.len) * (lineXs[1] - lineXs[0]) }),
        {} as typeof xShares
    );

    // const lineXs: [number, number] =
    //     param.direction === 'r'
    //         ? [
    //               (param.svgWidth.railmap * param.padding) / 100 + 65,
    //               param.svgWidth.railmap * (1 - param.padding / 100) - 20,
    //           ]
    //         : [(param.svgWidth.railmap * param.padding) / 100, param.svgWidth.railmap * (1 - param.padding / 100) - 65];
    // const xs = Object.keys(xShares).reduce(
    //     (acc, cur) => ({ ...acc, [cur]: lineXs[0] + (xShares[cur] / realCP.len) * (lineXs[1] - lineXs[0]) }),
    //     {} as typeof xShares
    // );

    const yShares = React.useMemo(
        () => {
            console.log('computing y shares');
            return Object.keys(param.stn_list).reduce(
                (acc, cur) => ({ ...acc, [cur]: branches[0].includes(cur) ? 0 : 3 }),
                {} as { [stnId: string]: number }
            );
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [deps]
    );
    const ys = Object.keys(yShares).reduce(
        (acc, cur) => ({ ...acc, [cur]: -yShares[cur] * param.branch_spacing }),
        {} as typeof yShares
    );
    console.log(param.stn_list)
    console.log(branches)

    const stnStates = React.useMemo(
        () => getStnState(param.current_stn_idx, routes, param.direction),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [param.current_stn_idx, param.direction, routes.toString()]
    );

    const linePaths = drawLine(branches, stnStates);

    // `paths: servicesPath[]` is supposed to be paths of different service
    // but for `indoor`, only `local` is enough
    const paths = [(Object.keys(linePaths) as (keyof ReturnType<typeof drawLine>)[]).reduce(
        (acc, cur) => ({
            ...acc,
            [cur]: linePaths[cur].map(stns => _linePath(stns, cur, xs, ys, param.direction, 'local', 1, 0)),
            service: 'local' as Services,
        }),
        {} as servicesPath
    ),]

    return (
        <g id="main" transform={`translate(0,${param.svg_height - 150})`}>
            <Line paths={paths} direction={param.direction} />
            <StationGroup xs={xs} ys={ys} xShares={xShares} stnStates={stnStates} />
        </g>
    );
}

const Line = (props: { paths: servicesPath[]; direction: 'l' | 'r' }) => {
    return (
        <>
            {props.paths.map((_, i) => (  // only use i here to adjust the height for different services
                <g key={`servicePath${i}`} transform={`translate(0,${i * 25})`}>
                    <g>
                        {props.paths.flatMap(path =>
                            Object
                                .values(path)
                                .filter(v => v instanceof Array)  // string[][]
                                .reduce((r, k) => r.concat(k), [] as string[]) as string[]
                        ).map((path, j) => (
                            <path
                                key={j}
                                stroke="var(--rmg-theme-colour)"
                                strokeWidth={12}
                                fill="none"
                                d={path}
                                strokeLinejoin="round"
                            />
                        ))}
                    </g>
                </g>
            ))}
        </>
    );
};

interface StationGroupProps {
    xs: { [stnId: string]: number };
    ys: { [stnId: string]: number };
    xShares: { [stnId: string]: number };  // Used as stn order
    stnStates: { [stnId: string]: -1 | 0 | 1 };
}

const StationGroup = (props: StationGroupProps) => {
    const { param } = useContext(ParamContext);

    return (
        <g>
            {Object.keys(param.stn_list)
                .filter(stnId => !['linestart', 'lineend'].includes(stnId))
                .map(stnId => (
                    <g key={stnId} transform={`translate(${props.xs[stnId]},${props.ys[stnId]})`}>
                        <StationSHMetro
                            stnId={stnId}
                            stnState={props.stnStates[stnId]}
                            nameDirection={props.xShares[stnId] % 2 === 0 ? 'downward' : 'upward'} />
                    </g>
                ))}
        </g>
    );
};
