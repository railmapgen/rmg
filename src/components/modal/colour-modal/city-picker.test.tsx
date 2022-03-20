import React from 'react';
import CityPicker from './city-picker';
import { mount, ReactWrapper } from 'enzyme';
import { useTranslation } from 'react-i18next';
import { act } from 'react-dom/test-utils';

jest.mock('@railmapgen/rmg-palette-resources', () => ({
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
            flagEmoji: '🇭🇰',
            flagSvg: '1F1ED-1F1F0.svg',
        },
        {
            id: 'taipei',
            country: 'TW',
            name: {
                en: 'Taipei',
                zh: '台北',
            },
            flagEmoji: '🇹🇼',
            flagSvg: '1F1F9-1F1FC.svg',
        },
    ],

    countryList: [
        {
            id: 'GBSCT',
            name: {
                en: 'Scotland',
                zh: '苏格兰',
            },
            flagEmoji: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
            flagSvg: '1F3F4-E0067-E0062-E0073-E0063-E0074-E007F.svg',
        },
        {
            id: 'HK',
            name: {
                en: 'Hong Kong',
                zh: '香港',
            },
            flagEmoji: '🇭🇰',
            flagSvg: '1F1ED-1F1F0.svg',
        },
        {
            id: 'TW',
            name: {
                en: 'Taiwan',
            },
            flagEmoji: '🇹🇼',
            flagSvg: '1F1F9-1F1FC.svg',
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
        expect(menuItems.at(2).text()).toContain('🏴'); // TW to be censored

        expect(menuItems.at(0).text()).toContain('爱丁堡'); // read zh-Hans field
        expect(menuItems.at(1).text()).toContain('香港'); // read zh field
        expect(menuItems.at(2).text()).toContain('台北'); // read zh field
    });

    it('Can render OpenMoji SVG-format emoji for Windows users as expected', async () => {
        const platformGetter = jest.spyOn(window.navigator, 'platform', 'get');
        platformGetter.mockReturnValue('Win64');

        let wrapper: ReactWrapper;
        await act(async () => {
            wrapper = mount(<CityPicker />);
        });

        // FIXME: how do i get rid of this typecheck error
        // @ts-ignore
        const menuItems = wrapper.find('button');
        expect(menuItems).toHaveLength(3);
        expect(menuItems.find('FlagSvgEmoji')).toHaveLength(2); // flag svg to be displayed for 2 of the cities
        expect(menuItems.find('span').text()).toContain('🏴'); // TW to be censored
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
