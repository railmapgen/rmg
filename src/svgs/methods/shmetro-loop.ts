import { ShortDirection, StationDict } from '../../constants/constants';

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

/**
 * Split the loopline with one branch into four sides according to left_and_right_factor and bottom_factor.
 * Note that the top side must start from the branch_stn_id.
 *
 * It assumes parameters will follow these rules:
 *     1. loopline.length > bottom_factor + left_and_right_factor * 2
 *     2. bottom_factor >= 0
 *     3. left_and_right_factor >= 0
 *     4. left_and_right_factor + bottom_factor > 0
 *
 * @param loopline The loop line aka branches[0].
 * @param branch_stn_id Branch station id.
 * @param bottom_factor How many stations the bottom side will have.
 * @param left_and_right_factor How many stations the left and right side will have.
 * @returns Each array returned should be consecutive, and when combined in top -> right -> bottom -> left order,
 * it will also be consecutive. Note that the length of right, bottom, and left can be 0.
 */
export const split_loop_stns_with_branch = (
    loopline: string[],
    branch_stn_id: string,
    bottom_factor: number,
    left_and_right_factor: number
) => {
    const top_factor = loopline.length - left_and_right_factor * 2 - bottom_factor;
    const non_undefined_loopline = [...loopline, ...loopline, ...loopline];
    const split_a = loopline.length + loopline.findIndex(val => val === branch_stn_id);
    const another_branch_stn_id = non_undefined_loopline[split_a + top_factor - 1];
    const split_b =
        loopline.length +
        loopline.findIndex(val => val === another_branch_stn_id) +
        (split_a + top_factor > loopline.length * 2 ? loopline.length : 0);
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

/**
 * Split the loopline with two branches into four sides according to left_and_right_factor and arc.
 * Note that the top side must start from one of the branch_stn_ids and end at another.
 * Also the top side will be the major or the minor arc between branch_stn_ids.
 *
 * It assumes parameters will follow these rules:
 *     1. loopline.length > the major or the minor arc length between branch_stn_ids +
 *                          left_and_right_factor * 2
 *     2. left_and_right_factor >= 0
 *
 * @param loopline The loop line aka branches[0].
 * @param branch_stn_ids Branches station id.
 * @param left_and_right_factor How many stations the left and right side will have.
 * @param arc Which arc will be the top side, the major or the minor.
 * @returns Each array returned should be consecutive, and when combined in top -> right -> bottom -> left order,
 * it will also be consecutive. Note that the length of right, bottom, and left can be 0.
 */
export const split_loop_stns_with_branches = (
    loopline: string[],
    branch_stn_ids: [string, string],
    left_and_right_factor: number,
    arc: 'major' | 'minor'
) => {
    let split_a = loopline.findIndex(val => val === branch_stn_ids[0]);
    let split_b = loopline.findIndex(val => val === branch_stn_ids[1]);
    // swap a and b if a is bigger than b
    [split_a, split_b, branch_stn_ids[0], branch_stn_ids[1]] =
        split_a > split_b
            ? [split_b, split_a, branch_stn_ids[1], branch_stn_ids[0]]
            : [split_a, split_b, branch_stn_ids[0], branch_stn_ids[1]];
    const top_a = loopline.slice(split_a, split_b + 1);
    const top_b = loopline.filter(stn => !top_a.filter(stn => !branch_stn_ids.includes(stn)).includes(stn));
    // which arc we use on the top will result to different bottom factor
    const bottom_factor =
        loopline.length -
        (arc === 'major' ? Math.max : Math.min)(top_a.length, top_b.length) -
        left_and_right_factor * 2;
    const branch_stn_id =
        arc === 'major'
            ? top_a.length > top_b.length
                ? branch_stn_ids[0]
                : branch_stn_ids[1]
            : top_a.length > top_b.length
            ? branch_stn_ids[1]
            : branch_stn_ids[0];
    return split_loop_stns_with_branch(loopline, branch_stn_id, bottom_factor, left_and_right_factor);
};

export type LoopStns = ReturnType<typeof split_loop_stns>;

/**
 * Calculate the xshares and yshares of the loop stations.
 *
 * @param loopline The loop line aka branches[0].
 * @param loop_stns Object returned from split_loop_stns.
 * @returns Values sit between 0 and 1.
 */
export const get_xshares_yshares_of_loop = (loopline: string[], loop_stns: LoopStns) => {
    const x_shares = Object.fromEntries(loopline.map(stn_id => [stn_id, -1]));
    const y_shares = Object.fromEntries(loopline.map(stn_id => [stn_id, -1]));

    const [Y_TOP, Y_BOTTOM, X_LEFT, X_RIGHT] = [0, 1, 0, 1];

    // loop's inner padding for xs
    const e = 0; // 0 <= e <= 1

    loop_stns.top.forEach((stn_id, i) => {
        x_shares[stn_id] = e / 2 + ((1 - e) / (loop_stns.top.length + 1)) * (i + 1);
        y_shares[stn_id] = Y_TOP;
    });
    loop_stns.right.forEach((stn_id, i) => {
        x_shares[stn_id] = X_RIGHT;
        y_shares[stn_id] = e / 2 + ((1 - e) / (loop_stns.right.length + 1)) * (i + 1);
    });
    loop_stns.bottom.forEach((stn_id, i) => {
        x_shares[stn_id] = 1 - e / 2 - ((1 - e) / (loop_stns.bottom.length + 1)) * (i + 1);
        y_shares[stn_id] = Y_BOTTOM;
    });
    loop_stns.left.forEach((stn_id, i) => {
        x_shares[stn_id] = X_LEFT;
        y_shares[stn_id] = 1 - e / 2 - ((1 - e) / (loop_stns.left.length + 1)) * (i + 1);
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
