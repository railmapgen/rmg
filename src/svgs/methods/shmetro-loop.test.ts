import { ShortDirection, StationDict } from '../../constants/constants';
import {
    split_loop_stns,
    split_loop_stns_with_branch,
    split_loop_stns_with_branches,
    get_pivot_stations,
} from './shmetro-loop';

const table = Array.from(new Array(20), (x, i) => i + 2)
    .map(i => [...Array(i).keys()].map(i => String.fromCharCode(i + 97)))
    .map(loopline => loopline.map(stn_id => ({ loopline: loopline, current_stn_id: stn_id })))
    .flat()
    .map(_ =>
        Array.from(new Array(_.loopline.length - 1), (x, i) => i + 1).map(bottom_factor => ({
            ..._,
            bottom_factor: bottom_factor,
            left_and_right_factor: Math.floor((_.loopline.length - bottom_factor * 2) / 2),
        }))
    )
    .flat()
    .filter(_ => _.bottom_factor > 0 && _.left_and_right_factor >= 0 && _.bottom_factor + _.left_and_right_factor > 0);

const branch_table = [
    {
        loopline: ['a', 'b', 'c', 'd', 'e'],
        branch_stn_id: 'b',
        bottom_factor: 1,
        left_and_right_factor: 1,
    },
    {
        loopline: ['a', 'b', 'c', 'd', 'e'],
        branch_stn_id: 'b',
        bottom_factor: 0,
        left_and_right_factor: 1,
    },
    {
        loopline: ['a', 'b', 'c', 'd', 'e'],
        branch_stn_id: 'b',
        bottom_factor: 1,
        left_and_right_factor: 0,
    },
    {
        loopline: ['a', 'b', 'c', 'd', 'e'],
        branch_stn_id: 'b',
        bottom_factor: 2,
        left_and_right_factor: 0,
    },
    {
        loopline: ['a', 'b', 'c', 'd', 'e'],
        branch_stn_id: 'b',
        bottom_factor: 0,
        left_and_right_factor: 2,
    },
    {
        loopline: ['a', 'b', 'c', 'd', 'e'],
        branch_stn_id: 'd',
        bottom_factor: 1,
        left_and_right_factor: 1,
    },
    {
        loopline: ['a', 'b', 'c', 'd', 'e'],
        branch_stn_id: 'd',
        bottom_factor: 0,
        left_and_right_factor: 1,
    },
    {
        loopline: ['a', 'b', 'c', 'd', 'e'],
        branch_stn_id: 'd',
        bottom_factor: 1,
        left_and_right_factor: 0,
    },
    {
        loopline: ['a', 'b', 'c', 'd', 'e'],
        branch_stn_id: 'd',
        bottom_factor: 2,
        left_and_right_factor: 0,
    },
    {
        loopline: ['a', 'b', 'c', 'd', 'e'],
        branch_stn_id: 'd',
        bottom_factor: 0,
        left_and_right_factor: 2,
    },
];

const branches_table = [
    {
        loopline: ['a', 'b', 'c', 'd', 'e'],
        branch_stn_ids: ['b', 'd'],
        left_and_right_factor: 0,
        arc: 'major',
    },
    {
        loopline: ['a', 'b', 'c', 'd', 'e'],
        branch_stn_ids: ['b', 'd'],
        left_and_right_factor: 0,
        arc: 'minor',
    },
    {
        loopline: ['a', 'b', 'c', 'd', 'e'],
        branch_stn_ids: ['a', 'c'],
        left_and_right_factor: 0,
        arc: 'major',
    },
    {
        loopline: ['a', 'b', 'c', 'd', 'e'],
        branch_stn_ids: ['c', 'a'],
        left_and_right_factor: 0,
        arc: 'major',
    },
    {
        loopline: ['a', 'b', 'c', 'd', 'e'],
        branch_stn_ids: ['b', 'c'],
        left_and_right_factor: 0,
        arc: 'major',
    },
    {
        loopline: ['a', 'b', 'c', 'd', 'e'],
        branch_stn_ids: ['a', 'e'],
        left_and_right_factor: 0,
        arc: 'minor',
    },
    {
        loopline: ['a', 'b', 'c', 'd', 'e', 'f'],
        branch_stn_ids: ['b', 'e'],
        left_and_right_factor: 1,
        arc: 'major',
    },
    {
        loopline: ['a', 'b', 'c', 'd', 'e', 'f'],
        branch_stn_ids: ['e', 'b'],
        left_and_right_factor: 1,
        arc: 'major',
    },
    {
        loopline: ['a', 'b', 'c', 'd', 'e', 'f'],
        branch_stn_ids: ['d', 'c'],
        left_and_right_factor: 1,
        arc: 'minor',
    },
] as {
    loopline: string[];
    branch_stn_ids: [string, string];
    left_and_right_factor: number;
    arc: 'major' | 'minor';
}[];

