import React from 'react';
import CityPicker from './city-picker';
import { mount } from 'enzyme';
import { useTranslation } from 'react-i18next';

jest.mock('../../constants/city-config', () => ({
    __esModule: true,
    cityList: [
        {
            id: 'edinburgh',
            country: 'GBSCT',
            name: {
                en: 'Edinburgh',
                'zh-Hans': '爱丁堡',
                'zh-Hant': '愛丁堡',
            },
        },
        {
            id: 'hongkong',
            country: 'HK',
            name: {
                en: 'Hong Kong',
                zh: '香港',
            },
        },
        {
            id: 'taipei',
            country: 'TW',
            name: {
                en: 'Taipei',
                zh: '台北',
            },
        },
    ],
}));

jest.mock('react-i18next', () => ({
    useTranslation: jest.fn(),
}));

const mockCallbacks = {
    onChange: jest.fn(),
};

describe('Unit tests for CityPicker component', () => {
    beforeEach(() => {
        (useTranslation as any).mockReturnValue({
            i18n: {
                language: 'zh-Hans',
                languages: ['zh-Hans', 'zh', 'en'],
            },
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Can render flag emojis (for non-Windows users) and translations as expected', () => {
        const wrapper = mount(<CityPicker />);

        const menuItems = wrapper.find('button');
        expect(menuItems).toHaveLength(3);

        expect(menuItems.at(0).text()).toContain('🏴󠁧󠁢󠁳󠁣󠁴󠁿'); // GBSCT
        expect(menuItems.at(1).text()).toContain('🇭🇰'); // HK
        expect(menuItems.at(2).text()).toContain('🏴'); // TW to be hidden

        expect(menuItems.at(0).text()).toContain('爱丁堡'); // read zh-Hans field
        expect(menuItems.at(1).text()).toContain('香港'); // read zh field
        expect(menuItems.at(2).text()).toContain('台北'); // read zh field
    });

    it('Can render OpenMoji SVG-format emoji for Windows users as expected', () => {
        const platformGetter = jest.spyOn(window.navigator, 'platform', 'get');
        platformGetter.mockReturnValue('Win64');

        const wrapper = mount(<CityPicker />);

        const flagImg = wrapper.find('button img');
        expect(flagImg).toHaveLength(3);
        expect(flagImg.at(0).props().src).toContain('.svg');
        expect(flagImg.at(1).props().src).toContain('.svg');
        expect(flagImg.at(2).props().src).toContain('.svg');
    });

    it('Can mount component with default city code as expected', () => {
        const wrapper = mount(<CityPicker defaultValueId={'hongkong' as any} />);

        expect(wrapper.find('input').getDOMNode<HTMLInputElement>().value).toBe('香港');
    });

    it('Can handle city selection as expected', () => {
        const wrapper = mount(<CityPicker {...mockCallbacks} />);

        wrapper.find('button').at(0).simulate('click');

        expect(mockCallbacks.onChange).toBeCalledTimes(1);
        expect(mockCallbacks.onChange).toBeCalledWith('edinburgh');

        expect(wrapper.find('input').getDOMNode<HTMLInputElement>().value).toBe('爱丁堡');
    });

    // TODO: isSettled
});
