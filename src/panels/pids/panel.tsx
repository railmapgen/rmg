import * as React from 'react';
import { Grid, ListItemText, List, ListItem, ListItemIcon, Icon, Paper, TextField, Dialog, DialogContent, DialogTitle, MenuItem } from '@material-ui/core';
import { formatStnName, getParams } from '../../utils';
import { StationInfo } from '../../types';

import RangeDialog from './range-diag';
import TimetableDialog from './timetable-diag';

export default (props) => {
    return (
        <Grid container spacing={3} justify="center" alignItems="flex-start">
            <Grid item xs={12} sm={12} md={6} lg={5}>
                <PidsList />
            </Grid>
        </Grid>
    )
}

function PidsList(props) {
    const [duration, setDuration] = React.useState('00:00:10:00');
    const [frameRate, setFrameRate] = React.useState('24');
    const [rangeDialogOpened, setRangeDialogOpened] = React.useState(false);
    const [timetableDialogOpened, setTimetableDialogOpened] = React.useState(false);

    const stnList = getParams().stn_list;

    const durationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDuration(event.target.value);
        window.myPids.duration = event.target.value;
    };

    const frameRateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFrameRate(event.target.value);
        window.myPids.frameRate = event.target.value;
    };

    const rangeDialogClose = (action: string) => () => {
        if (action === 'close') {
            setRangeDialogOpened(false);
            return;
        }
    }

    const timetableDialogClose = (action: string) => () => {
        if (action === 'close') {
            setTimetableDialogOpened(false);
            return;
        }
    }
    
    return (
        <div>
            <Paper>
                <List component="nav">
                    <ListItem>
                        <ListItemIcon>
                            <Icon>timelapse</Icon>
                        </ListItemIcon>
                        <TextField
                            label="Duration"
                            variant="outlined" 
                            value={duration} 
                            onChange={durationChange} />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <Icon>timer</Icon>
                        </ListItemIcon>
                        <TextField
                            label="Frame Rate"
                            variant="outlined" 
                            value={frameRate} 
                            onChange={frameRateChange} />
                    </ListItem>
                    <ListItem button onClick={() => setRangeDialogOpened(true)}>
                        <ListItemIcon>
                            <Icon>departure_board</Icon>
                        </ListItemIcon>
                        <ListItemText primary="Start" />
                    </ListItem>
                    <ListItem button onClick={() => setTimetableDialogOpened(true)}>
                        <ListItemIcon>
                            <Icon>timeline</Icon>
                        </ListItemIcon>
                        <ListItemText primary="Timetable" />
                    </ListItem>
                </List>
            </Paper>

            <RangeDialog open={rangeDialogOpened} onClose={rangeDialogClose} stnList={stnList} />
            <TimetableDialog open={timetableDialogOpened} onClose={timetableDialogClose} stnList={stnList} />
        </div>
    )
}
