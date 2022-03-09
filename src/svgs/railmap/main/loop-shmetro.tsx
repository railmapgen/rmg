import React from 'react';
import StationSHMetro from './station/station-shmetro';
import { NameDirection, StationSHMetro as StationSHMetroIndoor } from '../../indoor/station-shmetro';
import { Services } from '../../../constants/constants';
import { useAppSelector } from '../../../redux';

// Split the loopline into four sides according to left_and_right_factor and bottom_factor.
// It assumes parameters will follow these rules:
//     1. loopline.length > bottom_factor + left_and_right_factor * 2
//     2. bottom_factor >= 0
//     3. left_and_right_factor >= 0
//     4. left_and_right_factor + bottom_factor > 0
// Each array returned should be consecutive, and when combined in top -> right -> bottom -> left order,
// it will also be consecutive. Note that the length of right, bottom, and left can be 0.
const split_loop_stns = (
    loopline: string[],
    current_stn_id: string,
    bottom_factor: number,
    left_and_right_factor: number
) => {
    const top_factor = loopline.length - left_and_right_factor * 2 - bottom_factor;
    const current_stn_idx = loopline.findIndex(val => val === current_stn_id);
    const non_undefined_loopline = [...loopline, ...loopline, ...loopline];
    const split_a = loopline.length + current_stn_idx - Math.floor(top_factor / 2) + (top_factor % 2 === 0 ? 1 : 0);
    const split_b = loopline.length + current_stn_idx + Math.floor(top_factor / 2);
    return {
        top: non_undefined_loopline.slice(split_a, split_b + 1),
        left: non_undefined_loopline.slice(split_a - left_and_right_factor, split_a),
        right: non_undefined_loopline.slice(split_b + 1, split_b + 1 + left_and_right_factor),
        bottom: non_undefined_loopline.slice(
            split_b + 1 + left_and_right_factor,
            split_b + 1 + left_and_right_factor + bottom_factor
        ),
    };
};

type LoopStns = ReturnType<typeof split_loop_stns>;

// Return the xshares and yshares of the loop stations. Values sit between -1 and 1.
const get_xshares_yshares_of_loop = (loopline: string[], loop_stns: LoopStns) => {
    const x_shares = Object.fromEntries(loopline.map(stn_id => [stn_id, -1]));
    const y_shares = Object.fromEntries(loopline.map(stn_id => [stn_id, -1]));

    const [Y_TOP, Y_BOTTOM, X_LEFT, X_RIGHT] = [-1, 1, -1, 1];

    // make sure first and last station do not position at the corner
    const e = 0.1; // e should be smaller than 1

    loop_stns.top.forEach((stn_id, i) => {
        x_shares[stn_id] = -(1 - e) + ((2 - 2 * e) / loop_stns.top.length) * i + (1 - e) / loop_stns.top.length;
        y_shares[stn_id] = Y_TOP;
    });
    loop_stns.right.forEach((stn_id, i) => {
        x_shares[stn_id] = X_RIGHT;
        y_shares[stn_id] = -(1 - e) + ((2 - 2 * e) / loop_stns.right.length) * i + (1 - e) / loop_stns.right.length;
    });
    loop_stns.bottom.forEach((stn_id, i) => {
        x_shares[stn_id] = 1 - e - ((2 - 2 * e) / loop_stns.bottom.length) * i - (1 - e) / loop_stns.bottom.length;
        y_shares[stn_id] = Y_BOTTOM;
    });
    loop_stns.left.forEach((stn_id, i) => {
        x_shares[stn_id] = X_LEFT;
        y_shares[stn_id] = 1 - e - ((2 - 2 * e) / loop_stns.left.length) * i - (1 - e) / loop_stns.left.length;
    });

    return {
        x_shares: x_shares,
        y_shares: y_shares,
    };
};

