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
    Popper,
    useMediaQuery,
} from '@material-ui/core';
import { CanvasContext } from './context';

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
    const { t } = useTranslation();
    const classes = useStyles();
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    return React.useMemo(
        () => (
            <AppBar position="sticky" className={prefersDarkMode ? classes.rootDark : classes.rootLight}>
                <Toolbar variant="dense">
                    <Typography variant="h6" className={classes.title} color="textPrimary">
                        {t('title')}
                    </Typography>

                    <CanvasToggle />

                    {/* <Tooltip title="Information">
                    <IconButton className={classes.menuButton}>
                        <Icon>info</Icon>
                    </IconButton>
                </Tooltip> */}
                </Toolbar>
            </AppBar>
        ),
        [prefersDarkMode]
    );
};

export default AppAppBar;

const CanvasToggle = () => {
    const { t } = useTranslation();

    const classes = useStyles();

    const { canvasAvailable, setCanvasToShown } = React.useContext(CanvasContext);
    const [canvasButtonEl, setCanvasButtonEl] = React.useState<null | HTMLElement>(null);
    const handleClick = (action: 'destination' | 'runin' | 'railmap' | 'all') => () => {
        setCanvasToShown(action);
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
                    {canvasAvailable.map(c => (
                        <MenuItem key={c} dense onClick={handleClick(c)}>
                            {t('toggle.' + c)}
                        </MenuItem>
                    ))}
                    <Divider style={{ margin: '6px 0' }} />
                    <MenuItem dense onClick={handleClick('all')}>
                        {t('toggle.all')}
                    </MenuItem>
                </Menu>
            </>
        ),
        [canvasAvailable.toString(), canvasButtonEl]
    );
};
