import { ShortDirection, StationDict } from '../../../constants/constants';

/**
 * Split the loopline into four sides according to left_and_right_factor and bottom_factor.
 * It assumes parameters will follow these rules:
 *     1. loopline.length > bottom_factor + left_and_right_factor * 2
 *     2. bottom_factor >= 0
 *     3. left_and_right_factor >= 0
 *     4. left_and_right_factor + bottom_factor > 0
 *
 * @param loopline The loop line aka branches[0].
 * @param current_stn_id Current station id.
 * @param bottom_factor How many stations the bottom side will have.
 * @param left_and_right_factor How many stations the left and right side will have.
 * @returns Each array returned should be consecutive, and when combined in top -> right -> bottom -> left order,
 * it will also be consecutive. Note that the length of right, bottom, and left can be 0.
 */
export const split_loop_stns = (
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

export type LoopStns = ReturnType<typeof split_loop_stns>;

/**
 * Calculate the xshares and yshares of the loop stations.
 *
 * @param loopline The loop line aka branches[0].
 * @param loop_stns Object returned from split_loop_stns.
 * @returns Values sit between -1 and 1.
 */
export const get_xshares_yshares_of_loop = (loopline: string[], loop_stns: LoopStns) => {
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

/**
 * Get pivot stations from the loop line.
 */
export const get_pivot_stations = (
    branches: string[][],
    direction: ShortDirection,
    stn_list: StationDict,
    current_stn_id: string
) => {
    const loop_line = branches[0].filter(stn_id => !['linestart', 'lineend'].includes(stn_id));
    const _ = [...loop_line, ...loop_line, ...loop_line];
    const non_undefined_loop_line = direction === 'r' ? _ : _.reverse();
    const current_stn_idx = non_undefined_loop_line.findIndex(stn_id => current_stn_id === stn_id) + loop_line.length;
    return non_undefined_loop_line
        .slice(current_stn_idx + 1)
        .filter(stn_id => stn_list[stn_id].loop_pivot)
        .slice(undefined, 2);
};
