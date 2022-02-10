import React from 'react';
import { mount } from 'enzyme';
import FlagSvgEmoji from './flag-svg-emoji';
import { waitForComponentToPaint } from '../../../setupTests';

jest.doMock('@railmapgen/rmg-palette-resources/flags/1F1ED-1F1F0.svg', () => ({
    __esModule: true,
    default: 'mock-svg-src-url',
}));

describe('Unit tests for FlagSvgEmoji component', () => {
    it('Can resolute expect src url for SVG version of emoji', async () => {
        const wrapper = mount(<FlagSvgEmoji countryCode="HK" svgFilename="1F1ED-1F1F0.svg" />);
        await waitForComponentToPaint(wrapper);

        const img = wrapper.find('img');
        expect(img).toHaveLength(1);
        expect(img.props().src).toBe('mock-svg-src-url');
    });

    it('Can return empty component when src url not found', async () => {
        const wrapper = mount(<FlagSvgEmoji countryCode="RANDOM" svgFilename="random.svg" />);
        await waitForComponentToPaint(wrapper);

        expect(wrapper.isEmptyRender()).toBeTruthy();
    });
});
