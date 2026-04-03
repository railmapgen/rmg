import { useRootSelector } from '../../../redux';
import { CanvasType, Services } from '../../../constants/constants';
import StationSHMetro from '../station-shmetro';
import { StationSHMetro as StationSHMetroIndoor } from '../indoor/station-shmetro';
import React from 'react';
import { ColourHex } from '@railmapgen/rmg-palette-resources';
import { ColineStnState } from './loop-coline-order';

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
    indexsInLoopBranches: (number | undefined)[]; // index of current station in each branch, undefined if not on the branch
    isLeftLoopBranch: boolean[];
    colineStnStates?: Record<string, ColineStnState>;
}) => {
    const { loop_branches, edges, xs, ys, canvas, indexsInLoopBranches, isLeftLoopBranch, colineStnStates } = props;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [X_LEFT, X_RIGHT, Y_TOP, Y_BOTTOM] = edges;

    const { branches } = useRootSelector(store => store.helper);
    const { current_stn_idx: current_stn_id, direction, coline } = useRootSelector(store => store.param);

    const loopline = branches[0].filter(stn_id => !['linestart', 'lineend'].includes(stn_id));

    const get_branch_stn_state = (stn_id: string): -1 | 0 | 1 =>
        current_stn_id === stn_id ? 0 : (colineStnStates?.[stn_id] ?? 1);

    const e = canvas === CanvasType.RailMap ? 30 : 0;

    const branches_coline_color = Object.values(coline)
        .filter(co => ![co.from, co.to].every(stn_id => loopline.includes(stn_id)))
        .map(co => co.colors);

    return (
        <>
            {loop_branches.map((loop_branch, i) => {
                const stns = loop_branch;

                const coline_color: ColourHex | undefined = branches_coline_color.at(i)?.at(0)?.at(2) as
                    | ColourHex
                    | undefined;

                // this logic assumes that there are no 3-way branch case in RMG, so with a loop has at most one non-loop branch
                // markers in non RailMap canvas are suppressed in drawing logic
                const suppress_marker_direction = isLeftLoopBranch[i] ? 'r' : 'l';

                // assume that there are at least 1 station in loop_branch
                const left = suppress_marker_direction == 'l' ? X_LEFT : xs[loop_branch.at(0)!]! - e;
                const right = suppress_marker_direction == 'r' ? X_RIGHT : xs[loop_branch.at(-1)!]! + e;

                let pass_path: string | null = null;
                let main_path: string | null = null;

                const cur_station_index = indexsInLoopBranches[i];
                if (canvas !== CanvasType.RailMap) {
                    const left_ = suppress_marker_direction == 'l' ? X_LEFT : xs[loop_branch.at(0)!]!;
                    const right_ = suppress_marker_direction == 'r' ? X_RIGHT : xs[loop_branch.at(-1)!]!;
                    main_path = `M ${left_},${Y_TOP} H ${right_}`;
                } else if (cur_station_index === undefined) {
                    // current station is not on the branch, past status is not defined, all color
                    main_path = `M ${left},${Y_TOP} H ${right}`;
                } else if (cur_station_index === -1) {
                    // current station is on the left from the branch
                    // all gray or all colored according to direction
                    if (direction === 'l') {
                        pass_path = `M ${left},${Y_TOP} H ${right}`;
                    } else {
                        main_path = `M ${left},${Y_TOP} H ${right}`;
                    }
                } else if (cur_station_index >= loop_branch.length) {
                    // current station is on the right from the branch
                    // all gray or all colored according to direction
                    if (direction === 'l') {
                        main_path = `M ${left},${Y_TOP} H ${right}`;
                    } else {
                        pass_path = `M ${left},${Y_TOP} H ${right}`;
                    }
                } else {
                    // cut into two segments at current station
                    const cur_stn_x = xs[loop_branch[cur_station_index]];
                    if (direction === 'l') {
                        main_path = `M ${left},${Y_TOP} H ${cur_stn_x}`;
                        pass_path = `M ${cur_stn_x},${Y_TOP} H ${right}`;
                    } else {
                        pass_path = `M ${left},${Y_TOP} H ${cur_stn_x}`;
                        main_path = `M ${cur_stn_x},${Y_TOP} H ${right}`;
                    }
                }

                return (
                    <React.Fragment key={loop_branch.at(0)}>
                        {
                            <defs key="coline_color_defs">
                                <marker key={coline_color} id={`arrow_theme_${coline_color}`} refX={1} refY={0.5}>
                                    <path d="M0,1H2L1,0z" fill={coline_color} />
                                </marker>
                                <marker key={coline_color} id={`arrow_theme_${coline_color}_left`} refX={1} refY={0.5}>
                                    <path d="M1,0L0,1H1z" fill={coline_color} />
                                </marker>
                                <marker key={coline_color} id={`arrow_theme_${coline_color}_right`} refY={0.5}>
                                    <path d="M0,0L1,1H-1z" fill={coline_color} />
                                </marker>
                            </defs>
                        }
                        {pass_path && (
                            <path
                                key={'pass'}
                                stroke="var(--rmg-grey)"
                                strokeWidth={12}
                                fill="none"
                                d={pass_path}
                                markerStart={
                                    canvas === CanvasType.RailMap &&
                                    direction === 'l' &&
                                    suppress_marker_direction !== 'l'
                                        ? 'url(#arrow_gray)'
                                        : undefined
                                }
                                markerEnd={
                                    canvas === CanvasType.RailMap &&
                                    direction === 'r' &&
                                    suppress_marker_direction !== 'r'
                                        ? 'url(#arrow_gray)'
                                        : undefined
                                }
                                strokeLinejoin="round"
                            />
                        )}
                        {main_path && (
                            <path
                                key={'main'}
                                stroke={coline_color}
                                strokeWidth={12}
                                fill="none"
                                d={main_path}
                                markerStart={
                                    canvas === CanvasType.RailMap &&
                                    direction === 'l' &&
                                    suppress_marker_direction !== 'l'
                                        ? `url(#arrow_theme_${coline_color}_left)`
                                        : undefined
                                }
                                markerEnd={
                                    canvas === CanvasType.RailMap &&
                                    direction === 'r' &&
                                    suppress_marker_direction !== 'r'
                                        ? `url(#arrow_theme_${coline_color}_right)`
                                        : undefined
                                }
                                strokeLinejoin="round"
                            />
                        )}
                        {stns.map(stn_id => {
                            const state = get_branch_stn_state(stn_id);
                            return (
                                <React.Fragment key={stn_id}>
                                    {canvas === CanvasType.RailMap && (
                                        <g key={stn_id} transform={`translate(${xs[stn_id]},${ys[stn_id]})`}>
                                            <StationSHMetro
                                                stnId={stn_id}
                                                stnState={state}
                                                bank={0}
                                                direction={direction}
                                                color={state === -1 ? undefined : coline_color}
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
                                                color={coline_color}
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
