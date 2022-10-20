import React, { lazy, StrictMode } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { rmgChakraTheme, RmgErrorBoundary, RmgLoader } from '@railmapgen/rmg-components';
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
                                    <RmgErrorBoundary
                                        suspenseFallback={<RmgLoader isIndeterminate={true} />}
                                        allowReset
                                    >
                                        <AppRoot />
                                    </RmgErrorBoundary>
                                }
                            />
                        </Routes>
                    </BrowserRouter>
                </ChakraProvider>
            </Provider>
        </StrictMode>
    );
}
