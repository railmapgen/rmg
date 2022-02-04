import React from 'react';
import { adjacencyList, getXShareMTR, criticalPathMethod, drawLine, getStnState } from '../../methods/share';
import { calculateColineStations, calculateColine, ColineLinePath } from '../../methods/shmetro-coline';
import { AtLeastOneOfPartial, Services, ColineInfo, Theme } from '../../../../constants/constants';
import { useAppSelector } from '../../../../redux';
import { _linePath, StationGroupProps } from '../main-shmetro';
import StationSHMetro from '../station/station-shmetro';

interface Props {
    xs: { [stnId: string]: number };
    servicesPresent: Services[];
    stnStates: { [stnId: string]: -1 | 0 | 1 };
}

interface ColineServicesPath {
    main: {
        path: string;
        colors: Theme[];
    }[];
    pass: {
        path: string;
        colors: Theme[];
    }[];
    service: Services;
}

type ColinePath = AtLeastOneOfPartial<Record<Services, ColineServicesPath>>;
const defaultTheme = ['shanghai', 'sh4', '#5F259F', '#fff'] as Theme;

export const ColineSHMetro = (props: Props) => {
    const { xs, servicesPresent, stnStates } = props;

    const { direction, stn_list, branch_spacing, coline: colineInfo } = useAppSelector(store => store.param);
    const { branches, depsStr: deps } = useAppSelector(store => store.helper);

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
    // filter out all positive yShares to draw the railmap w/ coline and its branches
    const colineYShares = Object.entries(yShares)
        .filter(([k, v]) => v <= 0)
        .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {} as typeof yShares);
    const colineYs = Object.keys(colineYShares).reduce(
        (acc, cur) => ({ ...acc, [cur]: -colineYShares[cur] * branch_spacing }),
        {} as typeof yShares
    );

    // coline color and all stations in the coline segements
    const colineStns = React.useMemo(
        () => calculateColine(calculateColineStations(colineInfo, branches), stnStates),
        [JSON.stringify(colineInfo), JSON.stringify(branches), JSON.stringify(stnStates)]
    );
    console.log(colineStns);

    // const colineStnsBak = {
    //     main: [
    //         {
    //             linePath: ['ll8u', 'iwf6'],
    //             colors: [
    //                 [CityCode.Shanghai, 'sh3', '#FFD100', MonoColour.black],
    //                 [CityCode.Shanghai, 'sh4', '#5F259F', MonoColour.white],
    //             ],
    //         },
    //         {
    //             linePath: ['iwf6', 'h2tm'],
    //             colors: [[CityCode.Shanghai, 'sh4', '#5F259F', MonoColour.white]],
    //         },
    //     ],
    //     pass: [
    //         {
    //             linePath: ['l1mz', 'll8u'],
    //             colors: [
    //                 [CityCode.Shanghai, 'sh3', '#FFD100', MonoColour.black],
    //                 [CityCode.Shanghai, 'sh4', '#5F259F', MonoColour.white],
    //             ],
    //         },
    //         {
    //             linePath: ['tl2a', 'l1mz'],
    //             colors: [[CityCode.Shanghai, 'sh4', '#5F259F', MonoColour.white]],
    //         },
    //     ],
    // };

    const colinePaths = servicesPresent.reduce(
        (acc, service) => ({
            ...acc,
            [service]: (Object.keys(colineStns) as (keyof ReturnType<typeof drawLine>)[]).reduce(
                (acc, cur) => ({
                    ...acc,
                    [cur]: colineStns[cur]
                        .map(colineStn => ({
                            path: _linePath(
                                colineStn.linePath,
                                cur,
                                xs,
                                colineYs,
                                direction,
                                service,
                                servicesPresent.length,
                                stn_list,
                                'diagonal'
                            ),
                            colors: colineStn.colors,
                        }))
                        .filter(colineStn => colineStn.path !== ''),
                }),
                {} as ColineServicesPath
            ),
        }),
        {} as ColinePath
    );
    // console.log(colinePaths);

    const lineWidth = 12;
    const colineGap = 3;
    return (
        <>
            <g id="coline" transform={`translate(0,${lineWidth + colineGap})`}>
                <CoLine paths={colinePaths} direction={direction} />
                <ColineStationInMainLine
                    colineStns={colineStns}
                    branches={branches}
                    xs={xs}
                    ys={colineYs}
                    stnStates={stnStates}
                    lineWidth={lineWidth}
                    colineGap={colineGap}
                />
                <ColineStationGroup
                    stnIds={Object.entries(yShares)
                        .filter(([k, v]) => v < 0)
                        .reduce((acc, [k, v]) => [...acc, k], [] as string[])
                        .filter(stnId => !['linestart', 'lineend'].includes(stnId))
                        .filter(stnId => stn_list[stnId].services.length !== 0)}
                    xs={xs}
                    ys={colineYs}
                    stnStates={stnStates}
                />
            </g>
        </>
    );
};

