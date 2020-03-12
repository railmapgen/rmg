import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ParamContext } from '../../context';
import {
    Paper,
    List,
    ListItem,
    ListItemIcon,
    Icon,
    ListItemText,
    ListItemSecondaryAction,
    Switch,
} from '@material-ui/core';

const DesignListMTR = () => {
    const { t } = useTranslation();
    const { param, dispatch } = React.useContext(ParamContext);

    return (
        <div>
            <Paper>
                <List component="nav">
                    <ListItem button onClick={() => dispatch({ type: 'SET_TEXT_FLIP' })}>
                        <ListItemIcon>
                            <Icon>swap_vert</Icon>
                        </ListItemIcon>
                        <ListItemText primary={t('design.flipName')} />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <Icon>rotate_left</Icon>
                        </ListItemIcon>
                        <ListItemText primary={t('design.MTRLegacy')} />
                        <ListItemSecondaryAction>
                            <Switch
                                edge="end"
                                onChange={(_, checked) => dispatch({ type: 'SET_DEST_LEGACY', isLegacy: checked })}
                                checked={param.dest_legacy}
                            />
                        </ListItemSecondaryAction>
                    </ListItem>
                </List>
            </Paper>
        </div>
    );
};

export default DesignListMTR;
