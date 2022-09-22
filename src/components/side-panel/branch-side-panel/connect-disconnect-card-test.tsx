import { render } from '../../../test-utils';
import React from 'react';
import { BranchStyle, Direction, StationDict } from '../../../constants/constants';
import { getBranches } from '../../../redux/helper/graph-theory-util';
import ConnectDisconnectCard from './connect-disconnect-card';
import rootReducer from '../../../redux';
import { createMockAppStore } from '../../../setupTests';
import { screen } from '@testing-library/react';

/**
 *                      stn6
 *                    /
 * stn1 - stn2 - stn4 - stn5
 *       \     /
 *        stn3
 */
const mockStationList = {
    linestart: {
        parents: [],
        children: ['stn1'],
        branch: { left: [], right: [] },
    },
    stn1: {
        parents: ['linestart'],
        children: ['stn2', 'stn3'],
        branch: { left: [], right: [BranchStyle.through, 'stn3'] },
    },
    stn2: {
        parents: ['stn1'],
        children: ['stn4'],
        branch: { left: [], right: [] },
    },
    stn3: {
        parents: ['stn1'],
        children: ['stn4'],
        branch: { left: [], right: [] },
    },
    stn4: {
        parents: ['stn2', 'stn3'],
        children: ['stn6', 'stn5'],
        branch: { left: [BranchStyle.through, 'stn3'], right: [BranchStyle.through, 'stn6'] },
    },
    stn5: {
        parents: ['stn4'],
        children: ['lineend'],
        branch: { left: [], right: [] },
    },
    stn6: {
        parents: ['stn4'],
        children: ['lineend'],
        branch: { left: [], right: [] },
    },
    lineend: {
        parents: ['stn6', 'stn5'],
        children: [],
        branch: { left: [BranchStyle.through, 'stn6'], right: [] },
    },
} as any as StationDict;

const branches = getBranches(mockStationList);

const realStore = rootReducer.getState();

describe('ConnectDisconnectCard', () => {
    describe('ConnectDisconnectCard - branch type 1', () => {
        const mockStore = createMockAppStore({
            ...realStore,
            app: {
                ...realStore.app,
                selectedBranch: 2,
            },
            param: {
                ...realStore.param,
                stn_list: mockStationList,
            },
            helper: {
                ...realStore.helper,
                branches,
            },
        });

        it('Can show connect button if station is not on main line', () => {
            render(<ConnectDisconnectCard direction={Direction.right} />, { store: mockStore });

            expect(screen.getByRole('button', { name: 'Connect to main line' })).toBeInTheDocument();
            expect(screen.queryByRole('button', { name: 'Disconnect from main line' })).not.toBeInTheDocument();
        });

        it('Can show disabled disconnect button is station is on main line', () => {
            render(<ConnectDisconnectCard direction={Direction.left} />, { store: mockStore });

            expect(screen.getByRole('button', { name: 'Disconnect from main line' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Disconnect from main line' })).toBeDisabled();
        });
    });

    describe('ConnectDisconnectCard - branch type 2', () => {
        const mockStore = createMockAppStore({
            ...realStore,
            app: {
                ...realStore.app,
                selectedBranch: 1,
            },
            param: {
                ...realStore.param,
                stn_list: mockStationList,
            },
            helper: {
                ...realStore.helper,
                branches,
            },
        });

        it('Can show enabled disconnect button if it is possible to disconnect', () => {
            render(<ConnectDisconnectCard direction={Direction.left} />, { store: mockStore });

            expect(screen.getByRole('button', { name: 'Disconnect from main line' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Disconnect from main line' })).not.toBeDisabled();
        });

        it('Can show disabled disconnect button if it is not possible to disconnect', () => {
            render(<ConnectDisconnectCard direction={Direction.right} />, { store: mockStore });

            expect(screen.getByRole('button', { name: 'Disconnect from main line' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Disconnect from main line' })).toBeDisabled();
        });
    });
});
