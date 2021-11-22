import React from 'react';
import { mount } from 'enzyme';
import LineIcon from './line-icon';
import { MonoColour } from '../../../constants/constants';

const mockGetBBox = jest.fn();
(SVGElement.prototype as any).getBBox = mockGetBBox;

describe('Unit tests for LineIcon component', () => {
    beforeEach(() => {
        mockGetBBox.mockReturnValue({ width: 0 });
    });

    it('Can render line icon for passed station as expected', () => {
        const wrapper = mount(
            <svg>
                <LineIcon
                    lineName={['18号线', 'Line 18']}
                    foregroundColour={MonoColour.black}
                    backgroundColour="#000000"
                    stationState={-1}
                />
            </svg>
        );

        const gEl = wrapper.find('g');
        expect(gEl).toHaveLength(1);
        expect(gEl.props().fill).toBe(MonoColour.white);

        const rectEl = wrapper.find('rect');
        expect(rectEl).toHaveLength(1);
        expect(rectEl.props().fill).toBe('#aaa');
    });

    it('Can render type 1 line icon as expected', () => {
        const wrapper = mount(
            <svg>
                <LineIcon
                    lineName={['18号线', 'Line 18']}
                    foregroundColour={MonoColour.white}
                    backgroundColour="#000000"
                    stationState={1}
                />
            </svg>
        );

        const textEls = wrapper.find('text');
        expect(textEls).toHaveLength(2);

        // nameZh
        const tspanEls = textEls.at(0).find('tspan');
        expect(tspanEls).toHaveLength(2);
        expect(tspanEls.at(0).text()).toBe('18');
        expect(tspanEls.at(1).text()).toBe('号线');

        // nameEn
        expect(textEls.at(1).text()).toBe('Line 18');
    });

    it('Can render type 2 line icon as expected', () => {
        const wrapper = mount(
            <svg>
                <LineIcon
                    lineName={['APM线', 'APM Line']}
                    foregroundColour={MonoColour.white}
                    backgroundColour="#000000"
                    stationState={1}
                />
            </svg>
        );

        const textEl = wrapper.find('text');
        expect(textEl).toHaveLength(1);

        const tspanEls = textEl.find('tspan');
        expect(tspanEls).toHaveLength(2);
        // remaining part
        expect(tspanEls.at(0).text()).toBe('线');
        expect(tspanEls.at(1).text()).toBe('Line');

        // common part
        expect(textEl.text()).toContain('APM');
    });

    it('Can render type 3 line icon as expected', () => {
        const wrapper = mount(
            <svg>
                <LineIcon
                    lineName={['佛山2号线', 'Foshan Line 2']}
                    foregroundColour={MonoColour.white}
                    backgroundColour="#000000"
                    stationState={1}
                />
            </svg>
        );

        const textEls = wrapper.find('text');
        expect(textEls).toHaveLength(2);
        expect(textEls.at(0).text()).toBe('佛山2号线');
        expect(textEls.at(1).text()).toBe('Foshan Line 2');
    });
});
