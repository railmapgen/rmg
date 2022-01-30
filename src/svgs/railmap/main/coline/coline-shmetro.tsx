import React from 'react';
import { adjacencyList, getXShareMTR, criticalPathMethod, drawLine, getStnState } from '../../methods/share';
import { AtLeastOneOfPartial, Services, CoLineInfo, MonoColour, Theme } from '../../../../constants/constants';
import { CityCode } from '@railmapgen/rmg-palette-resources';
import { useAppSelector } from '../../../../redux';
import { _linePath } from '../main-shmetro';

interface Props {
    xs: { [stnId: string]: number };
    ys: { [stnId: string]: number };
    servicesPresent: Services[];
    stnStates: {
        [stnId: string]: 0 | 1 | -1;
    };
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

interface ColineLinePath {
    main: {
        linePath: string[];
        colors: Theme[];
    }[];
    pass: {
        linePath: string[];
        colors: Theme[];
    }[];
}

type ColinePath = AtLeastOneOfPartial<Record<Services, ColineServicesPath>>;

const ColineSHMetro = (props: Props) => {
    const { xs, ys, servicesPresent, stnStates } = props;

    const direction = useAppSelector(store => store.param.direction);
    const stn_list = useAppSelector(store => store.param.stn_list);
    const branches = useAppSelector(store => store.helper.branches);

    const coLineInfo: CoLineInfo[] = [
        {
            from: 'l1mz',
            to: 'iwf6',
            colors: [
                [CityCode.Shanghai, 'sh3', '#FFD100', MonoColour.black],
                [CityCode.Shanghai, 'sh4', '#5F259F', MonoColour.white],
            ],
        },
        // {
        //     from: 'iwf6',
        //     to: 'h2tm',
        //     colors: [[CityCode.Shanghai, 'sh4', '#5F259F', MonoColour.white]],
        // },
    ];

    // coline color and its station ids
    const colineStns = coLineInfo
        .map(coLine => {
            const involvedBranches = branches.filter(
                branch => branch.includes(coLine.from) && branch.includes(coLine.to)
            );

            // the current coLineInfo fall on two separate branches,
            // which should not be possible
            if (involvedBranches.length !== 1) return { linePath: [], colors: coLine.colors };

            const branch = involvedBranches.flat();
            const a = branch.indexOf(coLine.from);
            const b = branch.indexOf(coLine.to);
            const linePath = a < b ? branch.slice(a, b + 1) : branch.slice(b, a + 1);
            return {
                linePath: linePath,
                colors: coLine.colors,
            };
        })
        .filter(branchWithColine => branchWithColine.linePath.length !== 0)
        .map(branchWithColine => {
            const linePaths = drawLine(branchWithColine.linePath, stnStates);
            return {
                main: [
                    {
                        linePath: linePaths.main,
                        colors: branchWithColine.colors,
                    },
                ],
                pass: [
                    {
                        linePath: linePaths.pass,
                        colors: branchWithColine.colors,
                    },
                ],
            };
        })
        // .map(branchWithColine =>
        //     (
        //         Object.entries(drawLine(branchWithColine.linePath, stnStates)) as [
        //             keyof ReturnType<typeof drawLine>,
        //             string[]
        //         ][]
        //     )
        //         .map(([type, linePath]) => ({ [type]: { linePath: linePath, colors: branchWithColine.colors } }))
        //         .reduce((acc, cur) => ({ ...acc, ...cur }), { main: [], pass: [] } as ColineLinePath)
        // )
        .reduce(
            (acc, cur) => {
                acc.main = [...acc.main, ...cur.main];
                acc.pass = [...acc.pass, ...cur.pass];
                return acc;
            },
            { main: [], pass: [] } as ColineLinePath
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
                                ys,
                                direction,
                                service,
                                servicesPresent.length,
                                stn_list
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

    // Data to draw the station elements.
    const colineStations = [...colineStns.main, ...colineStns.pass]
        // Merge main and pass station together to minimize the code duplication
        // and its state can obtained by stnStates.
        .map(stns =>
            stns.linePath.map(stnId => ({
                curStn: stnId,
                x: xs[stnId],
                y: ys[stnId],
                color: stns.colors[1],
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
        );
    console.log(colineStations);

    const lineWidth = 12;
    const colineGap = 3;
    return (
        <g id="coline" transform={`translate(0,${lineWidth + colineGap})`}>
            <CoLine paths={colinePaths} direction={direction} />
            {colineStations.map(colineStation => {
                const { curStn, x, y, color } = colineStation;
                const height = (stnStates[curStn] === -1 ? 0 : lineWidth) + colineGap;
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
        </g>
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

                                {/* {direction === 'l' && (
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
                                )} */}

                                <path
                                    key={j}
                                    // stroke={colinePath.colors.length > 1 ? `url(#grad${j})` : colinePath.colors[0][2]}
                                    stroke={colinePath.colors[1][2]}
                                    strokeWidth={12}
                                    fill="none"
                                    d={colinePath.path}
                                    // markerStart={
                                    //     direction === 'l'
                                    //         ? `url(#arrow_left_${j}_${colinePath.colors.map(c => c[2]).join('_')})`
                                    //         : undefined
                                    // }
                                    // markerEnd={
                                    //     direction === 'r'
                                    //         ? `url(#arrow_right_${j}_${colinePath.colors.map(c => c[2]).join('_')})`
                                    //         : undefined
                                    // }
                                    strokeLinejoin="round"
                                    filter={service === Services.local ? undefined : `url(#contrast-${service})`}
                                />
                            </React.Fragment>
                        ))}

                        {paths[service]?.pass.map((colinePath, j) => (
                            <React.Fragment key={j}>
                                <path
                                    key={j}
                                    stroke={colinePath.colors[1][2]}
                                    strokeWidth={12}
                                    fill="none"
                                    d={colinePath.path}
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
