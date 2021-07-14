import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { ListItem, ListItemIcon, Icon, ListItemText, Divider, Select } from '@material-ui/core';

import { ParamContext } from '../../context';
import { PanelTypeShmetro } from '../../constants/constants';

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
    const { param, dispatch } = useContext(ParamContext);

    return useMemo(
        () => (
            <>
                <ListItem>
                    <ListItemIcon>
                        <Icon style={{ transform: 'rotate(180deg)' }}>credit_card</Icon>
                    </ListItemIcon>
                    <ListItemText primary={t('design.panelType.button')} />
                    <Select
                        native
                        value={param.info_panel_type}
                        onChange={e =>
                            dispatch({ type: 'SET_PANEL_TYPE', variant: e.target.value as PanelTypeShmetro })
                        }
                        style={{ width: 166 }}
                    >
                        {Object.values(PanelTypeShmetro).map(type => (
                            <option key={type} value={type}>
                                {t('design.panelType.' + type)}
                            </option>
                        ))}
                    </Select>
                </ListItem>
            </>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [param.info_panel_type]
    );
};
