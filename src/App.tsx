import React, { lazy, StrictMode, Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import AppAppBar from './app-appbar';
// import Panels from './panels';
// import { createTheme, ThemeProvider, useMediaQuery, LinearProgress } from '@material-ui/core';
import { useAppSelector } from './redux';
import SvgRouter from './svgs/svg-router';
import { ChakraProvider, CircularProgress } from '@chakra-ui/react';
import { rmgChakraTheme } from '@railmapgen/rmg-components';
import ErrorBoundary from './error-boundary';

const AppRoot = lazy(() => import(/* webpackChunkName: "AppRoot" */ './components/app-root'));

// const darkTheme = createTheme({
//     palette: {
//         type: 'dark',
//         primary: {
//             main: '#bb86fc',
//         },
//         secondary: {
//             main: '#018786',
//         },
//         error: {
//             main: '#cf6679',
//         },
//     },
//     // palette: {
//     //     type: 'dark',
//     //     primary: {
//     //         main: '#8ab4f8',
//     //     },
//     // },
//     overrides: {
//         MuiDialog: {
//             paper: {
//                 minWidth: 280,
//             },
//         },
//     },
// });

// const lightTheme = createTheme({
//     palette: {
//         primary: {
//             light: '#bb86fc',
//             main: '#6200ee',
//         },
//         secondary: {
//             main: '#018786',
//         },
//         error: {
//             main: '#b00020',
//         },
//     },
//     // palette: {
//     //     primary: {
//     //         main: '#1a73e8',
//     //     },
//     //     text: {
//     //         primary: '#202124',
//     //         secondary: '#5f6368',
//     //     },
//     // },
//     overrides: {
//         MuiDialog: {
//             paper: {
//                 minWidth: 280,
//             },
//         },
//     },
// });

export default function App() {
    // const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    // const theme = prefersDarkMode ? darkTheme : lightTheme;
    // Though Electron distribution will use a ./ to get local files,
    // Router need to be configured to / as the render process is just like
    // a regular browser and is expecting a web based url.
    const basename = process.env.PUBLIC_URL === '.' ? '/' : process.env.PUBLIC_URL;

    return (
        <BrowserRouter basename={basename}>
            <Routes>
                {/*<Route*/}
                {/*    path="/v3/*"*/}
                {/*    element={*/}
                {/*        <ThemeProvider theme={theme}>*/}
                {/*            <React.Suspense fallback={<LinearProgress />}>*/}
                {/*                <AppAppBar />*/}
                {/*            </React.Suspense>*/}
                {/*            <AppBody />*/}
                {/*        </ThemeProvider>*/}
                {/*    }*/}
                {/*/>*/}
                <Route
                    path="*"
                    element={
                        <ChakraProvider theme={rmgChakraTheme}>
                            <StrictMode>
                                <Suspense fallback={<CircularProgress isIndeterminate />}>
                                    <ErrorBoundary>
                                        <AppRoot />
                                    </ErrorBoundary>
                                </Suspense>
                            </StrictMode>
                        </ChakraProvider>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

// const AppBody = () => {
//     const param = useAppSelector(store => store.param);
//
//     const paramString = JSON.stringify(param);
//     useEffect(() => {
//         window.rmgStorage.writeFile('rmgParam', paramString).then();
//     }, [paramString]);
//
//     return (
//         <>
//             <div style={{ overflowY: 'auto' }}>
//                 <SvgRouter />
//             </div>
//             <div style={{ flex: 1, overflow: 'hidden' }}>
//                 <Panels />
//             </div>
//
//             <canvas style={{ display: 'none' }} />
//         </>
//     );
// };
