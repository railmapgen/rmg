import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { List, ListItem, ListItemIcon, Avatar, TextField, Icon } from '@material-ui/core';
import { StationInfo } from '../../../types';

import NameListItems from './name-list-items';

interface Props {
    onUpdate: (event, field, index?) => void;
    stnInfo: StationInfo;
}

export default (props: Props) => {
    const { t } = useTranslation();

    const handleUpdate = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
        props.onUpdate(event.target.value, 'name', index);
    };

    return (
        <List>
            <NameListItems name={props.stnInfo.name} onUpdate={handleUpdate} />
            <ListItem>
                <ListItemIcon>
                    <Icon>looks_one</Icon>
                </ListItemIcon>
                <TextField 
                    style={{width: '100%'}}
                    variant="outlined"
                    label={t('stations.edit.name.num')}
                    onChange={(e) => props.onUpdate(e.target.value, 'num')}
                    value={props.stnInfo.num} />
            </ListItem>
        </List>
    );
}
