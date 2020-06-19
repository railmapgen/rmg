import React, { useContext, memo } from 'react';
import { useTranslation } from 'react-i18next';
import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Icon,
    FormControlLabel,
    FormGroup,
    Checkbox,
    ListItemSecondaryAction,
    Select,
} from '@material-ui/core';
import { ParamContext, CanvasContext } from '../../../context';

export default memo(function MoreTab(props: { stnId: string }) {
    const { rmgStyle } = useContext(CanvasContext);

    return (
        <div>
            <List>
                {rmgStyle === 'mtr' && <FacilityLi stnId={props.stnId} />}
                {rmgStyle === 'gzmtr' && <ServiceLi stnId={props.stnId} services={['local', 'express'] as Services[]} />}
                {rmgStyle === 'shmetro' && <ServiceLi stnId={props.stnId} services={['local', 'express', 'direct'] as Services[]} />}
            </List>
        </div>
    );
});

const FacilityLi = (props: { stnId: string }) => {
    const { t } = useTranslation();
    const { param, dispatch } = useContext(ParamContext);
    return (
        <ListItem>
            <ListItemIcon>
                <Icon>place</Icon>
            </ListItemIcon>
            <ListItemText primary={t('stations.edit.more.facility.button')} />
            <ListItemSecondaryAction>
                <Select
                    native
                    value={param.stn_list[props.stnId].facility}
                    onChange={e =>
                        dispatch({
                            type: 'UPDATE_STATION_FACILITY',
                            stnId: props.stnId,
                            facility: e.target.value as Facilities,
                        })
                    }
                >
                    {(['', 'airport', 'hsr', 'disney'] as Facilities[]).map(f => (
                        <option key={f} value={f}>
                            {t('stations.edit.more.facility.' + (f === '' ? 'none' : f))}
                        </option>
                    ))}
                </Select>
            </ListItemSecondaryAction>
        </ListItem>
    );
};

const ServiceLi = (props: { stnId: string, services: Services[] }) => {
    const { t } = useTranslation();
    const { param, dispatch } = useContext(ParamContext);
    const services = new Set(param.stn_list[props.stnId].services);

    const handleChange = (service: Services) => (event: React.ChangeEvent<HTMLInputElement>) => {
        if (service === 'local') return;
        dispatch({
            type: 'UPDATE_STATION_SERVICES',
            stnId: props.stnId,
            serviceId: service,
            isChecked: event.target.checked,
        });
    };
    return (
        <ListItem>
            <ListItemIcon>
                <Icon>train</Icon>
            </ListItemIcon>
            <ListItemText
                primary={t('stations.edit.more.services.button')}
                secondary={
                    <FormGroup row>
                        {props.services.map(s => (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={services.has(s)}
                                        value={s}
                                        onChange={handleChange(s)}
                                        disabled={s === 'local'}
                                    />
                                }
                                label={t('stations.edit.more.services.' + s)}
                                key={s}
                            />
                        ))}
                    </FormGroup>
                }
                secondaryTypographyProps={{ ['component' as any]: 'div' }}
            />
        </ListItem>
    );
};
