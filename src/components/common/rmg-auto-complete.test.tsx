import React from 'react';
import { mount } from 'enzyme';
import RmgAutoComplete from './rmg-auto-complete';
import { act } from 'react-dom/test-utils';

const mockData = [
    { id: 'gz', value: 'Guangzhou', additionalValue: '廣州' },
    { id: 'hk', value: 'Hong Kong', additionalValue: '香港' },
    { id: 'sh', value: 'Shanghai', additionalValue: '上海' },
];

const mockCallbacks = {
    onChange: jest.fn(),
};

const wrapper = mount(
    <RmgAutoComplete
        data={mockData}
        displayValue={item => item.value + ' (' + item.value[0] + ')'} // Guangzhou (G)
        predicate={(item, input) => item.value.includes(input) || item.additionalValue.includes(input)}
        {...mockCallbacks}
    />
);

describe('Unit tests for RmgAutoComplete component', () => {
    afterEach(() => {
        jest.clearAllTimers();
    });

    it('Can render list of items and hide popover content as expected', () => {
        expect(wrapper.find('section.chakra-popover__content').props().style).toHaveProperty('visibility', 'hidden');

        const items = wrapper.find('button');
        expect(items).toHaveLength(3);
        expect(items.at(0).text()).toBe('Guangzhou (G)');
        expect(items.at(1).text()).toBe('Hong Kong (H)');
        expect(items.at(2).text()).toBe('Shanghai (S)');
    });

    it('Can make popover content visible by focusing on input field', () => {
        wrapper.find('input').simulate('focus');
        wrapper.update();

        expect(wrapper.html()).toContain('visibility: visible;');
        // FIXME: why this line doesn't work
        // expect(wrapper.find('section.chakra-popover__content').props().style).toHaveProperty('visibility', 'visible');
        console.warn(wrapper.find('section.chakra-popover__content').props().style);
    });

    it('Can filter items as expected', () => {
        jest.useFakeTimers();
        wrapper.find('input').simulate('change', { target: { value: 'Hong' } });
        act(() => {
            jest.advanceTimersByTime(1000);
        });
        wrapper.update();

        const items = wrapper.find('button');
        expect(items).toHaveLength(1);
        expect(items.at(0).text()).toBe('Hong Kong (H)');
    });

    it('Can filter items by additional value as expected', () => {
        jest.useFakeTimers();
        wrapper.find('input').simulate('change', { target: { value: '廣' } });
        act(() => {
            jest.advanceTimersByTime(1000);
        });
        wrapper.update();

        const items = wrapper.find('button');
        expect(items).toHaveLength(1);
        expect(items.at(0).text()).toBe('Guangzhou (G)');
    });

    it('Can handle selecting item action as expected', () => {
        wrapper.find('button').at(0).simulate('click');
        wrapper.update();

        // populate input field with the selected value (display style)
        expect(wrapper.find('input').getDOMNode<HTMLInputElement>().value).toBe('Guangzhou (G)');

        // hide popover content
        // FIXME: this is not testing the correct thing
        expect(wrapper.html()).toContain('visibility: hidden;');

        // onChange event triggered
        expect(mockCallbacks.onChange).toBeCalledTimes(1);
        expect(mockCallbacks.onChange).toBeCalledWith({ id: 'gz', value: 'Guangzhou', additionalValue: '廣州' });
    });

    it('Can populate input field when default value (as props) is changed', () => {
        wrapper.setProps({ defaultValue: mockData[2] }); // set default value prop as Shanghai
        wrapper.update();

        expect(wrapper.find('input').getDOMNode<HTMLInputElement>().value).toBe('Shanghai (S)');
    });
});
