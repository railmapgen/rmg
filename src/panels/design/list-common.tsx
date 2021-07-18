import React, { ChangeEvent, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Button,
    Collapse,
    createStyles,
    Divider,
    Icon,
    List,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    makeStyles,
    Switch,
    TextField,
} from '@material-ui/core';
import ColourDialog from '../colour-diag';
import { ParamContext } from '../../context';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux';
import { Name, RmgStyle, ShortDirection } from '../../constants/constants';
import { setDirection, setLineName, setPlatform, setTheme } from '../../redux/param/action';

const useStyles = makeStyles(theme =>
    createStyles({
        dividerVertical: {
            margin: theme.spacing(0, 2),
        },
        nestedList: {
            paddingLeft: theme.spacing(5),
        },
    })
);

const DesignList = () => {
    const { t } = useTranslation();
    const reduxDispatch = useDispatch();

    const rmgStyle = useSelector((store: RootState) => store.app.rmgStyle);
    const lineName = useSelector((store: RootState) => store.param.line_name);
    const theme = useSelector((store: RootState) => store.param.theme);

    const { dispatch } = React.useContext(ParamContext);

    const [isCDiagOpen, setIsCDiagOpen] = React.useState(false);

    const nameDialogUpdate = (key: string, value: any) => {
        if (key === 'name') {
            dispatch({ type: 'SET_LINE_NAME', name: Object.values(value) as Name });
            reduxDispatch(setLineName(Object.values(value) as Name));
        }
        if (key === 'theme') {
            dispatch({ type: 'SET_THEME', theme: value });
            reduxDispatch(setTheme(value));
        }
    };

    return (
        <>
            <ListItem button onClick={() => setIsCDiagOpen(true)}>
                <ListItemIcon>
                    <Icon>color_lens</Icon>
                </ListItemIcon>
                <ListItemText
                    primary={t('design.theme')}
                    secondary={
                        <span
                            style={{
                                backgroundColor: theme[2],
                                color: theme[3],
                                padding: '.1rem .3rem',
                            }}
                        >
                            {Object.values(lineName).join()}
                        </span>
                    }
                />
                <Icon color="action">arrow_right</Icon>
            </ListItem>
            <ColourDialog
                open={isCDiagOpen}
                theme={theme}
                lineName={lineName}
                onUpdate={nameDialogUpdate}
                onClose={() => setIsCDiagOpen(false)}
            />
            <Divider />
            <DirectionLi />
            <Divider />
            {rmgStyle === RmgStyle.SHMetro ? <PlatformNumSHMetroLi /> : <PlatformNumLi />}
        </>
    );
};

export default DesignList;

const DirectionLi = () => {
    const { t } = useTranslation();
    const classes = useStyles();
    const reduxDispatch = useDispatch();
    const { dispatch } = React.useContext(ParamContext);

    const direction = useSelector((store: RootState) => store.param.direction);

    return React.useMemo(() => {
        const handleDirectionChange = () => {
            dispatch({ type: 'SET_DIRECTION' });
            reduxDispatch(setDirection(direction === ShortDirection.left ? ShortDirection.right : ShortDirection.left));
        };

        return (
            <ListItem>
                <ListItemIcon>
                    <Icon>directions</Icon>
                </ListItemIcon>
                <ListItemText primary={t('design.direction.button')} secondary={t('design.direction.' + direction)} />
                <Divider orientation="vertical" flexItem className={classes.dividerVertical} />
                <Button variant="outlined" color="primary" onClick={handleDirectionChange}>
                    {t('design.direction.switch')}
                </Button>
            </ListItem>
        );
    }, [classes.dividerVertical, direction, t, dispatch, reduxDispatch]);
};

const PlatformNumLi = () => {
    const { t } = useTranslation();
    const reduxDispatch = useDispatch();
    const { dispatch } = React.useContext(ParamContext);

    const platform = useSelector((store: RootState) => store.param.platform_num);

    return React.useMemo(() => {
        const handleChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
            dispatch({ type: 'SET_PLATFORM', platform: value });
            reduxDispatch(setPlatform(value));
        };

        return (
            <ListItem>
                <ListItemIcon>
                    <Icon>looks_one</Icon>
                </ListItemIcon>
                <ListItemText primary={t('design.platform')} />
                <TextField value={platform} onChange={handleChange} />
            </ListItem>
        );
    }, [platform, dispatch, reduxDispatch, t]);
};

const PlatformNumSHMetroLi = () => {
    const { t } = useTranslation();
    const classes = useStyles();
    const reduxDispatch = useDispatch();
    const { dispatch } = useContext(ParamContext);

    const platform = useSelector((store: RootState) => store.param.platform_num);

    return useMemo(() => {
        const handleSwitch = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
            if (checked) {
                dispatch({ type: 'SET_PLATFORM', platform: '' });
                reduxDispatch(setPlatform(''));
            } else {
                dispatch({ type: 'SET_PLATFORM', platform: false });
                reduxDispatch(setPlatform(false));
            }
        };

        const handleChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
            dispatch({ type: 'SET_PLATFORM', platform: value });
            reduxDispatch(setPlatform(value));
        };

        return (
            <>
                <ListItem>
                    <ListItemIcon>
                        <Icon>looks_one</Icon>
                    </ListItemIcon>
                    <ListItemText primary={t('design.platform')} />
                    <ListItemSecondaryAction>
                        <Switch color="primary" checked={platform !== false} onChange={handleSwitch} />
                    </ListItemSecondaryAction>
                </ListItem>
                <Collapse in={platform !== false} unmountOnExit>
                    <List component="div" disablePadding className={classes.nestedList}>
                        <ListItem>
                            <TextField placeholder={t('design.platform')} value={platform} onChange={handleChange} />
                        </ListItem>
                    </List>
                </Collapse>
            </>
        );
    }, [platform, classes.nestedList, t, reduxDispatch, dispatch]);
};
