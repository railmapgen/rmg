import React from 'react';
import { mount } from 'enzyme';
import StationNumber from './station-number';

const getScaleFromTransform = (transformAttr?: string) => {
    return transformAttr?.match(/scale\(([\d.]+)\)/)?.[1];
};

const mockGetBBox = jest.fn();
(SVGElement.prototype as any).getBBox = mockGetBBox;

describe('Unit tests for StationNumber components', () => {
    it('Can apply same scale to both line and stn numbers when both have char length 2', async () => {
        mockGetBBox.mockReturnValueOnce({ width: 20 }); // mock line num bbox
        mockGetBBox.mockReturnValueOnce({ width: 14 }); // mock stn num bbox
        const wrapper = mount(
            <svg>
                <StationNumber lineNum="GF" stnNum="11" />
            </svg>
        );

        const numberGroups = wrapper.find('g > g > g');
        expect(numberGroups).toHaveLength(2);

        const lineNumScale = getScaleFromTransform(numberGroups.at(0).props()['transform']);
        expect(lineNumScale).toBe((15 / 20).toString());

        const stnNumScale = getScaleFromTransform(numberGroups.at(1).props()['transform']);
        expect(stnNumScale).toBe((15 / 20).toString()); // will apply line num scale
    });

    it('Can apply different scales as expected', async () => {
        mockGetBBox.mockReturnValueOnce({ width: 10 }); // mock line num bbox
        mockGetBBox.mockReturnValueOnce({ width: 20 }); // mock stn num bbox
        const wrapper = mount(
            <svg>
                <StationNumber lineNum="7" stnNum="01-6" />
            </svg>
        );

        const numberGroups = wrapper.find('g > g > g');
        expect(numberGroups).toHaveLength(2);

        const lineNumScale = getScaleFromTransform(numberGroups.at(0).props()['transform']);
        expect(lineNumScale).toBe('1'); // will not be scaled

        const stnNumScale = getScaleFromTransform(numberGroups.at(1).props()['transform']);
        expect(stnNumScale).toBe((15 / 20).toString());
    });
});
