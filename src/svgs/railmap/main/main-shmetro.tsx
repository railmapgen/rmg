import React from 'react';
import { adjacencyList, getXShareMTR, criticalPathMethod, drawLine, getStnState } from '../methods/share';
import StationSHMetro from './station/station-shmetro';
import ColineSHMetro from './coline/coline-shmetro';
import { AtLeastOneOfPartial, Services, StationDict } from '../../../constants/constants';
import { useRootSelector } from '../../../redux';

interface servicesPath {
    main: string[];
    pass: string[];
    service: Services;
}

type Paths = AtLeastOneOfPartial<Record<Services, servicesPath>>;

const MainSHMetro = () => {
    const { routes, branches, depsStr: deps } = useRootSelector(store => store.helper);
    const param = useRootSelector(store => store.param);
    const { stn_list, branch_spacing, coline, direction } = useRootSelector(store => store.param);

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

    // const yShares = React.useMemo(
    //     () => {
    //         console.log('computing y shares');
    //         return Object.keys(param.stn_list).reduce(
    //             (acc, cur) => ({ ...acc, [cur]: branches[0].includes(cur) ? 0 : 3 }),
    //             {} as { [stnId: string]: number }
    //         );
    //     },
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    //     [deps]
    // );
    const yShares = React.useMemo(
        () => {
            console.log('computing y shares');
            return Object.keys(stn_list).reduce((acc, cur) => {
                if (branches[0].includes(cur)) {
                    return { ...acc, [cur]: 0 };
                } else {
                    const branchOfStn = branches.slice(1).filter(branch => branch.includes(cur))[0];
                    return { ...acc, [cur]: stn_list[branchOfStn[0]].children.indexOf(branchOfStn[1]) ? -3 : 3 };
                }
            }, {} as { [stnId: string]: number });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [deps]
    );

    // filter out all negative yShares to draw the traditional railmap w/o coline and its branches
    const lineYShares = Object.entries(yShares)
        .filter(([k, v]) => v >= 0)
        .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {} as typeof yShares);
    const lineYs = Object.keys(lineYShares).reduce(
        (acc, cur) => ({ ...acc, [cur]: -lineYShares[cur] * branch_spacing }),
        {} as typeof yShares
    );

    const stnStates = React.useMemo(
        () => getStnState(param.current_stn_idx, routes, param.direction),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [param.current_stn_idx, param.direction, routes.toString()]
    );

    const servicesAll = Object.values(Services);
    const servicesPresent = Object.values(param.stn_list)
        .map(stationInfo => stationInfo.services)
        .flat() // all services in all stations
        .reduce(
            (acc, cur) => {
                acc[servicesAll.indexOf(cur)] = true;
                return acc;
            },
            [false, false, false] as [boolean, boolean, boolean]
        ) // set the flag in order
        .map((bool, i) => [servicesAll[i], bool] as [Services, boolean]) // zip
        .filter(s => s[1]) // get the existing service
        .map(s => s[0]); // maintain the services' order

    const linePaths = branches
        .map(branch => drawLine(branch, stnStates))
        .reduce(
            (acc, cur) => {
                acc.main.push(cur.main);
                acc.pass.push(cur.pass);
                return acc;
            },
            { main: [], pass: [] } as { main: string[][]; pass: string[][] }
        );

    const paths = servicesPresent.reduce(
        (acc, service) => ({
            ...acc,
            [service]: (Object.keys(linePaths) as (keyof ReturnType<typeof drawLine>)[]).reduce(
                (acc, cur) => ({
                    ...acc,
                    [cur]: linePaths[cur]
                        .map(stns =>
                            _linePath(
                                stns,
                                cur,
                                xs,
                                lineYs,
                                direction,
                                service,
                                servicesPresent.length,
                                stn_list
                                // info_panel_type === 'sh2020' ? 'rightangle' : 'diagonal'
                            )
                        )
                        .filter(path => path !== ''),
                }),
                {} as servicesPath
            ),
        }),
        {} as Paths
    );

    return (
        <g
            id="main"
            transform={`translate(0,${param.svg_height * (Object.keys(coline).length > 0 ? 0.5 : 0.7 + 0.1)})`}
        >
            <Line paths={paths} direction={param.direction} />
            <StationGroup
                stnIds={Object.keys(lineYShares)
                    .filter(stnId => !['linestart', 'lineend'].includes(stnId))
                    .filter(stnId => stn_list[stnId].services.length !== 0)}
                xs={xs}
                ys={lineYs}
                stnStates={stnStates}
            />
            {Object.keys(coline).length > 0 && (
                <ColineSHMetro xs={xs} servicesPresent={servicesPresent} stnStates={stnStates} />
            )}
            {servicesPresent.length > 1 && <ServicesElements servicesLevel={servicesPresent} lineXs={lineXs} />}
        </g>
    );
};

