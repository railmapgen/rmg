import { getBranches, getRoutes, getTpo } from './graph-theory-util';
import { BranchStyle, StationDict } from '../../constants/constants';

/**
 *     stn1 - stn2 - stn3
 *             /
 * stn4 - stn5
 *
 * [stn4, stn2] is a branch
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
        parents: ['stn1', 'stn5'],
        children: ['stn3'],
        branch: { left: [BranchStyle.through, 'stn5'], right: [] },
    },
    stn3: {
        parents: ['stn2'],
        children: ['lineend'],
        branch: { left: [], right: [] },
    },
    stn4: {
        parents: ['linestart'],
        children: ['stn5'],
        branch: { left: [], right: [] },
    },
    stn5: {
        parents: ['stn4'],
        children: ['stn2'],
        branch: { left: [], right: [] },
    },
    lineend: {
        parents: ['stn3'],
        children: [],
        branch: { left: [], right: [] },
    },
} as any as StationDict;

describe('Unit tests for graph theory utilities', () => {
    it('Can calculate branches as expected', () => {
        const branches = getBranches(mockStationList);
        expect(branches).toHaveLength(2);
        expect(branches[0]).toEqual(['linestart', 'stn1', 'stn2', 'stn3', 'lineend']);
        expect(branches[1]).toEqual(['linestart', 'stn4', 'stn5', 'stn2']);
    });

    it('Can calculate routes (through train) as expected', () => {
        const routes = getRoutes(mockStationList);
        expect(routes).toHaveLength(2);
        expect(routes[0]).toEqual(['linestart', 'stn1', 'stn2', 'stn3', 'lineend']);
        expect(routes[1]).toEqual(['linestart', 'stn4', 'stn5', 'stn2', 'stn3', 'lineend']);
    });

    it('Can calculate routes (non-through train) as expected', () => {
        const routes = getRoutes({
            ...mockStationList,
            stn2: {
                ...mockStationList.stn2,
                branch: { left: [BranchStyle.nonThrough, 'stn5'], right: [] },
            },
        });
        expect(routes).toHaveLength(2);
        expect(routes[0]).toEqual(['linestart', 'stn1', 'stn2', 'stn3', 'lineend']);
        expect(routes[1]).toEqual(['linestart', 'stn4', 'stn5', 'stn2']);
    });

    it('Can calculate tpo for line without branches as expected', () => {
        const mockBranches = [['linestart', '1', '2', 'lineend']];
        expect(getTpo(mockBranches)).toEqual(['1', '2']);
    });

    it('Can calculate tpo for line with branches as expected', () => {
        const mockBranches = [
            ['linestart', '1', '2', 'lineend'],
            ['linestart', '3', '2'],
            ['2', '4', 'lineend'],
        ];
        expect(getTpo(mockBranches)).toEqual(['1', '3', '2', '4']);
    });
});
