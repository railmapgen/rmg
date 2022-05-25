import React from 'react';
import OpenActions from './open-actions';
import { createMockAppStore } from '../../setupTests';
import rootReducer from '../../redux';
import { SET_GLOBAL_ALERTS } from '../../redux/app/action';
import * as utils from '../../util/utils';
import { render } from '../../test-utils';
import { fireEvent, screen, waitFor } from '@testing-library/react';

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

describe('OpenActions', () => {
    afterEach(() => {
        mockStore.clearActions();
    });

    it('Can open UploadConfirmModal if a valid file is uploaded', async () => {
        readFileAsTextSpy.mockResolvedValue(JSON.stringify({ stn_list: [], theme: [] }));
        render(<OpenActions />, { store: mockStore });

        // modal is closed
        expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();

        fireEvent.change(screen.getByTestId('file-upload'), { target: { files: [mockUploadedFile] } });

        // modal open
        await screen.findByRole('alertdialog');
    });

    it('Can display error message if invalid type of file is uploaded', async () => {
        readFileAsTextSpy.mockResolvedValue('dummy-content');
        render(<OpenActions />, { store: mockStore });

        fireEvent.change(screen.getByTestId('file-upload'), { target: { files: [mockInvalidTypeFile] } });

        const actions = mockStore.getActions();
        expect(actions).toHaveLength(1);
        expect(actions).toContainEqual({
            type: SET_GLOBAL_ALERTS,
            globalAlerts: {
                error: {
                    message: expect.stringContaining('Invalid'),
                },
            },
        });
    });

    it('Can display error message if mal format file is uploaded', async () => {
        readFileAsTextSpy.mockResolvedValue('random-content');
        render(<OpenActions />, { store: mockStore });

        fireEvent.change(screen.getByTestId('file-upload'), { target: { files: [mockMalFormatFile] } });

        await waitFor(() => expect(mockStore.getActions()).toHaveLength(1));
        const actions = mockStore.getActions();
        expect(actions).toContainEqual({
            type: SET_GLOBAL_ALERTS,
            globalAlerts: {
                error: {
                    message: expect.stringContaining('Unknown error'),
                },
            },
        });
    });
});
