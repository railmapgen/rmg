import React from 'react';
import { render } from '../../test-utils';
import AppRouter from './app-router';
import rootReducer from '../../redux';
import { createMockAppStore } from '../../setupTests';
import { screen } from '@testing-library/react';

jest.mock('./app-view', () => {
    return () => (
        <div role="presentation" aria-label="Mock App View">
            Mock App View
        </div>
    );
});

jest.mock('./param-selector-view', () => {
    return () => (
        <div role="presentation" aria-label="Mock Param Selector View">
            Mock Param Selector View
        </div>
    );
});

const realStore = rootReducer.getState();
const mockStore = createMockAppStore({
    ...realStore,
});

describe('AppRouter', () => {
    afterEach(() => {
        mockStore.clearActions();
    });

    it('Can render param selector view if param id is not specified', () => {
        render(<AppRouter />, { store: mockStore, route: '/' });

        const actions = mockStore.getActions();
        expect(actions).toHaveLength(0);

        expect(screen.getByRole('presentation', { name: 'Mock Param Selector View' })).toBeInTheDocument();
    });

    it('Can read param from localStorage and render app view if param is not loaded', () => {
        render(<AppRouter />, { store: mockStore, route: '/?project=test-id' });

        const actions = mockStore.getActions();
        expect(actions).toContainEqual({ type: 'app/setCurrentParamId', payload: 'test-id' });
        expect(actions).toContainEqual(expect.objectContaining({ type: 'SET_FULL_PARAM' }));

        expect(screen.getByRole('presentation', { name: 'Mock App View' })).toBeInTheDocument();
    });

    it('Can render app view if param is loaded', async () => {
        const mockStore = createMockAppStore({ ...realStore, app: { ...realStore.app, currentParamId: 'test-id' } });
        render(<AppRouter />, { store: mockStore, route: '/?project=test-id' });

        const actions = mockStore.getActions();
        expect(actions).toHaveLength(0);

        await screen.findByRole('presentation', { name: 'Mock App View' });
    });
});
