import { BranchStyle, StationDict } from '../../constants/constants';
import { getBranches } from '../../redux/helper/graph-theory-util';
import { getSidingPath, getStationYShare } from './line-diagram-utils';

/**
 *                             stn6
 *                           /
 * stn0 - stn2 - stn3 - stn5 - stn7
 *      /      \      /
 * stn1          stn4
 */
const mockStationList = {
    linestart: {
        parents: [],
        children: ['stn0', 'stn1'],
        branch: { left: [], right: [BranchStyle.through, 'stn1'] },
    },
    stn0: {
        parents: ['linestart'],
        children: ['stn2'],
        branch: { left: [], right: [] },
    },
    stn1: {
        parents: ['linestart'],
        children: ['stn2'],
        branch: { left: [], right: [] },
    },
    stn2: {
        parents: ['stn0', 'stn1'],
        children: ['stn3', 'stn4'],
        branch: { left: [BranchStyle.through, 'stn1'], right: [BranchStyle.through, 'stn4'] },
    },
    stn3: {
        parents: ['stn2'],
        children: ['stn5'],
        branch: { left: [], right: [] },
    },
    stn4: {
        parents: ['stn2'],
        children: ['stn5'],
        branch: { left: [], right: [] },
    },
    stn5: {
        parents: ['stn3', 'stn4'],
        children: ['stn6', 'stn7'],
        branch: { left: [BranchStyle.through, 'stn4'], right: [BranchStyle.through, 'stn6'] },
    },
    stn6: {
        parents: ['stn5'],
        children: ['lineend'],
        branch: { left: [], right: [] },
    },
    stn7: {
        parents: ['stn5'],
        children: ['lineend'],
        branch: { left: [], right: [] },
    },
    lineend: {
        parents: ['stn6', 'stn7'],
        children: [],
        branch: { left: [BranchStyle.through, 'stn6'], right: [] },
    },
} as any as StationDict;

const mockBranches = getBranches(mockStationList);

describe('LineDiagramUtils', () => {
    it('Can compute y share for station as expected', () => {
        expect(getStationYShare('stn0', mockBranches, mockStationList)).toBe(-1);
        expect(getStationYShare('stn1', mockBranches, mockStationList)).toBe(1);
        expect(getStationYShare('stn2', mockBranches, mockStationList)).toBe(0);
        expect(getStationYShare('stn3', mockBranches, mockStationList)).toBe(0);
        expect(getStationYShare('stn4', mockBranches, mockStationList)).toBe(1.2); // siding
        expect(getStationYShare('stn5', mockBranches, mockStationList)).toBe(0);
        expect(getStationYShare('stn6', mockBranches, mockStationList)).toBe(-1);
        expect(getStationYShare('stn7', mockBranches, mockStationList)).toBe(1);
    });

    it('Can create siding path as expected', () => {
        const actualPath = getSidingPath([
            [0, 0],
            [50, 50],
            [100, 0],
        ]);
        const expectedPath = [
            'M0,0',
            'H25', // (0 + 50) / 2
            'a6,6,0,0,1,6,6',
            'V44', // 50 - 6
            'a6,6,0,0,0,6,6',
            // H50 is removed as simplification
            'H63', // 75 - 2 * 6
            'a6,6,0,0,0,6,-6',
            'V6',
            'a6,6,0,0,1,6,-6',
            'H100',
        ].join(' ');

        expect(expectedPath).toBe(actualPath);
    });
});
