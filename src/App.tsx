import { lazy } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ImportViewWindowHeader, WindowHeader } from './components/root/window-header';
import { RMErrorBoundary, RMMantineProvider, RMWindow } from '@railmapgen/mantine-components';
import { LoadingOverlay } from '@mantine/core';

const AppRouter = lazy(() => import('./components/root/app-router'));
const AppClipView = lazy(() => import('./components/param-selector-view/app-clip-view'));

export default function App() {
    return (
        <HashRouter>
            <RMMantineProvider>
                <RMWindow>
                    <Routes>
                        <Route
                            path="/import"
                            element={
                                <RMErrorBoundary suspenseFallback={<LoadingOverlay visible />}>
                                    <ImportViewWindowHeader />
                                    <AppClipView />
                                </RMErrorBoundary>
                            }
                        />
                        <Route
                            path="/"
                            element={
                                <RMErrorBoundary suspenseFallback={<LoadingOverlay visible />} allowReset>
                                    <WindowHeader />
                                    <AppRouter />
                                </RMErrorBoundary>
                            }
                        />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </RMWindow>
            </RMMantineProvider>
        </HashRouter>
    );
}
