import * as React from 'react';
import './i18n';
import AppAppBar from './app-appbar';
import SVGs from './svgs';
// import SVGs from './svgs';
import Panels from './panels';
import { getParams } from './utils';
import { getBranches, useTpo, getRoutes } from './methods';
import { CanvasContext, ParamContext, paramReducer } from './context';
import { createMuiTheme, ThemeProvider, useMediaQuery, LinearProgress } from '@material-ui/core';

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

    const canvasAvailable = ((style): ('destination' | 'runin' | 'railmap')[] => {
        switch (style) {
            case 'mtr':
                return ['destination', 'railmap'];
            case 'gzmtr':
                return ['runin', 'railmap'];
            case 'shmetro':
                return ['destination', 'runin', 'railmap'];
            default:
                return [];
        }
    })(window.urlParams.get('style'));
    const [canvasToShown, setCanvasToShown] = React.useState<'all' | 'destination' | 'runin' | 'railmap'>('all');

    const [param, dispatch] = React.useReducer(paramReducer, getParams());
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
            <ThemeProvider theme={theme}>
                <CanvasContext.Provider value={{ canvasAvailable, canvasToShown, setCanvasToShown }}>
                    <React.Suspense fallback={<LinearProgress />}>
                        <AppAppBar />
                    </React.Suspense>
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
                        <Panels param={param} paramUpdate={handleUpdate} tpo={tpo} />
                    </ParamContext.Provider>
                </CanvasContext.Provider>
                <canvas style={{ display: 'none' }} />
            </ThemeProvider>
        </>
    );
}
