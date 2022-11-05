import React from 'react';
import { render } from '../../test-utils';
import ParamSelectorView from './index';
import rootReducer from '../../redux';
import { createMockAppStore, createParamInLocalStorage } from '../../setupTests';
import { fireEvent, screen } from '@testing-library/react';

const realStore = rootReducer.getState();

describe('ParamSelectorView', () => {
    it('Can disable open button if no project is selected', () => {
        createParamInLocalStorage('test-1');
        createParamInLocalStorage('test-2');
        const mockStore = createMockAppStore({ ...realStore, app: { ...realStore.app } });

        render(<ParamSelectorView />, { store: mockStore, route: '/' });

        // display 2 projects for selecting
        expect(screen.getByText(/test-1/)).toBeInTheDocument();
        expect(screen.getByText(/test-2/)).toBeInTheDocument();

        // open button is disabled
        expect(screen.getByRole('button', { name: 'Open project' })).toBeDisabled();

        // select test-2 and open
        fireEvent.click(screen.getByText(/test-2/));
        expect(screen.getByRole('button', { name: 'Open project' })).toBeEnabled();
    });
});
