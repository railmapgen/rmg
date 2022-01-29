import React from 'react';
import { mount } from 'enzyme';
import TemplateModal from './template-modal';

const mockCallbacks = {
    onClose: jest.fn(),
    onOpenParam: jest.fn(),
};

// TODO: add unit test
describe('Unit tests for TemplateModal component', () => {
    it('Can render modal as expected', () => {
        const wrapper = mount(<TemplateModal isOpen={true} {...mockCallbacks} />);

        // console.log(wrapper.html())
    });
});