const LoopSHMetro = (props: { bank_angle: boolean }) => {
    const { bank_angle } = props;
    const { branches } = useAppSelector(store => store.helper);
    const {
        current_stn_idx: current_stn_id,
        svgWidth: svg_width,
        svg_height,
        padding,
        direction,
        loop_info,
    } = useAppSelector(store => store.param);
    const { left_and_right_factor, bottom_factor } = loop_info;

    const loopline = branches[0].filter(stn_id => !['linestart', 'lineend'].includes(stn_id));

    const loop_stns = split_loop_stns(loopline, current_stn_id, bottom_factor, left_and_right_factor);

    const { x_shares, y_shares } = get_xshares_yshares_of_loop(loopline, loop_stns);
    loopline.forEach(stn_id => {
        // normalization
        x_shares[stn_id] = (x_shares[stn_id] + 1) / 2;
        y_shares[stn_id] = (y_shares[stn_id] + 1) / 2;
    });

    const line_xs = [
        (svg_width.railmap * padding) / 100 + (bank_angle ? 0 : 50),
        svg_width.railmap * (1 - padding / 100) - (bank_angle ? 0 : 50),
    ];
    const xs = Object.keys(x_shares).reduce(
        (acc, cur) => ({
            ...acc,
            [cur]: line_xs[0] + x_shares[cur] * (line_xs[1] - line_xs[0]),
        }),
        {} as typeof x_shares
    );
    const line_ys = [175, svg_height - 75 - (bank_angle ? 0 : 100)] as [number, number];
    const ys = Object.keys(x_shares).reduce(
        (acc, cur) => ({
            ...acc,
            [cur]: line_ys[0] + y_shares[cur] * (line_ys[1] - line_ys[0]),
        }),
        {} as typeof y_shares
    );

    // bank the right, bottom, left side if bank_angle
    const bank = (bank_angle ? { l: 1, r: -1 }[direction] : 0) as -1 | 0 | 1;
    [...loop_stns.right, ...loop_stns.left].forEach(stn_id => {
        xs[stn_id] -= (ys[stn_id] - line_ys[0]) * bank;
    });
    loop_stns.bottom.forEach(stn_id => {
        xs[stn_id] -= (line_ys[1] - line_ys[0]) * bank;
    });

    const path = _linePath(loop_stns, xs, ys, bank, line_ys);

    return (
        <>
            <g id="loop" transform={`translate(${bank * 150},0)`}>
                <path stroke="var(--rmg-theme-colour)" strokeWidth={12} fill="none" d={path} strokeLinejoin="round" />
                <LoopStationGroup bank_angle={bank_angle} loop_stns={loop_stns} xs={xs} ys={ys} />
            </g>
        </>
    );
};

export default LoopSHMetro;

export const _linePath = (
    loop_stns: LoopStns,
    xs: { [stn_id: string]: number },
    ys: { [stn_id: string]: number },
    bank: -1 | 0 | 1,
    line_ys: [number, number] // get Y_BOTTOM when no stations at bottom
) => {
    const [Y_TOP, Y_BOTTOM] = line_ys;

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
            // this station in fact lays on the previous side with an extra_e dx
            const extra_e = 100;
            const extra = {
                right: [stn_pos.at(-1)![0] + extra_e, stn_pos.at(-1)![1]] as [number, number],
                bottom: [
                    stn_pos.at(-1)![0] + (Y_BOTTOM - stn_pos.at(-1)![1]) * -bank,
                    stn_pos.at(-1)![1] + (Y_BOTTOM - stn_pos.at(-1)![1]),
                ] as [number, number],
                left: [stn_pos.at(-1)![0] - extra_e, stn_pos.at(-1)![1]] as [number, number],
            };
            stn_pos.push(extra[side]);
        }
    });
    stn_pos.push(corner(stn_pos.at(-1)![0], stn_pos.at(-1)![1], xs[loop_stns.top[0]], ys[loop_stns.top[0]], 'top'));

    const path = stn_pos
        .slice(1)
        .map(([x, y]) => `L${x},${y}`)
        .join(' ');
    return `M${stn_pos[0][0]},${stn_pos[0][1]} ${path} Z`;
};

const LoopStationGroup = (props: {
    bank_angle: boolean;
    loop_stns: LoopStns;
    xs: {
        [k: string]: number;
    };
    ys: {
        [k: string]: number;
    };
}) => {
    const { bank_angle, loop_stns, xs, ys } = props;

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
        }[side] as NameDirection);
    return (
        <g id="loop_stations">
            {bank_angle
                ? Object.entries(loop_stns).map(([side, stn_ids]) =>
                      stn_ids.map(stn_id => (
                          <g key={stn_id} transform={`translate(${xs[stn_id]},${ys[stn_id]})`}>
                              <StationSHMetro
                                  stnId={stn_id}
                                  stnState={1}
                                  bank={railmap_bank[side as keyof LoopStns]}
                                  direction={railmap_direction[side as keyof LoopStns]}
                              />
                          </g>
                      ))
                  )
                : Object.entries(loop_stns).map(([side, stn_ids]) =>
                      stn_ids.map((stn_id, i) => (
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
