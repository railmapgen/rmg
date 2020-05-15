import * as React from 'react';

import {
    Typography,
    CircularProgress,
    Tabs,
    Tab,
    Icon,
    makeStyles,
    createStyles,
    useTheme,
    useMediaQuery,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const PanelSave = React.lazy(() => import(/* webpackChunkName: "panelSave" */ './save'));
const PanelLayout = React.lazy(() => import(/* webpackChunkName: "panelLayout" */ './layout'));
const PanelDesign = React.lazy(() => import(/* webpackChunkName: "panelDesign" */ './design'));
const PanelStations = React.lazy(() => import(/* webpackChunkName: "panelStations" */ './stations'));
const PanelInfo = React.lazy(() => import(/* webpackChunkName: "panelInfo" */ './panel-info'));

const useStyles = makeStyles(theme =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'row',
            height: '100%',
            [theme.breakpoints.down('xs')]: {
                flexDirection: 'column',
            },
        },
        typography: {
            background: theme.palette.background.default,
        },
        tab: {
            padding: '6px 24px',
            height: 48,
            '& .MuiTab-wrapper': {
                flexDirection: 'row',
            },
            [theme.breakpoints.up('sm')]: {
                '& .MuiTab-wrapper': {
                    justifyContent: 'flex-start',
                },
            },
            [theme.breakpoints.down('xs')]: {
                minWidth: 'calc(100% / 5)',
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
        tabs: {
            overflow: 'auto',
            '&::-webkit-scrollbar': {
                width: 0,
            },
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
        },
        tabpanel: {
            overflow: 'auto',
            flex: 1,
            padding: theme.spacing(3),
            paddingBottom: 0,
            height: `calc(100% - ${theme.spacing(3)}px)`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
        },
    })
);

export default function PanelTab() {
    const { t, i18n } = useTranslation();

    const classes = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

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
                return <PanelStations />;
            case 4:
                return <PanelInfo />;
            default:
                return <PanelSave />;
        }
    };

    const tabNav = React.useMemo(
        () => (
            <Typography className={`${classes.typography} ${classes.tabs}`} component="div">
                <Tabs
                    value={value}
                    orientation={isMobile ? 'horizontal' : 'vertical'}
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
                </Tabs>
            </Typography>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [value, i18n.language, classes.tab, isMobile]
    );

    return (
        <div className={classes.root}>
            {tabNav}
            <Typography className={`${classes.typography} ${classes.tabpanel}`} component="div" role="tabpanel">
                <React.Suspense fallback={<CircularProgress />}>{panel(value)}</React.Suspense>
            </Typography>
        </div>
    );
}
