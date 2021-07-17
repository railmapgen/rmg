import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
    AppBar,
    Toolbar,
    Tooltip,
    IconButton,
    Typography,
    Icon,
    makeStyles,
    createStyles,
    Menu,
    MenuItem,
    Divider,
    useMediaQuery,
} from '@material-ui/core';
import { AllCanvas, canvasConfig, CanvasType } from "./constants/constants";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './redux';
import { selectCanvas, zoomIn, zoomOut } from "./redux/app/action";

const useStyles = makeStyles(theme =>
    createStyles({
        rootLight: {
            backgroundColor: theme.palette.primary.main,
        },
        rootDark: {
            backgroundColor: theme.palette.background.paper,
        },
        title: {
            flexGrow: 1,
            color: '#fff',
        },
        menuButton: {
            color: '#fff',
        },
    })
);

const AppAppBar = () => {
    const { t, i18n } = useTranslation();
    const classes = useStyles();
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    return React.useMemo(
        () => (
            <AppBar position="sticky" className={prefersDarkMode ? classes.rootDark : classes.rootLight}>
                <Toolbar variant="dense">
                    <Typography variant="h6" className={classes.title} color="textPrimary">
                        {process.env.PUBLIC_URL.includes('uat') ? t('titleUAT') : t('title')}
                    </Typography>

                    <CanvasToggle />
                    <ZoomToggles />
                </Toolbar>
            </AppBar>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [prefersDarkMode, i18n.language]
    );
};

export default AppAppBar;

const CanvasToggle = () => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();

    const rmgStyle = useSelector((store: RootState) => store.app.rmgStyle);

    const [canvasButtonEl, setCanvasButtonEl] = React.useState<null | HTMLElement>(null);
    const handleClick = (action: CanvasType | typeof AllCanvas) => () => {
        dispatch(selectCanvas(action));
        setCanvasButtonEl(null);
    };

    return React.useMemo(
        () => (
            <>
                <Tooltip title={t('toggle.tooltip')}>
                    <IconButton onClick={e => setCanvasButtonEl(e.currentTarget)} className={classes.menuButton}>
                        <Icon>photo_library</Icon>
                    </IconButton>
                </Tooltip>
                <Menu anchorEl={canvasButtonEl} open={Boolean(canvasButtonEl)} onClose={() => setCanvasButtonEl(null)}>
                    {canvasConfig[rmgStyle].map(c => (
                        <MenuItem key={c} onClick={handleClick(c)}>
                            {t('toggle.' + c)}
                        </MenuItem>
                    ))}
                    <Divider style={{ margin: '6px 0' }} />
                    <MenuItem onClick={handleClick(AllCanvas)}>{t('toggle.all')}</MenuItem>
                </Menu>
            </>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [rmgStyle, canvasButtonEl, classes.menuButton]
    );
};

const ZoomToggles = () => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();

    return React.useMemo(
        () => (
            <>
                <Tooltip title={t('zoom.out')}>
                    <IconButton
                        onClick={() => dispatch(zoomOut())}
                        className={classes.menuButton}
                    >
                        <Icon>zoom_out</Icon>
                    </IconButton>
                </Tooltip>
                <Tooltip title={t('zoom.in')}>
                    <IconButton
                        onClick={() => dispatch(zoomIn())}
                        className={classes.menuButton}
                    >
                        <Icon>zoom_in</Icon>
                    </IconButton>
                </Tooltip>
            </>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [classes.menuButton]
    );
};
