import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { SidePanelMode, StationDict } from '../../constants/constants';
import { createMockAppStore } from '../../setupTests';
import { render } from '../../test-utils';
import RemoveConfirmModal from './remove-confirm-modal';
import rootReducer from '../../redux';
import { SET_STATIONS_BULK } from '../../redux/param/action';

const realStore = rootReducer.getState();
const mockCallbacks = {
    onClose: jest.fn(),
};

describe('RemoveConfirmModal', () => {
    it('Can display error message if station is not removable', async () => {
        /**
         * stn1 - stn2
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
                children: ['lineend'],
                branch: { left: [], right: [] },
            },
            lineend: {
                parents: ['stn2'],
                children: [],
                branch: { left: [], right: [] },
            },
        } as any as StationDict;
        const mockStore = createMockAppStore({
            ...realStore,
            app: {
                ...realStore.app,
                selectedStation: 'stn1',
            },
            param: {
                ...realStore.param,
                stn_list: mockStationList,
            },
        });

        render(<RemoveConfirmModal isOpen={true} {...mockCallbacks} />, { store: mockStore });

        // click confirm button
        fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));

        // redux state not modified
        const actions = mockStore.getActions();
        expect(actions).toHaveLength(0);

        // display error message
        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByRole('alert')).toHaveTextContent('Unable to remove this station.');
    });

    it('Can remove station and clear states as expected', async () => {
        /**
         * stn1 - stn2 - stn3
         *         ^
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
        const mockStore = createMockAppStore({
            ...realStore,
            app: {
                ...realStore.app,
                selectedStation: 'stn2',
            },
            param: {
                ...realStore.param,
                stn_list: mockStationList,
            },
        });

        render(<RemoveConfirmModal isOpen={true} {...mockCallbacks} />, { store: mockStore });

        // click confirm button
        fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));

        // assertions
        const actions = mockStore.getActions();
        expect(actions).toContainEqual({ type: 'app/setSidePanelMode', payload: SidePanelMode.CLOSE }); // close side panel
        expect(actions).toContainEqual({ type: 'app/setSelectedStation', payload: 'linestart' }); // reset station selection
        expect(actions).toContainEqual(expect.objectContaining({ type: SET_STATIONS_BULK })); // removal of station
    });
});
