import React, { useContext } from 'react';
import { ParamContext } from '../../../context';
import { adjacencyList, getXShareMTR, criticalPathMethod, drawLine, getStnState } from '../methods/share';
import StationSHMetro from './station/station-shmetro';

const MainSHMetro = () => {
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
                (acc, cur) => ({ ...acc, [cur]: getXShareMTR(cur, adjMat, branches) }),
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

    const stnStates = React.useMemo(
        () => getStnState(param.current_stn_idx, routes, param.direction),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [param.current_stn_idx, param.direction, routes.toString()]
    );

    const linePaths = drawLine(branches, stnStates);
    const paths = (Object.keys(linePaths) as (keyof ReturnType<typeof drawLine>)[]).reduce(
        (acc, cur) => ({
            ...acc,
            [cur]: linePaths[cur].map(stns => _linePath(stns, cur, xs, ys, param.direction)).filter(path => path !== ''),
        }),
        {} as { [key in keyof ReturnType<typeof drawLine>]: string[] }
    );

    return (
        <g id="main" transform={`translate(0,${param.svg_height - 63})`}>
            <Line paths={paths} direction={param.direction}/>
            <StationGroup xs={xs} ys={ys} stnStates={stnStates} />
        </g>
    );
};

export default MainSHMetro;

const Line = (props: { paths: { main: string[]; pass: string[] }, direction: 'l' | 'r' }) => {
    return (
        <>
            <g>
                {props.paths.pass.map((path, i) => (
                    <path key={i} stroke="gray" strokeWidth={12} fill="none" d={path}
                        markerStart={props.direction === 'l' ? "url(#arrow_gray)" : undefined}
                        markerEnd={props.direction === 'r' ? "url(#arrow_gray)" : undefined}
                    />
                ))}
            </g>
            <g>
                {props.paths.main.map((path, i) => (
                    <path key={i} stroke="var(--rmg-theme-colour)" strokeWidth={12} fill="none" d={path}
                        markerStart={props.direction === 'l' ? "url(#arrow_theme_left)" : undefined}
                        markerEnd={props.direction === 'r' ? "url(#arrow_theme_right)" : undefined}
                    />
                ))}
            </g>
        </>
    );
};

const _linePath = (
    stnIds: string[],
    type: 'main' | 'pass',
    xs: { [stnId: string]: number },
    ys: { [stnId: string]: number },
    direction: 'l' | 'r'
) => {
    var [prevY, prevX] = [] as number[];
    var path: { [key: string]: number[] } = {};
    const e = 30;

    stnIds.forEach(stnId => {
        var x = xs[stnId];
        var y = ys[stnId];
        if (!prevY && prevY !== 0) {
            [prevX, prevY] = [x, y];
            path['start'] = [x, y];
            return;
        }
        if (y === 0) {
            // merge back to main line
            if (y !== prevY) {
                path['bifurcate'] = [prevX, prevY];
            }
        } else {
            // on the branch line
            if (y !== prevY) {
                path['bifurcate'] = [x, y];
            }
        }
        path['end'] = [x, y];
        [prevX, prevY] = [x, y];
    });

    // generate path
    if (!path.hasOwnProperty('start')) {
        // no line generated
        // keys in path: none
        return '';
    } else if (!path.hasOwnProperty('end')) {
        // litte line (only beyond terminal station)
        // keys in path: start
        let [x, y] = path['start'];
        if (type === 'main') {
            // current at terminal(end) station, draw the litte main line
            if (direction === 'l') {
                return `M ${x - e},${y} L ${x},${y}`;
            } else {
                return `M ${x},${y} L ${x + e},${y}`;
            }
        } else {
            // type === 'pass'
            // current at terminal(start) station, draw the litte pass line
            if (direction === 'l') {
                return `M ${x},${y} L ${x + e},${y}`;
            } else {
                return `M ${x - e},${y} L ${x},${y}`;
            }
        }
    } else if (!path.hasOwnProperty('bifurcate')) {
        // general main line
        // keys in path: start, end
        let [x, y] = path['start'],
            h = path['end'][0];
        if (type === 'main') {
            if (direction === 'l') {
                return `M ${x - e},${y} H ${h}`;
            } else {
                return `M ${x},${y} H ${h + e}`;
            }
        } else {
            // type === 'pass'
            if (direction === 'l') {
                return `M ${x},${y} H ${h + e}`;
            } else {
                return `M ${x - e},${y} H ${h}`;
            }
        }
    } else {
        // main line bifurcate here to become the branch line
        // and path return here are only branch line
        // keys in path: start, bifurcate, end

        // Todo: disable lower branch
        let [x, y] = path['start'];
        // let h = path['end'][0];
        // let [xb, yb] = path['bifurcate']
        let [xm, ym] = path['end'];
        if (type === 'main') {
            if (direction === 'l') {
                if (ym > y) {
                    // main line, left direction, center to upper
                    return `M ${x - e},${y} H ${xm} V ${ym}`;
                } else {
                    // main line, left direction, upper to center
                    return `M ${x},${y} V ${ym} H ${xm}`;  // wrong marker
                    // return `M ${xm},${ym - 6} H ${x - 6} V ${y - 6} h 12 V ${ym + 6} H ${xm} Z`;
                }
            } else {
                if (ym > y) {
                    // main line, right direction, upper to center
                    return `M ${x},${y} H ${xm} V ${ym}`;  // wrong marker
                    // return `M ${x},${y - 6} H ${xm + 6} V ${ym - 6} h -12 V ${y + 6} H ${x} Z`;
                } else {
                    // main line, right direction, center to upper
                    return `M ${x},${y} V ${ym} H ${xm + e}`;
                }
            }
        } else {
            // type === 'pass'
            if (direction === 'l') {
                if (ym > y) {
                    // pass line, left direction, center to upper
                    return `M ${x - e},${y} H ${xm} V ${ym}`;
                } else {
                    // pass line, left direction, upper to center
                    return `M ${x},${y} V ${ym} H ${xm + e}`;
                }
            } else {
                if (ym > y) {
                    // pass line, right direction, upper to center
                    return `M ${x - e},${y} H ${xm} V ${ym}`;
                } else {
                    // pass line, right direction, center to upper
                    return `M ${x},${y} V ${ym} H ${xm + e}`;
                }
            }
        }
    }
};

interface StationGroupProps {
    xs: { [stnId: string]: number };
    ys: { [stnId: string]: number };
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
                        <StationSHMetro stnId={stnId} stnState={props.stnStates[stnId]} />
                    </g>
                ))}
        </g>
    );
};
