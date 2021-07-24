import React, { useContext, useState } from 'react';
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
import { ParamContext } from '../../context';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux';
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
    const { tpo } = useContext(ParamContext);

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
    const { t } = useTranslation();
    const classes = useStyles();
    const reduxDispatch = useDispatch();

    const rmgStyle = useSelector((store: RootState) => store.app.rmgStyle);
    const { param, dispatch } = useContext(ParamContext);

    const { name, num } = param.stn_list[props.stnId] || param.stn_list.linestart;

    const [toggleEl, setToggleEl] = useState<null | HTMLElement>(null);

    const handleCurrent = () => {
        dispatch({ type: 'SET_CURRENT_STATION', stnId: props.stnId });
        reduxDispatch(setCurrentStation(props.stnId));
        setToggleEl(null);
    };

    const handleAction = (action: 'edit' | 'remove') => () => {
        props.onAction(action);
        setToggleEl(null);
    };

    return (
        <ListItem className={props.isSelected ? classes.selectedItem : ''}>
            {rmgStyle === RmgStyle.GZMTR && <Typography className={classes.listItemNum}>{num}</Typography>}
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
