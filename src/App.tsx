import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppAppBar from './app-appbar';
import Panels from './panels';
import { createMuiTheme, ThemeProvider, useMediaQuery, LinearProgress } from '@material-ui/core';
import { useAppSelector } from './redux';
import SvgRouter from './svgs/svg-router';

const darkTheme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            main: '#bb86fc',
        },
        secondary: {
            main: '#018786',
        },
        error: {
            main: '#cf6679',
        },
    },
    // palette: {
    //     type: 'dark',
    //     primary: {
    //         main: '#8ab4f8',
    //     },
    // },
    overrides: {
        MuiDialog: {
            paper: {
                minWidth: 280,
            },
        },
    },
});

const lightTheme = createMuiTheme({
    palette: {
        primary: {
            light: '#bb86fc',
            main: '#6200ee',
        },
        secondary: {
            main: '#018786',
        },
        error: {
            main: '#b00020',
        },
    },
    // palette: {
    //     primary: {
    //         main: '#1a73e8',
    //     },
    //     text: {
    //         primary: '#202124',
    //         secondary: '#5f6368',
    //     },
    // },
    overrides: {
        MuiDialog: {
            paper: {
                minWidth: 280,
            },
        },
    },
});

export default function App() {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const theme = prefersDarkMode ? darkTheme : lightTheme;

    return (
        <BrowserRouter basename={process.env.PUBLIC_URL}>
            <ThemeProvider theme={theme}>
                <React.Suspense fallback={<LinearProgress />}>
                    <AppAppBar />
                </React.Suspense>
                <AppBody />
            </ThemeProvider>
        </BrowserRouter>
    );
}

const AppBody = () => {
    const param = useAppSelector(store => store.param);

    const paramString = JSON.stringify(param);
    useEffect(() => {
        window.rmgStorage.writeFile('rmgParam', paramString).then();
    }, [paramString]);

    return (
        <>
            <div style={{ overflowY: 'auto' }}>
                <SvgRouter />
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
                <Panels />
            </div>

            <canvas style={{ display: 'none' }} />
        </>
    );
};
