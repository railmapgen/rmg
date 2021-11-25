import React from 'react';
import { mount } from 'enzyme';
import StationSecondaryName from './station-secondary-name';

const mockGetBBox = jest.fn();
(SVGElement.prototype as any).getBBox = mockGetBBox;

const onUpdate = jest.fn();

const mockBBox = { x: -30, width: 59 } as SVGRect;

describe('Unit tests for StationSecondaryName component', () => {
    beforeEach(() => {
        mockGetBBox.mockReturnValueOnce(mockBBox);
    });

    it('Can shift parentheses to expected position', () => {
        const wrapper = mount(
            <svg>
                <StationSecondaryName stnName={['1号航站楼', 'Terminal 1']} onUpdate={onUpdate} />
            </svg>
        );

        expect(onUpdate).toBeCalledTimes(1);
        expect(onUpdate).toBeCalledWith(mockBBox);

        const leftParenthesis = wrapper.find('text').at(0);
        expect(leftParenthesis.text()).toBe('(');
        expect(leftParenthesis.props()['x']).toBe(-33); // x - 3

        const rightParenthesis = wrapper.find('text').at(1);
        expect(rightParenthesis.text()).toBe(')');
        expect(rightParenthesis.props().x).toBe(32); // width + x + 3
    });
});
