import React from 'react';
import { render } from '../../test-utils';
import DownloadModal from './download-modal';
import rootReducer from '../../redux';
import { createMockAppStore } from '../../setupTests';
import { CanvasType, RmgStyle } from '../../constants/constants';
import { screen } from '@testing-library/react';

const realStore = rootReducer.getState();
const mockStore = createMockAppStore({
    ...realStore,
    app: {
        ...realStore.app,
        canvasToShow: CanvasType.RailMap,
    },
    param: {
        ...realStore.param,
        style: RmgStyle.GZMTR,
    },
});

describe('DownloadModal', () => {
    it('Can filter canvas on screen for selecting only', () => {
        render(<DownloadModal isOpen={true} onClose={jest.fn()} />, { store: mockStore });

        expect(screen.getByRole('option', { name: 'Rail map' })).toBeInTheDocument();
        expect(screen.queryByRole('option', { name: 'Running-in' })).not.toBeInTheDocument();
    });
});
