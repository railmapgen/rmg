import { ColineInfo, ShortDirection } from '../../../constants/constants';
import { find_branch_connection } from './loop-branches-shmetro';
import { get_coline_arc_stations, get_branch_past_stations } from './loop-shmetro';

describe('find_branch_connection', () => {
    const loopline = ['s1', 's2', 's3', 's4'];

    it('returns the nearest connection station on the origin side', () => {
        const raw_branch = ['linestart', 's1', 'b1', 'b2', 's3', 'lineend'];
        const result = find_branch_connection(raw_branch, loopline, ['s1', 's3']);
        expect(result).toEqual({ connection_stn: 's1', connection_is_origin: true });
    });

    it('returns the nearest connection station on the non-origin side', () => {
        const raw_branch = ['linestart', 's3', 'b1', 'b2', 's1', 'lineend'];
        const result = find_branch_connection(raw_branch, loopline, ['s1', 's3']);
        expect(result).toEqual({ connection_stn: 's3', connection_is_origin: true });
    });

    it('returns undefined when branch has no non-loop stations', () => {
        const raw_branch = ['linestart', 's1', 's2', 's3', 'lineend'];
        const result = find_branch_connection(raw_branch, loopline, ['s1', 's3']);
        expect(result).toBeUndefined();
    });

    it('returns undefined when no branch station ids match', () => {
        const raw_branch = ['linestart', 'b1', 'b2', 'lineend'];
        const result = find_branch_connection(raw_branch, loopline, ['s1', 's3']);
        expect(result).toBeUndefined();
    });

    it('handles empty raw_branch', () => {
        const result = find_branch_connection([], loopline, ['s1']);
        expect(result).toBeUndefined();
    });
});

describe('get_coline_arc_stations', () => {
    const loopline = ['s1', 's2', 's3', 's4', 's5', 's6'];

    const makeColine = (from: string, to: string, display = true): Record<string, ColineInfo> => ({
        co1: { from, to, display, colors: [] },
    });

    it('returns stations on the shorter arc between from and to', () => {
        const result = get_coline_arc_stations(loopline, makeColine('s2', 's4'));
        expect(result).toEqual(new Set(['s2', 's3', 's4']));
    });

    it('wraps around the loop for the shorter arc', () => {
        const result = get_coline_arc_stations(loopline, makeColine('s5', 's1'));
        expect(result).toEqual(new Set(['s5', 's6', 's1']));
    });

    it('returns empty set when coline display is false', () => {
        const result = get_coline_arc_stations(loopline, makeColine('s1', 's3', false));
        expect(result).toEqual(new Set());
    });

    it('returns empty set when from or to not in loopline', () => {
        const result = get_coline_arc_stations(loopline, makeColine('s1', 'unknown'));
        expect(result).toEqual(new Set());
    });

    it('returns empty set for empty coline', () => {
        const result = get_coline_arc_stations(loopline, {});
        expect(result).toEqual(new Set());
    });

    it('returns empty set for empty loopline', () => {
        const result = get_coline_arc_stations([], makeColine('s1', 's3'));
        expect(result).toEqual(new Set());
    });
});

describe('get_branch_past_stations', () => {
    const loopline = ['s1', 's2', 's3', 's4'];

    it('marks branch stations past when connection station is past', () => {
        const branches = [
            ['linestart', 's1', 's2', 's3', 's4', 'lineend'],
            ['linestart', 's1', 'b1', 'b2', 's3', 'lineend'],
        ];
        const loop_past = new Set(['s1']);
        const result = get_branch_past_stations(branches, loopline, 's2', ShortDirection.left, ['s1', 's3'], loop_past);
        expect(result).toContain('b1');
        expect(result).toContain('b2');
    });

    it('marks stations past by direction when current is on branch (direction l)', () => {
        const branches = [
            ['linestart', 's1', 's2', 's3', 's4', 'lineend'],
            ['linestart', 's1', 'b1', 'b2', 'b3', 's3', 'lineend'],
        ];
        const result = get_branch_past_stations(branches, loopline, 'b2', ShortDirection.left, ['s1', 's3'], new Set());
        expect(result).toContain('b3');
        expect(result).not.toContain('b1');
    });

    it('marks stations past by direction when current is on branch (direction r)', () => {
        const branches = [
            ['linestart', 's1', 's2', 's3', 's4', 'lineend'],
            ['linestart', 's1', 'b1', 'b2', 'b3', 's3', 'lineend'],
        ];
        const result = get_branch_past_stations(
            branches,
            loopline,
            'b2',
            ShortDirection.right,
            ['s1', 's3'],
            new Set()
        );
        expect(result).toContain('b1');
        expect(result).not.toContain('b3');
    });

    it('does nothing when branch has no non-loop stations', () => {
        const branches = [
            ['linestart', 's1', 's2', 's3', 's4', 'lineend'],
            ['linestart', 's1', 's2', 'lineend'],
        ];
        const result = get_branch_past_stations(branches, loopline, 's2', ShortDirection.left, ['s1'], new Set());
        expect(result).toHaveLength(0);
    });
});
