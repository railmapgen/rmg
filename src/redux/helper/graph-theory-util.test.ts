import { getBranches, getRoutes, getTpo } from './graph-theory-util';
import { BranchStyle } from '../../constants/constants';
import { mockSimpleStationList } from '../../setupTests';

describe('Unit tests for graph theory utilities', () => {
    it('Can calculate branches as expected', () => {
        const branches = getBranches(mockSimpleStationList);
        console.log(branches);
        expect(branches).toHaveLength(2);
        expect(branches[0]).toEqual(['linestart', 'stn0', 'stn1', 'stn2', 'lineend']);
        expect(branches[1]).toEqual(['stn1', 'stn3', 'stn4', 'lineend']);
    });

    it('Can calculate routes (through train) as expected', () => {
        const routes = getRoutes(mockSimpleStationList);
        console.log(routes);
        expect(routes).toHaveLength(2);
        expect(routes[0]).toEqual(['linestart', 'stn0', 'stn1', 'stn2', 'lineend']);
        expect(routes[1]).toEqual(['linestart', 'stn0', 'stn1', 'stn3', 'stn4', 'lineend']);
    });

    it('Can calculate routes (non-through train) as expected', () => {
        const routes = getRoutes({
            ...mockSimpleStationList,
            stn1: {
                ...mockSimpleStationList.stn1,
                branch: { left: [], right: [BranchStyle.nonThrough, 'stn3'] },
            },
        });
        expect(routes).toHaveLength(2);
        expect(routes[0]).toEqual(['linestart', 'stn0', 'stn1', 'stn2', 'lineend']);
        expect(routes[1]).toEqual(['stn1', 'stn3', 'stn4', 'lineend']);
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
