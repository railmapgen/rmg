import React, { lazy, StrictMode } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { rmgChakraTheme, RmgErrorBoundary, RmgLoader } from '@railmapgen/rmg-components';
import { Provider } from 'react-redux';
import store from './redux';

const AppRouter = lazy(() => import(/* webpackChunkName: "AppRouter" */ './components/root/app-router'));

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
                                path="/"
                                element={
                                    <RmgErrorBoundary
                                        suspenseFallback={<RmgLoader isIndeterminate={true} />}
                                        allowReset
                                    >
                                        <AppRouter />
                                    </RmgErrorBoundary>
                                }
                            />
                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                    </BrowserRouter>
                </ChakraProvider>
            </Provider>
        </StrictMode>
    );
}
