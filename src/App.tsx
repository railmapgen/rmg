// 应用根组件：配置哈希路由、主题、窗口外壳、懒加载视图和错误边界。
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
                <Routes>
                    <Route
                        path="/import"
                        element={
                            <RMWindow isAppClip>
                                <ImportViewWindowHeader />
                                <RMErrorBoundary suspenseFallback={<LoadingOverlay visible />}>
                                    <AppClipView />
                                </RMErrorBoundary>
                            </RMWindow>
                        }
                    />
                    <Route
                        path="/"
                        element={
                            <RMWindow>
                                <WindowHeader />
                                <RMErrorBoundary suspenseFallback={<LoadingOverlay visible />} allowReset>
                                    <AppRouter />
                                </RMErrorBoundary>
                            </RMWindow>
                        }
                    />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </RMMantineProvider>
        </HashRouter>
    );
}
