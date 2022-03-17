import React from 'react';
import { adjacencyList, getXShareMTR, criticalPathMethod, drawLine, getStnState } from '../methods/share';
import StationSHMetro from './station/station-shmetro';
import { Services } from '../../../constants/constants';
import { useAppSelector } from '../../../redux';

interface servicesPath {
    main: string[];
    pass: string[];
    service: Services;
}

const MainSHMetro = () => {
    const { routes, branches, depsStr: deps } = useAppSelector(store => store.helper);
    const param = useAppSelector(store => store.param);

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

    const linePaths = drawLine(branches, stnStates);

    // paths = {'local':{'main':..., 'pass':...}, 'express':...}
    // const paths = servicesLevel.reduce((allServicesPath, services) => ({
    //         ...allServicesPath,
    //         [services]: (Object.keys(linePaths) as (keyof ReturnType<typeof drawLine>)[]).reduce(
    //             (acc, cur) => ({
    //                 ...acc,
    //                 [cur]: linePaths[cur].map(stns => _linePath(stns, cur, xs, ys, param.direction, services)).filter(path => path !== ''),
    //             }),
    //             {} as { [key in keyof ReturnType<typeof drawLine>]: string[] })
    //     }), {} as {[services in Services]: { main: string[]; pass: string[] }}
    // );

    // paths = [{'main':..., 'pass':..., 'service':'local'}, ...}]
    const paths = servicesPresent.map(services =>
        (Object.keys(linePaths) as (keyof ReturnType<typeof drawLine>)[]).reduce(
            (acc, cur) => ({
                ...acc,
                [cur]: linePaths[cur]
                    .map(stns => _linePath(stns, cur, xs, ys, param.direction, services, servicesPresent.length))
                    .filter(path => path !== ''),
                service: services,
            }),
            {} as servicesPath
        )
    );

    return (
        <g id="main" transform={`translate(0,${param.svg_height - 63})`}>
            <Line paths={paths} direction={param.direction} />
            <StationGroup xs={xs} ys={ys} stnStates={stnStates} />
            <ServicesElements
                servicesLevel={servicesPresent}
                dy={-param.svg_height + 100}
                direction={param.direction}
                lineXs={lineXs}
            />
            <DirectionElements />
        </g>
    );
};

export default MainSHMetro;

