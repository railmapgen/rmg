import { render } from '../../test-utils';
import AppRouter from './app-router';
import rootReducer from '../../redux';
import { createMockAppStore, createParamInLocalStorage } from '../../setupTests';
import { act, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { initParam } from '../../redux/param/util';
import { RmgStyle } from '../../constants/constants';
import * as paramUpdaterUtils from '../../util/param-updater-utils';

vi.mock('./app-view', () => {
    return {
        default: () => (
            <div role="presentation" aria-label="Mock App View">
                Mock App View
            </div>
        ),
    };
});

vi.mock('../param-selector-view', () => {
    return {
        default: () => (
            <div role="presentation" aria-label="Mock Param Selector View">
                Mock Param Selector View
            </div>
        ),
    };
});

const realStore = rootReducer.getState();
const mockStore = createMockAppStore({
    ...realStore,
});

const mockFetch = vi.fn();
const originalFetch = global.fetch;

const updateThemesSpy = vi.spyOn(paramUpdaterUtils, 'updateThemes');

describe('AppRouter', () => {
    afterEach(() => {
        window.localStorage.clear();
        mockStore.clearActions();
        global.fetch = originalFetch;
    });

    beforeEach(() => {
        updateThemesSpy.mockImplementation(param => Promise.resolve(param));
    });

    it('Can render param selector view if param id is not specified', () => {
        render(<AppRouter />, { store: mockStore, route: '/' });

        const actions = mockStore.getActions();
        expect(actions).toHaveLength(0);

        expect(screen.getByRole('presentation', { name: 'Mock Param Selector View' })).toBeInTheDocument();
    });

    it('Can read param from localStorage and render app view if param is not loaded', async () => {
        createParamInLocalStorage('test-id');
        render(<AppRouter />, { store: mockStore, route: '/?project=test-id' });

        await waitFor(() => expect(mockStore.getActions().length).toBeGreaterThan(0));
        const actions = mockStore.getActions();
        expect(actions).toContainEqual({ type: 'app/setParamConfig', payload: { id: 'test-id' } });
        expect(actions).toContainEqual(expect.objectContaining({ type: 'SET_FULL_PARAM' }));

        expect(screen.getByRole('presentation', { name: 'Mock App View' })).toBeInTheDocument();
    });

    it('Can render param selector view if no param in localStorage matches URL param ID', async () => {
        render(<AppRouter />, { store: mockStore, route: '/?project=test-id-2' });
        await act(async () => {
            await Promise.resolve();
        });

        const actions = mockStore.getActions();
        expect(actions).toHaveLength(0);

        expect(screen.getByRole('presentation', { name: 'Mock Param Selector View' })).toBeInTheDocument();
    });

    it('Can render app view for direct url if param is loaded', async () => {
        const mockStore = createMockAppStore({
            ...realStore,
            app: { ...realStore.app, paramConfig: { id: 'test-id' } },
        });
        render(<AppRouter />, { store: mockStore, route: '/?project=test-id' });

        const actions = mockStore.getActions();
        expect(actions).toHaveLength(0);

        await screen.findByRole('presentation', { name: 'Mock App View' });
    });

    it('Can download external project and open it', async () => {
        const externalUrl = 'https://example.com/path/to/file.json';
        const rmgParam = initParam(RmgStyle.MTR, 'en');
        global.fetch = mockFetch.mockResolvedValue({ ok: true, text: () => Promise.resolve(JSON.stringify(rmgParam)) });

        render(<AppRouter />, { store: mockStore, route: '/?external=' + encodeURIComponent(externalUrl) });

        expect(mockFetch).toBeCalledTimes(1);
        expect(mockFetch).lastCalledWith(externalUrl);

        await waitFor(() => expect(mockStore.getActions().length).toBeGreaterThanOrEqual(1));
        const actions = mockStore.getActions();
        expect(actions).toContainEqual({
            type: 'app/setParamConfig',
            payload: expect.objectContaining({ name: 'file.json' }),
        });
        expect(actions).toContainEqual(expect.objectContaining({ type: 'SET_FULL_PARAM' }));

        await screen.findByRole('presentation', { name: 'Mock App View' });
    });
});
