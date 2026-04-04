import { ColineInfo, ShortDirection, StationDict } from '../../../constants/constants';
import {
    getBranchStnIds,
    getColineArcInfo,
    getColineOrder,
    getColineStnStates,
    resolveIndexInBranch,
    resolveIndexInTop,
} from './loop-coline-order';

const loopline = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const branches = [
    ['linestart', ...loopline, 'lineend'],
    ['linestart', 'b1', 'B'],
    ['F', 'f1', 'lineend'],
];

const stationDict = {
    linestart: { children: ['A', 'b1'] },
    A: { children: ['B'] },
    B: { children: ['C'] },
    C: { children: ['C2'] },
    D: { children: ['E'] },
    E: { children: ['F'] },
    F: { children: ['G', 'f1'] },
    G: { children: ['lineend'] },
    b1: { children: ['B'] },
    f1: { children: ['lineend'] },
    lineend: { children: [] },
} as unknown as StationDict;

const displayedColine: Record<string, ColineInfo> = {
    col1: {
        from: 'B',
        to: 'F',
        colors: [],
        display: true,
    },
    col2: {
        from: 'b1',
        to: 'B',
        colors: [],
        display: true,
    },
    col3: {
        from: 'F',
        to: 'f1',
        colors: [],
        display: true,
    },
};

describe('loop-coline-order', () => {
    it('finds repeated loop branch connection stations', () => {
        expect(getBranchStnIds(branches)).toEqual(['B', 'F']);
    });

    it('resolves displayed arc info for a loop coline', () => {
        const arc = getColineArcInfo(loopline, displayedColine, branches, stationDict);

        expect(arc).toEqual({
            colineInfo: displayedColine.col1,
            arcType: 'major',
            topStnIds: ['B', 'C', 'D', 'E', 'F'],
        });
    });

    it('returns undefined when no displayed coline matches loop-side branches', () => {
        const invalidColine: Record<string, ColineInfo> = {
            col1: {
                from: 'A',
                to: 'D',
                colors: [],
                display: true,
            },
        };

        expect(getColineArcInfo(loopline, invalidColine, branches, stationDict)).toBeUndefined();
    });

    it('builds the linearized order as left branch, top arc, then right branch', () => {
        const arc = getColineArcInfo(loopline, displayedColine, branches, stationDict);

        expect(arc).toBeDefined();
        expect(getColineOrder(branches, arc!, displayedColine)).toEqual({
            stnIds: ['b1', 'B', 'C', 'D', 'E', 'F', 'f1'],
            leftBranchEndIndex: 1,
            rightBranchBeginIndex: 6,
            leftBranchIndexInBranches: 1,
            rightBranchIndexInBranches: 2,
        });
    });

    it('marks station states in leftward travel order', () => {
        const states = getColineStnStates({
            order: {
                stnIds: ['b1', 'B', 'C', 'D', 'E', 'F', 'f1'],
                leftBranchEndIndex: 1,
                rightBranchBeginIndex: 6,
                leftBranchIndexInBranches: 1,
                rightBranchIndexInBranches: 2,
            },
            curStnId: 'B',
            direction: 'l' as ShortDirection,
        });

        expect(states).toEqual({
            b1: 1,
            B: 0,
            C: -1,
            D: -1,
            E: -1,
            F: -1,
            f1: -1,
        });
    });

    it('marks station states in rightward travel order', () => {
        const states = getColineStnStates({
            order: {
                stnIds: ['b1', 'B', 'C', 'D', 'E', 'F', 'f1'],
                leftBranchEndIndex: 1,
                rightBranchBeginIndex: 6,
                leftBranchIndexInBranches: 1,
                rightBranchIndexInBranches: 2,
            },
            curStnId: 'D',
            direction: 'r' as ShortDirection,
        });

        expect(states).toEqual({
            b1: -1,
            B: -1,
            C: -1,
            D: 0,
            E: 1,
            F: 1,
            f1: 1,
        });
    });

    it('resolves top-arc indexes with branch boundary clamping', () => {
        const order = {
            stnIds: ['b1', 'B', 'C', 'D', 'E', 'F', 'f1'],
            leftBranchEndIndex: 1,
            rightBranchBeginIndex: 6,
            leftBranchIndexInBranches: 1,
            rightBranchIndexInBranches: 2,
        };

        expect(resolveIndexInTop('b1', order)).toBe(-1);
        expect(resolveIndexInTop('B', order)).toBe(0);
        expect(resolveIndexInTop('D', order)).toBe(2);
        expect(resolveIndexInTop('F', order)).toBe(4);
        expect(resolveIndexInTop('f1', order)).toBe(5);
        expect(resolveIndexInTop('A', order)).toBeUndefined();
    });

    it('resolves branch-relative indexes with clamped top junction boundaries', () => {
        const order = {
            stnIds: ['b1', 'B', 'C', 'D', 'E', 'F', 'f1'],
            leftBranchEndIndex: 1,
            rightBranchBeginIndex: 6,
            leftBranchIndexInBranches: 1,
            rightBranchIndexInBranches: 2,
        };

        expect(resolveIndexInBranch('b1', order, 1)).toBe(0);
        expect(resolveIndexInBranch('B', order, 1)).toBe(1);
        expect(resolveIndexInBranch('D', order, 1)).toBe(1);
        expect(resolveIndexInBranch('D', order, 2)).toBe(-1);
        expect(resolveIndexInBranch('F', order, 2)).toBe(-1);
        expect(resolveIndexInBranch('f1', order, 2)).toBe(0);
        expect(resolveIndexInBranch('A', order, 1)).toBeUndefined();
    });
});
