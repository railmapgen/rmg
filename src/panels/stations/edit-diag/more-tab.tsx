import React, { memo, useContext } from 'react';
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
import { ParamContext } from '../../../context';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux';
import { Facilities, RmgStyle, Services } from '../../../constants/constants';
import { addStationService, removeStationService, updateStationFacility } from '../../../redux/param/action';

export default memo(function MoreTab(props: { stnId: string }) {
    const rmgStyle = useSelector((store: RootState) => store.app.rmgStyle);
    const rmgStyleServices: { [s in RmgStyle]?: Services[] } = {
        [RmgStyle.GZMTR]: [Services.local, Services.express],
        [RmgStyle.SHMetro]: [Services.local, Services.express, Services.direct],
    };
    const rmgStyleFacility: RmgStyle[] = [RmgStyle.MTR];

    return (
        <div>
            <List>
                {rmgStyle in rmgStyleServices && (
                    <ServiceLi stnId={props.stnId} services={rmgStyleServices[rmgStyle] as Services[]} />
                )}
                {rmgStyleFacility.includes(rmgStyle) && <FacilityLi stnId={props.stnId} />}
            </List>
        </div>
    );
});

const FacilityLi = (props: { stnId: string }) => {
    const { t } = useTranslation();
    const reduxDispatch = useDispatch();
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
                    onChange={({ target: { value } }) => {
                        dispatch({
                            type: 'UPDATE_STATION_FACILITY',
                            stnId: props.stnId,
                            facility: value as Facilities,
                        });
                        reduxDispatch(updateStationFacility(props.stnId, value as Facilities));
                    }}
                >
                    {Object.values(Facilities).map(f => (
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
    const reduxDispatch = useDispatch();
    const { param, dispatch } = useContext(ParamContext);
    const services = new Set(param.stn_list[props.stnId].services);

    const handleChange =
        (service: Services) =>
        ({ target: { checked } }: React.ChangeEvent<HTMLInputElement>) => {
            if (service === Services.local) return; // cannot remove local service
            dispatch({
                type: 'UPDATE_STATION_SERVICES',
                stnId: props.stnId,
                serviceId: service,
                isChecked: checked,
            });
            if (checked) {
                reduxDispatch(addStationService(props.stnId, service));
            } else {
                reduxDispatch(removeStationService(props.stnId, service));
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
