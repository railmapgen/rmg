import * as React from 'react';

import { List, ListItem, ListItemIcon, Avatar, TextField, Icon } from '@material-ui/core';
import { StationInfo } from '../types';

interface StationEditNameTabProps {
    onUpdate: (event, field, index?) => void;
    stnInfo: StationInfo;
}

export default class StationEditNameTab extends React.Component<StationEditNameTabProps> {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <List>
                <ListItem>
                    <ListItemIcon>
                        <Avatar>漢</Avatar>
                    </ListItemIcon>
                    <TextField 
                        style={{width: '100%'}}
                        variant="outlined"
                        label="Name (in Chinese characters)"
                        onChange={(e) => this.props.onUpdate(e.target.value, 'name', 0)}
                        value={this.props.stnInfo.name[0]} />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <Avatar>A</Avatar>
                    </ListItemIcon>
                    <TextField 
                        style={{width: '100%'}}
                        variant="outlined"
                        label="Name (in Latin characters)"
                        onChange={(e) => this.props.onUpdate(e.target.value, 'name', 1)}
                        value={this.props.stnInfo.name[1]}
                        helperText="Use a backslash (\) to wrap text" />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <Icon>looks_one</Icon>
                    </ListItemIcon>
                    <TextField 
                        style={{width: '100%'}}
                        variant="outlined"
                        label="Station Number"
                        onChange={(e) => this.props.onUpdate(e.target.value, 'num')}
                        value={this.props.stnInfo.num} />
                </ListItem>
            </List>
        )
    }
}
