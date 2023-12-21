import { render } from '../../test-utils';
import DownloadModal from './download-modal';
import rootReducer from '../../redux';
import { createTestStore } from '../../setupTests';
import { CanvasType } from '../../constants/constants';
import { act, fireEvent, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { setCanvasToShow } from '../../redux/app/app-slice';

const realStore = rootReducer.getState();

const mockCallbacks = {
    onClose: vi.fn(),
};

describe('DownloadModal', () => {
    it('Can filter canvas on screen for selecting only', () => {
        const mockStore = createTestStore({
            app: {
                ...realStore.app,
                canvasToShow: [CanvasType.RailMap],
            },
        });
        render(<DownloadModal isOpen={true} {...mockCallbacks} />, { store: mockStore });

        expect(screen.getByRole('option', { name: 'Rail map' })).toBeInTheDocument();
        expect(screen.queryByRole('option', { name: 'Destination' })).not.toBeInTheDocument();
    });

    it('Can reset canvas to download selection if on-screen canvas is changed', async () => {
        // step 1: render download modal with all canvases shown on screen
        const mockStore = createTestStore();
        render(<DownloadModal isOpen={true} {...mockCallbacks} />, { store: mockStore });

        // step 2: select destination as the canvas to download
        fireEvent.change(screen.getByRole('combobox', { name: 'Canvas' }), { target: { value: 'destination' } });
        expect(screen.getByDisplayValue('Destination')).toBeInTheDocument();

        // step 3: rerender with only rail map is shown on screen
        await act(async () => {
            mockStore.dispatch(setCanvasToShow([CanvasType.RailMap]));
        });

        // assertion - selection is reset
        expect(screen.queryByDisplayValue('Destination')).not.toBeInTheDocument();
        expect(screen.getByDisplayValue('Please select...')).toBeInTheDocument();
    });
});
