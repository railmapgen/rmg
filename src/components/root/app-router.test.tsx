import React from 'react';
import { render } from '../../test-utils';
import AppRouter from './app-router';
import rootReducer from '../../redux';
import { createMockAppStore, createParamInLocalStorage } from '../../setupTests';
import { screen } from '@testing-library/react';
import rmgRuntime, { RmgEnv } from '@railmapgen/rmg-runtime';

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
    describe('AppRouter - UAT toggle on', () => {
        beforeEach(() => {
            jest.spyOn(rmgRuntime, 'getEnv').mockReturnValue(RmgEnv.UAT);
        });

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
            createParamInLocalStorage('test-id');
            render(<AppRouter />, { store: mockStore, route: '/?project=test-id' });

            const actions = mockStore.getActions();
            expect(actions).toContainEqual({ type: 'app/setCurrentParamId', payload: 'test-id' });
            expect(actions).toContainEqual(expect.objectContaining({ type: 'SET_FULL_PARAM' }));

            expect(screen.getByRole('presentation', { name: 'Mock App View' })).toBeInTheDocument();
        });

        it('Can render param selector view if no param in localStorage matches URL param ID', () => {
            render(<AppRouter />, { store: mockStore, route: '/?project=test-id-2' });

            // TODO
            // expect(screen.getByRole('presentation', { name: 'Mock Param Selector View' })).toBeInTheDocument();
        });

        it('Can render app view if param is loaded', async () => {
            const mockStore = createMockAppStore({
                ...realStore,
                app: { ...realStore.app, currentParamId: 'test-id' },
            });
            render(<AppRouter />, { store: mockStore, route: '/?project=test-id' });

            const actions = mockStore.getActions();
            expect(actions).toHaveLength(0);

            await screen.findByRole('presentation', { name: 'Mock App View' });
        });
    });

    describe('AppRouter - PRD toggle off', () => {
        beforeEach(() => {
            jest.spyOn(rmgRuntime, 'getEnv').mockReturnValue(RmgEnv.PRD);
        });

        afterEach(() => {
            mockStore.clearActions();
            window.localStorage.clear();
        });

        it('Can generate param and render app view if param id is not specified and no param in localStorage', () => {
            render(<AppRouter />, { store: mockStore, route: '/' });

            // update redux store
            const actions = mockStore.getActions();
            expect(actions).toContainEqual(expect.objectContaining({ type: 'app/setCurrentParamId' }));
            expect(actions).toContainEqual(expect.objectContaining({ type: 'SET_FULL_PARAM' }));

            expect(screen.getByRole('presentation', { name: 'Mock App View' })).toBeInTheDocument();
        });

        it('Can read first param from localStorage and render app view if param id is not specified', () => {
            createParamInLocalStorage('test-id');
            render(<AppRouter />, { store: mockStore, route: '/' });

            // update redux store
            const actions = mockStore.getActions();
            expect(actions).toContainEqual({ type: 'app/setCurrentParamId', payload: 'test-id' });
            expect(actions).toContainEqual({
                type: 'SET_FULL_PARAM',
                fullParam: expect.objectContaining({ line_num: 'test-id' }),
            });

            expect(screen.getByRole('presentation', { name: 'Mock App View' })).toBeInTheDocument();
        });

        it('Can read param from localStorage and render app view if param is not loaded', () => {
            createParamInLocalStorage('test-id');
            render(<AppRouter />, { store: mockStore, route: '/?project=test-id' });

            const actions = mockStore.getActions();
            expect(actions).toContainEqual({ type: 'app/setCurrentParamId', payload: 'test-id' });
            expect(actions).toContainEqual(expect.objectContaining({ type: 'SET_FULL_PARAM' }));

            expect(screen.getByRole('presentation', { name: 'Mock App View' })).toBeInTheDocument();
        });

        it('Can read first param from localStorage and render app selector view if no param in localStorage matches URL param ID', () => {
            createParamInLocalStorage('test-id-1');
            render(<AppRouter />, { store: mockStore, route: '/?project=test-id-2' });

            // update redux store
            const actions = mockStore.getActions();
            expect(actions).toContainEqual({ type: 'app/setCurrentParamId', payload: 'test-id-1' });
            expect(actions).toContainEqual({
                type: 'SET_FULL_PARAM',
                fullParam: expect.objectContaining({ line_num: 'test-id-1' }),
            });

            expect(screen.getByRole('presentation', { name: 'Mock App View' })).toBeInTheDocument();
        });

        it('Can render app view if param is loaded', async () => {
            const mockStore = createMockAppStore({
                ...realStore,
                app: { ...realStore.app, currentParamId: 'test-id' },
            });
            render(<AppRouter />, { store: mockStore, route: '/?project=test-id' });

            const actions = mockStore.getActions();
            expect(actions).toHaveLength(0);

            await screen.findByRole('presentation', { name: 'Mock App View' });
        });
    });
});
