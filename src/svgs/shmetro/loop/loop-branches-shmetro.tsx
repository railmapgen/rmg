import { useRootSelector } from '../../../redux';
import { CanvasType, Services } from '../../../constants/constants';
import StationSHMetro from '../station-shmetro';
import { StationSHMetro as StationSHMetroIndoor } from '../indoor/station-shmetro';
import React from 'react';
import { ColourHex } from '@railmapgen/rmg-palette-resources';

type BranchSeg = { d: string; color: string; markerEnd?: string };

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
    // calculate the length of top stations + branch(es) stations
    const critical_path_length =
        loop_branches.reduce(
            (acc, cur) =>
                acc + cur.filter(stn_id => !['linestart', 'lineend', ...branch_stn_ids].includes(stn_id)).length,
            0
        ) +
        loopline.length -
        bottom_factor -
        left_and_right_factor * 2;
    // interval for each station on the top side with branches
    // note the interval of station for the top side will be smaller because of e = 0.1 in get_xshares_yshares_of_loop
    const x_interval = (svg_width - ((svg_width * padding) / 100) * 2) / (1 + critical_path_length);
    // split lines_xs for branches, used to shrink loop line's lines_xs
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

/**
 * Find the nearest loop connection station for a given branch.
 * In the loop line (Shanghai Metro Lines 3/4), each branch has at most 2 connection stations.
 */
