/* eslint @typescript-eslint/no-non-null-assertion: 0 */
import StationSHMetro from '../station-shmetro';
import { NameDirection, StationSHMetro as StationSHMetroIndoor } from '../indoor/station-shmetro';
import { CanvasType, ColineInfo, Services, ShortDirection, StationDict } from '../../../constants/constants';
import { useRootSelector } from '../../../redux';
import { isColineBranch } from '../../../redux/param/coline-action';
import {
    get_xshares_yshares_of_loop,
    LoopStns,
    split_loop_stns,
    split_loop_stns_with_branch,
    split_loop_stns_with_branches,
} from '../../methods/shmetro-loop';
import { find_branch_connection, get_loop_branches, LoopBranches } from './loop-branches-shmetro';
import { LoopColine } from './loop-coline-shmetro';

/**
 * Get the set of stations on the shorter arc of the displayed coline.
 * Only one coline in loop line is supported (Shanghai Metro Lines 3/4).
 *
 * @param loopline The loop line aka branches[0].
 * @param coline The coline record from param.
 * @returns Set of station ids on the shorter arc, or empty set if no coline is displayed.
 */
export const get_coline_arc_stations = (loopline: string[], coline: Record<string, ColineInfo>): Set<string> => {
    const co = Object.values(coline).find(co => co.display);
    if (!co) return new Set();
    const n = loopline.length;
    const from_idx = loopline.indexOf(co.from);
    const to_idx = loopline.indexOf(co.to);
    if (from_idx === -1 || to_idx === -1) return new Set();
    const len = Math.min((to_idx - from_idx + n) % n, (from_idx - to_idx + n) % n);
    const step = (to_idx - from_idx + n) % n <= (from_idx - to_idx + n) % n ? 1 : -1;
    return new Set(Array.from({ length: len + 1 }, (_, i) => loopline[(from_idx + step * i + n) % n]));
};

/**
 * Get the list of branch stations that are past (already visited) based on the current station and direction.
 *
 * @param branches All branches including the loop line.
 * @param loopline The loop line aka branches[0].
 * @param current_stn_id Current station id.
 * @param direction Current travel direction.
 * @param branch_stn_ids Station ids that appear in multiple branches (connection stations).
 * @param loop_past Set of loop stations already marked as past.
 * @returns Array of past branch station ids.
 */
export const get_branch_past_stations = (
    branches: string[][],
    loopline: string[],
    current_stn_id: string,
    direction: ShortDirection,
    branch_stn_ids: string[],
    loop_past: Set<string>
): string[] => {
    const result: string[] = [];
    branches.slice(1, 3).forEach(raw_branch => {
        const branch_stns = raw_branch.filter(
            stn => !loopline.includes(stn) && !['linestart', 'lineend'].includes(stn)
        );
        if (branch_stns.length === 0) return;

        if (raw_branch.includes(current_stn_id)) {
            const cur_branch_idx = raw_branch.indexOf(current_stn_id);
            branch_stns.forEach(stn => {
                const stn_branch_idx = raw_branch.indexOf(stn);
                if (direction === 'l' ? stn_branch_idx > cur_branch_idx : stn_branch_idx < cur_branch_idx) {
                    result.push(stn);
                }
            });
        } else {
            const conn = find_branch_connection(raw_branch, loopline, branch_stn_ids);
            if (conn && loop_past.has(conn.connection_stn)) {
                result.push(...branch_stns);
            }
        }
    });
    return result;
};

/**
 * Calculate the set of station ids that should be displayed as past (gray) on the coline.
 * Includes both loop arc stations and branch stations.
 *
 * @param loopline The loop line aka branches[0].
 * @param coline The coline record from param.
 * @param branches All branches including the loop line.
 * @param current_stn_id Current station id.
 * @param direction Current travel direction.
 * @param stn_list Station dictionary, used to check if a branch is a coline branch.
 * @param branch_stn_ids Station ids that appear in multiple branches (connection stations).
 * @returns Set of station ids that are past.
 */
