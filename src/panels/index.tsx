import * as React from 'react';
import { createMuiTheme, useMediaQuery, ThemeProvider, CircularProgress } from '@material-ui/core';

import PanelTabs from './panels';
import { RMGParam } from '../types';

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
            }
        }
    }
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
            }
        }, 
    }
});

interface Props {
    param: RMGParam;
    paramUpdate: (key, data) => void;
    tpo: string[];
}

export default (props: Props) => {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const theme = prefersDarkMode ? darkTheme : lightTheme;

    return (
        <div>
            <ThemeProvider theme={theme}>
                <React.Suspense fallback={<CircularProgress />}>
                    <PanelTabs {...props} />
                </React.Suspense>
            </ThemeProvider>
        </div>
    );
}