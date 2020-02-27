import * as React from 'react';

import { Typography, Box, CircularProgress, Tabs, Tab, Icon, createMuiTheme, ThemeProvider } from '@material-ui/core';
import { withTranslation } from 'react-i18next';

const PanelSave = React.lazy(() => import(/* webpackChunkName: "panelSave" */ './panel-save'));
const PanelLayout = React.lazy(() => import(/* webpackChunkName: "panelLayout" */ './panel-layout'));
const PanelDesign = React.lazy(() => import(/* webpackChunkName: "panelDesign" */ './panel-design'));
const PanelStations = React.lazy(() => import(/* webpackChunkName: "panelStations" */ './panel-stations'));
const PanelInfo = React.lazy(() => import(/* webpackChunkName: "panelInfo" */ './panel-info'));

interface PanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

interface PanelState {
    panel: JSX.Element;
}

class Panel extends React.Component<PanelProps, PanelState> {
    constructor(props) {
        super(props);

        this.state = {
            panel: this.panel
        }
    }

    get panel() {
        switch (this.props.value) {
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
    }

    componentDidUpdate(prevProps) {
        if (prevProps.value === this.props.value) {return;}
        this.setState({panel: this.panel});
    }

    render() {
        // const { children, value, index, ...other } = this.props;
        // return (
        //     <Typography
        //       component="div"
        //       role="tabpanel"
        //       hidden={value !== index}
        //       id={`simple-tabpanel-${index}`}
        //       aria-labelledby={`simple-tab-${index}`}
        //       {...other}
        //     >
        //       {value === index && <Box p={3}>{children}</Box>}
        //     </Typography>
        // );
        const { children, value, index, ...other } = this.props;
        return (
            <Typography
                component="div"
                role="tabpanel"
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}>
                <Box p={3} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <React.Suspense fallback={<CircularProgress />}>
                        {this.state.panel}
                    </React.Suspense>
                </Box>
            </Typography>
        )
    }
}

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#6200ee',
            dark: '#bb86fc',
        },
        secondary: {
            main: '#018786',
        },
        error: {
            main: '#b00020',
            dark: '#cf6679',
        }, 
    },
});

interface PanelTabProps {
    t: any;
}

interface PanelTabState {
    value: number;
}

class PanelTab extends React.Component<PanelTabProps, PanelTabState> {
    constructor(props) {
        super(props);
        this.state = {
            value: 0
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event: React.ChangeEvent<{}>, newValue: number) {
        this.setState({value: newValue})
    };

    render() {
        let tabClasses = {
            root: 'tab-nav-main',
            wrapper: 'tab-nav', 
            labelIcon: 'tab-nav',
        };
        return (
            <div>
                <ThemeProvider theme={theme}>
                    <div>
                        <Tabs value={this.state.value} indicatorColor="primary" textColor="primary" onChange={this.handleChange} variant="scrollable" scrollButtons="off">
                            <Tab 
                                label={<span>{this.props.t('tab.file')}</span>}
                                icon={<Icon>insert_drive_file</Icon>}
                                classes={tabClasses}
                            />
                            <Tab 
                                label={<span>{this.props.t('tab.layout')}</span>}
                                icon={<Icon>panorama</Icon>}
                                classes={tabClasses}
                            />
                            <Tab 
                                label={<span>{this.props.t('tab.design')}</span>}
                                icon={<Icon>brush</Icon>}
                                classes={tabClasses}
                            />
                            <Tab
                                label={<span>{this.props.t('tab.stations')}</span>}
                                icon={<Icon>directions_transit</Icon>}
                                classes={tabClasses}
                            />
                            <Tab
                                label={<span>{this.props.t('tab.info')}</span>}
                                icon={<Icon>info</Icon>}
                                classes={tabClasses}
                            />
                        </Tabs>
                    </div>
                    <Panel value={this.state.value} index={0} />
                </ThemeProvider>
            </div>
        );
    }
}

export default withTranslation()(PanelTab);