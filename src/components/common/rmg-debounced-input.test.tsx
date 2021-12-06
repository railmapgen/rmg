import React from 'react';
import { mount } from 'enzyme';
import RmgDebouncedInput from './rmg-debounced-input';

const mockCallbacks = {
    onDebouncedChange: jest.fn(),
};

describe('Unit tests for RmgDebouncedInput component', () => {
    afterEach(() => {
        jest.clearAllTimers();
        jest.resetAllMocks();
    });

    it('Can debounce onChange event as expected', () => {
        const wrapper = mount(<RmgDebouncedInput {...mockCallbacks} />);

        const inputEl = wrapper.find('input');
        jest.useFakeTimers();

        inputEl.simulate('change', { target: { value: 'te' } });
        jest.advanceTimersByTime(200);

        inputEl.simulate('change', { target: { value: 'test' } });
        jest.advanceTimersByTime(1000);

        expect(mockCallbacks.onDebouncedChange).toBeCalledTimes(1);
        expect(mockCallbacks.onDebouncedChange).lastCalledWith('test');
    });

    it('Can re-render input field with new defaultValue without firing onChange event', () => {
        const wrapper = mount(<RmgDebouncedInput defaultValue="value-1" {...mockCallbacks} />);

        const inputEl = wrapper.find('input');
        expect(inputEl.getDOMNode<HTMLInputElement>().value).toBe('value-1');

        jest.useFakeTimers();
        wrapper.setProps({ defaultValue: 'value-2' }); // update prop
        expect(inputEl.getDOMNode<HTMLInputElement>().value).toBe('value-2');

        jest.advanceTimersByTime(1000);
        expect(mockCallbacks.onDebouncedChange).toBeCalledTimes(0);
    });

    it('Can clear input field when defaultValue is changed to undefined', () => {
        const wrapper = mount(<RmgDebouncedInput defaultValue="value-1" {...mockCallbacks} />);

        const inputEl = wrapper.find('input');
        expect(inputEl.getDOMNode<HTMLInputElement>().value).toBe('value-1');

        wrapper.setProps({ defaultValue: undefined }); // update prop
        expect(inputEl.getDOMNode<HTMLInputElement>().value).toBe('');
    });
});
