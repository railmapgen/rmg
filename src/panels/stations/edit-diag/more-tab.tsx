import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { List, ListItem, ListItemIcon, ListItemText, Icon, Dialog, DialogTitle, DialogContent, RadioGroup, FormControlLabel, Radio, DialogActions, Button, FormGroup, Checkbox, ListItemSecondaryAction } from '@material-ui/core';

const allFacilities = {
    '': 'None',
    airport: 'Airport', 
    hsr: 'High Speed Rail', 
    disney: 'Disneyland Resort', 
}

const allServices = {
    local: 'Stopping', 
    express: 'Express', 
}

interface StationEditMoreTabProps {
    onUpdate: (value: any, field: string) => void;
    facility: keyof typeof allFacilities;
    services: Set<keyof typeof allServices>;
}

export default (props: StationEditMoreTabProps) => {
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
                {window.urlParams.get('style')==='mtr' && <ListItem button onClick={() => setFacilityDialogOpen(true)}>
                    <ListItemIcon>
                        <Icon>place</Icon>
                    </ListItemIcon>
                    <ListItemText 
                        primary={t('stations.edit.more.facility.button')} 
                        secondary={t('stations.edit.more.facility.'+(props.facility==='' ? 'none' : props.facility))} />
                </ListItem>}
                {window.urlParams.get('style')==='gzmtr' && <ListItem>
                    <ListItemIcon>
                        <Icon>train</Icon>
                    </ListItemIcon>
                    <ListItemText primary={t('stations.edit.more.services.button')} secondary={
                        <FormGroup row>
                            {Object.keys(allServices).map((s: 'local' | 'express') => (
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={props.services.has(s)} value={s}
                                            onChange={servicesChange(s)} disabled={s==='local'} />
                                    }
                                    label={t('stations.edit.more.services.'+s)} key={s}
                                />
                            ))}
                      </FormGroup>
                    } secondaryTypographyProps={{['component' as any]: 'div'}} />
                </ListItem>}
            </List>

            {window.urlParams.get('style')==='mtr' && <FacilityDialog open={facilityDialogOpen} onClose={facilityDialogClose} facility={props.facility} />}
        </div>
    );
}

interface FacilityDialogProps {
    open: boolean;
    onClose: (action: string) => void;
    facility: keyof typeof allFacilities;
}

function FacilityDialog(props: FacilityDialogProps) {
    const { t } = useTranslation();
    return (
        <Dialog open={props.open} onClose={() => props.onClose('close')}>
            <DialogTitle>{t('stations.edit.more.facility.title')}</DialogTitle>
            <DialogContent dividers>
                <RadioGroup
                    name="facility"
                    value={props.facility}
                    onChange={(e) => props.onClose(e.target.value)}
                >
                    {Object.keys(allFacilities).map(f => (
                        <FormControlLabel value={f} key={f} control={<Radio />} 
                            label={t('stations.edit.more.facility.'+(f==='' ? 'none' : f))} />
                    ))}
                </RadioGroup>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => props.onClose('close')} color="primary" autoFocus>
                    {t('dialog.done')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
