import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import RmgButtonGroup from './rmg-button-group';

const mockSelections = [
    {
        label: 'Local',
        value: 'local',
        disabled: true,
    },
    {
        label: 'Express',
        value: 'express',
    },
    {
        label: 'Direct',
        value: 'direct',
    },
];

const mockCallbacks = {
    onChange: jest.fn(),
};

describe('Unit tests for RmgButtonGroup component', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Can render single select button group as expected', () => {
        const wrapper = mount(<RmgButtonGroup selections={mockSelections} defaultValue="local" {...mockCallbacks} />);

        // contains 3 buttons
        const buttons = wrapper.find('Button') as ReactWrapper<any>;
        expect(buttons).toHaveLength(3);

        // selected button
        const localBtn = buttons.at(0);
        expect(localBtn.text()).toBe('Local');
        expect(localBtn.props().variant).toBe('solid');

        // unselected button
        const expressBtn = buttons.at(1);
        expect(expressBtn.text()).toBe('Express');
        expect(expressBtn.props().variant).toBe('outline');

        // unselected button
        const directBtn = buttons.at(2);
        expect(directBtn.text()).toBe('Direct');
        expect(directBtn.props().variant).toBe('outline');

        expressBtn.find('button').simulate('click');
        expect(mockCallbacks.onChange).toBeCalledTimes(1);
        expect(mockCallbacks.onChange).toBeCalledWith('express');
    });

    it('Can render multi select button group as expected', () => {
        const wrapper = mount(
            <RmgButtonGroup
                selections={mockSelections}
                defaultValue={['local', 'express']}
                multiSelect
                {...mockCallbacks}
            />
        );

        const buttons = wrapper.find('Button') as ReactWrapper<any>;
        expect(buttons).toHaveLength(3);
        expect(buttons.at(0).props().variant).toBe('solid');
        expect(buttons.at(1).props().variant).toBe('solid');
        expect(buttons.at(2).props().variant).toBe('outline');

        // disabled selection is not toggleable
        buttons.at(0).find('button').simulate('click');
        expect(mockCallbacks.onChange).toBeCalledTimes(0);

        buttons.at(2).find('button').simulate('click');
        expect(mockCallbacks.onChange).toBeCalledTimes(1);
        expect(mockCallbacks.onChange).toBeCalledWith(['local', 'express', 'direct']);
    });
});
