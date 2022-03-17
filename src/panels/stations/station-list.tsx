import React, { useState } from 'react';
import {
    createStyles,
    Divider,
    Icon,
    IconButton,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    makeStyles,
    Menu,
    MenuItem,
    Paper,
    Typography,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../redux';
import { RmgStyle } from '../../constants/constants';
import { setCurrentStation } from '../../redux/param/action';

const useStyles = makeStyles(theme =>
    createStyles({
        listItemNum: {
            marginRight: theme.spacing(1),
            fontSize: '1.2rem',
        },
        listItemText: {
            display: 'flex',
            alignItems: 'baseline',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            '& .MuiListItemText-primary': {
                marginRight: theme.spacing(1),
            },
        },
        selectedItem: {
            background: theme.palette.action.hover,
        },
    })
);

interface Props {
    selectedId: string;
    onAction: (stnId: string) => (action: 'edit' | 'remove') => void;
}

const StationList = (props: Props) => {
    const tpo = useAppSelector(store => store.helper.tpo);

    return (
        <Paper>
            <List dense disablePadding>
                {tpo.map(stnId => (
                    <React.Fragment key={stnId}>
                        <StationEntry
                            stnId={stnId}
                            isSelected={stnId === props.selectedId}
                            onAction={props.onAction(stnId)}
                        />
                        <Divider />
                    </React.Fragment>
                ))}
            </List>
        </Paper>
    );
};

export default StationList;

const StationEntry = (props: { stnId: string; isSelected: boolean; onAction: (action: 'edit' | 'remove') => void }) => {
    const { stnId, isSelected, onAction } = props;
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useAppDispatch();

    const rmgStyle = useAppSelector(store => store.param.style);
    const stationInfo = useAppSelector(store => store.param.stn_list[stnId]);
    const stn_number = useAppSelector(store => store.param.showStationNumber);

    const name = stationInfo?.name || ['', ''];
    const num = stationInfo?.num || '00';

    const [toggleEl, setToggleEl] = useState<null | HTMLElement>(null);

    const handleCurrent = () => {
        dispatch(setCurrentStation(stnId));
        setToggleEl(null);
    };

    const handleAction = (action: 'edit' | 'remove') => () => {
        onAction(action);
        setToggleEl(null);
    };

    return (
        <ListItem className={isSelected ? classes.selectedItem : ''}>
            {(rmgStyle === RmgStyle.GZMTR || (rmgStyle === RmgStyle.SHMetro && stn_number)) && <Typography className={classes.listItemNum}>{num}</Typography>}
            <ListItemText primary={name[0]} secondary={name[1].replace('\\', ' ')} className={classes.listItemText} />
            <ListItemSecondaryAction>
                <IconButton size="small" onClick={e => setToggleEl(e.currentTarget)}>
                    <Icon>more_vert</Icon>
                </IconButton>
                <Menu anchorEl={toggleEl} open={Boolean(toggleEl)} onClose={() => setToggleEl(null)}>
                    <MenuItem onClick={handleCurrent}>{t('stations.current')}</MenuItem>
                    <MenuItem onClick={handleAction('edit')}>{t('stations.edit.button')}</MenuItem>
                    <MenuItem onClick={handleAction('remove')}>{t('stations.remove.button')}</MenuItem>
                </Menu>
            </ListItemSecondaryAction>
        </ListItem>
    );
};
