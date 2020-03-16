import * as React from 'react';

import {
    Typography,
    Box,
    CircularProgress,
    Tabs,
    Tab,
    Icon,
    createMuiTheme,
    ThemeProvider,
    makeStyles,
    createStyles,
    useMediaQuery,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { RMGParam } from '../types';

const PanelSave = React.lazy(() => import(/* webpackChunkName: "panelSave" */ './save'));
const PanelLayout = React.lazy(() => import(/* webpackChunkName: "panelLayout" */ './layout'));
const PanelDesign = React.lazy(() => import(/* webpackChunkName: "panelDesign" */ './design'));
const PanelStations = React.lazy(() => import(/* webpackChunkName: "panelStations" */ './stations'));
const PanelInfo = React.lazy(() => import(/* webpackChunkName: "panelInfo" */ './panel-info'));

const useStyles = makeStyles(theme =>
    createStyles({
        typography: {
            background: theme.palette.background.default,
        },
        tab: {
            padding: '6px 24px',
            height: 48,
            minWidth: 'calc(100% / 5)',
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
                        paddingLeft: 8,
                    },
                },
            },
        },
        box: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
    })
);

interface Props {
    param: RMGParam;
    paramUpdate: (key, data) => void;
    tpo: string[];
}

export default function PanelTab(props: Props) {
    const { t, i18n } = useTranslation();

    const classes = useStyles();

    const [value, setValue] = React.useState(0);

    const panel = (index: number) => {
        switch (index) {
            case 0:
                return <PanelSave />;
            case 1:
                return <PanelLayout />;
            case 2:
                return <PanelDesign />;
            case 3:
                return (
                    <PanelStations
                        theme={props.param.theme}
                        stnList={props.param.stn_list}
                        currentId={props.param.current_stn_idx}
                        paramUpdate={props.paramUpdate}
                        tpo={props.tpo}
                    />
                );
            case 4:
                return <PanelInfo />;
            default:
                return <PanelSave />;
        }
    };

    const tabNav = React.useMemo(
        () => (
            <Typography className={classes.typography} component="div">
                <Tabs
                    value={value}
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={(_, val) => setValue(val)}
                    variant="scrollable"
                    scrollButtons="off"
                >
                    {[
                        ['file', 'insert_drive_file'],
                        ['layout', 'panorama'],
                        ['design', 'brush'],
                        ['stations', 'directions_transit'],
                        ['info', 'info'],
                    ].map((val, i) => (
                        <Tab
                            label={<span>{t('tab.' + val[0])}</span>}
                            icon={<Icon>{val[1]}</Icon>}
                            key={i}
                            className={classes.tab}
                        />
                    ))}
                    />
                </Tabs>
            </Typography>
        ),
        [value, i18n.language, classes.tab]
    );

    return (
        <>
            {tabNav}
            <Typography className={classes.typography} component="div" role="tabpanel" style={{ overflow: 'auto' }}>
                <Box p={3} className={classes.box}>
                    <React.Suspense fallback={<CircularProgress />}>{panel(value)}</React.Suspense>
                </Box>
            </Typography>
        </>
    );
}