export const find_branch_connection = (
    raw_branch: string[],
    loopline: string[],
    branch_stn_ids: string[]
): { connection_stn: string; connection_is_origin: boolean } | undefined => {
    const pivot = raw_branch.findIndex(stn => !loopline.includes(stn) && !['linestart', 'lineend'].includes(stn));
    if (pivot === -1) return undefined;
    const connection_stn = branch_stn_ids
        .filter(b => raw_branch.includes(b))
        .sort((a, b) => Math.abs(raw_branch.indexOf(a) - pivot) - Math.abs(raw_branch.indexOf(b) - pivot))
        .at(0);
    if (!connection_stn) return undefined;
    return { connection_stn, connection_is_origin: raw_branch.indexOf(connection_stn) < pivot };
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
    colinePastStationIds?: Set<string>;
}) => {
    const { loop_branches, edges, xs, ys, canvas, colinePastStationIds } = props;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [X_LEFT, X_RIGHT, Y_TOP, Y_BOTTOM] = edges;

    const { branches } = useRootSelector(store => store.helper);
    const { current_stn_idx: current_stn_id, direction, coline } = useRootSelector(store => store.param);

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

    const get_branch_stn_state = (stn_id: string): -1 | 0 | 1 =>
        current_stn_id === stn_id ? 0 : colinePastStationIds?.has(stn_id) ? -1 : 1;

    const e = canvas === CanvasType.RailMap ? 30 : 0;

    const branches_coline_color = Object.values(coline)
        .filter(co => ![co.from, co.to].every(stn_id => loopline.includes(stn_id)))
        .map(co => co.colors);

    return (
        <>
            {loop_branches.map((loop_branch, i) => {
                const raw_branch = branches[i + 1];
                const stns = loop_branch.filter(
                    stn_id => !['linestart', 'lineend'].includes(stn_id) && !loopline.includes(stn_id)
                );
                if (!raw_branch || stns.length === 0) return null;

                const coline_color: string = branches_coline_color.at(i)?.at(0)?.at(2) ?? 'var(--rmg-theme-colour)';

                const is_gray = (state: -1 | 0 | 1): boolean => canvas !== CanvasType.Indoor && state === -1;

                const conn = find_branch_connection(raw_branch, loopline, branch_stn_ids);
                const connection_is_origin = conn?.connection_is_origin ?? false;

                const show_arrow =
                    canvas === CanvasType.RailMap && ((direction === 'l' && i === 0) || (direction === 'r' && i === 1));
                const arrow_marker_url = (stn: string) =>
                    get_branch_stn_state(stn) === -1
                        ? 'url(#arrow_gray)'
                        : branches_coline_color.at(i)
                          ? `url(#arrow_theme_${branches_coline_color[i][0][2]})`
                          : 'url(#arrow_theme)';

                // order stations from edge boundary to arrow tip
                const ordered_stns = connection_is_origin ? stns : [...stns].reverse();
                const edge_x = connection_is_origin ? X_RIGHT : X_LEFT;
                const tip_offset = connection_is_origin ? e : -e;
                // The edge segment (from SVG boundary to first station) should be gray
                // when the train is heading towards the boundary (i.e. already passed first station).
                const edge_gray_dir: 'l' | 'r' = connection_is_origin ? 'r' : 'l';
                // Inner segments (between stations) should be gray
                // when the train is heading away from the boundary (i.e. already passed inner stations).
                const inner_gray_dir: 'l' | 'r' = connection_is_origin ? 'l' : 'r';

                const seg_paths: BranchSeg[] = [];

                const first_stn_state = get_branch_stn_state(ordered_stns[0]);
                seg_paths.push({
                    d: `M ${edge_x},${Y_TOP} H ${xs[ordered_stns[0]]}`,
                    color:
                        is_gray(first_stn_state) || (direction === edge_gray_dir && first_stn_state === 0)
                            ? 'var(--rmg-grey)'
                            : coline_color,
                });

                for (let j = 0; j < ordered_stns.length - 1; j++) {
                    const state = get_branch_stn_state(ordered_stns[j]);
                    seg_paths.push({
                        d: `M ${xs[ordered_stns[j]]},${Y_TOP} H ${xs[ordered_stns[j + 1]]}`,
                        color:
                            is_gray(state) || (direction === inner_gray_dir && state === 0)
                                ? 'var(--rmg-grey)'
                                : coline_color,
                    });
                }

                const tip_stn = ordered_stns[ordered_stns.length - 1];
                const tip_state = get_branch_stn_state(tip_stn);
                seg_paths.push({
                    d: `M ${xs[tip_stn]},${Y_TOP} H ${xs[tip_stn] + tip_offset}`,
                    color:
                        is_gray(tip_state) || (direction === inner_gray_dir && tip_state === 0)
                            ? 'var(--rmg-grey)'
                            : coline_color,
                    markerEnd: show_arrow ? arrow_marker_url(tip_stn) : undefined,
                });

                return (
                    <React.Fragment key={loop_branch.at(0)}>
                        {branches_coline_color
                            // remove duplicate
                            .filter((c, ci, self) => ci === self.findIndex(t => t.at(0)?.at(2) === c.at(0)?.at(2)))
                            // generate marker with coline color
                            .map(color => (
                                <marker key={color[0][2]} id={`arrow_theme_${color[0][2]}`} refX={1} refY={0.5}>
                                    <path d="M0,1H2L1,0z" fill={color[0][2]} />
                                </marker>
                            ))}
                        {seg_paths.map((seg, idx) => (
                            <path
                                key={idx}
                                stroke={seg.color}
                                strokeWidth={12}
                                fill="none"
                                d={seg.d}
                                markerEnd={seg.markerEnd}
                            />
                        ))}
                        {stns.map(stn_id => {
                            const state = get_branch_stn_state(stn_id);
                            return (
                                <React.Fragment key={stn_id}>
                                    {canvas === CanvasType.RailMap && (
                                        <g transform={`translate(${xs[stn_id]},${ys[stn_id]})`}>
                                            <StationSHMetro
                                                stnId={stn_id}
                                                stnState={state}
                                                bank={0}
                                                direction={direction}
                                                color={
                                                    state === -1
                                                        ? undefined
                                                        : (branches_coline_color.at(i)?.at(0)?.at(2) as
                                                              | ColourHex
                                                              | undefined)
                                                }
                                            />
                                        </g>
                                    )}
                                    {canvas === CanvasType.Indoor && (
                                        <g transform={`translate(${xs[stn_id]},${ys[stn_id]})`}>
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
                                                color={
                                                    branches_coline_color.at(i)?.at(0)?.at(2) as ColourHex | undefined
                                                }
                                            />
                                        </g>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </React.Fragment>
                );
            })}
        </>
    );
};
