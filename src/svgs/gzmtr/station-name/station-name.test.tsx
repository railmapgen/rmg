import React from 'react';
import StationName from './station-name';
import { render } from '../../../test-utils';

const mockGetBBox = jest.fn();
(SVGElement.prototype as any).getBBox = mockGetBBox;

const onUpdate = jest.fn();

const mockBBox = { width: 70, height: 30 } as DOMRect;

describe('GZMTRStationName', () => {
    beforeEach(() => {
        mockGetBBox.mockReturnValueOnce(mockBBox);
    });

    it('Can invoke onChange event when name passed through props is updated', () => {
        render(
            <svg>
                <StationName stnName={['体育西路', 'Tiyu Xilu']} onUpdate={onUpdate} />
            </svg>
        );

        expect(onUpdate).toBeCalledTimes(1);
        expect(onUpdate).toBeCalledWith(mockBBox);
    });
});
