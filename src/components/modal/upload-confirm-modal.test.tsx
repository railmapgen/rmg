import React from 'react';
import UploadConfirmModal from './upload-confirm-modal';
import { createMockAppStore } from '../../setupTests';
import rootReducer from '../../redux';
import { render } from '../../test-utils';
import { fireEvent, screen } from '@testing-library/react';

jest.mock('../../index', () => ({
    reRenderApp: jest.fn(),
}));

(global.window as any).localStorage = {
    setItem: () => {},
} as any;

const realStore = rootReducer.getState();
const mockStore = createMockAppStore(realStore);

const mockCallbacks = {
    onClose: jest.fn(),
    onOpenParam: jest.fn(),
};

describe('Unit tests for UploadConfirmModal', () => {
    it('Can save uploaded param to storage and re-render app', () => {
        render(
            <UploadConfirmModal
                isOpen={true}
                cancelRef={null as any}
                uploadedParam={realStore.param}
                {...mockCallbacks}
            />,
            { store: mockStore }
        );

        // simulate confirm
        fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));

        expect(mockCallbacks.onOpenParam).toBeCalledTimes(1);
        expect(mockCallbacks.onOpenParam).toBeCalledWith(expect.any(Object));
    });
});
