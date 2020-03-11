import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { RMGLineHK } from '../../Line/LineHK';
import { Paper, List, ListItem, ListItemIcon, Icon, ListItemText, ListItemSecondaryAction, Switch } from '@material-ui/core';

interface Props {
    destLegacy: boolean;
    txtFlip: boolean;
    paramUpdate: (key, data) => void;
}

const DesignListMTR = (props: Props) => {
    const { t } = useTranslation();
    
    const destLegacyChange = (event) => {
        props.paramUpdate('dest_legacy', event.target.checked);
        (window.myLine as RMGLineHK).destLegacy = event.target.checked;
    };

    const txtFlipChange = () => {
        let newFlip = !props.txtFlip;
        // (window.myLine as RMGLineHK).txtFlip = newFlip;
        props.paramUpdate('txt_flip', newFlip)
    };

    return (
        <div>
            <Paper>
                <List component="nav">
                    <ListItem button onClick={txtFlipChange}>
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
                                onChange={destLegacyChange}
                                checked={props.destLegacy}
                            />
                        </ListItemSecondaryAction>
                    </ListItem>
                </List>
            </Paper>
        </div>
    );
}

export default DesignListMTR;