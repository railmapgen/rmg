import { checkColineValidity, getRowSpanForColine } from './coline-action';
import { BranchStyle, ColineInfo, MonoColour, StationDict } from '../../constants/constants';
import { getBranches } from '../helper/graph-theory-util';
import { CityCode } from '@railmapgen/rmg-palette-resources';
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

        expect(() =>
            checkColineValidity([['linestart', 'stn1', 'stn2', 'stn3', 'lineend']], 'stn1', 'stn2', mockStationList)
        ).toThrow('addColine():: failed');

        expect(() =>
            checkColineValidity([['linestart', 'stn1', 'stn2', 'stn3', 'lineend']], 'stn2', 'stn3', mockStationList)
        ).toThrow('addColine():: failed');

        expect(() =>
            checkColineValidity([['linestart', 'stn1', 'stn2', 'stn3', 'lineend']], 'stn1', 'stn3', mockStationList)
        ).not.toThrow();
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
                parents: ['stn1'],
                children: ['stn3'],
                branch: { left: ['through', 'stnB'], right: [] },
            },
            stn3: {
                parents: ['stn2'],
                children: ['lineend'],
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
        const branches = [
            ['linestart', 'stn1', 'stn2', 'stn3', 'stn4', 'lineend'],
            ['linestart', 'stnA', 'stnB', 'stn2'],
            ['stn3', 'stnZ', 'lineend'],
        ];

        expect(() => checkColineValidity(branches, 'stn1', 'stn2', mockStationList)).toThrow('addColine():: failed');

        expect(() => checkColineValidity(branches, 'stn2', 'stn3', mockStationList)).toThrow('addColine():: failed');

        expect(() => checkColineValidity(branches, 'stn1', 'stn3', mockStationList)).not.toThrow();

        expect(() => checkColineValidity(branches, 'stn3', 'stn4', mockStationList)).not.toThrow();

        expect(() => checkColineValidity(branches, 'stn1', 'stn4', mockStationList)).not.toThrow();

        expect(() => checkColineValidity(branches, 'stn2', 'stnZ', mockStationList)).toThrow('addColine():: failed');

        expect(() => checkColineValidity(branches, 'stn3', 'stnZ', mockStationList)).not.toThrow();

        expect(() => checkColineValidity(branches, 'stn4', 'stnZ', mockStationList)).toThrow('addColine():: failed');
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

        const coline: ColineInfo[] = [
            {
                from: 'stn3',
                to: 'stn2',
                colors: [[CityCode.Guangzhou, 'gz1', '#FFFFFF', MonoColour.black, 'ZH Name', 'EN Name']],
                display: true,
            },
            {
                from: 'stn2',
                to: 'stn4',
                colors: [[CityCode.Guangzhou, 'gz1', '#FFFFFF', MonoColour.black, 'ZH Name', 'EN Name']],
                display: true,
            },
        ];

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

        expect(mockStore.dispatch(getRowSpanForColine('stn1', 0))).toBe(1);

        expect(mockStore.dispatch(getRowSpanForColine('stn2', 0))).toBe(2);
        expect(mockStore.dispatch(getRowSpanForColine('stn3', 0))).toBe(1);

        expect(mockStore.dispatch(getRowSpanForColine('stn4', 1))).toBe(2);
        expect(mockStore.dispatch(getRowSpanForColine('stn2', 1))).toBe(1);
    });
});
