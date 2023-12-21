import { render } from '../../test-utils';
import AppRouter from './app-router';
import rootReducer, { RootStore } from '../../redux';
import { createParamInLocalStorage, createTestStore } from '../../setupTests';
import { act, screen } from '@testing-library/react';
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
let mockStore: RootStore;

const mockFetch = vi.fn();
const originalFetch = global.fetch;

const updateThemesSpy = vi.spyOn(paramUpdaterUtils, 'updateThemes');

describe('AppRouter', () => {
    beforeEach(() => {
        window.localStorage.clear();
        mockStore = createTestStore();
        global.fetch = originalFetch;
        updateThemesSpy.mockImplementation(param => Promise.resolve(param));
    });

    it('Can render param selector view if param id is not specified', () => {
        const prevState = mockStore.getState();
        render(<AppRouter />, { store: mockStore, route: '/' });

        expect(mockStore.getState()).toEqual(prevState);
        expect(screen.getByRole('presentation', { name: 'Mock Param Selector View' })).toBeInTheDocument();
    });

    it('Can read param from localStorage and render app view if param is not loaded', async () => {
        createParamInLocalStorage('test-id');
        render(<AppRouter />, { store: mockStore, route: '/?project=test-id' });
        await act(async () => {
            await Promise.resolve();
        });

        expect(mockStore.getState().app.paramConfig).toEqual({ id: 'test-id' });
        expect(mockStore.getState().param.line_num).toBe('test-id');

        expect(screen.getByRole('presentation', { name: 'Mock App View' })).toBeInTheDocument();
    });

    it('Can render param selector view if no param in localStorage matches URL param ID', async () => {
        const prevState = mockStore.getState();
        render(<AppRouter />, { store: mockStore, route: '/?project=test-id-2' });
        await act(async () => {
            await Promise.resolve();
        });

        expect(mockStore.getState()).toEqual(prevState);
        expect(screen.getByRole('presentation', { name: 'Mock Param Selector View' })).toBeInTheDocument();
    });

    it('Can render app view for direct url if param is loaded', async () => {
        const mockStore = createTestStore({
            app: { ...realStore.app, paramConfig: { id: 'test-id' } },
        });
        const prevState = mockStore.getState();
        render(<AppRouter />, { store: mockStore, route: '/?project=test-id' });

        expect(mockStore.getState()).toEqual(prevState);
        await screen.findByRole('presentation', { name: 'Mock App View' });
    });

    it('Can download external project and open it', async () => {
        const externalUrl = 'https://example.com/path/to/file.json';
        const rmgParam = initParam(RmgStyle.MTR, 'en');
        rmgParam.line_num = 'file.json';
        global.fetch = mockFetch.mockResolvedValue({ ok: true, text: () => Promise.resolve(JSON.stringify(rmgParam)) });

        render(<AppRouter />, { store: mockStore, route: '/?external=' + encodeURIComponent(externalUrl) });
        await act(async () => {
            await Promise.resolve();
        });

        expect(mockFetch).toBeCalledTimes(1);
        expect(mockFetch).lastCalledWith(externalUrl);

        expect(mockStore.getState().app.paramConfig).toEqual(expect.objectContaining({ name: 'file.json' }));
        expect(mockStore.getState().param.line_num).toBe('file.json');

        await screen.findByRole('presentation', { name: 'Mock App View' });
    });
});
