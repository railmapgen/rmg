import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { List, ListItem, ListItemIcon, ListItemText, Icon, Dialog, DialogTitle, DialogContent, RadioGroup, FormControlLabel, Radio, DialogActions, Button, FormGroup, Checkbox, ListItemSecondaryAction } from '@material-ui/core';

const allFacilities = {
    '': 'None',
    airport: 'Airport', 
    disney: 'Disneyland Resort', 
    hsr: 'High Speed Rail', 
}

const allServices = {
    local: 'Stopping', 
    express: 'Express', 
}

interface StationEditMoreTabProps {
    onUpdate: (value: any, field: string) => void;
    facility: 'airport' | 'disney' | 'hsr' | '';
    services: Set<'local' | 'express'>;
}

export default function StationEditMoreTab(props: StationEditMoreTabProps) {
    const {t, i18n} = useTranslation();
    const [facilityDialogOpen, setFacilityDialogOpen] = React.useState(false);

    const facilityDialogClose = (action: string) => {
        if (action !== 'close') props.onUpdate(action, 'facility');
        setFacilityDialogOpen(false);
    }

    const servicesChange = (service: 'local' | 'express') => (event: React.ChangeEvent<HTMLInputElement>) => {
        if (service === 'local') return;
        props.onUpdate({chipId: service, selected: event.target.checked}, 'services');
    }

    return (
        <div>
            <List>
                <ListItem button onClick={() => setFacilityDialogOpen(true)}>
                    <ListItemIcon>
                        <Icon>place</Icon>
                    </ListItemIcon>
                    <ListItemText primary={t('stations.edit.more.facility')} secondary={allFacilities[props.facility]} />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <Icon>train</Icon>
                    </ListItemIcon>
                    <ListItemText primary="Train Services" />
                    <ListItemSecondaryAction>
                        <FormGroup row>
                            {Object.keys(allServices).map((s: 'local' | 'express') => (
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={props.services.has(s)} value={s}
                                            onChange={servicesChange(s)} disabled={s==='local'} />
                                    }
                                    label={allServices[s]} key={s}
                                />
                            ))}
                      </FormGroup>
                    </ListItemSecondaryAction>
                </ListItem>
            </List>

            <FacilityDialog open={facilityDialogOpen} onClose={facilityDialogClose} facility={props.facility} />
        </div>
    );
}

interface FacilityDialogProps {
    open: boolean;
    onClose: (action: string) => void;
    facility: 'airport' | 'disney' | 'hsr' | '';
}

function FacilityDialog(props: FacilityDialogProps) {
    return (
        <Dialog open={props.open} onClose={() => props.onClose('close')}>
            <DialogTitle>Choose A Facility Near This Station</DialogTitle>
            <DialogContent dividers>
                <RadioGroup
                    name="facility"
                    value={props.facility}
                    onChange={(e) => props.onClose(e.target.value)}
                >
                    {Object.keys(allFacilities).map(f => (
                        <FormControlLabel value={f} key={f} control={<Radio />} label={allFacilities[f]} />
                    ))}
                </RadioGroup>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => props.onClose('close')} color="primary" autoFocus>
                    Done
                </Button>
            </DialogActions>
        </Dialog>
    );
}
