import React from 'react';
import StationSHMetro from '../station/station-shmetro';
import { NameDirection, StationSHMetro as StationSHMetroIndoor } from '../../../indoor/station-shmetro';
import { CanvasType, Services, ShortDirection } from '../../../../constants/constants';
import { useAppSelector } from '../../../../redux';
import { split_loop_stns, LoopStns, get_xshares_yshares_of_loop } from '../../methods/shmetro-loop';

const LoopSHMetro = (props: { bank_angle: boolean; canvas: CanvasType.RailMap | CanvasType.Indoor }) => {
    const { bank_angle, canvas } = props;
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

    const line_ys = [175, svg_height - 125] as [number, number];
    const ys = Object.keys(x_shares).reduce(
        (acc, cur) => ({
            ...acc,
            [cur]: line_ys[0] + y_shares[cur] * (line_ys[1] - line_ys[0]),
        }),
        {} as typeof y_shares
    );
    const line_xs = [
        // in railmap and bank, we need to add extra padding for the 45-degree angle
        (svg_width[canvas] * padding) / 100 + (bank_angle && canvas === CanvasType.RailMap ? 100 : 0),
        svg_width[canvas] * (1 - padding / 100) - (bank_angle && canvas === CanvasType.RailMap ? 100 : 0),
    ] as [number, number];
    const xs = Object.keys(x_shares).reduce(
        (acc, cur) => ({
            ...acc,
            [cur]: line_xs[0] + x_shares[cur] * (line_xs[1] - line_xs[0]),
        }),
        {} as typeof x_shares
    );

    // bank the right, bottom, left side if bank_angle
    const bank = (bank_angle ? { l: 1, r: -1 }[direction] : 0) as -1 | 0 | 1;
    [...loop_stns.right, ...loop_stns.left].forEach(stn_id => {
        xs[stn_id] -= (ys[stn_id] - line_ys[0]) * bank;
    });
    loop_stns.bottom.forEach(stn_id => {
        xs[stn_id] -= (line_ys[1] - line_ys[0]) * bank;
    });

    const path = _linePath(loop_stns, xs, ys, bank, [...line_xs, ...line_ys], direction);

    return (
        <>
            <g id="loop" transform={`translate(${((line_ys[1] - line_ys[0]) * bank) / 2},0)`}>
                <path stroke="var(--rmg-theme-colour)" strokeWidth={12} fill="none" d={path} strokeLinejoin="round" />
                <LoopStationGroup canvas={canvas} loop_stns={loop_stns} xs={xs} ys={ys} />
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
}) => {
    const { canvas, loop_stns, xs, ys } = props;
    const { current_stn_idx: current_stn_id } = useAppSelector(store => store.param);

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
            {canvas === CanvasType.RailMap &&
                Object.entries(loop_stns).map(([side, stn_ids]) =>
                    stn_ids.map(stn_id => (
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
