import * as React from 'react';
import { StationInfo } from '../../types';
import { MenuItem, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemIcon, Icon, TextField } from '@material-ui/core';
import { formatStnName } from '../../utils';

interface RangeDialogProps {
    open: boolean;
    onClose: (action: string) => () => void;
    stnList: {[stnId: string]: StationInfo};
}

export default (props: RangeDialogProps) => {
    const stationMenuItems = React.useMemo(() => (
        window.myLine.tpo.map(stnId => (
            <MenuItem key={stnId} value={stnId}>
                {formatStnName(props.stnList[stnId])}
            </MenuItem>
        ))
    ), [props.stnList]);

    return (
        <Dialog open={props.open} onClose={props.onClose('close')}>
            <DialogTitle>Title</DialogTitle>
            <DialogContent dividers>
                <List component="nav">
                    <ListItem>
                        <ListItemIcon>
                            <Icon>departure_board</Icon>
                        </ListItemIcon>
                        <TextField select
                            style={{width: '100%'}}
                            variant="outlined"
                            label="Start"
                            onChange={(e) => window.myPids.start = e.target.value} >
                            {stationMenuItems}
                        </TextField>
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <Icon>departure_board</Icon>
                        </ListItemIcon>
                        <TextField select
                            style={{width: '100%'}}
                            variant="outlined"
                            label="End" 
                            onChange={(e) => window.myPids.end = e.target.value} >
                            {stationMenuItems}
                        </TextField>
                    </ListItem>
                </List>
            </DialogContent>
        </Dialog>
    )
}
