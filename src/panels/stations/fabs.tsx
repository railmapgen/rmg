import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Fab, Tooltip, Icon, Menu, MenuItem, createStyles, makeStyles, ListItemText, ListItemIcon } from '@material-ui/core';

const useStyles = makeStyles(theme => (
    createStyles({
        fab: {
            position: 'fixed',
            right: theme.spacing(2),
            bottom: theme.spacing(2),
        }
    })
))

interface Props {
    onAction: (action: string) => void;
}

const StationFabs = React.memo((props: Props) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [fabEl, setFabEl] = React.useState<null | HTMLElement>(null);

    const handleAction = (action: string) => () => {
        setFabEl(null);
        props.onAction(action);
    }

    return (
        <>
            <Tooltip title={t('stations.fabs.tooltip')} aria-label="options">
                <Fab color="primary" className={classes.fab}
                    onClick={(e) => setFabEl(e.target as HTMLElement)}>
                    <Icon>more_vert</Icon>
                </Fab>
            </Tooltip>


            <Menu
                anchorEl={fabEl}
                open={Boolean(fabEl)}
                onClose={() => setFabEl(null)}>
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
                {window.urlParams.get('style')==='gzmtr' && <MenuItem onClick={handleAction('autonum')}>
                    <ListItemIcon>
                        <Icon>filter_1</Icon>
                    </ListItemIcon>
                    <ListItemText primary={t('design.autoNum.button')} />
                </MenuItem>}
            </Menu>
        </>
    )
}, () => true)

export default StationFabs;