export const get_coline_past_station_ids = (
    loopline: string[],
    coline: Record<string, ColineInfo>,
    branches: string[][],
    current_stn_id: string,
    direction: ShortDirection,
    stn_list: StationDict,
    branch_stn_ids: string[]
): Set<string> => {
    const past = new Set<string>();
    if (Object.keys(coline).length === 0) return past;

    const coline_arc_stations = get_coline_arc_stations(loopline, coline);
    const n = loopline.length;

    const active_branch = branches.slice(1, 3).find(branch => branch.includes(current_stn_id));
    const is_on_coline_branch =
        active_branch && isColineBranch(active_branch, stn_list) && !loopline.includes(current_stn_id);

    if (!is_on_coline_branch && !coline_arc_stations.has(current_stn_id)) return past;

    const cur_idx = loopline.indexOf(current_stn_id);
    const conn =
        cur_idx === -1 && active_branch ? find_branch_connection(active_branch, loopline, branch_stn_ids) : undefined;

    const effective_cur_idx = conn ? loopline.indexOf(conn.connection_stn) : cur_idx;
    if (effective_cur_idx === -1) return past;

    // Mark loop arc stations that are behind the current station in the travel direction
    coline_arc_stations.forEach(arc_stn => {
        const idx = loopline.indexOf(arc_stn);
        if (idx === effective_cur_idx) return;
        const past_dist = direction === 'l' ? (idx - effective_cur_idx + n) % n : (effective_cur_idx - idx + n) % n;
        if (past_dist > 0 && past_dist <= Math.floor(n / 2)) past.add(arc_stn);
    });

    // If current station is on a branch, also mark its connection station as past when appropriate
    if (
        conn &&
        ((!conn.connection_is_origin && direction === 'l') || (conn.connection_is_origin && direction === 'r'))
    ) {
        past.add(conn.connection_stn);
    }

    // Mark branch stations that are past
    for (const stn of get_branch_past_stations(branches, loopline, current_stn_id, direction, branch_stn_ids, past)) {
        past.add(stn);
    }
    return past;
};

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

    // find which arc would be displayed on the top side from coline info
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

    // use different split methods for different numbers of branches
    const loop_stns = branch_stn_ids.at(1)
        ? split_loop_stns_with_branches(loopline, branch_stn_ids as [string, string], left_and_right_factor, arc)
        : branch_stn_ids.at(0)
          ? split_loop_stns_with_branch(loopline, branch_stn_ids[0], bottom_factor, left_and_right_factor)
          : split_loop_stns(loopline, current_stn_id, bottom_factor, left_and_right_factor);
    const { x_shares: x_shares_loop, y_shares: y_shares_loop } = get_xshares_yshares_of_loop(loopline, loop_stns);

    // calculate xs and ys for branches
    const { loop_branches, line_xs_branches, xs_branches } = get_loop_branches(
        branches,
        branch_stn_ids,
        svg_width[canvas],
        padding,
        left_and_right_factor,
        loop_stns.bottom.length // respect to the new bottom_factor if there are 2 branches for critical_path_length
    );

    // all y_shares in branches will be 0
    const y_shares = { ...y_shares_loop, ...Object.fromEntries(loop_branches.flat().map(stn => [stn, 0])) };
    // before: branch_spacing / 400 * svg_height (Chito)
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
        // in railmap and bank, we need to add extra padding for the 45-degree angle
        // also if there are branches, we need to leave additional spaces
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

    // bank the right, bottom, left side if bank_angle
    const bank = (bank_angle ? { l: 1, r: -1 }[direction] : 0) as -1 | 0 | 1;
    [...loop_stns.right, ...loop_stns.left].forEach(stn_id => {
        xs_loop[stn_id] -= (ys[stn_id] - line_ys[0]) * bank;
    });
    loop_stns.bottom.forEach(stn_id => {
        xs_loop[stn_id] -= (line_ys[1] - line_ys[0]) * bank;
    });

    const xs = { ...xs_branches, ...xs_loop };

    const coline_past_station_ids = get_coline_past_station_ids(
        loopline,
        coline,
        branches,
        current_stn_id,
        direction,
        stn_list,
        branch_stn_ids
    );

    // generate loop path used in svg
    const path = _linePath(loop_stns, xs, ys, bank, [...line_xs, ...line_ys], direction);

    // coline stuff
    const LINE_WIDTH = 12;
    const COLINE_GAP = canvas === CanvasType.RailMap && info_panel_type === 'sh2020' ? 3 : 0;
    // move up to display the full station name and int
    if (Object.keys(coline).length > 0) {
        loop_stns.top.forEach(stn_id => {
            ys[stn_id] -= COLINE_GAP + LINE_WIDTH;
        });
    }

    // FIXME: branches with only one station could not display properly
    const dy = loop_branches.length ? 0 : ((line_ys[1] - line_ys[0]) * bank) / 2;
    return (
        <g id="loop" transform={`translate(${dy},0)`}>
            <path stroke="var(--rmg-theme-colour)" strokeWidth={12} fill="none" d={path} strokeLinejoin="round" />
            {/* Order matters. The LoopColine should cover the station in RailMap. */}
            {canvas === CanvasType.RailMap && (
                <LoopStationGroup
                    canvas={canvas}
                    loop_stns={loop_stns}
                    xs={xs}
                    ys={ys}
                    colinePastStationIds={coline_past_station_ids}
                />
            )}
            <g transform={`translate(0,${Object.keys(coline).length > 0 ? -LINE_WIDTH - COLINE_GAP : 0})`}>
                <LoopBranches
                    loop_branches={loop_branches}
                    edges={[...line_xs, ...line_ys]}
                    xs={xs}
                    ys={ys}
                    canvas={canvas}
                    colinePastStationIds={coline_past_station_ids}
                />
                {Object.keys(coline).length > 0 && (
                    <LoopColine
                        edges={[...line_xs, ...line_ys]}
                        loop_stns={loop_stns}
                        xs={xs}
                        ys={ys}
                        canvas={canvas}
                        colinePastStationIds={coline_past_station_ids}
                    />
                )}
            </g>
            {/* Order matters. The station should cover LoopColine's main path in Indoor. */}
            {canvas === CanvasType.Indoor && (
                <LoopStationGroup
                    canvas={canvas}
                    loop_stns={loop_stns}
                    xs={xs}
                    ys={ys}
                    colinePastStationIds={coline_past_station_ids}
                />
            )}
        </g>
    );
};

export default LoopSHMetro;

export const _linePath = (
    loop_stns: LoopStns,
    xs: { [stn_id: string]: number },
    ys: { [stn_id: string]: number },
    bank: -1 | 0 | 1,
    // use these edges to mock when there is no station on the edge
    edges: [number, number, number, number],
    direction: ShortDirection
) => {
    const [X_LEFT, X_RIGHT, Y_TOP, Y_BOTTOM] = edges;

    // calculate the corner point when two sides needs to be joined
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
            // simulate a fake station on the side
            // this station lays on the previous side corner
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
    colinePastStationIds?: Set<string>;
}) => {
    const { canvas, loop_stns, xs, ys, colinePastStationIds } = props;
    const { current_stn_idx: current_stn_id, stn_list } = useRootSelector(store => store.param);

    const getStnState = (stn_id: string): -1 | 0 | 1 =>
        current_stn_id === stn_id ? 0 : colinePastStationIds?.has(stn_id) ? -1 : 1;

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
                                    stnState={getStnState(stn_id)}
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
