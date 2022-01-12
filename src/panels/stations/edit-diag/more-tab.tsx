import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Checkbox,
    FormControlLabel,
    FormGroup,
    Icon,
    List,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    Select,
} from '@material-ui/core';
import { useAppDispatch, useAppSelector } from '../../../redux';
import { Facilities, RmgStyle, Services } from '../../../constants/constants';
import { addStationService, removeStationService, updateStationFacility } from '../../../redux/param/action';

export default memo(function MoreTab(props: { stnId: string }) {
    const rmgStyle = useAppSelector(store => store.param.style);
    const rmgStyleServices: { [s in RmgStyle]?: Services[] } = {
        [RmgStyle.GZMTR]: [Services.local, Services.express],
        [RmgStyle.SHMetro]: [Services.local, Services.express, Services.direct],
    };
    const rmgStyleFacility: { [s in RmgStyle]?: Facilities[] } = {
        [RmgStyle.MTR]: [Facilities.airport, Facilities.disney, Facilities.hsr, Facilities.none],
        [RmgStyle.SHMetro]: [Facilities.railway, Facilities.airport, Facilities.disney, Facilities.none],
    };

    return (
        <div>
            <List>
                {rmgStyle in rmgStyleServices && (
                    <ServiceLi stnId={props.stnId} providedServices={rmgStyleServices[rmgStyle] as Services[]} />
                )}
                {rmgStyle in rmgStyleFacility && (
                    <FacilityLi stnId={props.stnId} providedFacilities={rmgStyleFacility[rmgStyle] as Facilities[]} />
                )}
            </List>
        </div>
    );
});

const FacilityLi = (props: { stnId: string; providedFacilities: Facilities[] }) => {
    const { stnId, providedFacilities } = props;
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const { facility } = useAppSelector(store => store.param.stn_list[stnId]);
    return (
        <ListItem>
            <ListItemIcon>
                <Icon>place</Icon>
            </ListItemIcon>
            <ListItemText primary={t('stations.edit.more.facility.button')} />
            <ListItemSecondaryAction>
                <Select
                    native
                    value={facility}
                    onChange={({ target: { value } }) => {
                        dispatch(updateStationFacility(stnId, value as Facilities));
                    }}
                >
                    {providedFacilities.map(f => (
                        <option key={f} value={f}>
                            {t('stations.edit.more.facility.' + (f === '' ? 'none' : f))}
                        </option>
                    ))}
                </Select>
            </ListItemSecondaryAction>
        </ListItem>
    );
};

const ServiceLi = (props: { stnId: string; providedServices: Services[] }) => {
    const { stnId, providedServices } = props;
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const rmgStyle = useAppSelector(store => store.param.style);
    const { services } = useAppSelector(store => store.param.stn_list[stnId]);

    const handleChange =
        (service: Services) =>
        ({ target: { checked } }: React.ChangeEvent<HTMLInputElement>) => {
            // only shmetro can remove local service
            if (service === Services.local && rmgStyle !== RmgStyle.SHMetro) return;

            if (checked) {
                dispatch(addStationService(props.stnId, service));
            } else {
                dispatch(removeStationService(props.stnId, service));
            }
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
                        {providedServices.map(s => (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={services.includes(s)}
                                        value={s}
                                        onChange={handleChange(s)}
                                        disabled={s === Services.local && rmgStyle !== RmgStyle.SHMetro}
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
