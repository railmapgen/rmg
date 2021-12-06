import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import WindowHeader from './window-header';
import * as config from '../util/config';
import { Environments } from '../util/config';
import { TestingProvider } from '../setupTests';

describe('Unit tests for WindowHeader component', () => {
    it('Can show DEV badge as expected', () => {
        jest.spyOn(config, 'getEnvironment').mockReturnValue(Environments.DEV);
        const wrapper = mount(<WindowHeader />, { wrappingComponent: TestingProvider });

        const badge = wrapper.find('Badge') as ReactWrapper<any>;
        expect(badge.text()).toBe('DEV');
        expect(badge.props().colorScheme).toBe('red');
    });

    it('Can show UAT badge as expected', () => {
        jest.spyOn(config, 'getEnvironment').mockReturnValue(Environments.UAT);
        const wrapper = mount(<WindowHeader />, { wrappingComponent: TestingProvider });

        const badge = wrapper.find('Badge') as ReactWrapper<any>;
        expect(badge.text()).toBe('UAT');
        expect(badge.props().colorScheme).toBe('orange');
    });

    it('Can show PRD badge with version as expected', () => {
        jest.spyOn(config, 'getEnvironment').mockReturnValue(Environments.PRD);
        jest.spyOn(config, 'getVersion').mockReturnValue('1.2.3');
        const wrapper = mount(<WindowHeader />, { wrappingComponent: TestingProvider });

        const badge = wrapper.find('Badge') as ReactWrapper<any>;
        expect(badge.text()).toBe('1.2.3');
        expect(badge.props().colorScheme).toBe('green');
    });
});
