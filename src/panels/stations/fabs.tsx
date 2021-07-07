import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    createStyles,
    Fab,
    Icon,
    ListItemIcon,
    ListItemText,
    makeStyles,
    Menu,
    MenuItem,
    Tooltip,
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux';
import { RmgStyle } from '../../constants/constants';

const useStyles = makeStyles(theme =>
    createStyles({
        fab: {
            position: 'fixed',
            right: theme.spacing(2),
            bottom: theme.spacing(2),
        },
    })
);

interface Props {
    onAction: (action: string) => void;
}

const StationFabs = React.memo(
    (props: Props) => {
        const { t } = useTranslation();
        const rmgStyle = useSelector((store: RootState) => store.app.rmgStyle);
        const classes = useStyles();
        const [fabEl, setFabEl] = React.useState<null | HTMLElement>(null);

        const handleAction = (action: string) => () => {
            setFabEl(null);
            props.onAction(action);
        };

        return (
            <>
                <Tooltip title={t('stations.fabs.tooltip')} aria-label="options">
                    <Fab color="primary" className={classes.fab} onClick={e => setFabEl(e.target as HTMLElement)}>
                        <Icon>more_vert</Icon>
                    </Fab>
                </Tooltip>

                <Menu anchorEl={fabEl} open={Boolean(fabEl)} onClose={() => setFabEl(null)}>
                    <MenuItem onClick={handleAction('add')}>
                        <ListItemIcon>
                            <Icon>add_box</Icon>
                        </ListItemIcon>
                        <ListItemText primary={t('stations.fabs.add')} />
                    </MenuItem>
                    <MenuItem onClick={handleAction('reverse')}>
                        <ListItemIcon>
                            <Icon>cached</Icon>
                        </ListItemIcon>
                        <ListItemText primary={t('stations.fabs.reverse')} />
                    </MenuItem>
                    {rmgStyle === RmgStyle.GZMTR && (
                        <MenuItem onClick={handleAction('autonum')}>
                            <ListItemIcon>
                                <Icon>filter_1</Icon>
                            </ListItemIcon>
                            <ListItemText primary={t('design.autoNum.button')} />
                        </MenuItem>
                    )}
                </Menu>
            </>
        );
    },
    () => true
);

export default StationFabs;
