import React, { ChangeEvent, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ListItem, ListItemIcon, Icon, ListItemText, Divider, Select } from '@material-ui/core';
import { PanelTypeShmetro } from '../../constants/constants';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux';
import { setPanelType } from '../../redux/param/action';

const DesignListShmetro = () => {
    return (
        <>
            {/* TODO: Platform Door Number could be added
            <ListItem>
                <ListItemIcon>
                    <Icon>looks_one</Icon>
                </ListItemIcon>
                <ListItemText primary={t('design.psd')} />
                <TextField
                    value={param.psd_num}
                    onChange={e => dispatch({ type: 'SET_PSD_NUM', num: e.target.value })}
                />
            </ListItem> */}
            <Divider />
            <PanelTypeLi />
        </>
    );
};

export default DesignListShmetro;

const PanelTypeLi = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const panelType = useSelector((store: RootState) => store.param.info_panel_type);

    return useMemo(() => {
        const handleChange = ({ target: { value } }: ChangeEvent<{ name?: string; value: unknown }>) => {
            dispatch(setPanelType(value as PanelTypeShmetro));
        };
        return (
            <ListItem>
                <ListItemIcon>
                    <Icon style={{ transform: 'rotate(180deg)' }}>credit_card</Icon>
                </ListItemIcon>
                <ListItemText primary={t('design.panelType.button')} />
                <Select native value={panelType} onChange={handleChange} style={{ width: 166 }}>
                    {Object.values(PanelTypeShmetro).map(type => (
                        <option key={type} value={type}>
                            {t('design.panelType.' + type)}
                        </option>
                    ))}
                </Select>
            </ListItem>
        );
    }, [panelType, t, dispatch]);
};
