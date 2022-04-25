import React from 'react';
import { render as customRender, TestingProvider } from '../../test-utils';
import DownloadModal from './download-modal';
import rootReducer from '../../redux';
import { createMockAppStore } from '../../setupTests';
import { CanvasType } from '../../constants/constants';
import { fireEvent, render, screen } from '@testing-library/react';

const realStore = rootReducer.getState();
const mockStore = createMockAppStore({
    ...realStore,
});
const mockStoreWithRailMap = createMockAppStore({
    ...realStore,
    app: {
        ...realStore.app,
        canvasToShow: CanvasType.RailMap,
    },
});

const mockCallbacks = {
    onClose: jest.fn(),
};

describe('DownloadModal', () => {
    it('Can filter canvas on screen for selecting only', () => {
        customRender(<DownloadModal isOpen={true} {...mockCallbacks} />, { store: mockStoreWithRailMap });

        expect(screen.getByRole('option', { name: 'Rail map' })).toBeInTheDocument();
        expect(screen.queryByRole('option', { name: 'Destination' })).not.toBeInTheDocument();
    });

    it('Can reset canvas to download selection if on-screen canvas is changed', () => {
        // step 1: render download modal with all canvases shown on screen
        const { rerender } = render(
            <TestingProvider store={mockStore}>
                <DownloadModal isOpen={true} {...mockCallbacks} />
            </TestingProvider>
        );

        // step 2: select destination as the canvas to download
        fireEvent.change(screen.getByRole('combobox', { name: 'Canvas' }), { target: { value: 'destination' } });
        expect(screen.getByDisplayValue('Destination')).toBeInTheDocument();

        // step 3: rerender with only rail map is shown on screen
        rerender(
            <TestingProvider store={mockStoreWithRailMap}>
                <DownloadModal isOpen={true} {...mockCallbacks} />
            </TestingProvider>
        );

        // assertion - selection is reset
        expect(screen.queryByDisplayValue('Destination')).not.toBeInTheDocument();
        expect(screen.getByDisplayValue('Please select...')).toBeInTheDocument();
    });
});
