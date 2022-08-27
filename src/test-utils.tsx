import '@testing-library/jest-dom';
import React, { ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Store } from '@reduxjs/toolkit';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/config';
import { Provider } from 'react-redux';
import rootReducer from './redux';
import { createMockAppStore } from './setupTests';
import { MemoryRouter } from 'react-router-dom';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
    store: Store;
    route?: string;
}

const initialOptions: CustomRenderOptions = {
    store: createMockAppStore({ ...rootReducer.getState() }),
};

interface TestingProviderProps {
    children?: ReactNode;
    store: Store;
    route?: string;
}

export const TestingProvider = (props: TestingProviderProps) => {
    const { children, store, route } = props;

    return (
        <I18nextProvider i18n={i18n}>
            <Provider store={store}>
                <MemoryRouter initialEntries={[route ?? '/']}>{children}</MemoryRouter>
            </Provider>
        </I18nextProvider>
    );
};

const customRender = (ui: ReactElement, { store, route, ...renderOptions } = initialOptions) => {
    return render(ui, {
        wrapper: props => <TestingProvider store={store} route={route} {...props} />,
        ...renderOptions,
    });
};

export { customRender as render };
