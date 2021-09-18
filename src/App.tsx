import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppAppBar from './app-appbar';
import SVGs from './svgs';
import Panels from './panels';
import { ParamContext } from './context';
import { createMuiTheme, ThemeProvider, useMediaQuery, LinearProgress } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { RootState } from './redux';

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
    const param = useSelector((store: RootState) => store.param);
    const deps = useSelector((store: RootState) => store.helper.depsStr);
    const branches = useSelector((store: RootState) => store.helper.branches);
    const routes = useSelector((store: RootState) => store.helper.routes);
    const tpo = useSelector((store: RootState) => store.helper.tpo);

    const paramString = JSON.stringify(param);
    useEffect(() => {
        window.rmgStorage.writeFile('rmgParam', paramString).then();
    }, [paramString]);

    return (
        <>
            <ParamContext.Provider value={{ branches, routes, deps, tpo }}>
                <div style={{ overflowY: 'auto' }}>
                    <SVGs />
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                    <Panels />
                </div>
            </ParamContext.Provider>
            <canvas style={{ display: 'none' }} />
        </>
    );
};
