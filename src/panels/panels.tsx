import * as React from 'react';

import { Typography, Box, CircularProgress, Tabs, Tab, Icon, createMuiTheme, ThemeProvider, makeStyles, createStyles, useMediaQuery } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const PanelSave = React.lazy(() => import(/* webpackChunkName: "panelSave" */ './save'));
const PanelLayout = React.lazy(() => import(/* webpackChunkName: "panelLayout" */ './layout'));
const PanelDesign = React.lazy(() => import(/* webpackChunkName: "panelDesign" */ './design'));
const PanelStations = React.lazy(() => import(/* webpackChunkName: "panelStations" */ './stations'));
const PanelPids = React.lazy(() => import(/* webpackChunkName: "panelPids" */ './pids'));
const PanelInfo = React.lazy(() => import(/* webpackChunkName: "panelInfo" */ './panel-info'));

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

const useStyles = makeStyles(theme => (
    createStyles({
        typography: {
            background: theme.palette.background.default,
        }, 
        tab: {
            padding: '6px 24px', 
            height: 48, 
            minWidth: 'calc(100% / 6)', 
            '& .MuiTab-wrapper': {
                flexDirection: 'row', 
            }, 
            '&.MuiTab-labelIcon': {
                minHeight: 'unset', 
                '& .MuiTab-wrapper': {
                    '& > *:first-child': {
                        marginBottom: 0, 
                    },
                    '& > *:not(first-child)': {
                        paddingLeft: 8
                    },
                }, 
            },
        }, 
        box: {
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
        }
    })
));

export default function PanelTab(props) {
    const { t, i18n } = useTranslation('', { useSuspense: false });

    const classes = useStyles();
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const theme = prefersDarkMode ? darkTheme : lightTheme;

    const [value, setValue] = React.useState(4);

    const panel = (index: number) => {
        switch (index) {
            case 0:
                return <PanelSave />;
            case 1:
                return <PanelLayout />;
            case 2:
                return <PanelDesign />;
            case 3:
                return <PanelStations />
            case 4: 
                return <PanelPids />;
            case 5:
                return <PanelInfo />;
            default:
                return <PanelSave />;
        };
    };

    return (
        <div>
            <ThemeProvider theme={theme}>
                <Typography className={classes.typography} component="div">
                    <Tabs value={value} indicatorColor="primary" 
                        textColor="primary" onChange={(_, val) => setValue(val)} 
                        variant="scrollable" scrollButtons="off">
                        {[
                            ['file', 'insert_drive_file'], 
                            ['layout', 'panorama'], 
                            ['design', 'brush'], 
                            ['stations', 'directions_transit'], 
                            ['pids', 'ondemand_video'],
                            ['info', 'info']
                        ].map(val => (
                            <Tab label={<span>{t('tab.'+val[0])}</span>}
                                icon={<Icon>{val[1]}</Icon>}
                                className={classes.tab} />
                        ))}
                        />
                    </Tabs>
                </Typography>
                <Typography
                    className={classes.typography}
                    component="div"
                    role="tabpanel">
                    <Box p={3} className={classes.box}>
                        <React.Suspense fallback={<CircularProgress />}>
                            {panel(value)}
                        </React.Suspense>
                    </Box>
                </Typography>
            </ThemeProvider>
        </div>
    );
}
