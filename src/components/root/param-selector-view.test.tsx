import React from 'react';
import { render } from '../../test-utils';
import ParamSelectorView from './param-selector-view';
import rootReducer from '../../redux';
import { createMockAppStore, createParamInLocalStorage } from '../../setupTests';
import { fireEvent, screen } from '@testing-library/react';

const realStore = rootReducer.getState();
const mockStore = createMockAppStore({ ...realStore });

describe('ParamSelectorView', () => {
    it('Can render view with list of projects as expected', () => {
        createParamInLocalStorage('test-1');
        createParamInLocalStorage('test-2');

        render(<ParamSelectorView />, { store: mockStore, route: '/' });

        // display 2 projects for selecting
        expect(screen.getByRole('button', { name: 'Project ID: test-1' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Project ID: test-2' })).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'Project ID: test-2' }));
        fireEvent.click(screen.getByRole('button', { name: 'Open project' }));

        // TODO: assert open project with id = test-2
    });
});
