// 上海地铁环线画布：上海地铁环线。
/* eslint @typescript-eslint/no-non-null-assertion: 0 */
import StationSHMetro from '../station-shmetro';
import { NameDirection, StationSHMetro as StationSHMetroIndoor } from '../indoor/station-shmetro';
import { CanvasType, Services, ShortDirection } from '../../../constants/constants';
import { useRootSelector } from '../../../redux';
import { isColineBranch } from '../../../redux/param/coline-action';
import {
    get_xshares_yshares_of_loop,
    LoopStns,
    split_loop_stns,
    split_loop_stns_with_branch,
    split_loop_stns_with_branches,
} from '../../methods/shmetro-loop';
import { get_loop_branches, LoopBranches } from './loop-branches-shmetro';
import { LoopColine } from './loop-coline-shmetro';

const LoopSHMetro = (props: { bank_angle: boolean; canvas: CanvasType.RailMap | CanvasType.Indoor }) => {
    const { bank_angle, canvas } = props;
    const { branches } = useRootSelector(store => store.helper);
    const {
        current_stn_idx: current_stn_id,
        svgWidth: svg_width,
        svg_height,
        padding,
        branchSpacingPct,
        direction,
        info_panel_type,
        stn_list,
        loop_info: { left_and_right_factor, bottom_factor },
        coline,
    } = useRootSelector(store => store.param);

    const loopline = branches[0].filter(stn_id => !['linestart', 'lineend'].includes(stn_id));
    const branch_stn_ids = branches
        .slice(0, 3) // drop additional branches
        .flat()
        .filter(
            (
                o => v =>
                    (o[v] = (o[v] || 0) + 1) === 2
            )({} as { [stn_id: string]: number })
        ) // count each occurrence
        .filter(stn_id => !['linestart', 'lineend'].includes(stn_id)); // find branch stations

    // 根据共线信息确定顶边显示的圆弧
    const arc =
        Object.values(coline)
            .filter(co =>
                [co.from, co.to].every(stn_id =>
                    branches
                        .slice(1, 3)
                        .filter(branch => isColineBranch(branch, stn_list))
                        .flat()
                        .includes(stn_id)
                )
            )
            .map(co => {
                const from_idx = loopline.findIndex(stn_id => stn_id === co.from);
                const to_idx = loopline.findIndex(stn_id => stn_id === co.to);
                return Math.abs(to_idx - from_idx) > loopline.length - 2 - Math.abs(to_idx - from_idx)
                    ? 'major'
                    : 'minor';
            })
            .at(0) ?? 'minor';

    // 根据支线数量选择不同的拆分方法
    const loop_stns = branch_stn_ids.at(1)
        ? split_loop_stns_with_branches(loopline, branch_stn_ids as [string, string], left_and_right_factor, arc)
        : branch_stn_ids.at(0)
          ? split_loop_stns_with_branch(loopline, branch_stn_ids[0], bottom_factor, left_and_right_factor)
          : split_loop_stns(loopline, current_stn_id, bottom_factor, left_and_right_factor);
    const { x_shares: x_shares_loop, y_shares: y_shares_loop } = get_xshares_yshares_of_loop(loopline, loop_stns);

    // 计算支线的横向与纵向坐标
    const { loop_branches, line_xs_branches, xs_branches } = get_loop_branches(
        branches,
        branch_stn_ids,
        svg_width[canvas],
        padding,
        left_and_right_factor,
        loop_stns.bottom.length // respect to the new bottom_factor if there are 2 branches for critical_path_length
    );

    // 支线中所有纵向份额均为 0
    const y_shares = { ...y_shares_loop, ...Object.fromEntries(loop_branches.flat().map(stn => [stn, 0])) };
    // 原实现：`branch_spacing / 400 * svg_height`（Chito）
    const verticalPadding = (branchSpacingPct * svg_height) / 300;
    const line_ys = [
        225 + verticalPadding,
        svg_height - 75 - (canvas === CanvasType.RailMap ? 0 : 125) - verticalPadding,
    ] as [number, number];
    const ys = Object.keys(y_shares).reduce(
        (acc, cur) => ({
            ...acc,
            [cur]: line_ys[0] + y_shares[cur] * (line_ys[1] - line_ys[0]),
        }),
        {} as typeof y_shares
    );
    const line_xs = [
        // 线路图与矩形环线需要为 45 度角额外增加内边距
        // 存在支线时还需预留额外空间
        Math.max(
            (svg_width[canvas] * padding) / 100 + (bank_angle && canvas === CanvasType.RailMap ? 100 : 0),
            line_xs_branches[0]
        ),
        Math.min(
            svg_width[canvas] * (1 - padding / 100) - (bank_angle && canvas === CanvasType.RailMap ? 100 : 0),
            line_xs_branches[1]
        ),
    ] as [number, number];
    const xs_loop = Object.keys(x_shares_loop).reduce(
        (acc, cur) => ({
            ...acc,
            [cur]: line_xs[0] + x_shares_loop[cur] * (line_xs[1] - line_xs[0]),
        }),
        {} as typeof x_shares_loop
    );

    // 启用矩形环线时折叠右、下、左边
    const bank = (bank_angle ? { l: 1, r: -1 }[direction] : 0) as -1 | 0 | 1;
    [...loop_stns.right, ...loop_stns.left].forEach(stn_id => {
        xs_loop[stn_id] -= (ys[stn_id] - line_ys[0]) * bank;
    });
    loop_stns.bottom.forEach(stn_id => {
        xs_loop[stn_id] -= (line_ys[1] - line_ys[0]) * bank;
    });

    const xs = { ...xs_branches, ...xs_loop };

    // 生成 SVG 使用的环线路径
    const path = _linePath(loop_stns, xs, ys, bank, [...line_xs, ...line_ys], direction);

    // 共线处理
    const LINE_WIDTH = 12;
    const COLINE_GAP = canvas === CanvasType.RailMap && info_panel_type === 'sh2020' ? 3 : 0;
    // 上移以完整显示站名与换乘信息
    if (Object.keys(coline).length > 0) {
        loop_stns.top.forEach(stn_id => {
            ys[stn_id] -= COLINE_GAP + LINE_WIDTH;
        });
    }

    // 待修复：仅含一个车站的支线无法正确显示。
    const dy = loop_branches.length ? 0 : ((line_ys[1] - line_ys[0]) * bank) / 2;
    return (
        <g id="loop" transform={`translate(${dy},0)`}>
            <path stroke="var(--rmg-theme-colour)" strokeWidth={12} fill="none" d={path} strokeLinejoin="round" />
            {/* 顺序很重要：环线共线层应覆盖线路图中的车站。 */}
            {canvas === CanvasType.RailMap && (
                <LoopStationGroup canvas={canvas} loop_stns={loop_stns} xs={xs} ys={ys} />
            )}
            <g transform={`translate(0,${Object.keys(coline).length > 0 ? -LINE_WIDTH - COLINE_GAP : 0})`}>
                <LoopBranches
                    loop_branches={loop_branches}
                    edges={[...line_xs, ...line_ys]}
                    xs={xs}
                    ys={ys}
                    canvas={canvas}
                />
                {Object.keys(coline).length > 0 && (
                    <LoopColine
                        edges={[...line_xs, ...line_ys]}
                        loop_stns={loop_stns}
                        xs={xs}
                        ys={ys}
                        canvas={canvas}
                    />
                )}
            </g>
            {/* 顺序很重要：站内图中车站应覆盖环线共线的主路径。 */}
            {canvas === CanvasType.Indoor && <LoopStationGroup canvas={canvas} loop_stns={loop_stns} xs={xs} ys={ys} />}
        </g>
    );
};

