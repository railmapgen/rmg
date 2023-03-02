import React, { lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { RmgErrorBoundary, RmgLoader, RmgWindow } from '@railmapgen/rmg-components';
import WindowHeader from './components/root/window-header';

const AppRouter = lazy(() => import('./components/root/app-router'));

export default function App() {
    // const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    // const theme = prefersDarkMode ? darkTheme : lightTheme;
    // Though Electron distribution will use a ./ to get local files,
    // Router need to be configured to / as the render process is just like
    // a regular browser and is expecting a web based url.
    const basename = import.meta.env.BASE_URL === './' ? '/' : import.meta.env.BASE_URL;

    return (
        <BrowserRouter basename={basename}>
            <RmgWindow>
                <WindowHeader />
                <Routes>
                    <Route
                        path="/"
                        element={
                            <RmgErrorBoundary suspenseFallback={<RmgLoader isIndeterminate={true} />} allowReset>
                                <AppRouter />
                            </RmgErrorBoundary>
                        }
                    />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </RmgWindow>
        </BrowserRouter>
    );
}
