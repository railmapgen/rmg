import React, { useMemo, useEffect, useReducer } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppAppBar from './app-appbar';
import SVGs from './svgs';
import Panels from './panels';
import { getBranches, useTpo, getRoutes } from './methods';
import { ParamContext, paramReducer } from './context';
import { createMuiTheme, ThemeProvider, useMediaQuery, LinearProgress } from '@material-ui/core';
import { RMGParam, StationInfo } from './constants/constants';

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
    const [param, dispatch] = useReducer(paramReducer, JSON.parse(localStorage.rmgParam) as RMGParam);
    const paramString = JSON.stringify(param);
    useEffect(() => {
        window.rmgStorage.writeFile('rmgParam', paramString).then();
    }, [paramString]);

    const deps = Object.keys(param.stn_list).reduce(
        (acc, cur) =>
            acc +
            cur +
            (
                (...k: (keyof StationInfo)[]) =>
                (o: StationInfo) =>
                    k.reduce((a, c) => a + JSON.stringify(o[c]), '')
            )(
                'parents',
                'children',
                'branch'
            )(param.stn_list[cur]),
        ''
    );

    const branches = useMemo(
        () => getBranches(param.stn_list),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [deps]
    );
    const routes = useMemo(
        () => getRoutes(param.stn_list),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [deps]
    );
    const tpo = useTpo(branches);

    return (
        <>
            <ParamContext.Provider
                value={{
                    param,
                    dispatch,
                    branches,
                    routes,
                    deps,
                    tpo,
                }}
            >
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
