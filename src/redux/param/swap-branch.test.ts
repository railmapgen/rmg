// 测试：验证交换主线和支线所覆盖的线路参数与编辑操作行为。
import { swapBranch } from './swap-branch';
import { BranchStyle, RmgStyle, ShortDirection, StationDict } from '../../constants/constants';
import { createStore } from '../index';
import { describe, it, expect, beforeEach } from 'vitest';

describe('swapBranch', () => {
    let store: any;

    beforeEach(() => {
        // 根据用户提供的 JSON 示例初始化状态
        // 结构：
        // linestart -> iwf6 -> 39k5（分叉点）-> cgz8（支线）-> lineend（汇合点）
        //                                      -> cJasip（主线）-> lineend（汇合点）

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
            // 分叉点
            '39k5': {
                parents: ['iwf6'],
                children: ['cgz8', 'cJasip'], // 按项目约定，支线 cgz8 应位于索引 0
                branch: { right: [BranchStyle.through, 'cgz8'] }, // 当前 cgz8 是支线
                num: '02',
                localisedName: { zh: 'Diverge', en: 'Diverge' },
                transfer: { tick_direc: ShortDirection.right, paid_area: true, groups: [{}] },
                services: [],
                loop_pivot: false,
                one_line: true,
                int_padding: 0,
                character_spacing: 0,
            },
            // 支线节点
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
            // 主线节点
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
            // 汇合点
            lineend: {
                parents: ['cgz8', 'cJasip'],
                children: [],
                branch: { left: [BranchStyle.through, 'cgz8'] }, // 表示汇入的支线是 cgz8
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

        // 模拟 helper 中的分支状态以支持选择
        // 支线 0：主线（linestart -> iwf6 -> 39k5 -> cJasip -> lineend）
        // 支线 1：支线段（39k5 -> cgz8 -> lineend）
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
                // 如有需要，可继续补充其他 helper 状态
            },
        } as any);
    });

    it('should swap the branch definition at diverge and converge points', () => {
        // 对支线 1（cgz8）派发交换操作
        store.dispatch(swapBranch(1));

        const state = store.getState();
        const stnList = state.param.stn_list;
        const divergePoint = stnList['39k5'];
        const convergePoint = stnList['lineend'];

        // 1. 检查分叉点 39k5
        // 预期：`branch.right[1]` 应指向 `children[0]`，即 `cJasip`
        expect(divergePoint.branch?.right?.[1]).toBe('cJasip');

        // 2. 检查汇合点 lineend
        // 预期：`branch.left[1]` 应指向 `cJasip`
        expect(convergePoint.branch?.left?.[1]).toBe('cJasip');
    });

    it('should swap back when called again', () => {
        // 交换一次
        store.dispatch(swapBranch(1));

        // 再次交换。支线 1 在视觉上已成为“主线”，但在测试上下文中索引仍为 1，
        // 因为 `swapBranch` 依赖的 `branches` 状态不会由该操作直接更新；
        // 因此仍可用索引 1 定位原来的 cgz8 区段并识别节点。
        store.dispatch(swapBranch(1));

        const state = store.getState();
        const stnList = state.param.stn_list;

        // 应恢复原始状态
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

        // 初始状态检查：`cgz8` 是支线，应位于索引 0
        expect(stnList['39k5'].children[0]).toBe('cgz8');

        // 交换支线
        store.dispatch(swapBranch(1));
        state = store.getState();
        stnList = state.param.stn_list;

        // 验证支线已交换
        expect(stnList['39k5'].branch.right[1]).toBe('cJasip');

        // 验证子节点顺序：新支线 `cJasip` 应位于索引 0
        expect(stnList['39k5'].children[0]).toBe('cJasip');
    });
});