export default ColineSHMetro;

const CoLine = (props: { paths: ColinePath; direction: 'l' | 'r' }) => {
    const { paths, direction } = props;

    return (
        <>
            {(Object.keys(paths) as Services[]).map((service, i) => (
                <g key={`servicePath${i}`} transform={`translate(0,${i * 25})`}>
                    <g>
                        {paths[service]?.pass.map((colinePath, j) => (
                            <React.Fragment key={j}>
                                <path
                                    key={j}
                                    stroke="var(--rmg-grey)"
                                    strokeWidth={12}
                                    fill="none"
                                    d={colinePath.path}
                                    strokeLinejoin="round"
                                    filter={service === Services.local ? undefined : `url(#contrast-${service})`}
                                />
                            </React.Fragment>
                        ))}

                        {paths[service]?.main.map((colinePath, j) => (
                            <React.Fragment key={j}>
                                {colinePath.colors.length > 1 && (
                                    <linearGradient
                                        id={`grad${j}`}
                                        y1="-100%"
                                        y2="100%"
                                        x1="0"
                                        x2="0"
                                        // gradientTransform="rotate(90)"
                                        gradientUnits="userSpaceOnUse"
                                    >
                                        {colinePath.colors.map((color, i) => (
                                            <React.Fragment key={i}>
                                                {/* more about React.Fragment on https://stackoverflow.com/a/59390967 */}
                                                <stop // from
                                                    offset={`${(100 / colinePath.colors.length) * (i + 0)}%`}
                                                    stopColor={color[2]}
                                                />
                                                <stop // to
                                                    offset={`${(100 / colinePath.colors.length) * (i + 1)}%`}
                                                    stopColor={color[2]}
                                                />
                                            </React.Fragment>
                                        ))}
                                    </linearGradient>
                                )}

                                {direction === 'l' && (
                                    <marker
                                        id={`arrow_left_${j}_${colinePath.colors.map(c => c[2]).join('_')}`}
                                        refY={0.5}
                                        refX={1}
                                    >
                                        <path
                                            d="M1,0L0,1H1z"
                                            fill={
                                                colinePath.colors.length > 1
                                                    ? `url(#grad${j})`
                                                    : colinePath.colors[0][2]
                                            }
                                        />
                                    </marker>
                                )}
                                {direction === 'r' && (
                                    <marker
                                        id={`arrow_right_${j}_${colinePath.colors.map(c => c[2]).join('_')}`}
                                        refY={0.5}
                                    >
                                        <path
                                            d="M0,0L1,1H-1z"
                                            fill={
                                                colinePath.colors.length > 1
                                                    ? `url(#grad${j})`
                                                    : colinePath.colors[0][2]
                                            }
                                        />
                                    </marker>
                                )}

                                <path
                                    key={j}
                                    // stroke={colinePath.colors.length > 1 ? `url(#grad${j})` : colinePath.colors[0][2]}
                                    stroke={(colinePath.colors.at(-1) ?? defaultTheme)[2]}
                                    strokeWidth={12}
                                    fill="none"
                                    d={colinePath.path}
                                    markerStart={
                                        direction === 'l'
                                            ? `url(#arrow_left_${j}_${colinePath.colors.map(c => c[2]).join('_')})`
                                            : undefined
                                    }
                                    markerEnd={
                                        direction === 'r'
                                            ? `url(#arrow_right_${j}_${colinePath.colors.map(c => c[2]).join('_')})`
                                            : undefined
                                    }
                                    strokeLinejoin="round"
                                    filter={service === Services.local ? undefined : `url(#contrast-${service})`}
                                />
                            </React.Fragment>
                        ))}
                    </g>
                </g>
            ))}
        </>
    );
};

