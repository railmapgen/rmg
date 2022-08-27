import React from 'react';
import { render } from '../test-utils';
import SvgRouter from './svg-router';
import rootReducer from '../redux';
import { createMockAppStore } from '../setupTests';
import { RmgStyle } from '../constants/constants';
import { act } from 'react-dom/test-utils';

const mockUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockUseNavigate,
}));

const realStore = rootReducer.getState();
const mockStore = createMockAppStore({
    ...realStore,
    param: {
        ...realStore.param,
        style: RmgStyle.MTR,
    },
});

describe('SvgRouter', () => {
    beforeAll(() => {
        const link = document.createElement('link');
        link.id = 'css_share';
        document.head.append(link);

        jest.mock('./mtr/index', () => ({}));
        jest.mock('./gzmtr/index', () => ({}));
    });

    afterEach(() => {
        jest.clearAllMocks();
        mockStore.clearActions();
    });

    it('Can push route to match style if route is not provided in advanced', async () => {
        render(<SvgRouter />, { store: mockStore, route: '/' });
        await act(async () => {
            await Promise.resolve();
        });

        const actions = mockStore.getActions();
        expect(actions).toHaveLength(0);
        expect(mockUseNavigate).toBeCalledWith('mtr');
    });

    it('Can push route to match style if route provided is invalid', async () => {
        render(<SvgRouter />, { store: mockStore, route: '/abc' });
        await act(async () => {
            await Promise.resolve();
        });

        const actions = mockStore.getActions();
        expect(actions).toHaveLength(0);
        expect(mockUseNavigate).toBeCalledWith('mtr');
    });

    it('Can keep route as is if route provided matches param', async () => {
        render(<SvgRouter />, { store: mockStore, route: '/mtr' });
        await act(async () => {
            await Promise.resolve();
        });

        const actions = mockStore.getActions();
        expect(actions).toHaveLength(0);
        expect(mockUseNavigate).toBeCalledTimes(0);
    });

    it('Can update param style if route provided is valid but does not match param', async () => {
        render(<SvgRouter />, { store: mockStore, route: '/gzmtr' });
        await act(async () => {
            await Promise.resolve();
        });

        const actions = mockStore.getActions();
        expect(actions).toHaveLength(1);
        expect(actions).toContainEqual({ type: 'SET_STYLE', style: 'gzmtr' });
        expect(mockUseNavigate).toBeCalledTimes(0);
    });
});
