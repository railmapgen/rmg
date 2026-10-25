// 上海地铁环线画布：上海地铁环线支线。
import { useRootSelector } from '../../../redux';
import { CanvasType, Services } from '../../../constants/constants';
import StationSHMetro from '../station-shmetro';
import { StationSHMetro as StationSHMetroIndoor } from '../indoor/station-shmetro';
import React from 'react';
import { ColourHex } from '@railmapgen/rmg-palette-resources';

export const get_loop_branches = (
    branches: string[][],
    branch_stn_ids: string[],
    svg_width: number,
    padding: number,
    left_and_right_factor: number,
    bottom_factor: number
) => {
    const loopline = branches[0].filter(stn_id => !['linestart', 'lineend'].includes(stn_id));

    const loop_branches = branches.slice(1, 3).map(branch => branch.slice(1, branch.length - 1));
    // 计算顶边车站与支线车站的总长度
    const critical_path_length =
        loop_branches.reduce(
            (acc, cur) =>
                acc + cur.filter(stn_id => !['linestart', 'lineend', ...branch_stn_ids].includes(stn_id)).length,
            0
        ) +
        loopline.length -
        bottom_factor -
        left_and_right_factor * 2;
    // 计算带支线时顶边每个车站的间距
    // 由于 `get_xshares_yshares_of_loop` 中 `e = 0.1`，顶边车站间距会较小
    const x_interval = (svg_width - ((svg_width * padding) / 100) * 2) / (1 + critical_path_length);
    // 拆分支线横向坐标，用于收缩环线横向坐标
    const line_xs_branches = [
        (svg_width * padding) / 100 + (loop_branches.at(0) ?? []).length * x_interval,
        svg_width * (1 - padding / 100) - (loop_branches.at(1) ?? []).length * x_interval,
    ] as [number, number];
    const xs_branches = {
        ...Object.fromEntries(
            (loop_branches.at(0) ?? []).map((stn, i) => [stn, (svg_width * padding) / 100 + i * x_interval])
        ),
        ...Object.fromEntries(
            (loop_branches.at(1) ?? []).map((stn, i) => [stn, line_xs_branches[1] + (1 + i) * x_interval])
        ),
    };
    return { loop_branches, line_xs_branches, xs_branches };
};

export const LoopBranches = (props: {
    loop_branches: string[][];
    edges: [number, number, number, number];
    xs: {
        [k: string]: number;
    };
    ys: {
        [k: string]: number;
    };
    canvas: CanvasType.RailMap | CanvasType.Indoor;
}) => {
    const { loop_branches, edges, xs, ys, canvas } = props;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [X_LEFT, X_RIGHT, Y_TOP, Y_BOTTOM] = edges;

    const { branches } = useRootSelector(store => store.helper);
    const { current_stn_idx: current_stn_id, direction, coline } = useRootSelector(store => store.param);

    const e = canvas === CanvasType.RailMap ? 30 : 0;
    const branches_paths = [
        `M ${X_LEFT},${Y_TOP} H ${Number(xs[loop_branches.at(0)?.at(0) ?? '']) - e}`,
        `M ${X_RIGHT},${Y_TOP} H ${Number(xs[loop_branches.at(1)?.at(-1) ?? '']) + e}`,
    ];

    const loopline = branches[0].filter(stn_id => !['linestart', 'lineend'].includes(stn_id));
    const branches_coline_color = Object.values(coline)
        .filter(co => ![co.from, co.to].every(stn_id => loopline.includes(stn_id)))
        .map(co => co.colors);

    return (
        <>
            {loop_branches.map((loop_branch, i) => (
                <React.Fragment key={loop_branch.at(0)}>
                    {branches_coline_color
                        // 移除重复项
                        .filter((c, i, self) => i === self.findIndex(t => t.at(0)?.at(2) === c.at(0)?.at(2)))
                        // 生成共线颜色的标记
                        .map(color => (
                            <marker key={color[0][2]} id={`arrow_theme_${color[0][2]}`} refX={1} refY={0.5}>
                                <path d="M0,1H2L1,0z" fill={color[0][2]} />
                            </marker>
                        ))}
                    <path
                        stroke={branches_coline_color.at(i)?.at(0)?.at(2) ?? 'var(--rmg-theme-colour)'}
                        strokeWidth={12}
                        fill="none"
                        d={branches_paths[i]}
                        markerEnd={
                            canvas === CanvasType.RailMap &&
                            ((direction === 'l' && i === 0) || (direction === 'r' && i === 1))
                                ? branches_coline_color.at(i)
                                    ? `url(#arrow_theme_${branches_coline_color[i][0][2]})`
                                    : 'url(#arrow_theme)'
                                : undefined
                        }
                    />
                    {loop_branch
                        .filter(stn_id => !['linestart', 'lineend'].includes(stn_id))
                        .map(stn_id => (
                            <React.Fragment key={stn_id}>
                                {canvas === CanvasType.RailMap && (
                                    <g key={stn_id} transform={`translate(${xs[stn_id]},${ys[stn_id]})`}>
                                        <StationSHMetro
                                            stnId={stn_id}
                                            stnState={current_stn_id === stn_id ? 0 : 1}
                                            bank={0}
                                            direction={direction}
                                            color={branches_coline_color.at(i)?.at(0)?.at(2) as ColourHex | undefined}
                                        />
                                    </g>
                                )}

                                {canvas === CanvasType.Indoor && (
                                    <g key={stn_id} transform={`translate(${xs[stn_id]},${ys[stn_id]})`}>
                                        <StationSHMetroIndoor
                                            stnId={stn_id}
                                            nameDirection={
                                                loop_branches
                                                    .filter(branch => branch.includes(stn_id))
                                                    .map(branch =>
                                                        branch.indexOf(stn_id) % 2 === 0 ? 'downward' : 'upward'
                                                    )[0] as 'upward' | 'downward'
                                            }
                                            services={[Services.local]}
                                            color={branches_coline_color.at(i)?.at(0)?.at(2) as ColourHex | undefined}
                                        />
                                    </g>
                                )}
                            </React.Fragment>
                        ))}
                </React.Fragment>
            ))}
        </>
    );
};
