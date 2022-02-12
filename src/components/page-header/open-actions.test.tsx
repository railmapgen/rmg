import React from 'react';
import { mount } from 'enzyme';
import OpenActions from './open-actions';
import { createMockAppStore, TestingProvider } from '../../setupTests';
import rootReducer from '../../redux';
import { SET_GLOBAL_ALERT } from '../../redux/app/action';
import * as utils from '../../util/utils';
import { act } from 'react-dom/test-utils';

jest.mock('../../index', () => ({
    reRenderApp: jest.fn(),
}));

global.window.rmgStorage = {
    writeFile: jest.fn().mockResolvedValue(void 0),
} as any;

const realStore = rootReducer.getState();
const mockStore = createMockAppStore(realStore);

const readFileAsTextSpy = jest.spyOn(utils, 'readFileAsText');

const mockUploadedFile = new File([], 'mock-uploaded-file.json', { type: 'application/json' });
const mockInvalidTypeFile = new File(['dummy-content'], 'invalid-file-type.txt', { type: 'text/plain' });
const mockMalFormatFile = new File(['random-content'], 'mal-format-file.json', { type: 'application/json' });

describe('Unit tests for OpenActions component', () => {
    afterEach(() => {
        mockStore.clearActions();
    });

    it('Can open UploadConfirmModal if a valid file is uploaded', async () => {
        readFileAsTextSpy.mockResolvedValue(JSON.stringify({ stn_list: [], theme: [] }));
        const wrapper = mount(<OpenActions />, { wrappingComponent: TestingProvider });

        // modal is closed
        expect(document.querySelectorAll('.chakra-portal')).toHaveLength(0);

        await act(async () => {
            await wrapper.find('input[type="file"]').simulate('change', { target: { files: [mockUploadedFile] } });
        });

        // modal open
        expect(document.querySelectorAll('.chakra-portal')).toHaveLength(1);
    });

    it('Can display error message if invalid type of file is uploaded', async () => {
        readFileAsTextSpy.mockResolvedValue('dummy-content');
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
        readFileAsTextSpy.mockResolvedValue('random-content');
        const wrapper = mount(<OpenActions />, {
            wrappingComponent: TestingProvider,
            wrappingComponentProps: { store: mockStore },
        });

        await act(async () => {
            await wrapper.find('input[type="file"]').simulate('change', { target: { files: [mockMalFormatFile] } });
        });

        const actions = mockStore.getActions();
        expect(actions).toHaveLength(1);
        expect(actions).toContainEqual({
            type: SET_GLOBAL_ALERT,
            globalAlert: {
                status: 'error',
                message: expect.stringContaining('Unknown error'),
            },
        });
    });
});
