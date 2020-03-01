import * as React from 'react';

import { Typography, Box, CircularProgress, Tabs, Tab, Icon, createMuiTheme, ThemeProvider, makeStyles, createStyles, useMediaQuery } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const PanelSave = React.lazy(() => import(/* webpackChunkName: "panelSave" */ './save'));
const PanelLayout = React.lazy(() => import(/* webpackChunkName: "panelLayout" */ './panel-layout'));
const PanelDesign = React.lazy(() => import(/* webpackChunkName: "panelDesign" */ './panel-design'));
const PanelStations = React.lazy(() => import(/* webpackChunkName: "panelStations" */ './stations'));
const PanelInfo = React.lazy(() => import(/* webpackChunkName: "panelInfo" */ './panel-info'));

const panelStyles = makeStyles(theme => (
    createStyles({
        root: {
            background: theme.palette.background.default,
        }
    })
));

interface PanelProps {
    children?: React.ReactNode;
    value: any;
}

function Panel(props: PanelProps) {
    const classes = panelStyles();

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
                return <PanelInfo />;
            default:
                return <PanelSave />;
        };
    };

    const { children, value, ...other } = props;
    return (
        <Typography
            className={classes.root}
            component="div"
            role="tabpanel"
            {...other}>
            <Box p={3} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <React.Suspense fallback={<CircularProgress />}>
                    {panel(props.value)}
                </React.Suspense>
            </Box>
        </Typography>
    );

}

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

export default function PanelTab(props) {
    const { t } = useTranslation('', { useSuspense: false });

    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const theme = prefersDarkMode ? darkTheme : lightTheme;

    const [value, setValue] = React.useState(0);

    const tabClasses = {
        root: 'tab-nav-main',
        wrapper: 'tab-nav', 
        labelIcon: 'tab-nav',
    };
    return (
        <div>
            <ThemeProvider theme={theme}>
                <Typography style={{background: theme.palette.background.default}}>
                    <Tabs value={value} indicatorColor="primary" 
                        textColor="primary" onChange={(e, val) => setValue(val)} 
                        variant="scrollable" scrollButtons="off">
                        <Tab 
                            label={<span>{t('tab.file')}</span>}
                            icon={<Icon>insert_drive_file</Icon>}
                            classes={tabClasses}
                        />
                        <Tab 
                            label={<span>{t('tab.layout')}</span>}
                            icon={<Icon>panorama</Icon>}
                            classes={tabClasses}
                        />
                        <Tab 
                            label={<span>{t('tab.design')}</span>}
                            icon={<Icon>brush</Icon>}
                            classes={tabClasses}
                        />
                        <Tab
                            label={<span>{t('tab.stations')}</span>}
                            icon={<Icon>directions_transit</Icon>}
                            classes={tabClasses}
                        />
                        <Tab
                            label={<span>{t('tab.info')}</span>}
                            icon={<Icon>info</Icon>}
                            classes={tabClasses}
                        />
                    </Tabs>
                </Typography>
                <Panel value={value} />
            </ThemeProvider>
        </div>
    );
}
