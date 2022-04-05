import '@testing-library/jest-dom';
import React, { ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Store } from 'redux';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/config';
import { Provider } from 'react-redux';
import rootReducer from './redux';
import { createMockAppStore } from './setupTests';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
    store: Store;
}

const initialOptions: CustomRenderOptions = {
    store: createMockAppStore({ ...rootReducer.getState() }),
};

interface TestingProviderProps {
    children?: ReactNode;
}

const customRender = (ui: ReactElement, { store, ...renderOptions } = initialOptions) => {
    const TestingProvider = (props: TestingProviderProps) => {
        const { children } = props;

        return (
            <I18nextProvider i18n={i18n}>
                <Provider store={store}>{children}</Provider>
            </I18nextProvider>
        );
    };

    return render(ui, { wrapper: TestingProvider, ...renderOptions });
};

export { customRender as render };
