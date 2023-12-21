import {
    checkColineValidity,
    getRowSpanForColine,
    removeColineColor,
    verifyAreSelectionsConsecutive,
} from './coline-action';
import { BranchStyle, ColineInfo, StationDict } from '../../constants/constants';
import { getBranches } from '../helper/graph-theory-util';
import { MonoColour } from '@railmapgen/rmg-palette-resources';
import rootReducer from '../index';
import { createMockAppStore } from '../../setupTests';

const realStore = rootReducer.getState();

describe('Unit tests for coline action', () => {
    it('Coline-check-validity-single-mainline', () => {
        /**
         * stn1 - stn2 - stn3
         *  ^
         */
        const mockStationList = {
            linestart: {
                parents: [],
                children: ['stn1'],
                branch: { left: [], right: [] },
            },
            stn1: {
                parents: ['linestart'],
                children: ['stn2'],
                branch: { left: [], right: [] },
            },
            stn2: {
                parents: ['stn1'],
                children: ['stn3'],
                branch: { left: [], right: [] },
            },
            stn3: {
                parents: ['stn2'],
                children: ['lineend'],
                branch: { left: [], right: [] },
            },
            lineend: {
                parents: ['stn3'],
                children: [],
                branch: { left: [], right: [] },
            },
        } as any as StationDict;
        const branches = getBranches(mockStationList);

        const mockStore = createMockAppStore({
            ...realStore,
            param: {
                ...realStore.param,
                stn_list: mockStationList,
            },
            helper: {
                ...realStore.helper,
                branches,
            },
        });

        expect(() => mockStore.dispatch(checkColineValidity('stn1', 'stn2'))).toThrow(
            /addColine():: main|branch check failed for .?/
        );

        expect(() => mockStore.dispatch(checkColineValidity('stn2', 'stn3'))).toThrow(
            /addColine():: main|branch check failed for .?/
        );

        expect(() => mockStore.dispatch(checkColineValidity('stn1', 'stn3'))).not.toThrow();
    });

    it('Coline-check-validity-multiple-branch-lines', () => {
        /**
         * stnA - stnB
         *             \
         *        stn1 - stn2 - stn3 - stn4
         *         ^                 \
         *                             stnZ
         *
         * Coline between any of stn1, stn3, stn4 and stn3 - stnZ should be allowed.
         */
        const mockStationList = {
            linestart: {
                parents: [],
                children: ['stnA', 'stn1'],
                branch: { left: [], right: ['through', 'stnA'] },
            },
            stn1: {
                parents: ['linestart'],
                children: ['stn2'],
                branch: { left: [], right: [] },
            },
            stn2: {
                parents: ['stnB', 'stn1'],
                children: ['stn3'],
                branch: { left: ['through', 'stnB'], right: [] },
            },
            stn3: {
                parents: ['stn2'],
                children: ['stn4', 'stnZ'],
                branch: { left: [], right: ['through', 'stnZ'] },
            },
            stn4: {
                parents: ['stn3'],
                children: ['lineend'],
                branch: { left: [], right: [] },
            },
            stnA: {
                parents: ['linestart'],
                children: ['stnB'],
                branch: { left: [], right: [] },
            },
            stnB: {
                parents: ['stnA'],
                children: ['stn2'],
                branch: { left: [], right: [] },
            },
            stnZ: {
                parents: ['stn3'],
                children: ['lineend'],
                branch: { left: [], right: [] },
            },
            lineend: {
                parents: ['stn4', 'stnZ'],
                children: [],
                branch: { left: ['through', 'stnZ'], right: [] },
            },
        } as any as StationDict;
        const branches = getBranches(mockStationList);

        const mockStore = createMockAppStore({
            ...realStore,
            param: {
                ...realStore.param,
                stn_list: mockStationList,
            },
            helper: {
                ...realStore.helper,
                branches,
            },
        });

        expect(() => mockStore.dispatch(checkColineValidity('stn1', 'stn2'))).toThrow(
            /addColine():: main|branch check failed for .?/
        );

        expect(() => mockStore.dispatch(checkColineValidity('stn2', 'stn3'))).toThrow(
            /addColine():: main|branch check failed for .?/
        );

        expect(() => mockStore.dispatch(checkColineValidity('stn3', 'stn4'))).not.toThrow();

        expect(() => mockStore.dispatch(checkColineValidity('stn1', 'stn4'))).not.toThrow();

        expect(() => mockStore.dispatch(checkColineValidity('stn1', 'stn4'))).not.toThrow();

        expect(() => mockStore.dispatch(checkColineValidity('stn2', 'stnZ'))).toThrow(
            /addColine():: main|branch check failed for .?/
        );

        expect(() => mockStore.dispatch(checkColineValidity('stn3', 'stnZ'))).not.toThrow();

        expect(() => mockStore.dispatch(checkColineValidity('stn4', 'stnZ'))).toThrow(
            /addColine():: main|branch check failed for .?/
        );
    });

    it('Can calculate row span as expected', () => {
        /**
         * stn1 - stn2 = stn3
         *      /
         * stn4
         */
        const mockStationList = {
            linestart: {
                parents: [],
                children: ['stn1', 'stn4'],
                branch: { left: [], right: [BranchStyle.through, 'stn4'] },
            },
            stn1: {
                parents: ['linestart'],
                children: ['stn2'],
                branch: { left: [], right: [] },
            },
            stn2: {
                parents: ['stn1', 'stn4'],
                children: ['stn3'],
                branch: { left: [BranchStyle.through, 'stn4'], right: [] },
            },
            stn3: {
                parents: ['stn2'],
                children: ['lineend'],
                branch: { left: [], right: [] },
            },
            stn4: {
                parents: ['linestart'],
                children: ['stn2'],
                branch: { left: [], right: [] },
            },
            lineend: {
                parents: ['stn3'],
                children: [],
                branch: { left: [], right: [] },
            },
        } as any as StationDict;

        const branches = getBranches(mockStationList);

        const coline: Record<string, ColineInfo> = {
            col1: {
                from: 'stn3',
                to: 'stn2',
                colors: [['guangzhou', 'gz1', '#FFFFFF', MonoColour.black, 'ZH Name', 'EN Name']],
                display: true,
            },
            col2: {
                from: 'stn2',
                to: 'stn4',
                colors: [['guangzhou', 'gz1', '#FFFFFF', MonoColour.black, 'ZH Name', 'EN Name']],
                display: true,
            },
        };

        const mockStore = createMockAppStore({
            ...realStore,
            param: {
                ...realStore.param,
                stn_list: mockStationList,
                coline,
            },
            helper: {
                ...realStore.helper,
                branches,
            },
        });

        expect(mockStore.dispatch(getRowSpanForColine('stn1', 0))).toEqual([0, undefined]);

        expect(mockStore.dispatch(getRowSpanForColine('stn2', 0))).toEqual([2, 'col1']);
        expect(mockStore.dispatch(getRowSpanForColine('stn3', 0))).toEqual([0, undefined]);

        expect(mockStore.dispatch(getRowSpanForColine('stn4', 1))).toEqual([2, 'col2']);
        expect(mockStore.dispatch(getRowSpanForColine('stn2', 1))).toEqual([0, undefined]);
    });

    it('Can verify whether selected stations are consecutive as expected', () => {
        /**
         * stn1 - stn2 - stn3
         */
        const mockStationList = {
            linestart: {
                parents: [],
                children: ['stn1'],
                branch: { left: [], right: [] },
            },
            stn1: {
                parents: ['linestart'],
                children: ['stn2'],
                branch: { left: [], right: [] },
            },
            stn2: {
                parents: ['stn1'],
                children: ['stn3'],
                branch: { left: [], right: [] },
            },
            stn3: {
                parents: ['stn2'],
                children: ['lineend'],
                branch: { left: [], right: [] },
            },
            lineend: {
                parents: ['stn3'],
                children: [],
                branch: { left: [], right: [] },
            },
        } as any as StationDict;
        const branches = getBranches(mockStationList);

        const mockStore = createMockAppStore({
            ...realStore,
            param: {
                ...realStore.param,
                stn_list: mockStationList,
            },
            helper: {
                ...realStore.helper,
                branches,
            },
        });

        expect(mockStore.dispatch(verifyAreSelectionsConsecutive(['stn1', 'stn3'], 0))).toBeFalsy();
        expect(mockStore.dispatch(verifyAreSelectionsConsecutive(['stn1', 'stn2', 'stn3'], 0))).toBeTruthy();
    });

    it('Can remove colour from a sharing track as expected', () => {
        /**
         * stn1 = stn2
         */
        const mockStationList = {
            linestart: {
                parents: [],
                children: ['stn1'],
                branch: { left: [], right: [] },
            },
            stn1: {
                parents: ['linestart'],
                children: ['stn2'],
                branch: { left: [], right: [] },
            },
            stn2: {
                parents: ['stn1'],
                children: ['lineend'],
                branch: { left: [], right: [] },
            },
            lineend: {
                parents: ['stn2'],
                children: [],
                branch: { left: [], right: [] },
            },
        } as any as StationDict;
        const branches = getBranches(mockStationList);

        const coline: Record<string, ColineInfo> = {
            col1: {
                from: 'stn1',
                to: 'stn2',
                colors: [
                    ['guangzhou', 'gz1', '#AAAAAA', MonoColour.black, 'ZH Name 1', 'EN Name 1'],
                    ['guangzhou', 'gz2', '#BBBBBB', MonoColour.black, 'ZH Name 2', 'EN Name 2'],
                ],
                display: true,
            },
        };

        const mockStore = createMockAppStore({
            ...realStore,
            param: {
                ...realStore.param,
                stn_list: mockStationList,
                coline,
            },
            helper: {
                ...realStore.helper,
                branches,
            },
        });

        mockStore.dispatch(removeColineColor('col1', 1));

        const actions = mockStore.getActions();
        expect(actions).toHaveLength(1);
        expect(actions[0].type).toBe('param/setColine');
        expect(actions[0].payload).toHaveProperty('col1');
        expect(actions[0].payload.col1.colors).toHaveLength(1);
        expect(actions[0].payload.col1.colors[0]).toContain('gz1');
    });

    it('Can remove entire coline if removing the last colour', () => {
        /**
         * stn1 = stn2
         */
        const mockStationList = {
            linestart: {
                parents: [],
                children: ['stn1'],
                branch: { left: [], right: [] },
            },
            stn1: {
                parents: ['linestart'],
                children: ['stn2'],
                branch: { left: [], right: [] },
            },
            stn2: {
                parents: ['stn1'],
                children: ['lineend'],
                branch: { left: [], right: [] },
            },
            lineend: {
                parents: ['stn2'],
                children: [],
                branch: { left: [], right: [] },
            },
        } as any as StationDict;
        const branches = getBranches(mockStationList);

        const coline: Record<string, ColineInfo> = {
            col1: {
                from: 'stn1',
                to: 'stn2',
                colors: [['guangzhou', 'gz1', '#AAAAAA', MonoColour.black, 'ZH Name 1', 'EN Name 1']],
                display: true,
            },
        };

        const mockStore = createMockAppStore({
            ...realStore,
            param: {
                ...realStore.param,
                stn_list: mockStationList,
                coline,
            },
            helper: {
                ...realStore.helper,
                branches,
            },
        });

        mockStore.dispatch(removeColineColor('col1', 0));

        const actions = mockStore.getActions();
        expect(actions).toHaveLength(1);
        expect(actions[0].type).toBe('param/setColine');
        expect(actions[0].payload).not.toHaveProperty('col1');
    });
});
