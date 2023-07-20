import React, { lazy } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { RmgErrorBoundary, RmgLoader, RmgThemeProvider, RmgWindow } from '@railmapgen/rmg-components';
import WindowHeader from './components/root/window-header';

const AppRouter = lazy(() => import('./components/root/app-router'));
const AppClipView = lazy(() => import('./components/param-selector-view/app-clip-view'));

export default function App() {
    return (
        <HashRouter>
            <RmgThemeProvider>
                <RmgWindow>
                    <WindowHeader />
                    <Routes>
                        <Route
                            path="/import"
                            element={
                                <RmgErrorBoundary suspenseFallback={<RmgLoader isIndeterminate={true} />}>
                                    <AppClipView />
                                </RmgErrorBoundary>
                            }
                        />
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
            </RmgThemeProvider>
        </HashRouter>
    );
}