describe('Unit tests for loop methods', () => {
    it.each(table)(
        'Correctly split loop stations',
        ({ loopline, current_stn_id, bottom_factor, left_and_right_factor }) => {
            const loop_stns = split_loop_stns(loopline, current_stn_id, bottom_factor, left_and_right_factor);

            // every side is valid
            expect(loop_stns.top.length).toBeGreaterThanOrEqual(1);
            expect(loop_stns.right.length).toBeGreaterThanOrEqual(left_and_right_factor);
            expect(loop_stns.bottom.length).toBeGreaterThanOrEqual(bottom_factor);
            expect(loop_stns.left.length).toBeGreaterThanOrEqual(left_and_right_factor);

            // Each array returned should be consecutive, and when combined in top -> right -> bottom -> left order,
            // it will also be consecutive. Note that the length of right, bottom, and left can be 0.
            const _ = [...loop_stns.top, ...loop_stns.right, ...loop_stns.left, ...loop_stns.bottom];
            expect(_.length).toBe(loopline.length);

            // expect arrays to be equal ignoring order
            expect(_.sort()).toEqual(loopline.sort());
        }
    );

    it.each(branch_table)(
        'Correctly split loop stations with one branch',
        ({ loopline, branch_stn_id, bottom_factor, left_and_right_factor }) => {
            const loop_stns = split_loop_stns_with_branch(
                loopline,
                branch_stn_id,
                bottom_factor,
                left_and_right_factor
            );

            // every side is valid
            expect(loop_stns.top.length).toBeGreaterThanOrEqual(1);
            expect(loop_stns.right.length).toBeGreaterThanOrEqual(left_and_right_factor);
            expect(loop_stns.bottom.length).toBeGreaterThanOrEqual(bottom_factor);
            expect(loop_stns.left.length).toBeGreaterThanOrEqual(left_and_right_factor);

            // top side will start from branch_stn_id
            expect(loop_stns.top.at(0)).toBe(branch_stn_id);

            // Each array returned should be consecutive, and when combined in top -> right -> bottom -> left order,
            // it will also be consecutive. Note that the length of right, bottom, and left can be 0.
            const _ = [...loop_stns.top, ...loop_stns.right, ...loop_stns.left, ...loop_stns.bottom];
            expect(_.length).toBe(loopline.length);

            // expect arrays to be equal ignoring order
            expect(_.sort()).toEqual(loopline.sort());
        }
    );

    it.each(branches_table)(
        'Correctly split loop stations with two branches',
        ({ loopline, branch_stn_ids, left_and_right_factor, arc }) => {
            const loop_stns = split_loop_stns_with_branches(loopline, branch_stn_ids, left_and_right_factor, arc);

            // every side is valid
            expect(loop_stns.top.length).toBeGreaterThanOrEqual(1);
            expect(loop_stns.right.length).toBeGreaterThanOrEqual(left_and_right_factor);
            expect(loop_stns.bottom.length).toBeGreaterThanOrEqual(0);
            expect(loop_stns.left.length).toBeGreaterThanOrEqual(left_and_right_factor);

            // top side will start from branch_stn_ids[0] and end at branch_stn_ids[1]
            expect(loop_stns.top.at(0)).toMatch(new RegExp(branch_stn_ids.join('|')));
            expect(loop_stns.top.at(-1)).toMatch(new RegExp(branch_stn_ids.join('|')));

            // Each array returned should be consecutive, and when combined in top -> right -> bottom -> left order,
            // it will also be consecutive. Note that the length of right, bottom, and left can be 0.
            const _ = [...loop_stns.top, ...loop_stns.right, ...loop_stns.left, ...loop_stns.bottom];
            expect(_.length).toBe(loopline.length);

            // expect arrays to be equal ignoring order
            expect(_.sort()).toEqual(loopline.sort());
        }
    );

    it('Correctly get pivot stations', () => {
        const branches = [['a', 'b', 'c', 'd', 'e']];
        const stn_list = Object.fromEntries(branches[0].map(stn_id => [stn_id, { loop_pivot: false }])) as StationDict;

        let pivots: string[];

        // no error when no pivot is set
        pivots = get_pivot_stations(branches, ShortDirection.left, stn_list, 'b');
        expect(pivots.length).toBe(0);

        // one pivot is not supported
        // we just make sure no error is returned
        stn_list['c'].loop_pivot = true;
        pivots = get_pivot_stations(branches, ShortDirection.left, stn_list, 'b');
        expect(pivots.length).toBe(1);
        expect(pivots).toEqual(['c']);
        pivots = get_pivot_stations(branches, ShortDirection.right, stn_list, 'b');
        expect(pivots.length).toBe(2);
        expect(pivots).toEqual(['c', 'c']);

        stn_list['e'].loop_pivot = true;
        pivots = get_pivot_stations(branches, ShortDirection.left, stn_list, 'b');
        expect(pivots.length).toBe(2);
        expect(pivots).toEqual(['e', 'c']);
        pivots = get_pivot_stations(branches, ShortDirection.right, stn_list, 'b');
        expect(pivots.length).toBe(2);
        expect(pivots).toEqual(['c', 'e']);

        pivots = get_pivot_stations(branches, ShortDirection.left, stn_list, 'e');
        expect(pivots.length).toBe(2);
        expect(pivots).toEqual(['c', 'e']);
        pivots = get_pivot_stations(branches, ShortDirection.right, stn_list, 'e');
        expect(pivots.length).toBe(2);
        expect(pivots).toEqual(['c', 'e']);
    });
});
