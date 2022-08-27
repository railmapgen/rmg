import React, { useMemo } from 'react';
import { adjacencyList, criticalPathMethod, getStnState, getXShareMTR } from '../railmap/methods/share';
import StationSHMetro from './station-shmetro';
import { StationsSHMetro } from '../railmap/methods/mtr';
import { CanvasType, RmgStyle, Services, StationDict } from '../../constants/constants';
import { useRootSelector } from '../../redux';
import LoopSHMetro from '../railmap/main/loop/loop-shmetro';
import SvgWrapper from '../svg-wrapper';

const CANVAS_TYPE = CanvasType.Indoor;
const STYLE = RmgStyle.SHMetro;

export default function IndoorWrapperSHMetro() {
    const { canvasScale } = useRootSelector(state => state.app);
    const { svgWidth: svgWidths, svg_height: svgHeight, theme, loop } = useRootSelector(store => store.param);

    const svgWidth = svgWidths[CANVAS_TYPE];

    return (
        <SvgWrapper
            type={CANVAS_TYPE}
            style={STYLE}
            svgWidth={svgWidth}
            svgHeight={svgHeight}
            canvasScale={canvasScale}
            theme={theme}
        >
            <DefsSHMetro />
            {loop ? <LoopSHMetro bank_angle={false} canvas={CanvasType.Indoor} /> : <IndoorSHMetro />}
            <InfoElements />
        </SvgWrapper>
    );
}

export const DefsSHMetro = React.memo(() => (
    <defs>
        <circle id="stn_indoor_sh" fill="var(--rmg-white)" strokeWidth={5} r={8} transform="scale(1.5)" />
        <path
            id="int2_indoor_sh"
            fill="var(--rmg-white)"
            transform="translate(0, -10)scale(2)"
            strokeWidth={4}
            d="M -5,0 a 5,5 0 1 1 10,0 V10 a 5,5 0 1 1 -10,0Z"
        />
        <path
            id="express_indoor_sh"
            fill="var(--rmg-white)"
            transform="translate(0, -10)scale(2)"
            strokeWidth={4}
            d="M -5,0 a 5,5 0 1 1 10,0 V25 a 5,5 0 1 1 -10,0Z"
        />
        <path
            id="direct_indoor_sh"
            fill="var(--rmg-white)"
            transform="translate(0, -10)scale(2)"
            strokeWidth={4}
            d="M -5,0 a 5,5 0 1 1 10,0 V40 a 5,5 0 1 1 -10,0Z"
        />
    </defs>
));

const leftWideFactor = (stnList: StationDict, stnId: string) => {
    let res = 0;
    if (stnList[stnId].parents.length === 2) res += 1;
    if (stnList[stnList[stnId].parents[0]].children.length === 2) res += 1;
    return res;
};

const rightWideFactor = (stnList: StationDict, stnId: string) => {
    let res = 0;
    if (stnList[stnId].children.length === 2) res += 1;
    if (stnList[stnList[stnId].children[0]].parents.length === 2) res += 1;
    return res;
};

const IndoorSHMetro = () => {
    const { routes, branches, depsStr: deps } = useRootSelector(store => store.helper);
    const param = useRootSelector(store => store.param);

    const adjMat = adjacencyList(param.stn_list, leftWideFactor, rightWideFactor);

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
        (param.svgWidth.indoor * param.padding) / 100,
        param.svgWidth.indoor * (1 - param.padding / 100),
    ];
    const xs = Object.keys(xShares).reduce(
        (acc, cur) => ({ ...acc, [cur]: lineXs[0] + (xShares[cur] / realCP.len) * (lineXs[1] - lineXs[0]) }),
        {} as typeof xShares
    );

    const yShares = useMemo(
        () => StationsSHMetro.getYShares(param.stn_list, branches),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [deps]
    );
    const ys = Object.keys(yShares).reduce(
        (acc, cur) => ({ ...acc, [cur]: (yShares[cur] * param.branchSpacingPct * param.svg_height) / 200 }),
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

    const linePaths = StationsSHMetro.drawLine(
        branches,
        stnStates,
        param.stn_list,
        lineXs,
        xs,
        ys,
        (param.branchSpacingPct * param.svg_height) / 200,
        criticalPath,
        0
    );

    return (
        <g id="main" transform={`translate(0,${param.svg_height / 2})`}>
            <Lines paths={linePaths} services={servicesPresent} />
            <StationGroup xs={xs} ys={ys} services={servicesPresent} />
        </g>
    );
};

const Lines = (props: { paths: { main: string[]; pass: string[] }; services: Services[] }) => {
    return (
        <g fill="none" strokeWidth={12} stroke="var(--rmg-theme-colour)">
            {props.services.map((service, i) => (
                <g key={`indoor_line_${i}`} transform={`translate(0, ${i * 30})`}>
                    {props.paths.main.map((path, i) => (
                        <path key={i} d={path} />
                    ))}
                    {props.paths.pass.map((path, i) => (
                        <path key={i} d={path} />
                    ))}
                </g>
            ))}
        </g>
    );
};

interface StationGroupProps {
    xs: { [stnId: string]: number };
    ys: { [stnId: string]: number };
    services: Services[]; // determine if all station text should be upward
}

