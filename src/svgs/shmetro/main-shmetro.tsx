import { adjacencyList, criticalPathMethod, drawLine, getStnState, getXShareMTR } from '../methods/share';
import StationSHMetro from './station-shmetro';
import ColineSHMetro from './coline-shmetro';
import { AtLeastOneOfPartial, PanelTypeShmetro, Services, StationDict, StationInfo } from '../../constants/constants';
import { useRootSelector } from '../../redux';
import { useMemo } from 'react';

interface servicesPath {
    main: string[];
    pass: string[];
    service: Services;
}

type Paths = AtLeastOneOfPartial<Record<Services, servicesPath>>;

/** LeftW callback for SHMetro 2020: adds weight at merge points (multiple parents). */
const createSh2020LeftW =
    (k1: number) =>
    (stnList: { [stnId: string]: StationInfo }, stnId: string): number => {
        const stn = stnList[stnId];
        if (!stn) return 0;
        return stn.parents.length > 1 ? k1 - 1 : 0;
    };

/** RightW callback for SHMetro 2020: adds weight at bifurcation points (multiple children). */
const createSh2020RightW =
    (k1: number) =>
    (stnList: { [stnId: string]: StationInfo }, stnId: string): number => {
        const stn = stnList[stnId];
        if (!stn) return 0;
        return stn.children.length > 1 ? k1 - 1 : 0;
    };

