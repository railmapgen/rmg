import React from 'react';
import StationSidePanelFooter from './station-side-panel-footer';
import { mount, ReactWrapper } from 'enzyme';
import { createMockAppStore, TestingProvider } from '../../../setupTests';
import { SidePanelMode, StationDict } from '../../../constants/constants';
import { SET_GLOBAL_ALERT, SET_SELECTED_STATION, SET_SIDE_PANEL_MODE } from '../../../redux/app/action';
import rootReducer from '../../../redux';
import { SET_STATIONS_BULK } from '../../../redux/param/action';

const realStore = rootReducer.getState();

describe('Unit tests for StationSidePanelFooter component', () => {
    it('Can display error message if station is not removable', () => {
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

        const wrapper = mount(<StationSidePanelFooter />, {
            wrappingComponent: TestingProvider,
            wrappingComponentProps: { store: mockStore },
        });

        // click remove button
        const removeBtn = wrapper.find('HStack button').at(1);
        expect(removeBtn.text()).toBe('Remove');
        removeBtn.simulate('click');
        wrapper.update();

        // assert delete confirmation modal is open
        const modal = wrapper.find('RemoveConfirmModal') as ReactWrapper<any>;
        expect(modal.props().isOpen).toBeTruthy();

        // click confirm button
        const confirmBtn = modal.find('button').last();
        expect(confirmBtn.text()).toBe('Confirm');
        confirmBtn.simulate('click');
        wrapper.update();

        // assert error message
        const actions = mockStore.getActions();
        expect(actions).toHaveLength(1);
        expect(actions).toContainEqual({
            type: SET_GLOBAL_ALERT,
            globalAlert: { status: 'error', message: expect.stringContaining('Unable to remove') },
        });
    });

    it('Can remove station and clear states as expected', () => {
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

        const wrapper = mount(<StationSidePanelFooter />, {
            wrappingComponent: TestingProvider,
            wrappingComponentProps: { store: mockStore },
        });

        // click remove button
        wrapper.find('HStack button').at(1).simulate('click');
        wrapper.update();

        // click confirm button
        wrapper.find('RemoveConfirmModal button').last().simulate('click');
        wrapper.update();

        // assertions
        const actions = mockStore.getActions();
        expect(actions).toContainEqual({ type: SET_SIDE_PANEL_MODE, sidePanelMode: SidePanelMode.CLOSE }); // close side panel
        expect(actions).toContainEqual({ type: SET_SELECTED_STATION, selectedStation: 'linestart' }); // reset station selection
        expect(actions).toContainEqual(expect.objectContaining({ type: SET_STATIONS_BULK })); // removal of station
    });
});
