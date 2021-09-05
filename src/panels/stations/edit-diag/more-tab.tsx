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
                    <ServiceLi stnId={props.stnId} providedServices={rmgStyleServices[rmgStyle] as Services[]} />
                )}
                {rmgStyleFacility.includes(rmgStyle) && <FacilityLi stnId={props.stnId} />}
            </List>
        </div>
    );
});

const FacilityLi = (props: { stnId: string }) => {
    const { stnId } = props;
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const { facility } = useSelector((store: RootState) => store.param.stn_list[stnId]);
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

const ServiceLi = (props: { stnId: string; providedServices: Services[] }) => {
    const { stnId, providedServices } = props;
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const { services } = useSelector((store: RootState) => store.param.stn_list[stnId]);

    const handleChange =
        (service: Services) =>
        ({ target: { checked } }: React.ChangeEvent<HTMLInputElement>) => {
            if (service === Services.local) return; // cannot remove local service
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
                                        disabled={s === Services.local}
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