export default MainSHMetro;

const Line = (props: { paths: Paths; direction: 'l' | 'r' }) => {
    const { theme } = useRootSelector(store => store.param);
    const { paths, direction } = props;

    return (
        <>
            {(Object.keys(paths) as Services[]).map((service, i) => (
                <g
                    key={`servicePath${i}`}
                    transform={`translate(0,${i * 25})`}
                    // the following line is a special case for pujiang line
                    // where its pass line color should be white with outline
                    // surrounding it, see #161 for details.
                    filter={theme[2] === '#999999' ? 'url(#pujiang_outline_railmap)' : undefined}
                >
                    <g>
                        {paths[service]?.pass.map((path, j) => (
                            <path
                                key={j}
                                stroke="var(--rmg-grey)"
                                strokeWidth={12}
                                fill="none"
                                d={path}
                                markerStart={props.direction === 'l' ? 'url(#arrow_gray)' : undefined}
                                markerEnd={props.direction === 'r' ? 'url(#arrow_gray)' : undefined}
                                strokeLinejoin="round"
                            />
                        ))}
                    </g>
                    <g>
                        {paths[service]?.main.map((path, j) => (
                            <path
                                key={j}
                                stroke="var(--rmg-theme-colour)"
                                strokeWidth={12}
                                fill="none"
                                d={path}
                                markerStart={direction === 'l' ? 'url(#arrow_theme_left)' : undefined}
                                markerEnd={direction === 'r' ? 'url(#arrow_theme_right)' : undefined}
                                strokeLinejoin="round"
                                filter={service === Services.local ? undefined : `url(#contrast-${service})`}
                            />
                        ))}
                    </g>
                </g>
            ))}
        </>
    );
};

