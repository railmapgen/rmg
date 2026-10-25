// 线路图几何与拓扑算法：上海地铁环线工具。
import { ShortDirection, StationDict } from '../../constants/constants';

/**
 * 根据 `left_and_right_factor` 与 `bottom_factor` 将环线拆分为四边。
 * 该函数假设参数满足以下规则：
 *     1. `loopline.length > bottom_factor + left_and_right_factor * 2`
 *     2. `bottom_factor >= 0`
 *     3. `left_and_right_factor >= 0`
 *     4. `left_and_right_factor + bottom_factor > 0`
 *
 * @param loopline 环线，即 `branches[0]`
 * @param current_stn_id 当前车站 ID
 * @param bottom_factor 底边包含的车站数量
 * @param left_and_right_factor 左右两侧各包含的车站数量
 * @returns 各数组在按上、右、下、左顺序拼接后应保持连续，
 * 并且整体保持连续；右、下、左三边的长度均可为 0。
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
 * 根据 `left_and_right_factor` 与 `bottom_factor` 将带一条支线的环线拆为四边。
 * 注意顶边必须从 `branch_stn_id` 开始。
 *
 * 该函数假设参数满足以下规则：
 *     1. `loopline.length > bottom_factor + left_and_right_factor * 2`
 *     2. `bottom_factor >= 0`
 *     3. `left_and_right_factor >= 0`
 *     4. `left_and_right_factor + bottom_factor > 0`
 *
 * @param loopline 环线，即 `branches[0]`
 * @param branch_stn_id 分支车站 ID
 * @param bottom_factor 底边包含的车站数量
 * @param left_and_right_factor 左右两侧各包含的车站数量
 * @returns 各数组在按上、右、下、左顺序拼接后应保持连续，
 * 并且整体保持连续；右、下、左三边的长度均可为 0。
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
 * 根据 `left_and_right_factor` 与圆弧选择将带两条支线的环线拆为四边。
 * 注意顶边必须从一个 `branch_stn_ids` 元素开始，并在另一个元素结束。
 * 顶边取 `branch_stn_ids` 之间的大弧或小弧。
 *
 * 该函数假设参数满足以下规则：
 *     1. `loopline.length >` `branch_stn_ids` 之间的大弧或小弧长度 `+`
 *        `left_and_right_factor * 2`
 *     2. `left_and_right_factor >= 0`
 *
 * @param loopline 环线，即 `branches[0]`
 * @param branch_stn_ids 分支车站 ID 列表
 * @param left_and_right_factor 左右两侧各包含的车站数量
 * @param arc 顶边采用大弧还是小弧
 * @returns 各数组在按上、右、下、左顺序拼接后应保持连续，
 * 并且整体保持连续；右、下、左三边的长度均可为 0。
 */
export const split_loop_stns_with_branches = (
    loopline: string[],
    branch_stn_ids: [string, string],
    left_and_right_factor: number,
    arc: 'major' | 'minor'
) => {
    let split_a = loopline.findIndex(val => val === branch_stn_ids[0]);
    let split_b = loopline.findIndex(val => val === branch_stn_ids[1]);
    // 若 a 大于 b 则交换两者
    [split_a, split_b, branch_stn_ids[0], branch_stn_ids[1]] =
        split_a > split_b
            ? [split_b, split_a, branch_stn_ids[1], branch_stn_ids[0]]
            : [split_a, split_b, branch_stn_ids[0], branch_stn_ids[1]];
    const top_a = loopline.slice(split_a, split_b + 1);
    const top_b = loopline.filter(stn => !top_a.filter(stn => !branch_stn_ids.includes(stn)).includes(stn));
    // 顶边选用不同圆弧会得到不同的底部系数
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
 * 计算环线车站的横向与纵向份额。
 *
 * @param loopline 环线，即 `branches[0]`
 * @param loop_stns `split_loop_stns` 返回的对象
 * @returns 返回值介于 0 和 1 之间
 */
export const get_xshares_yshares_of_loop = (loopline: string[], loop_stns: LoopStns) => {
    const x_shares = Object.fromEntries(loopline.map(stn_id => [stn_id, -1]));
    const y_shares = Object.fromEntries(loopline.map(stn_id => [stn_id, -1]));

    const [Y_TOP, Y_BOTTOM, X_LEFT, X_RIGHT] = [0, 1, 0, 1];

    // 环线横向内边距
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
 * 获取环线中的枢轴车站。
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
