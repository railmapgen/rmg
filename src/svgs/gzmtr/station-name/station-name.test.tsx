import React from 'react';
import { mount } from 'enzyme';
import StationName from './station-name';

const mockGetBBox = jest.fn();
(SVGElement.prototype as any).getBBox = mockGetBBox;

const onUpdate = jest.fn();

const mockBBox = { width: 70, height: 30 } as DOMRect;

describe('Unit tests for StationName component', () => {
    beforeEach(() => {
        mockGetBBox.mockReturnValueOnce(mockBBox);
    });

    it('Can invoke onChange event when name passed through props is updated', () => {
        mount(
            <svg>
                <StationName stnName={['体育西路', 'Tiyu Xilu']} onUpdate={onUpdate} />
            </svg>
        );

        expect(onUpdate).toBeCalledTimes(1);
        expect(onUpdate).toBeCalledWith(mockBBox);
    });
});