export const _linePath = (
    stnIds: string[],
    type: 'main' | 'pass',
    xs: { [stnId: string]: number },
    ys: { [stnId: string]: number },
    direction: 'l' | 'r',
    services: Services,
    servicesMax: number,
    stn_list: StationDict, // only used to determine startFromTerminal or endAtTerminal
    bend: 'rightangle' | 'diagonal' = 'rightangle'
) => {
    var [prevY, prevX] = [] as number[];
    var path: { [key: string]: number[] } = {};

    const servicesDelta = {
        local: 0,
        express: 20,
        direct: 40,
    }[services]; // TODO: enum Services could be a better idea?
    const servicesPassDelta = servicesMax > 1 ? 50 : 0;

    // extra short line on either end
    let e1 = 30;
    // check if path starts from or ends at the terminal
    // and change e1 to 0 if it matches
    if (stnIds.length > 0) {
        let startFromTerminal = false,
            endAtTerminal = false;
        if (stn_list[stnIds.at(-1) || 0].children.some(stnId => ['linestart', 'lineend'].includes(stnId))) {
            endAtTerminal = true;
        } else if (stn_list[stnIds.at(0) || 0].parents.some(stnId => ['linestart', 'lineend'].includes(stnId))) {
            startFromTerminal = true;
        }
        e1 = startFromTerminal || endAtTerminal ? e1 : 0;
    }

    // diagonal use e2 to make soft line
    const e2 = 30;

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
        // little line (only beyond terminal station)
        // keys in path: start
        let [x, y] = path['start'];
        if (type === 'main') {
            // current at terminal(end) station, draw the litte main line
            if (direction === 'l') {
                return `M ${x - e1 - servicesDelta},${y} H ${x}`;
            } else {
                return `M ${x},${y} H ${x + e1 + servicesDelta}`;
            }
        } else {
            // type === 'pass'
            // current at terminal(start) station, draw the litte pass line
            if (direction === 'l') {
                return `M ${x},${y} L ${x + e1 + servicesPassDelta},${y}`;
            } else {
                return `M ${x - e1 - servicesPassDelta},${y} L ${x},${y}`;
            }
        }
    } else if (!path.hasOwnProperty('bifurcate')) {
        // general main line
        // keys in path: start, end
        let [x, y] = path['start'],
            h = path['end'][0];
        if (type === 'main') {
            if (direction === 'l') {
                return `M ${x - e1 - servicesDelta},${y} H ${h}`;
            } else {
                return `M ${x},${y} H ${h + e1 + servicesDelta}`;
            }
        } else {
            // type === 'pass'
            if (direction === 'l') {
                return `M ${x - e1},${y} H ${h + e1 + servicesPassDelta}`;
            } else {
                return `M ${x - e1 - servicesPassDelta},${y} H ${h + e1}`;
            }
        }
    } else {
        // main line bifurcate here to become the branch line
        // and path return here are only branch line
        // keys in path: start, bifurcate, end
        // TODO: make diagonal available to `sh`

        let [x, y] = path['start'];
        let xb = path['bifurcate'][0];
        let [xm, ym] = path['end'];
        if (type === 'main') {
            if (direction === 'l') {
                if (ym > y) {
                    console.log(path);
                    // main line, left direction, center to upper
                    if (bend === 'rightangle') return `M ${x - e1},${y} H ${xm} V ${ym}`;
                    // center to upper/rightangle, lower to center/diagonal
                    else return `M ${x},${y} H ${x + e2} L ${xb - e2},${ym} H ${xm}`;
                } else {
                    // wrong marker
                    // main line, left direction, upper to center
                    if (bend === 'rightangle') return `M ${x},${y} V ${ym} H ${xm}`;
                    // upper to center/rightangle, center to lower/diagonal
                    else return `M ${x - e1},${y} H ${xb + e2} L ${xm - e2},${ym} H ${xm}`;
                }
            } else {
                if (ym > y) {
                    // wrong marker
                    // main line, right direction, upper to center
                    if (bend === 'rightangle') return `M ${x},${y} H ${xm} V ${ym}`;
                    // upper to center/rightangle, center to lower/diagonal
                    else return `M ${x},${y} H ${x + e2} L ${xb - e2},${ym} H ${xm + e1}`;
                } else {
                    // main line, right direction, center to upper
                    if (bend === 'rightangle') return `M ${x},${y} V ${ym} H ${xm + e1}`;
                    // center to upper/rightangle, lower to center/diagonal
                    else return `M ${x},${y} H ${xb + e2} L ${xm - e2},${ym} H ${xm}`;
                }
            }
        } else {
            // type === 'pass'
            if (direction === 'l') {
                if (ym > y) {
                    // pass line, left direction, center to upper
                    if (bend === 'rightangle') return `M ${x - e1},${y} H ${xm} V ${ym}`;
                    // center to upper/rightangle, lower to center/diagonal
                    else return `M ${x},${y} H ${x + e2} L ${xb - e2},${ym} H ${xm + e1}`;
                } else {
                    // pass line, left direction, upper to center
                    if (bend === 'rightangle') return `M ${x},${y} V ${ym} H ${xm + e1}`;
                    // upper to center/rightangle, center to lower/diagonal
                    else return `M ${x - e1},${y} H ${xb + e2} L ${xm - e2},${ym} H ${xm}`;
                }
            } else {
                if (ym > y) {
                    // pass line, right direction, upper to center
                    if (bend === 'rightangle') return `M ${x - e1},${y} H ${xm} V ${ym}`;
                    // upper to center/rightangle, center to lower/diagonal
                    return `M ${x},${y} H ${x + e2} L ${xb - e2},${ym} H ${xm + e1}`;
                } else {
                    // pass line, right direction, center to upper
                    if (bend === 'rightangle') return `M ${x},${y} V ${ym} H ${xm + e1}`;
                    // center to upper/rightangle, lower to center/diagonal
                    return `M ${x - e1},${y} H ${xb + e2} L ${xm - e2},${ym} H ${xm}`;
                }
            }
        }
    }
};

