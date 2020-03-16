import * as React from 'react';
import './i18n';
import AppAppBar from './app-appbar';
import SVGs from './svgs';
import Panels from './panels';
import { getBranches, useTpo, getRoutes } from './methods';
import { CanvasContext, ParamContext, paramReducer } from './context';
import { createMuiTheme, ThemeProvider, useMediaQuery, LinearProgress } from '@material-ui/core';
import { ProvidedCanvas, RMGParam } from './types';

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
    //         light: '#1A73E8',
    //         main: '#3367D6',
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

export default function App(props: { canvas: ProvidedCanvas[] }) {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const theme = prefersDarkMode ? darkTheme : lightTheme;

    const [canvasToShown, setCanvasToShown] = React.useState<'all' | ProvidedCanvas>(
        props.canvas.includes(localStorage.rmgCanvas) ? localStorage.rmgCanvas : 'all'
    );
    React.useEffect(() => localStorage.setItem('rmgCanvas', canvasToShown), [canvasToShown]);
    const [canvasScale, setCanvasScale] = React.useState(
        Number(localStorage.rmgScale) >= 0.1 ? Number(localStorage.rmgScale) : 1
    );
    React.useEffect(() => localStorage.setItem('rmgScale', canvasScale.toFixed(1)), [canvasScale]);

    return (
        <>
            <ThemeProvider theme={theme}>
                <CanvasContext.Provider
                    value={{
                        canvasAvailable: props.canvas,
                        canvasToShown,
                        setCanvasToShown,
                        canvasScale,
                        setCanvasScale,
                    }}
                >
                    <React.Suspense fallback={<LinearProgress />}>
                        <AppAppBar />
                    </React.Suspense>
                    <AppBody />
                </CanvasContext.Provider>
            </ThemeProvider>
        </>
    );
}

const AppBody = () => {
    const [param, dispatch] = React.useReducer(paramReducer, JSON.parse(localStorage.rmgParam) as RMGParam);
    const paramString = JSON.stringify(param);
    React.useEffect(() => localStorage.setItem('rmgParam', paramString), [paramString]);

    const deps = Object.keys(param.stn_list).reduce(
        (acc, cur) =>
            acc +
            cur +
            ((...k) => o => k.reduce((a, c) => a + JSON.stringify(o[c]), ''))(
                'parents',
                'children',
                'branch'
            )(param.stn_list[cur]),
        ''
    );

    const branches = React.useMemo(() => getBranches(param.stn_list), [deps]);
    const routes = React.useMemo(() => getRoutes(param.stn_list), [deps]);
    const tpo = useTpo(branches);

    const handleUpdate = (key, data) => dispatch({ type: 'ANY', key, data });

    return (
        <>
            <ParamContext.Provider
                value={{
                    param,
                    dispatch,
                    branches,
                    routes,
                    deps,
                }}
            >
                <SVGs />
                <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
                    <Panels param={param} paramUpdate={handleUpdate} tpo={tpo} />
                </div>
            </ParamContext.Provider>
            <canvas style={{ display: 'none' }} />
        </>
    );
};