export default LoopSHMetro;

export const _linePath = (
    loop_stns: LoopStns,
    xs: { [stn_id: string]: number },
    ys: { [stn_id: string]: number },
    bank: -1 | 0 | 1,
    // 用这些边模拟边上没有车站的情况
    edges: [number, number, number, number],
    direction: ShortDirection
) => {
    const [X_LEFT, X_RIGHT, Y_TOP, Y_BOTTOM] = edges;

    // 计算需要连接的两边之间的角点
    const corner = (prev_x: number, prev_y: number, x: number, y: number, side: keyof LoopStns): [number, number] => {
        return {
            right: [x + (y - Y_TOP) * bank, prev_y] as [number, number],
            bottom: [prev_x - (Y_BOTTOM - prev_y) * bank, y] as [number, number],
            left: [x - (Y_BOTTOM - y) * bank, prev_y] as [number, number],
            top: [prev_x + (prev_y - Y_TOP) * bank, y] as [number, number],
        }[side];
    };

    const stn_pos = [] as [number, number][];
    loop_stns.top.forEach(stn_id => {
        stn_pos.push([xs[stn_id], ys[stn_id]]);
    });
    (['right', 'bottom', 'left'] as Exclude<keyof LoopStns, 'top'>[]).forEach(side => {
        if (loop_stns[side].length > 0) {
            stn_pos.push(
                corner(stn_pos.at(-1)![0], stn_pos.at(-1)![1], xs[loop_stns[side][0]], ys[loop_stns[side][0]], side)
            );
            loop_stns[side].forEach(stn_id => {
                stn_pos.push([xs[stn_id], ys[stn_id]]);
            });
        } else {
            // 在边上模拟临时车站
            // 该临时车站位于上一条边的角点
            const extra = {
                right: [X_RIGHT, stn_pos.at(-1)![1]] as [number, number],
                bottom: [
                    stn_pos.at(-1)![0] + (Y_BOTTOM - stn_pos.at(-1)![1]) * -bank,
                    stn_pos.at(-1)![1] + (Y_BOTTOM - stn_pos.at(-1)![1]),
                ] as [number, number],
                left: [
                    X_LEFT + (bank === 0 ? 0 : (Y_BOTTOM - Y_TOP) * (direction === 'l' ? -1 : 1)),
                    stn_pos.at(-1)![1],
                ] as [number, number],
            };
            stn_pos.push(extra[side]);
        }
    });
    stn_pos.push(corner(stn_pos.at(-1)![0], stn_pos.at(-1)![1], xs[loop_stns.top[0]], ys[loop_stns.top[0]], 'top'));

    const path = stn_pos
        .slice(1)
        .map(([x, y]) => `L${x},${y} `)
        .join(' ');
    return `M${stn_pos[0][0]},${stn_pos[0][1]} ${path} Z`;
};

