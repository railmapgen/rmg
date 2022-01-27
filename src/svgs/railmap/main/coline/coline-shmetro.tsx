import React from 'react';
import { adjacencyList, getXShareMTR, criticalPathMethod, drawLine, getStnState } from '../../methods/share';
import { AtLeastOneOfPartial, Services, CoLineInfo, MonoColour, Theme } from '../../../../constants/constants';
import { CityCode } from '../../../../constants/city-config';
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
            from: 'vzv2',
            to: 'iwf6',
            colors: [
                [CityCode.Shanghai, 'sh3', '#FFD100', MonoColour.black],
                [CityCode.Shanghai, 'sh4', '#5F259F', MonoColour.white],
            ],
        },
        {
            from: 'iwf6',
            to: 'h2tm',
            colors: [[CityCode.Shanghai, 'sh4', '#5F259F', MonoColour.white]],
        },
    ];

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

    console.log(colinePaths);
    return (
        <g id="coline">
            <CoLine paths={colinePaths} direction={direction} />
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
                                    stroke={colinePath.colors.length > 1 ? `url(#grad${j})` : colinePath.colors[0][2]}
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

const drawLineWithColine = (
    branchWithColine: {
        linePath: string[];
        colors: Theme[];
    },
    stnStates: { [stnId: string]: -1 | 0 | 1 }
) => {
    const branch = branchWithColine.linePath.filter(stnId => !['linestart', 'lineend'].includes(stnId));
    var lineMainStns = branch.filter(stnId => stnStates[stnId] >= 0);
    var linePassStns = branch.filter(stnId => stnStates[stnId] <= 0);

    if (lineMainStns.length === 1) {
        linePassStns = branch;
    }

    if (lineMainStns.filter(stnId => linePassStns.indexOf(stnId) !== -1).length === 0 && lineMainStns.length) {
        // if two set disjoint
        if (linePassStns[0] === branch[0]) {
            // -1 -1 1 1
            linePassStns.push(lineMainStns[0]);
        } else if (
            lineMainStns[0] === branch[0] &&
            lineMainStns[lineMainStns.length - 1] === branch[branch.length - 1] &&
            linePassStns.length
        ) {
            linePassStns = branch;
            lineMainStns = [];
        } else {
            // 1 1 -1 -1
            linePassStns.unshift(lineMainStns[lineMainStns.length - 1]);
        }
    }

    return {
        main: [{ linePath: lineMainStns, colors: branchWithColine.colors }],
        pass: [{ linePath: linePassStns, colors: branchWithColine.colors }],
    };
};
