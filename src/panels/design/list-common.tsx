import React, { ChangeEvent, useMemo } from 'react';
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
import { useAppDispatch, useAppSelector } from '../../redux';
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
    const dispatch = useAppDispatch();

    const rmgStyle = useAppSelector(store => store.app.rmgStyle);
    const lineName = useAppSelector(store => store.param.line_name);
    const theme = useAppSelector(store => store.param.theme);

    const [isCDiagOpen, setIsCDiagOpen] = React.useState(false);

    const nameDialogUpdate = (key: string, value: any) => {
        if (key === 'name') {
            dispatch(setLineName(Object.values(value) as Name));
        }
        if (key === 'theme') {
            dispatch(setTheme(value));
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
    const dispatch = useAppDispatch();

    const direction = useAppSelector(store => store.param.direction);

    return React.useMemo(() => {
        const handleDirectionChange = () => {
            dispatch(setDirection(direction === ShortDirection.left ? ShortDirection.right : ShortDirection.left));
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
    }, [classes.dividerVertical, direction, t, dispatch]);
};

const PlatformNumLi = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const platform = useAppSelector(store => store.param.platform_num);

    return React.useMemo(() => {
        const handleChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
            dispatch(setPlatform(value));
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
    }, [platform, dispatch, t]);
};

const PlatformNumSHMetroLi = () => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useAppDispatch();

    const platform = useAppSelector(store => store.param.platform_num);

    return useMemo(() => {
        const handleSwitch = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
            if (checked) {
                dispatch(setPlatform(''));
            } else {
                dispatch(setPlatform(false));
            }
        };

        const handleChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
            dispatch(setPlatform(value));
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
    }, [platform, classes.nestedList, t, dispatch]);
};
