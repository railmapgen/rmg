import React, { lazy, StrictMode, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { rmgChakraTheme } from '@railmapgen/rmg-components';
import ErrorBoundary from './error-boundary';
import FallbackLoader from './components/fallback-loader';
import { Provider } from 'react-redux';
import store from './redux';

const AppRoot = lazy(() => import(/* webpackChunkName: "AppRoot" */ './components/app-root'));

export default function App() {
    // const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    // const theme = prefersDarkMode ? darkTheme : lightTheme;
    // Though Electron distribution will use a ./ to get local files,
    // Router need to be configured to / as the render process is just like
    // a regular browser and is expecting a web based url.
    const basename = process.env.PUBLIC_URL === '.' ? '/' : process.env.PUBLIC_URL;

    return (
        <StrictMode>
            <Provider store={store}>
                <ChakraProvider theme={rmgChakraTheme}>
                    <BrowserRouter basename={basename}>
                        <Routes>
                            <Route
                                path="*"
                                element={
                                    <Suspense fallback={<FallbackLoader />}>
                                        <ErrorBoundary>
                                            <AppRoot />
                                        </ErrorBoundary>
                                    </Suspense>
                                }
                            />
                        </Routes>
                    </BrowserRouter>
                </ChakraProvider>
            </Provider>
        </StrictMode>
    );
}