export interface StationGroupProps {
    stnIds: string[];
    xs: { [stnId: string]: number };
    ys: { [stnId: string]: number };
    stnStates: { [stnId: string]: -1 | 0 | 1 };
}

const StationGroup = (props: StationGroupProps) => {
    const { xs, ys, stnStates, stnIds } = props;

    return (
        <g>
            {stnIds.map(stnId => (
                <g key={stnId} transform={`translate(${xs[stnId]},${ys[stnId]})`}>
                    <StationSHMetro stnId={stnId} stnState={stnStates[stnId]} />
                </g>
            ))}
        </g>
    );
};

const ServicesElements = (props: { servicesLevel: Services[]; lineXs: number[] }) => {
    const { svg_height, direction, svgWidth } = useRootSelector(store => store.param);
    const dy = -svg_height + 130;

    const servicesLevel = props.servicesLevel.map(
        service =>
            ({
                local: '普通车',
                express: '大站车',
                direct: '直达车',
            }[service])
    );

    // let dx = props.direction === 'r' ? 5 : param.svgWidth.railmap - 55;
    const labelX = direction === 'r' ? props.lineXs[0] - 42 : props.lineXs[1] + 42;

    let dx_hint = props.servicesLevel.length === 2 ? 350 : 500;

    return React.useMemo(
        () => (
            <g>
                {servicesLevel.map((service, i) => (
                    <g key={service} transform={`translate(${labelX},${i * 25})`}>
                        <rect x={-27.5} height={10} width={55} fill={'white'} stroke={'black'} y={-5}></rect>
                        <text
                            className="rmg-name__zh"
                            fontSize={9}
                            y={3}
                            textAnchor="middle"
                        >{`${service}运行线`}</text>
                    </g>
                ))}
                <g transform={`translate(${direction === 'r' ? 30 : svgWidth.railmap - dx_hint},${dy})`}>
                    <text className="rmg-name__zh">图例：</text>
                    {servicesLevel.map((serviceLevel, i) => (
                        <g key={`serviceLevel${i}`} transform={`translate(${i * 150 + 50},0)`}>
                            <line
                                x1="0"
                                x2="35"
                                y1="-5"
                                y2="-5"
                                stroke="var(--rmg-theme-colour)"
                                strokeWidth="12"
                                filter={i === 2 ? 'url(#contrast-direct)' : i === 1 ? 'url(#contrast-express)' : ''}
                            />
                            <use x="17.5" y="-5" xlinkHref="#stn_sh" fill="var(--rmg-theme-colour)" />
                            <text x="40" className="rmg-name__zh">{`${serviceLevel}停靠站`}</text>
                        </g>
                    ))}
                </g>
            </g>
        ),
        [svg_height, direction, svgWidth, props.servicesLevel, props.lineXs]
    );
};

export const DirectionElements = () => {
    const { direction, svgWidth, coline } = useRootSelector(store => store.param);
    // arrow will be black stroke with white fill in coline
    const isColine = Object.keys(coline).length ? true : false;

    return React.useMemo(
        () => (
            <g transform={`translate(${direction === 'l' ? 50 : svgWidth.railmap - 150},50)`}>
                <text className="rmg-name__zh">列车前进方向</text>
                <path
                    d="M60,60L0,0L60-60H100L55-15H160V15H55L100,60z"
                    stroke={!isColine ? undefined : 'var(--rmg-black)'}
                    strokeWidth={!isColine ? undefined : 5}
                    fill={!isColine ? 'var(--rmg-theme-colour)' : 'var(--rmg-white)'}
                    transform={`translate(${direction === 'l' ? -30 : 125},-5)rotate(${
                        direction === 'l' ? 0 : 180
                    })scale(0.15)`}
                />
            </g>
        ),
        [direction, coline, svgWidth.railmap]
    );
};
