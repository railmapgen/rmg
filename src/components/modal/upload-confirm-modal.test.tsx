import React from 'react';
import { mount } from 'enzyme';
import UploadConfirmModal from './upload-confirm-modal';
import { createMockAppStore, TestingProvider } from '../../setupTests';
import rootReducer from '../../redux';
import { SET_CANVAS_TO_SHOW } from '../../redux/app/action';
import { reRenderApp } from '../../index';

jest.mock('../../index', () => ({
    reRenderApp: jest.fn(),
}));

global.window.rmgStorage = {
    writeFile: jest.fn().mockResolvedValue(void 0),
} as any;

const realStore = rootReducer.getState();
const mockStore = createMockAppStore(realStore);

const mockCallbacks = {
    onClose: jest.fn(),
    onOpenParam: jest.fn(),
};

describe('Unit tests for UploadConfirmModal', () => {
    it('Can save uploaded param to storage and re-render app', () => {
        const wrapper = mount(<UploadConfirmModal isOpen={true} uploadedParam={realStore.param} {...mockCallbacks} />, {
            wrappingComponent: TestingProvider,
            wrappingComponentProps: { store: mockStore },
        });

        // simulate confirm
        wrapper.find('button.chakra-button').at(1).simulate('click');

        expect(mockCallbacks.onOpenParam).toBeCalledTimes(1);
        expect(mockCallbacks.onOpenParam).toBeCalledWith(expect.any(Object));
    });
});
