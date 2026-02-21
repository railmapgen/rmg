import { swapBranch } from './swap-branch';
import { BranchStyle, RmgStyle, ShortDirection, StationDict } from '../../constants/constants';
import { createStore } from '../index';
import { describe, it, expect, beforeEach } from 'vitest';

describe('swapBranch', () => {
    let store: any;

    beforeEach(() => {
        // Setup initial state based on the user provided JSON example
        // Structure:
        // linestart -> iwf6 -> 39k5 (Diverge) -> cgz8 (Branch) -> lineend (Converge)
        //                                     -> cJasip (Main) -> lineend (Converge)

        const stn_list: StationDict = {
            linestart: {
                parents: [],
                children: ['iwf6'],
                num: '00',
                localisedName: { zh: '', en: '' },
                transfer: { tick_direc: ShortDirection.right, paid_area: true, groups: [{}] },
                services: [],
                loop_pivot: false,
                one_line: true,
                int_padding: 0,
                character_spacing: 0,
            },
            iwf6: {
                parents: ['linestart'],
                children: ['39k5'],
                num: '01',
                localisedName: { zh: 'Base', en: 'Base' },
                transfer: { tick_direc: ShortDirection.right, paid_area: true, groups: [{}] },
                services: [],
                loop_pivot: false,
                one_line: true,
                int_padding: 0,
                character_spacing: 0,
            },
            // Diverge Point
            '39k5': {
                parents: ['iwf6'],
                children: ['cgz8', 'cJasip'], // cgz8 (Branch) should be at index 0 according to project convention
                branch: { right: [BranchStyle.through, 'cgz8'] }, // cgz8 is currently the branch
                num: '02',
                localisedName: { zh: 'Diverge', en: 'Diverge' },
                transfer: { tick_direc: ShortDirection.right, paid_area: true, groups: [{}] },
                services: [],
                loop_pivot: false,
                one_line: true,
                int_padding: 0,
                character_spacing: 0,
            },
            // Branch Node
            cgz8: {
                parents: ['39k5'],
                children: ['lineend'],
                num: '03B',
                localisedName: { zh: 'Branch', en: 'Branch' },
                transfer: { tick_direc: ShortDirection.right, paid_area: true, groups: [{}] },
                services: [],
                loop_pivot: false,
                one_line: true,
                int_padding: 0,
                character_spacing: 0,
            },
            // Main Node
            cJasip: {
                parents: ['39k5'],
                children: ['lineend'],
                num: '03M',
                localisedName: { zh: 'Main', en: 'Main' },
                transfer: { tick_direc: ShortDirection.right, paid_area: true, groups: [{}] },
                services: [],
                loop_pivot: false,
                one_line: true,
                int_padding: 0,
                character_spacing: 0,
            },
            // Converge Point
            lineend: {
                parents: ['cgz8', 'cJasip'],
                children: [],
                branch: { left: [BranchStyle.through, 'cgz8'] }, // Indicates cgz8 is branch coming in
                num: '00',
                localisedName: { zh: '', en: '' },
                transfer: { tick_direc: ShortDirection.right, paid_area: true, groups: [{}] },
                services: [],
                loop_pivot: false,
                one_line: true,
                int_padding: 0,
                character_spacing: 0,
            },
        };

        // Mock branches state in helper to allow selection
        // Branch 0: Main Line (linestart -> iwf6 -> 39k5 -> cJasip -> lineend)
        // Branch 1: The branch segment (39k5 -> cgz8 -> lineend)
        const branches = [
            ['linestart', 'iwf6', '39k5', 'cJasip', 'lineend'],
            ['39k5', 'cgz8', 'lineend'],
        ];

        store = createStore({
            param: {
                stn_list,
                style: RmgStyle.SHMetro,
                svg_height: 450,
                svgWidth: {},
                y_pc: 40,
                padding: 5,
                branchSpacingPct: 41,
            },
            helper: {
                branches,
                // ... other helper state if needed
            },
        } as any);
    });

    it('should swap the branch definition at diverge and converge points', () => {
        // Dispatch swap on Branch 1 (cgz8)
        store.dispatch(swapBranch(1));

        const state = store.getState();
        const stnList = state.param.stn_list;
        const divergePoint = stnList['39k5'];
        const convergePoint = stnList['lineend'];

        // 1. Check Diverge Point (39k5)
        // Expected: branch.right[1] should point to children[0] which is 'cJasip'
        expect(divergePoint.branch?.right?.[1]).toBe('cJasip');

        // 2. Check Converge Point (lineend)
        // Expected: branch.left[1] should point to 'cJasip'
        expect(convergePoint.branch?.left?.[1]).toBe('cJasip');
    });

    it('should swap back when called again', () => {
        // Swap once
        store.dispatch(swapBranch(1));

        // Swap again (Branch 1 is now logically the "main" track visually, but the index remains 1 in our test context unless helper updates,
        // but swapBranch relies on `branches` state which IS NOT updated by this action directly,
        // so we can still use index 1 to refer to the 'cgz8' segment for the purpose of identifying nodes).
        store.dispatch(swapBranch(1));

        const state = store.getState();
        const stnList = state.param.stn_list;

        // Should be back to original
        expect(stnList['39k5'].branch?.right?.[1]).toBe('cgz8');
        expect(stnList['lineend'].branch?.left?.[1]).toBe('cgz8');
    });

    it('should not do anything if branch index is 0', () => {
        const originalDiverge = store.getState().param.stn_list['39k5'];
        store.dispatch(swapBranch(0));
        const newDiverge = store.getState().param.stn_list['39k5'];

        expect(newDiverge).toEqual(originalDiverge);
    });

    it('should reorder children so that the new branch is at index 0', () => {
        let state = store.getState();
        let stnList = state.param.stn_list;

        // Initial state check: 'cgz8' is the branch, so it should be at index 0
        expect(stnList['39k5'].children[0]).toBe('cgz8');

        // Swap branch
        store.dispatch(swapBranch(1));
        state = store.getState();
        stnList = state.param.stn_list;

        // Verify Branch Swapped
        expect(stnList['39k5'].branch.right[1]).toBe('cJasip');

        // Verify Children Order (New Branch 'cJasip' should be at index 0)
        expect(stnList['39k5'].children[0]).toBe('cJasip');
    });
});
