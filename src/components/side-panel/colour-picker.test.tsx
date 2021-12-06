import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import ColourPicker from './colour-picker';
import { CityCode } from '../../constants/city-config';
import { act } from 'react-dom/test-utils';

jest.doMock('../../constants/colours/hongkong', () => ({
    __esModule: true,
    default: [
        {
            id: 'twl',
            name: {
                en: 'Tsuen Wan Line',
                zh: '荃灣綫',
            },
            colour: '#E2231A',
        },
        {
            id: 'ktl',
            name: {
                en: 'Kwun Tong Line',
                zh: '觀塘綫',
            },
            colour: '#00AF41',
            fg: '#000',
        },
    ],
}));

jest.doMock('../../constants/colours/guangzhou', () => ({
    __esModule: true,
    default: [
        {
            id: 'gz1',
            name: {
                en: 'Line 1',
                zh: '1号线',
            },
            colour: '#F3D03E',
            fg: '#000',
        },
        {
            id: 'gz2',
            name: {
                en: 'Line 2',
                zh: '2号线',
            },
            colour: '#00629B',
        },
    ],
}));

const mockCallbacks = {
    onChange: jest.fn(),
};

let wrapper: ReactWrapper;

describe('Unit tests for ColourPicker component', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Mount ColourPicker component', async () => {
        await act(async () => {
            wrapper = await mount(<ColourPicker city={CityCode.HongKong} {...mockCallbacks} />);
        });
        wrapper.update();
    });

    it('Can render line badges inside menu item as expected', () => {
        const menuItems = wrapper.find('button');
        expect(menuItems).toHaveLength(2);

        const lineBadge1 = menuItems.at(0).find('RmgLineBadge') as ReactWrapper<any>;
        expect(lineBadge1).toHaveLength(1);
        expect(lineBadge1.props().name).toBe('Tsuen Wan Line');
        expect(lineBadge1.props().fg).toBe('#fff');
        expect(lineBadge1.props().bg).toBe('#E2231A');

        const lineBadge2 = menuItems.at(1).find('RmgLineBadge') as ReactWrapper<any>;
        expect(lineBadge2).toHaveLength(1);
        expect(lineBadge2.props().name).toBe('Kwun Tong Line');
        expect(lineBadge2.props().fg).toBe('#000');
        expect(lineBadge2.props().bg).toBe('#00AF41');
    });

    it('Can search item by other languages as expected', () => {
        jest.useFakeTimers();
        wrapper.find('input').simulate('change', { target: { value: '荃灣' } });
        act(() => {
            jest.advanceTimersByTime(1000);
        });
        wrapper.update();
        expect(wrapper.find('button')).toHaveLength(1);
        expect(wrapper.find('button').text()).toBe('Tsuen Wan Line');

        wrapper.find('input').simulate('change', { target: { value: '觀塘' } });
        act(() => {
            jest.advanceTimersByTime(1000);
        });
        wrapper.update();
        expect(wrapper.find('button')).toHaveLength(1);
        expect(wrapper.find('button').text()).toBe('Kwun Tong Line');
    });

    it('Can handle select item action as expected', () => {
        wrapper.find('button').simulate('click');

        expect(wrapper.find('input').getDOMNode<HTMLInputElement>().value).toBe('Kwun Tong Line');

        expect(mockCallbacks.onChange).toBeCalledTimes(1);
        expect(mockCallbacks.onChange).toBeCalledWith('ktl', '#00AF41', '#000');
    });

    it('Can reload list of palette when city prop is changed', async () => {
        await act(async () => {
            await wrapper.setProps({ city: CityCode.Guangzhou });
        });
        wrapper.update();

        expect(wrapper.find('input').getDOMNode<HTMLInputElement>().value).toBe('');

        const listItemBtns = wrapper.find('button');
        expect(listItemBtns).toHaveLength(2);
        expect(listItemBtns.at(0).text()).toBe('Line 1');
        expect(listItemBtns.at(1).text()).toBe('Line 2');
    });

    it('Can handle invalid city prop as expected', async () => {
        await act(async () => {
            await wrapper.setProps({ city: undefined });
        });
        wrapper.update();

        // empty list of palette (lines)
        expect(wrapper.find('button')).toHaveLength(0);
    });
});