const StationGroup = (props: StationGroupProps) => {
    const { branches } = useRootSelector(store => store.helper);
    const param = useRootSelector(store => store.param);
    const { xs, ys, services } = props;

    return (
        <g>
            {Object.keys(param.stn_list)
                .filter(stnId => !['linestart', 'lineend'].includes(stnId))
                .filter(stnId => param.stn_list[stnId].services.length !== 0)
                .map(stnId => (
                    <g key={stnId} transform={`translate(${xs[stnId]},${ys[stnId]})`}>
                        <StationSHMetro
                            stnId={stnId}
                            nameDirection={
                                branches
                                    .filter(branch => branch.includes(stnId))
                                    .map(branch =>
                                        branch.indexOf(stnId) % 2 === 0 || services.length > 1 ? 'downward' : 'upward'
                                    )[0] as 'upward' | 'downward'
                            }
                            services={services}
                        />
                    </g>
                ))}
        </g>
    );
};

const InfoElements = () => {
    const param = useRootSelector(store => store.param);

    return React.useMemo(
        () => (
            <>
                <g transform={`translate(${param.svgWidth.indoor / 2},50)`}>
                    <text textAnchor="middle" fontSize="30" className="rmg-name__zh">
                        轨道交通{param.line_name[0]}运营线路示意图
                    </text>
                </g>
                <g transform={`translate(${param.svgWidth.indoor / 2},${param.svg_height - 270})`}>
                    <text textAnchor="middle" fontSize="18" className="rmg-name__zh" dx="-30" dy="230">
                        友情提示：请留意您需要换乘线路的首末班时间，以免耽误您的出行，末班车进站前三分钟停售该末班车车票。
                    </text>
                    <text textAnchor="middle" fontSize="12" className="rmg-name__en" dx="10" dy="250">
                        Please pay attention to the interchange schedule if you want to transfer to other lines. Stop
                        selling tickets 3 minutes before the last train services.
                    </text>
                    <g transform="translate(-600,215)">
                        <rect x="-5" y="-25" width="100" height="70" fill="none" stroke="black" rx="5"></rect>
                        <line x1="28" x2="28" y1="-20" y2="40" stroke="black"></line>
                        <text className="rmg-name__zh" dx="3" fontSize="18">
                            图
                        </text>
                        <text className="rmg-name__zh" dx="3" dy="18" fontSize="18">
                            例
                        </text>
                        <text className="rmg-name__en" dy="35" fontSize="8">
                            legend
                        </text>
                        <use
                            transform="translate(45,10)"
                            xlinkHref="#int2_indoor_sh"
                            stroke="var(--rmg-theme-colour)"
                        />
                        <text className="rmg-name__zh" dx="60" dy="10" fontSize="10">
                            换乘站
                        </text>
                        <text className="rmg-name__en" dx="60" dy="20" fontSize="6">
                            Interchange
                        </text>
                        <text className="rmg-name__en" dx="60" dy="30" fontSize="6">
                            Station
                        </text>
                    </g>
                </g>
            </>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [param.svgWidth.indoor, param.svg_height, param.line_name]
    );
};

/* Some unused functions to split branches from the main line.
 * Note the branches here has a slightly different meaning.
 * It refers to all the line sections that have a parallel line
 * rather than the upper or the bottom branch section.
 *
 * Currently these functions only can be used on a line that
 * branches in the middle and ends at the linestart, which also
 * means that linestart has two children in the adjMat.
 */
/*
const getPathLength = (adjMat: ReturnType<typeof adjacencyList>, from: string, to: string): number => {
    let cnt = 0, cur = from
    while (Object.keys(adjMat[cur]).length > 0) {
        cnt += 1
        // we choose the first for all the cases so that the length for different branches will end in the same node
        cur = Object.keys(adjMat[cur])[0]
    }
    return cnt
}
const getIntersectionStn = (adjMat: ReturnType<typeof adjacencyList>) => {
    const start = Object.keys(adjMat['linestart'])

    let a = start[0], b = start[1]
    const lenA = getPathLength(adjMat, a, 'lineend')
    const lenB = getPathLength(adjMat, b, 'lineend')
    if (lenA < lenB) {
        for (let i = 0; i < lenB - lenA; i++) b = Object.keys(adjMat[b])[0]
    } else {
        for (let i = 0; i < lenA - lenB; i++) a = Object.keys(adjMat[a])[0]
    }
    while (a !== b) {
        a = Object.keys(adjMat[a])[0]
        b = Object.keys(adjMat[b])[0]
    }
    return a
}
const getBranchesAndMainLine = (adjMat: ReturnType<typeof adjacencyList>) => {
    const start = Object.keys(adjMat['linestart'])
    const intersection = getIntersectionStn(adjMat)
    return {
        'branches': [
            criticalPathMethod(start[0], intersection, adjMat).nodes,
            criticalPathMethod(start[1], intersection, adjMat).nodes
        ],
        'main': criticalPathMethod(intersection, 'lineend', adjMat).nodes
    }
}
const getYShares = (adjMat: ReturnType<typeof adjacencyList>,
    branchesAndMainLine: ReturnType<typeof getBranchesAndMainLine>,
    stnId: string) => {
    const branches = branchesAndMainLine.branches
    const main = branchesAndMainLine.main

    if (main.includes(stnId)) {
        return 3
    } else if (branches[0].includes(stnId)) {
        return 0
    } else {
        return 6
    }
}
*/
