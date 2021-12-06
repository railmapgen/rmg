import React from 'react';
import { mount } from 'enzyme';
import RmgLabel from './rmg-label';

describe('Unit tests for RmgLabel component', () => {
    it('Can hide label when noLabel prop is passed', () => {
        const wrapper = mount(
            <RmgLabel label="Test label" noLabel>
                <input />
            </RmgLabel>
        );

        expect(wrapper.find('label')).toHaveLength(0);
    });
});
