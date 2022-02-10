import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import ColourModal from './colour-modal';
import { act } from 'react-dom/test-utils';
import { TestingProvider } from '../../../setupTests';

const mockCallbacks = {
    onClose: jest.fn(),
    onUpdate: jest.fn(),
};

let wrapper: ReactWrapper;

describe('Unit tests for ColourModal component', () => {
    // TODO: add unit tests
    it('Dummy test', async () => {
        await act(async () => {
            wrapper = await mount(<ColourModal isOpen={true} {...mockCallbacks} />, {
                wrappingComponent: TestingProvider,
            });
        });
        wrapper.update();
        console.log(wrapper.html());
    });
});
