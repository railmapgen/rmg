import React, { useContext, memo, useMemo, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { ParamContext } from '../../context';
import {
    Divider,
    List,
    ListItem,
    ListItemIcon,
    Icon,
    ListItemText,
    ListItemSecondaryAction,
    Switch,
    Collapse,
    makeStyles,
    createStyles,
    TextField,
    Grid,
    Button,
} from '@material-ui/core';
import { Name } from '../../constants/constants';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux';
import {
    customiseDestinationName,
    flipStationNames,
    toggleLineNameBeforeDestination,
    staggerStationNames,
} from '../../redux/param/action';

const useStyles = makeStyles(theme =>
    createStyles({
        divider: {
            margin: theme.spacing(0, 2),
        },
        nested: {
            paddingLeft: theme.spacing(5),
        },
        grid: {
            paddingLeft: theme.spacing(8),
            paddingBottom: theme.spacing(1),
            paddingRight: theme.spacing(2),
            '& .MuiFormControl-root': {
                width: '100%',
            },
        },
    })
);

export default memo(function DesignListMTR() {
    return (
        <>
            <NamePosLi />
            <Divider />
            <CustomiseDest />
        </>
    );
});

const NamePosLi = () => {
    const { t } = useTranslation();
    const classes = useStyles();
    const reduxDispatch = useDispatch();

    const namePosition = useSelector((store: RootState) => store.param.namePosMTR);

    const { dispatch } = useContext(ParamContext);

    return useMemo(() => {
        const handleStaggerChange = (_: ChangeEvent, checked: boolean) => {
            dispatch({ type: 'SET_TEXT_STAGGER', checked });
            reduxDispatch(staggerStationNames(checked));
        };

        const handleFlip = () => {
            dispatch({ type: 'SET_TEXT_FLIP' });
            reduxDispatch(flipStationNames());
        };

        return (
            <>
                <ListItem>
                    <ListItemIcon>
                        <Icon>text_rotation_none</Icon>
                    </ListItemIcon>
                    <ListItemText primary={t('design.txtFlip.text')} />
                    <ListItemSecondaryAction>
                        <Switch
                            edge="end"
                            color="primary"
                            checked={namePosition.isStagger}
                            onChange={handleStaggerChange}
                        />
                    </ListItemSecondaryAction>
                </ListItem>

                <List component="div" disablePadding>
                    <ListItem className={classes.nested}>
                        <ListItemText primary={t('design.txtFlip.flipText')} />
                        <Divider orientation="vertical" flexItem className={classes.divider} />
                        <Button variant="outlined" color="primary" onClick={handleFlip}>
                            {t('design.txtFlip.flip')}
                        </Button>
                    </ListItem>
                </List>
            </>
        );
    }, [namePosition.isStagger, classes.nested, classes.divider, dispatch, reduxDispatch, t]);
};

const CustomiseDest = () => {
    const { t } = useTranslation();
    const classes = useStyles();
    const reduxDispatch = useDispatch();

    const customisedMtrDestination = useSelector((store: RootState) => store.param.customiseMTRDest);
    const { dispatch } = React.useContext(ParamContext);
    const [open, setOpen] = React.useState(
        customisedMtrDestination.isLegacy || customisedMtrDestination.terminal !== false
    );

    return useMemo(() => {
        const handleShowNameChange = (_: ChangeEvent, checked: boolean) => {
            dispatch({ type: 'SET_DEST_LEGACY', isLegacy: checked });
            reduxDispatch(toggleLineNameBeforeDestination(checked));
        };

        const handleIsCustomisedChange = (_: ChangeEvent, checked: boolean) => {
            const customisedName = checked ? (['', ''] as Name) : false;
            dispatch({ type: 'SET_TERMINAL_OVERRIDE', terminal: customisedName });
            reduxDispatch(customiseDestinationName(customisedName));
        };

        const handleNameChange =
            (index: number) =>
            ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
                let terminal =
                    customisedMtrDestination.terminal !== false
                        ? (customisedMtrDestination.terminal.map((val, i) => (i === index ? value : val)) as Name)
                        : false;
                dispatch({ type: 'SET_TERMINAL_OVERRIDE', terminal });
                reduxDispatch(customiseDestinationName(terminal));
            };

        return (
            <>
                <ListItem button onClick={() => setOpen(prevOpen => !prevOpen)}>
                    <ListItemIcon>
                        <Icon>text_fields</Icon>
                    </ListItemIcon>
                    <ListItemText primary={t('design.MTRDest.button')} />
                    {open ? <Icon color="action">expand_less</Icon> : <Icon color="action">expand_more</Icon>}
                </ListItem>
                <Collapse in={open}>
                    <List component="div" disablePadding>
                        <ListItem className={classes.nested}>
                            <ListItemText primary={t('design.MTRDest.legacy')} />
                            <ListItemSecondaryAction>
                                <Switch
                                    color="primary"
                                    edge="end"
                                    onChange={handleShowNameChange}
                                    checked={customisedMtrDestination.isLegacy}
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem className={classes.nested}>
                            <ListItemText primary={t('design.MTRDest.terminal')} />
                            <ListItemSecondaryAction>
                                <Switch
                                    color="primary"
                                    edge="end"
                                    checked={customisedMtrDestination.terminal !== false}
                                    onChange={handleIsCustomisedChange}
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                        <Collapse in={customisedMtrDestination.terminal !== false} unmountOnExit>
                            <Grid
                                container
                                spacing={1}
                                justify="center"
                                alignItems="flex-start"
                                className={classes.grid}
                            >
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label={t('design.MTRDest.zh')}
                                        value={
                                            customisedMtrDestination.terminal
                                                ? customisedMtrDestination.terminal[0]
                                                : ''
                                        }
                                        onChange={handleNameChange(0)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label={t('design.MTRDest.en')}
                                        value={
                                            customisedMtrDestination.terminal
                                                ? customisedMtrDestination.terminal[1]
                                                : ''
                                        }
                                        onChange={handleNameChange(1)}
                                    />
                                </Grid>
                            </Grid>
                        </Collapse>
                    </List>
                </Collapse>
            </>
        );
    }, [
        customisedMtrDestination.isLegacy,
        customisedMtrDestination.terminal,
        open,
        classes.nested,
        classes.grid,
        t,
        dispatch,
        reduxDispatch,
    ]);
};
