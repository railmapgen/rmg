// 上海地铁 SVG 画布：上海地铁共线。
import { Fragment, useMemo } from 'react';
import { drawLine } from '../methods/share';
import { calculateColine, calculateColineStations } from '../methods/shmetro-coline';
import { AtLeastOneOfPartial, ColineColours, Services } from '../../constants/constants';
import { useRootSelector } from '../../redux';
import { _linePath, StationGroupProps } from './main-shmetro';
import StationSHMetro from './station-shmetro';

interface Props {
    xs: { [stnId: string]: number };
    servicesPresent: Services[];
    stnStates: { [stnId: string]: -1 | 0 | 1 };
}

interface ColineServicesPath {
    main: {
        path: string;
        colors: ColineColours[];
    }[];
    pass: {
        path: string;
        colors: ColineColours[];
    }[];
    service: Services;
}

type ColinePath = AtLeastOneOfPartial<Record<Services, ColineServicesPath>>;
const defaultTheme = ['shanghai', 'sh4', '#5F259F', '#fff', '4号线', 'Line 4'] as ColineColours;

export const ColineSHMetro = (props: Props) => {
    const { xs, servicesPresent, stnStates } = props;

    const {
        svg_height,
        direction,
        stn_list,
        current_stn_idx,
        branchSpacingPct,
        info_panel_type,
        coline: colineInfo,
    } = useRootSelector(store => store.param);
    const { branches, depsStr: deps } = useRootSelector(store => store.helper);

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
    // 筛选出所有正纵向份额，绘制带共线及其支线的线路图
    const colineYShares = Object.entries(yShares)
        .filter(([, v]) => v <= 0)
        .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {} as typeof yShares);
    const colineYs = Object.keys(colineYShares).reduce(
        (acc, cur) => ({ ...acc, [cur]: (-colineYShares[cur] * branchSpacingPct * svg_height) / 300 }),
        {} as typeof yShares
    );

    // 共线颜色及共线区段内的全部车站
    const colineStns = useMemo(
        () =>
            calculateColine(
                calculateColineStations(
                    Object.values(colineInfo).filter(co => co.display),
                    branches
                ),
                stnStates
            ),
        [JSON.stringify(colineInfo), current_stn_idx, direction, deps]
    );

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

    // 仅在共线生效时显示共线车站
    const colineStations = calculateColineStations(
        Object.values(colineInfo).filter(co => co.display),
        branches
    )
        .map(co => co.linePath)
        .flat();

    const LINE_WIDTH = 12;
    const COLINE_GAP = info_panel_type === 'sh2020' ? 3 : 0;
    return (
        <>
            <g id="coline" transform={`translate(0,${LINE_WIDTH + COLINE_GAP})`}>
                <CoLine paths={colinePaths} direction={direction} />
                <ColineStationInMainLine
                    colineStns={colineStns}
                    branches={branches}
                    xs={xs}
                    ys={colineYs}
                    stnStates={stnStates}
                    lineWidth={LINE_WIDTH}
                    colineGap={COLINE_GAP}
                />
                <ColineStationGroup
                    stnIds={Object.entries(yShares)
                        .filter(([, v]) => v < 0)
                        .reduce((acc, [k]) => [...acc, k], [] as string[])
                        .filter(stnId => !['linestart', 'lineend'].includes(stnId))
                        .filter(stnId => stn_list[stnId].services.length !== 0)
                        .filter(stnId => colineStations.includes(stnId))}
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
                            <Fragment key={j}>
                                <path
                                    key={j}
                                    stroke="var(--rmg-grey)"
                                    strokeWidth={12}
                                    fill="none"
                                    d={colinePath.path}
                                    strokeLinejoin="round"
                                    filter={service === Services.local ? undefined : `url(#contrast-${service})`}
                                />
                            </Fragment>
                        ))}

                        {paths[service]?.main.map((colinePath, j) => (
                            <Fragment key={j}>
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
                                            <Fragment key={i}>
                                                {/* React.Fragment 说明：https://stackoverflow.com/a/59390967 */}
                                                <stop // from
                                                    offset={`${(100 / colinePath.colors.length) * (i + 0)}%`}
                                                    stopColor={color[2]}
                                                />
                                                <stop // to
                                                    offset={`${(100 / colinePath.colors.length) * (i + 1)}%`}
                                                    stopColor={color[2]}
                                                />
                                            </Fragment>
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
                            </Fragment>
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
 * 在存在共线的主线支路上叠加的小矩形。
 */
const ColineStationInMainLine = (props: ColineStationInMainLineProps) => {
    const { colineStns, branches, xs, ys, stnStates, lineWidth: LINE_WIDTH, colineGap: COLINE_GAP } = props;
    const { line_name, theme, info_panel_type } = useRootSelector(store => store.param);

    // 绘制车站元素所需的数据。
    const colineStations = [...colineStns.main, ...colineStns.pass]
        // 合并主线与经过线车站，减少重复代码
        // 其状态可从 `stnStates` 获取。
        .map(stns =>
            stns.linePath.map(stnId => ({
                curStn: stnId,
                x: xs[stnId],
                y: ys[stnId],
                color: stns.colors.at(-1) ?? [...theme, ...line_name],
            }))
        )
        .flat()
        .reduce(
            // 移除同时出现在主线与经过线中的当前车站
            (acc, cur) => (acc.find(x => x.curStn === cur.curStn) ? acc : acc.concat(cur)),
            [] as {
                curStn: string;
                x: number;
                y: number;
                color: ColineColours;
            }[]
        )
        // 只处理第一支线（通常为主线）中的共线车站
        // 下层支线中的共线车站由 `ColineStationGroup` 处理
        .filter(stn => branches[0].includes(stn.curStn));
    console.log(colineStations);

    return (
        <g id="stations_in_mainline">
            {colineStations.map(colineStation => {
                const { curStn, x, y, color } = colineStation;
                const height = (stnStates[curStn] === -1 ? 0 : LINE_WIDTH) + COLINE_GAP + LINE_WIDTH;
                const dy = (stnStates[curStn] === -1 ? 0 : -LINE_WIDTH) - COLINE_GAP - LINE_WIDTH / 2;
                return (
                    <g key={curStn} transform={`translate(${x},${y})`}>
                        {info_panel_type === 'sh2020' ? (
                            <rect
                                stroke="none"
                                height={height}
                                width={12}
                                x={-6}
                                y={dy}
                                fill={stnStates[curStn] === -1 ? 'var(--rmg-grey)' : color[2]}
                            />
                        ) : (
                            <use
                                xlinkHref="#int2_sh"
                                stroke="var(--rmg-theme-colour)"
                                transform={`translate(0,${-LINE_WIDTH})`}
                            />
                        )}
                    </g>
                );
            })}
        </g>
    );
};

/**
 * 下层支线车站使用的完整车站组件。
 */
const ColineStationGroup = (props: StationGroupProps) => {
    const { xs, ys, stnStates, stnIds } = props;
    const { branches, depsStr: deps } = useRootSelector(store => store.helper);
    const { line_name, theme, coline } = useRootSelector(store => store.param);

    // 获取共线支线车站颜色，它们不同于 `var(--rmg-theme-colour)`
    const colines = useMemo(
        () => calculateColineStations(Object.values(coline), branches),
        [JSON.stringify(coline), deps]
    );
    const colors = stnIds.reduce(
        (acc, stnId) => ({
            ...acc,
            [stnId]: colines
                .filter(coline => coline.linePath.includes(stnId))
                .map(coline => coline.colors)
                .flat()
                // 待办（共线）：支持多条共线
                .at(0) ?? [...theme, ...line_name],
        }),
        {} as { [stnId: string]: ColineColours }
    );

    return (
        <g id="stations_in_coline">
            {stnIds.map(stnId => (
                <g key={stnId} transform={`translate(${xs[stnId]},${ys[stnId]})`}>
                    <StationSHMetro stnId={stnId} stnState={stnStates[stnId]} color={colors[stnId][2]} />
                </g>
            ))}
        </g>
    );
};
