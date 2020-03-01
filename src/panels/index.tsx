import * as React from 'react';
import { createMuiTheme, useMediaQuery, ThemeProvider } from '@material-ui/core';

import PanelTabs from './panels';

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
});

export default (props) => {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const theme = prefersDarkMode ? darkTheme : lightTheme;

    return (
        <div>
            <ThemeProvider theme={theme}>
                <PanelTabs />
            </ThemeProvider>
        </div>
    );
}