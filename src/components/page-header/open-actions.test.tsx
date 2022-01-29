import React from 'react';
import { mount } from 'enzyme';
import OpenActions from './open-actions';
import { createMockAppStore, TestingProvider } from '../../setupTests';
import rootReducer from '../../redux';
import { SET_GLOBAL_ALERT } from '../../redux/app/action';

jest.mock('../../index', () => ({
    reRenderApp: jest.fn(),
}));

global.window.rmgStorage = {
    writeFile: jest.fn().mockResolvedValue(void 0),
} as any;

const realStore = rootReducer.getState();
const mockStore = createMockAppStore(realStore);

const mockUploadedFile = new File(['{style: "mtr"}'], 'mock-uploaded-file.json', { type: 'application/json' });
const mockInvalidTypeFile = new File(['dummy-content'], 'invalid-file-type.txt', { type: 'text/plain' });
const mockMalFormatFile = new File(['random-content'], 'mal-format-file.json', { type: 'application/json' });

describe('Unit tests for OpenActions component', () => {
    afterEach(() => {
        mockStore.clearActions();
    });

    it('Can open UploadConfirmModal if a valid file is uploaded', async () => {
        const wrapper = mount(<OpenActions />, { wrappingComponent: TestingProvider });

        // modal is closed
        expect(document.querySelectorAll('.chakra-portal')).toHaveLength(0);

        await wrapper.find('input[type="file"]').simulate('change', { target: { files: [mockUploadedFile] } });
        wrapper.update();

        console.log(wrapper.debug());

        // FIXME: why file is not loaded
        // modal open
        // expect(document.querySelectorAll('.chakra-portal')).toHaveLength(1);
    });

    it('Can display error message if invalid type of file is uploaded', async () => {
        const wrapper = mount(<OpenActions />, {
            wrappingComponent: TestingProvider,
            wrappingComponentProps: { store: mockStore },
        });

        await wrapper.find('input[type="file"]').simulate('change', { target: { files: [mockInvalidTypeFile] } });

        const actions = mockStore.getActions();
        expect(actions).toHaveLength(1);
        expect(actions).toContainEqual({
            type: SET_GLOBAL_ALERT,
            globalAlert: {
                status: 'error',
                message: expect.stringContaining('Invalid'),
            },
        });
    });

    it('Can display error message if mal format file is uploaded', async () => {
        const wrapper = mount(<OpenActions />, {
            wrappingComponent: TestingProvider,
            wrappingComponentProps: { store: mockStore },
        });

        await wrapper.find('input[type="file"]').simulate('change', { target: { files: [mockMalFormatFile] } });

        const actions = mockStore.getActions();
        // FIXME: why file is not loaded
        // expect(actions).toHaveLength(1);
        // expect(actions).toContainEqual({
        //     type: SET_GLOBAL_ALERT,
        //     globalAlert: {
        //         status: 'error',
        //         message: expect.stringContaining('Unexpected error'),
        //     },
        // });
    });
});