const MainSHMetro = () => {
    const { routes, branches, depsStr: deps } = useRootSelector(store => store.helper);
    const param = useRootSelector(store => store.param);
    const { svg_height, stn_list, branch_info, coline, direction, info_panel_type } = useRootSelector(
        store => store.param
    );
    const { spacing_pct: branchSpacingPct } = branch_info;

    // Only apply SHMetro 2020-specific layout when the panel type matches.
    const sh2020 = info_panel_type === PanelTypeShmetro.sh2020 ? branch_info : undefined;
    const k1 = sh2020?.distance_factor ?? 1;
    const k2 = sh2020?.first_station_offset ?? 0;
    // Bend type: allow '45degree' only for sh2024 panel; otherwise fall back to 'rightangle'
    const rawBend = branch_info?.bend_type;
    const bendType = rawBend === '45degree' && info_panel_type !== 'sh2024' ? 'rightangle' : (rawBend ?? 'rightangle');
    const alignBranchEndpoints = sh2020?.align_endpoints ?? false;

    const adjMat = useMemo(() => {
        return adjacencyList(
            param.stn_list,
            sh2020 ? createSh2020LeftW(k1) : () => 0,
            sh2020 ? createSh2020RightW(k1) : () => 0
        );
    }, [JSON.stringify(param.stn_list), info_panel_type, k1]);

    const criticalPath = criticalPathMethod('linestart', 'lineend', adjMat);
    const realCP = criticalPathMethod(criticalPath.nodes[1], criticalPath.nodes.slice(-2)[0], adjMat);

    const xShares = useMemo(() => {
        console.log('computing x shares');
        return Object.keys(param.stn_list).reduce(
            (acc, cur) => ({ ...acc, [cur]: getXShareMTR(cur, adjMat, branches) }),
            {} as { [stnId: string]: number }
        );
    }, [branches.toString(), JSON.stringify(adjMat)]);
    const lineXs: [number, number] = [
        (param.svgWidth.railmap * param.padding) / 100,
        param.svgWidth.railmap * (1 - param.padding / 100),
    ];
    const stationSpacing = (lineXs[1] - lineXs[0]) / realCP.len;
    const branchOffset = k2 * stationSpacing;

    // Derive pixel x-positions from xShares, then optionally redistribute shorter
    // parallel branch segments so their endpoints align with the longer segment.
    const xs = useMemo(() => {
        const result = Object.keys(xShares).reduce(
            (acc, cur) => ({ ...acc, [cur]: lineXs[0] + (xShares[cur] / realCP.len) * (lineXs[1] - lineXs[0]) }),
            {} as typeof xShares
        );

        // Align parallel branch endpoints: the segment with more exclusive stations
        // defines the x-range; the shorter segment is redistributed to match.
        if (alignBranchEndpoints) {
            const mainLine = branches[0];

            branches.slice(1).forEach(branch => {
                const junctions = branch.filter(stnId => mainLine.includes(stnId));
                if (junctions.length < 2) return;
                const [jStart, jEnd] = [junctions[0], junctions[junctions.length - 1]];

                const mainExcl = mainLine.slice(mainLine.indexOf(jStart) + 1, mainLine.indexOf(jEnd));
                const branchExcl = branch.slice(branch.indexOf(jStart) + 1, branch.indexOf(jEnd));
                if (mainExcl.length < 1 || branchExcl.length < 1) return;

                const longer = mainExcl.length >= branchExcl.length ? mainExcl : branchExcl;
                const shorter = mainExcl.length >= branchExcl.length ? branchExcl : mainExcl;
                const firstX = result[longer[0]];
                const lastX = result[longer[longer.length - 1]];

                if (shorter.length === 1) {
                    result[shorter[0]] = (firstX + lastX) / 2;
                } else {
                    shorter.forEach((stnId, i) => {
                        result[stnId] = firstX + (i / (shorter.length - 1)) * (lastX - firstX);
                    });
                }
            });
        }

        return result;
    }, [xShares, lineXs[0], lineXs[1], realCP.len, alignBranchEndpoints, branches.toString()]);

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
    const yShares = useMemo(() => {
        console.log('computing y shares');
        return Object.keys(stn_list).reduce(
            (acc, cur) => {
                if (branches[0].includes(cur)) {
                    return { ...acc, [cur]: 0 };
                } else {
                    const branchOfStn = branches.slice(1).filter(branch => branch.includes(cur))[0];
                    return { ...acc, [cur]: stn_list[branchOfStn[0]].children.indexOf(branchOfStn[1]) ? -3 : 3 };
                }
            },
            {} as { [stnId: string]: number }
        );
    }, [deps]);

    // filter out all negative yShares to draw the traditional railmap w/o coline and its branches
    const lineYShares = Object.entries(yShares)
        .filter(([, v]) => v >= 0)
        .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {} as typeof yShares);
    const lineYs = Object.keys(lineYShares).reduce(
        (acc, cur) => ({ ...acc, [cur]: (-lineYShares[cur] * branchSpacingPct * svg_height) / 300 }),
        {} as typeof yShares
    );

    const stnStates = useMemo(
        () => getStnState(param.current_stn_idx, routes, param.direction),
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
                                stn_list,
                                stnStates,
                                bendType,
                                branchOffset
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
                    filter={theme[2] === '#B5B5B6' ? 'url(#pujiang_outline)' : undefined}
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
    stnStates?: { [stnId: string]: -1 | 0 | 1 }, // when provided, terminal caps on main paths are only drawn for state=1 stations
    bend: 'rightangle' | 'diagonal' | '45degree' = 'rightangle',
    branchOffset: number = 0 // k_2: offset from bifurcation point where vertical turn begins
) => {
    let [prevY, prevX] = [] as number[];
    const path: { [key: string]: number[] } = {};

    const servicesDelta = {
        local: 0,
        express: 20,
        direct: 40,
    }[services]; // TODO: enum Services could be a better idea?
    const servicesPassDelta = servicesMax > 1 ? 50 : 0;

    // check if path starts from or ends at the terminal
    let endAtTerminal = false;
    let startFromTerminal = false;
    if (stnIds.length > 0) {
        if (stn_list[stnIds.at(-1) || 0].children.some(stnId => ['linestart', 'lineend'].includes(stnId))) {
            endAtTerminal = true;
        }
        if (stn_list[stnIds.at(0) || 0].parents.some(stnId => ['linestart', 'lineend'].includes(stnId))) {
            startFromTerminal = true;
        }
    }
    // extra short line on either end (only at terminals)
    const e1 = startFromTerminal || endAtTerminal ? 30 : 0;
    // main-path terminal caps: only drawn when the terminal station is truly colored (state=1)
    const startCap = startFromTerminal && stnStates?.[stnIds.at(0) ?? ''] === 1 ? e1 + servicesDelta : 0;
    const endCap = endAtTerminal && stnStates?.[stnIds.at(-1) ?? ''] === 1 ? e1 + servicesDelta : 0;

    // smooth diagonal offset (used by 'diagonal' bend for coline)
    const e2 = 30;

    stnIds.forEach(stnId => {
        const x = xs[stnId];
        const y = ys[stnId];
        if (!prevY && prevY !== 0) {
            [prevX, prevY] = [x, y];
            path['start'] = [x, y];
            return;
        }
        if (y === 0) {
            // merge back to main line
            if (y !== prevY) {
                path['bifurcate'] = [prevX, prevY, x]; // [branchX, branchY, bifurcateX]
            }
        } else {
            // on the branch line
            if (y !== prevY) {
                path['bifurcate'] = [x, y, prevX]; // [branchX, branchY, bifurcateX]
            }
        }
        path['end'] = [x, y];
        [prevX, prevY] = [x, y];
    });

    // generate path
    if (!('start' in path)) {
        // no line generated
        // keys in path: none
        return '';
    } else if (!('end' in path)) {
        // little line (only beyond terminal station)
        // keys in path: start
        const [x, y] = path['start'];
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
    } else if (!('bifurcate' in path)) {
        // general main line
        // keys in path: start, end
        const [x, y] = path['start'],
            h = path['end'][0];
        if (type === 'main') {
            return `M ${x - startCap},${y} H ${h + endCap}`;
        } else {
            // type === 'pass'
            if (direction === 'l') {
                return `M ${x - e1},${y} H ${h + e1 + servicesPassDelta}`;
            } else {
                return `M ${x - e1 - servicesPassDelta},${y} H ${h + e1}`;
            }
        }
    } else {
        // branch line path, keys: start, bifurcate, end
        const [x, y] = path['start'];
        const xBranch = path['bifurcate'][0];
        const xBifurcate = path['bifurcate'][2];
        const [xm, ym] = path['end'];

        // turnX: vertical turn position, offset from bifurcation point towards branch
        // Offset moves turnX in the opposite direction of train travel (towards branch)
        const branchOnRight = xBranch > xBifurcate;
        const branchDirection = branchOnRight ? 1 : -1;
        const turnX = xBifurcate + branchDirection * branchOffset;

        // For 45° diagonal: dx = |dy|
        // Right branch: diagonal goes right from turnX  → diagX = turnX + dy
        // Left branch:  diagonal arrives at turnX from left → diagX = turnX - dy
        const dy = Math.abs(ym - y);
        const diagX = turnX + branchDirection * dy;
        // TODO: When bend === '45degree', k1 (branch_distance_factor) effectively absorbs one
        // extra station-spacing worth of horizontal room — without it, diagX would overshoot
        // xBranch (the first branch station) for a right-branch, which is nonsensical.
        // Consequently, k1 values smaller than one station spacing are meaningless in this mode.
        // Enforcing a proper lower bound on k1 for 45° bends is non-trivial under the current
        // architecture (k1 feeds into the adjacency-matrix weights before x-positions are known),
        // so this constraint is left as a known limitation for now.

        // For right-branch: diagonal STARTS at turnX → H turnX, L diagX
        // For left-branch:  diagonal ENDS at turnX   → H diagX, L turnX
        const diagH = branchOnRight ? turnX : diagX; // horizontal target (start y-level)
        const diagL = branchOnRight ? diagX : turnX; // diagonal target (end y-level)

        if (type === 'main') {
            if (bend === 'rightangle') {
                return `M ${x - startCap},${y} H ${turnX} V ${ym} H ${xm + endCap}`;
            }
            if (bend === '45degree') {
                return `M ${x - startCap},${y} H ${diagH} L ${diagL},${ym} H ${xm + endCap}`;
            }
            // diagonal — smooth free-form slope (used by coline)
            if (ym > y) {
                return `M ${x - startCap},${y} H ${x + e2} L ${xBranch - e2},${ym} H ${xm + endCap}`;
            } else {
                return `M ${x - startCap},${y} H ${xBranch + e2} L ${xm - e2},${ym} H ${xm + endCap}`;
            }
        } else {
            // type === 'pass' — direction-independent, e1 is always applied
            if (bend === 'rightangle') {
                return ym > y
                    ? `M ${x - e1},${y} H ${turnX} V ${ym} H ${xm}`
                    : `M ${x},${y} H ${turnX} V ${ym} H ${xm + e1}`;
            }
            if (bend === '45degree') {
                // diagH/diagL depend only on branchOnRight, not on ym direction;
                // ym only determines which end carries the e1 terminal cap.
                return ym > y
                    ? `M ${x - e1},${y} H ${diagH} L ${diagL},${ym} H ${xm}`
                    : `M ${x},${y} H ${diagH} L ${diagL},${ym} H ${xm + e1}`;
            }
            // diagonal — smooth free-form slope (used by coline)
            if (ym > y) {
                return `M ${x},${y} H ${x + e2} L ${xBranch - e2},${ym} H ${xm + e1}`;
            } else {
                return `M ${x - e1},${y} H ${xBranch + e2} L ${xm - e2},${ym} H ${xm}`;
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
            })[service]
    );

    // let dx = props.direction === 'r' ? 5 : param.svgWidth.railmap - 55;
    const labelX = direction === 'r' ? props.lineXs[0] - 42 : props.lineXs[1] + 42;

    const dx_hint = props.servicesLevel.length === 2 ? 350 : 500;

    return useMemo(
        () => (
            <g>
                {servicesLevel.map((service, i) => (
                    <g key={service} transform={`translate(${labelX},${i * 25})`}>
                        <rect x={-27.5} height={10} width={55} fill={'white'} stroke={'black'} y={-5} />
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
    const isColine = !!Object.keys(coline).length;

    return useMemo(
        () => (
            <g transform={`translate(${direction === 'l' ? 50 : svgWidth.railmap - 150},50)`}>
                <text className="rmg-name__zh">列车前进方向</text>
                <path
                    d="M60,60L0,0L60-60H100L55-15H160V15H55L100,60z"
                    stroke={isColine ? 'var(--rmg-black)' : 'var(--rmg-theme-colour)'}
                    strokeWidth={7}
                    fill={'none'}
                    transform={`translate(${direction === 'l' ? -30 : 125},-5)rotate(${
                        direction === 'l' ? 0 : 180
                    })scale(0.15)`}
                />
            </g>
        ),
        [direction, coline, svgWidth.railmap]
    );
};
