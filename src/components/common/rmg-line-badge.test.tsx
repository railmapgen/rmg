import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import RmgLineBadge from './rmg-line-badge';
import { MonoColour } from '../../constants/constants';

describe('Unit test for RmgLineBadge component', () => {
    it('Can render badge with short name as expected', () => {
        const wrapper = mount(
            <RmgLineBadge name={['18号线', 'Line 18']} fg={MonoColour.white} bg="#000000" showShortName />
        );

        const badge = wrapper.find('Badge') as ReactWrapper<any>;
        expect(badge.text()).toBe('18');
        expect(badge.props().color).toBe(MonoColour.white);
        expect(badge.props().bg).toBe('#000000');
    });

    it('Can render badge with long name as expected', () => {
        const wrapper = mount(<RmgLineBadge name="Tsuen Wan Line" fg={MonoColour.black} bg="#ffffff" />);

        const badge = wrapper.find('Badge') as ReactWrapper<any>;
        expect(badge.text()).toBe('Tsuen Wan Line');
        expect(badge.props().color).toBe(MonoColour.black);
        expect(badge.props().bg).toBe('#ffffff');
    });
});
