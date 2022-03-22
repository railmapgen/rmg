import React from 'react';
import { BranchStyle, StationDict } from '../../constants/constants';
import { getBranches } from '../../redux/helper/graph-theory-util';
import rootReducer from '../../redux';
import { createMockAppStore, TestingProvider } from '../../setupTests';
import { mount } from 'enzyme';
import AddStationModal from './add-station-modal';
import { SET_STATIONS_BULK } from '../../redux/param/action';

const mockStationList = {
    linestart: {
        name: ['路綫左端', 'LEFT END'],
        parents: [],
        children: ['stn1', 'stn5'],
        branch: { left: [], right: [BranchStyle.through, 'stn5'] },
    },
    stn1: {
        name: ['車站1', 'Station 1'],
        parents: ['linestart'],
        children: ['stn2'],
        branch: { left: [], right: [] },
    },
    stn2: {
        name: ['車站1', 'Station 1'],
        parents: ['stn1', 'stn5'],
        children: ['stn3'],
        branch: { left: [BranchStyle.through, 'stn5'], right: [] },
    },
    stn3: {
        name: ['車站3', 'Station 3'],
        parents: ['stn2'],
        children: ['stn4'],
        branch: { left: [], right: [] },
    },
    stn4: {
        name: ['車站4', 'Station 4'],
        parents: ['stn3'],
        children: ['lineend'],
        branch: { left: [], right: [] },
    },
    stn5: {
        name: ['車站5', 'Station 5'],
        parents: ['linestart'],
        children: ['stn2'],
        branch: { left: [], right: [] },
    },
    lineend: {
        name: ['路綫右端', 'RIGHT END'],
        parents: ['stn4'],
        children: [],
        branch: { left: [], right: [] },
    },
} as any as StationDict;

const branches = getBranches(mockStationList);

const realStore = rootReducer.getState();
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

const wrapper = mount(<AddStationModal isOpen={true} onClose={jest.fn()} />, {
    wrappingComponent: TestingProvider,
    wrappingComponentProps: { store: mockStore },
});

describe('Unit tests for AddStationModal component', () => {
    /**
     * stn1 - stn2 - stn3 - stn4
     *        /
     *   stn5
     */

    afterEach(() => {
        mockStore.clearActions();
    });

    it('Can render where dropdown as expected', () => {
        const whereDropdown = wrapper.find('select').at(0);
        expect(whereDropdown.find('option')).toHaveLength(3); // main, branch 1, new
    });

    it('Can render from and to dropdowns for main line as expected', () => {
        const fromDropdown = wrapper.find('select').at(1);
        const toDropdown = wrapper.find('select').at(2);

        // 4 stations in main line + linestart + lineend + please select
        expect(fromDropdown.find('option')).toHaveLength(7);
        expect(fromDropdown.text()).not.toContain('Station 5');

        expect(toDropdown.find('option')).toHaveLength(7);
        expect(toDropdown.text()).not.toContain('Station 5');
    });

    it('Submit button is disabled by default (without selection)', () => {
        const fromDropdown = wrapper.find('select').at(1);
        expect(fromDropdown.props().value).toBe('');

        const toDropdown = wrapper.find('select').at(2);
        expect(toDropdown.props().value).toBe('');

        const submitButton = wrapper.find('footer button');
        expect(submitButton.props().disabled).toBeTruthy();
    });

    it('Can display error if not adjacent stations are selected', () => {
        wrapper
            .find('select')
            .at(1)
            .simulate('change', { target: { value: 'stn2' } });
        wrapper.update();

        wrapper
            .find('select')
            .at(2)
            .simulate('change', { target: { value: 'stn4' } });
        wrapper.update();

        // previously selected field will be invalid
        expect(wrapper.find('select').at(1).props()['aria-invalid']).toBeTruthy();

        // currently selected field will be valid
        expect(wrapper.find('select').at(2).props()['aria-invalid']).toBeFalsy();

        // submit button is disabled
        const submitButton = wrapper.find('footer button');
        expect(submitButton.props().disabled).toBeTruthy();
        expect(submitButton.props().title).toContain('Must be previous station');
    });

    it('Can reset from and to selections when where is changed', () => {
        wrapper
            .find('select')
            .at(0)
            .simulate('change', { target: { value: 'new' } });
        wrapper.update();

        const fromDropdown = wrapper.find('select').at(1);
        const toDropdown = wrapper.find('select').at(2);

        expect(fromDropdown.props().value).toBe('');
        expect(toDropdown.props().value).toBe('');

        expect(fromDropdown.props()['aria-invalid']).toBeFalsy();
        expect(toDropdown.props()['aria-invalid']).toBeFalsy();
    });

    it('Can display error if failed at verification step', () => {
        wrapper
            .find('select')
            .at(1)
            .simulate('change', { target: { value: 'stn4' } });
        wrapper.update();

        wrapper
            .find('select')
            .at(2)
            .simulate('change', { target: { value: 'lineend' } });
        wrapper.update();

        const submitButton = wrapper.find('footer button');
        expect(submitButton.props().disabled).toBeTruthy();
        expect(submitButton.props().title).toContain('should not be open jaw from the last station');
    });

    it('Can add station in new branch as expected', () => {
        wrapper
            .find('select')
            .at(1)
            .simulate('change', { target: { value: 'stn3' } });
        wrapper.update();

        wrapper.find('footer button').simulate('click');

        const actions = mockStore.getActions();
        expect(actions).toContainEqual(expect.objectContaining({ type: SET_STATIONS_BULK }));
    });
});