interface ColineStationInMainLineProps {
    colineStns: ReturnType<typeof calculateColine>;
    branches: string[][];
    xs: { [stnId: string]: number };
    ys: { [stnId: string]: number };
    stnStates: { [stnId: string]: -1 | 0 | 1 };
    lineWidth: number;
    colineGap: number;
}

/**
 * A small rect overlay on the main branch where coline is present.
 */
const ColineStationInMainLine = (props: ColineStationInMainLineProps) => {
    const { colineStns, branches, xs, ys, stnStates, lineWidth, colineGap } = props;

    // data to draw the station elements.
    const colineStations = [...colineStns.main, ...colineStns.pass]
        // Merge main and pass station together to minimize the code duplication
        // and its state can obtained by stnStates.
        .map(stns =>
            stns.linePath.map(stnId => ({
                curStn: stnId,
                x: xs[stnId],
                y: ys[stnId],
                // TODO: fix this undefined error
                color: stns.colors.at(-1) ?? defaultTheme,
            }))
        )
        .flat()
        .reduce(
            // remove current station as it appears in both main and pass
            (acc, cur) => (acc.find(x => x.curStn === cur.curStn) ? acc : acc.concat(cur)),
            [] as {
                curStn: string;
                x: number;
                y: number;
                color: Theme;
            }[]
        )
        // only take the coline stations in the first branch(general main line)
        // as coline stations in lower branches will be taken care by ColineStationGroup
        .filter(stn => branches[0].includes(stn.curStn));
    console.log(colineStations);

    return (
        <>
            {colineStations.map(colineStation => {
                const { curStn, x, y, color } = colineStation;
                const height = (stnStates[curStn] === -1 ? 0 : lineWidth) + colineGap + lineWidth;
                const dy = (stnStates[curStn] === -1 ? 0 : -lineWidth) - colineGap - lineWidth / 2;
                return (
                    <g key={curStn} transform={`translate(${x},${y})`}>
                        <rect
                            stroke="none"
                            height={height}
                            width={12}
                            x={-6}
                            y={dy}
                            fill={stnStates[curStn] === -1 ? 'var(--rmg-grey)' : color[2]}
                        />
                    </g>
                );
            })}
        </>
    );
};

/**
 * Complete station component for stations in lower branches.
 */
const ColineStationGroup = (props: StationGroupProps) => {
    const { xs, ys, stnStates, stnIds } = props;
    const { branches, depsStr: deps } = useAppSelector(store => store.helper);
    const { coline } = useAppSelector(store => store.param);

    // get colors of stations in coline branches, they use different
    // colors than var(--rmg-theme-colour)
    const colines = React.useMemo(
        () => calculateColineStations(coline, branches),
        [JSON.stringify(coline), branches.toString()]
    );
    const colors = stnIds.reduce(
        (acc, stnId) => ({
            ...acc,
            [stnId]:
                colines
                    .filter(coline => coline.linePath.includes('syq7'))
                    .map(coline => coline.colors)
                    .flat()
                    // TODO: remove default and support multiple colines
                    .at(0) ?? defaultTheme,
        }),
        {} as { [stnId: string]: Theme }
    );

    return (
        <g>
            {stnIds.map(stnId => (
                <g key={stnId} transform={`translate(${xs[stnId]},${ys[stnId]})`}>
                    <StationSHMetro stnId={stnId} stnState={stnStates[stnId]} color={colors[stnId]} />
                </g>
            ))}
        </g>
    );
};
