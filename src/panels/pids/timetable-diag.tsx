import * as React from 'react';
import { Dialog, DialogTitle, DialogContent, List, ListItem, ListItemIcon, Icon, ListItemText, TextField } from '@material-ui/core';
import { StationInfo } from '../../types';

interface Props {
    open: boolean;
    onClose: (action: string) => () => void;
    stnList: {[stnId: string]: StationInfo};
}

export default (props: Props) => {
    return (
        <Dialog open={props.open} onClose={props.onClose('close')}>
            <DialogTitle>Title</DialogTitle>
            <DialogContent dividers>
                <List component="nav">
                    {window.myPids.timetableStnName.map(stnId => (
                        <ListItem>
                            <ListItemIcon>
                                <Icon>timelapse</Icon>
                            </ListItemIcon>
                            <ListItemText 
                                primary={props.stnList[stnId].name[0]}
                                secondary={[
                                    <TextField
                                        label="Duration"
                                        variant="outlined"  />, 
                                    <TextField
                                        label="Duration"
                                        variant="outlined"  />
                                ]} />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
        </Dialog>
    )
}