import React, { ChangeEvent, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Switch, ListItem, ListItemIcon, Icon, ListItemText, Divider, Select, makeStyles, createStyles, ListItemSecondaryAction, Collapse, List, TextField } from '@material-ui/core';
import { PanelTypeShmetro } from '../../constants/constants';
import { useAppDispatch, useAppSelector } from '../../redux';
import { setPanelType, setLineNum, setStationNumberOpen } from '../../redux/param/action';

const DesignListShmetro = () => {
    return (
        <>
            {/* TODO: Platform Door Number could be added
            <ListItem>
                <ListItemIcon>
                    <Icon>looks_one</Icon>
                </ListItemIcon>
                <ListItemText primary={t('design.psd')} />
                <TextField
                    value={param.psd_num}
                    onChange={e => dispatch({ type: 'SET_PSD_NUM', num: e.target.value })}
                />
            </ListItem> */}
            <Divider />
            <PanelTypeLi />
        </>
    );
};

export default DesignListShmetro;

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

const StationNumberSHMetroLi = () => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useAppDispatch();

    const station_number = useAppSelector(store => store.param.stn_number);
    const line_number = useAppSelector(store => store.param.line_num);

    return useMemo(() => {
        const handleSwitch = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
            if (checked) {
                dispatch(setStationNumberOpen(true));
            } else {
                dispatch(setStationNumberOpen(false));
            }
        };

        const handleChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
            dispatch(setLineNum(value));
        };

        return (
            <>
                <ListItem>
                    <ListItemIcon>
                        <Icon>account_balance_wallet</Icon>
                    </ListItemIcon>
                    <ListItemText primary={t('design.stationNumber')} />
                    <ListItemSecondaryAction>
                        <Switch color="primary" checked={station_number !== false} onChange={handleSwitch} />
                    </ListItemSecondaryAction>
                </ListItem>
                <Collapse in={station_number !== false} unmountOnExit>
                    <List component="div" disablePadding className={classes.nestedList}>
                        <ListItem>
                            <TextField placeholder={t('design.lineNum')} defaultValue={line_number} onChange={handleChange} />
                        </ListItem>
                    </List>
                </Collapse>
            </>
        );
    }, [line_number, station_number, t]);
};

const PanelTypeLi = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const panelType = useAppSelector(store => store.param.info_panel_type);
    return useMemo(() => {
        const handleChange = ({ target: { value } }: ChangeEvent<{ name?: string; value: unknown }>) => {
            dispatch(setPanelType(value as PanelTypeShmetro));
        };
        return (
            <>
                <StationNumberSHMetroLi />
                <ListItem>
                    <ListItemIcon>
                        <Icon style={{ transform: 'rotate(180deg)' }}>credit_card</Icon>
                    </ListItemIcon>
                    <ListItemText primary={t('design.panelType.button')} />
                    <Select native value={panelType} onChange={handleChange} style={{ width: 166 }}>
                        {Object.values(PanelTypeShmetro).map(type => (
                            <option key={type} value={type}>
                                {t('design.panelType.' + type)}
                            </option>
                        ))}
                    </Select>
                </ListItem>
            </>
        );
    }, [panelType, t, dispatch]);
};