const Line = (props: { paths: servicesPath[]; direction: 'l' | 'r' }) => {
    const { theme } = useAppSelector(store => store.param);

    return (
        <>
            {props.paths.map((servicePath, i) => (
                <g
                    key={`servicePath${i}`}
                    transform={`translate(0,${i * 25})`}
                    // the following line is a special case for pujiang line
                    // where its pass line color should be white with outline
                    // surrounding it, see #161 for details.
                    filter={theme[2] === '#999999' ? 'url(#pujiang_outline_railmap)' : undefined}
                >
                    <g>
                        {servicePath.pass.map((path, j) => (
                            <path
                                key={j}
                                stroke="gray"
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
                        {servicePath.main.map((path, j) => (
                            <path
                                key={j}
                                stroke="var(--rmg-theme-colour)"
                                strokeWidth={12}
                                fill="none"
                                d={path}
                                markerStart={props.direction === 'l' ? 'url(#arrow_theme_left)' : undefined}
                                markerEnd={props.direction === 'r' ? 'url(#arrow_theme_right)' : undefined}
                                strokeLinejoin="round"
                                filter={i === 2 ? 'url(#contrast-direct)' : i === 1 ? 'url(#contrast-express)' : undefined}
                            />
                        ))}
                    </g>
                </g>
            ))}
        </>
    );
};

const _linePath = (
    stnIds: string[],
    type: 'main' | 'pass',
    xs: { [stnId: string]: number },
    ys: { [stnId: string]: number },
    direction: 'l' | 'r',
    services: Services,
    servicesMax: number,
    e: number = 30 // extra short line on either end, will be 0 in `indoor`
) => {
    var [prevY, prevX] = [] as number[];
    var path: { [key: string]: number[] } = {};

    const servicesDelta = {
        local: 0,
        express: 20,
        direct: 40,
    }[services]; // Todo: enum Services could be a better idea?
    const servicesPassDelta = servicesMax > 1 ? 50 : 0;

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
                return `M ${x - e - servicesDelta},${y} H ${x}`;
            } else {
                return `M ${x},${y} H ${x + e + servicesDelta}`;
            }
        } else {
            // type === 'pass'
            // current at terminal(start) station, draw the litte pass line
            if (direction === 'l') {
                return `M ${x},${y} L ${x + e + servicesPassDelta},${y}`;
            } else {
                return `M ${x - e - servicesPassDelta},${y} L ${x},${y}`;
            }
        }
    } else if (!path.hasOwnProperty('bifurcate')) {
        // general main line
        // keys in path: start, end
        let [x, y] = path['start'],
            h = path['end'][0];
        if (type === 'main') {
            if (direction === 'l') {
                return `M ${x - e - servicesDelta},${y} H ${h}`;
            } else {
                return `M ${x},${y} H ${h + e + servicesDelta}`;
            }
        } else {
            // type === 'pass'
            if (direction === 'l') {
                return `M ${x - e},${y} H ${h + e + servicesPassDelta}`;
            } else {
                return `M ${x - e - servicesPassDelta},${y} H ${h + e}`;
            }
        }
    } else {
        // main line bifurcate here to become the branch line
        // and path return here are only branch line
        // keys in path: start, bifurcate, end

        // Todo: disable lower branch
        let [x, y] = path['start'];
        // let xb = path['bifurcate'][0];
        let [xm, ym] = path['end'];
        if (type === 'main') {
            if (direction === 'l') {
                if (ym > y) {
                    // main line, left direction, center to upper
                    return `M ${x - e},${y} H ${xm} V ${ym}`;
                } else {
                    // main line, left direction, upper to center
                    return `M ${x},${y} V ${ym} H ${xm}`; // wrong marker
                }
            } else {
                if (ym > y) {
                    // main line, right direction, upper to center
                    return `M ${x},${y} H ${xm} V ${ym}`; // wrong marker
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
    const param = useAppSelector(store => store.param);

    return (
        <g>
            {Object.keys(param.stn_list)
                .filter(stnId => !['linestart', 'lineend'].includes(stnId))
                .filter(stnId => param.stn_list[stnId].services.length !== 0)
                .map(stnId => (
                    <>
                        <g key={stnId} transform={`translate(${props.xs[stnId]},${props.ys[stnId]})`}>
                            {param.showStationNumberRailmap?<g>
                                <circle cx="0" cy="0" r="20" stroke={props.stnStates[stnId] === -1 ? 'gray' : 'var(--rmg-theme-colour)'} strokeWidth="5" fill="white">
                                </circle>
                                <line x1="-18" y1="0" x2="18" y2="0" stroke="rgb(0,0,0)" strokeWidth="2" />
                                <g textAnchor="middle">
                                    <text className="rmg-station-name" fontSize={15}
                                        dy={-3}>
                                        L10
                                    </text>
                                    <text className="rmg-station-name" fontSize={15}
                                        dy={15}>
                                        11
                                    </text>
                                </g>
                            </g>:<></>}
                            <StationSHMetro stnId={stnId} stnState={props.stnStates[stnId]} />
                        </g>
                    </>
                ))}
        </g>
    );
};

const ServicesElements = (props: { servicesLevel: Services[]; direction: 'l' | 'r'; dy: number; lineXs: number[] }) => {
    const param = useAppSelector(store => store.param);

    if (props.servicesLevel.length === 1) return <></>;

    const servicesLevel = props.servicesLevel.map(
        service =>
        ({
            local: '普通车',
            express: '大站车',
            direct: '直达车',
        }[service])
    );

    // let dx = props.direction === 'r' ? 5 : param.svgWidth.railmap - 55;
    const labelX = props.direction === 'r' ? props.lineXs[0] - 42 : props.lineXs[1] + 42;

    let dx_hint = props.servicesLevel.length === 2 ? 350 : 500;

    return (
        <g>
            {servicesLevel.map((service, i) => (
                <g key={service} transform={`translate(${labelX},${i * 25})`}>
                    <rect x={-27.5} height={10} width={55} fill={'white'} stroke={'black'} y={-5}></rect>
                    <text className="rmg-name__zh" fontSize={9} y={3} textAnchor="middle">{`${service}运行线`}</text>
                </g>
            ))}
            <g transform={`translate(${props.direction === 'r' ? 30 : param.svgWidth.railmap - dx_hint},${props.dy})`}>
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
    );
};

const DirectionElements = () => {
    const param = useAppSelector(store => store.param);

    return React.useMemo(
        () => (
            <g
                transform={`translate(${param.direction === 'l' ? 50 : param.svgWidth.railmap - 150},${-param.svg_height + 100
                    })`}
            >
                <text className="rmg-name__zh">列车前进方向</text>
                <path
                    d="M60,60L0,0L60-60H100L55-15H160V15H55L100,60z"
                    fill="var(--rmg-theme-colour)"
                    transform={`translate(${param.direction === 'l' ? -30 : 125},-5)rotate(${param.direction === 'l' ? 0 : 180
                        })scale(0.15)`}
                />
            </g>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [param.direction, param.svgWidth.railmap, param.svg_height]
    );
};
