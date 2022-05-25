import React from 'react';
import StationNumber from './station-number';
import { render } from '../../../test-utils';
import { screen } from '@testing-library/react';

const getScaleFromTransform = (transformAttr?: string | null) => {
    return transformAttr?.match(/scale\(([\d.]+)\)/)?.[1];
};

const mockGetBBox = jest.fn();
(SVGElement.prototype as any).getBBox = mockGetBBox;

describe('GZMTRStationNumber', () => {
    it('Can apply same scale to both line and stn numbers when both have char length 2', async () => {
        mockGetBBox.mockReturnValueOnce({ width: 20 }); // mock line num bbox
        mockGetBBox.mockReturnValueOnce({ width: 14 }); // mock stn num bbox
        render(
            <svg>
                <StationNumber lineNum="GF" stnNum="11" />
            </svg>
        );

        const lineNumScale = getScaleFromTransform(screen.getByText('GF').closest('g')?.getAttribute('transform'));
        expect(lineNumScale).toBe((15 / 20).toString());

        const stnNumScale = getScaleFromTransform(screen.getByText('11').closest('g')?.getAttribute('transform'));
        expect(stnNumScale).toBe((15 / 20).toString()); // will apply line num scale
    });

    it('Can apply different scales as expected', async () => {
        mockGetBBox.mockReturnValueOnce({ width: 10 }); // mock line num bbox
        mockGetBBox.mockReturnValueOnce({ width: 20 }); // mock stn num bbox
        render(
            <svg>
                <StationNumber lineNum="7" stnNum="01-6" />
            </svg>
        );

        const lineNumScale = getScaleFromTransform(screen.getByText('7').closest('g')?.getAttribute('transform'));
        expect(lineNumScale).toBe('1'); // will not be scaled

        const stnNumScale = getScaleFromTransform(screen.getByText('01-6').closest('g')?.getAttribute('transform'));
        expect(stnNumScale).toBe((15 / 20).toString());
    });
});