const LoopStationGroup = (props: {
    canvas: CanvasType.RailMap | CanvasType.Indoor;
    loop_stns: LoopStns;
    xs: {
        [k: string]: number;
    };
    ys: {
        [k: string]: number;
    };
}) => {
    const { canvas, loop_stns, xs, ys } = props;
    const { current_stn_idx: current_stn_id, stn_list } = useRootSelector(store => store.param);

    const railmap_bank: Record<keyof LoopStns, -1 | 0 | 1> = {
        top: 0,
        bottom: 0,
        left: -1,
        right: 1,
    };
    const railmap_direction: Record<keyof LoopStns, 'l' | 'r' | undefined> = {
        left: 'r',
        right: 'l',
        top: undefined,
        bottom: undefined,
    };
    const indoor_name_direction = (side: keyof LoopStns, i: number) =>
        ({
            top: i % 2 === 0 ? 'upward' : 'downward',
            bottom: i % 2 === 0 ? 'upward' : 'downward',
            left: 'left',
            right: 'right',
        })[side] as NameDirection;
    return (
        <g id="loop_stations">
            {canvas === CanvasType.RailMap &&
                Object.entries(loop_stns).map(([side, stn_ids]) =>
                    stn_ids
                        .filter(stn_id => stn_list[stn_id].services.length)
                        .map(stn_id => (
                            <g key={stn_id} transform={`translate(${xs[stn_id]},${ys[stn_id]})`}>
                                <StationSHMetro
                                    stnId={stn_id}
                                    stnState={current_stn_id === stn_id ? 0 : 1}
                                    bank={railmap_bank[side as keyof LoopStns]}
                                    direction={railmap_direction[side as keyof LoopStns]}
                                />
                            </g>
                        ))
                )}
            {canvas === CanvasType.Indoor &&
                Object.entries(loop_stns).map(([side, stn_ids]) =>
                    stn_ids
                        .filter(stn_id => stn_list[stn_id].services.length)
                        .map((stn_id, i) => (
                            <g key={stn_id} transform={`translate(${xs[stn_id]},${ys[stn_id]})`}>
                                <StationSHMetroIndoor
                                    stnId={stn_id}
                                    nameDirection={indoor_name_direction(side as keyof LoopStns, i)}
                                    services={[Services.local]}
                                />
                            </g>
                        ))
                )}
        </g>
    );
};
