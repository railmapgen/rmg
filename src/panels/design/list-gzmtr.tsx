import * as React from 'react';
import { useTranslation } from 'react-i18next';

import {
    ListItem,
    ListItemIcon,
    Icon,
    TextField,
    ListItemText,
    makeStyles,
    createStyles,
    FormControlLabel,
    RadioGroup,
    Radio,
    Collapse,
    Divider,
} from '@material-ui/core';

import { ParamContext } from '../../context';

const allInfoPanelTypes = {
    gz1: 'Line 1',
    gz28: 'Line 2/8',
    gz3: 'Line 3',
    gzgf: 'Line 6/Guangfo Line',
    gz1421: 'Line 14/21',
};

const useStyles = makeStyles(theme =>
    createStyles({
        radioGroup: {
            paddingLeft: theme.spacing(5),
            paddingBottom: theme.spacing(1),
        },
    })
);

const DesignListGZMTR = () => {
    const { t } = useTranslation();

    const { param, dispatch } = React.useContext(ParamContext);

    return (
        <>
            <ListItem>
                <ListItemIcon>
                    <Icon>looks_one</Icon>
                </ListItemIcon>
                <ListItemText primary={t('design.lineNum')} />
                <TextField
                    value={param.line_num}
                    onChange={e => dispatch({ type: 'SET_LINE_NUM', num: e.target.value })}
                    style={{ marginRight: 5 }}
                />
            </ListItem>
            <Divider />
            <ListItem>
                <ListItemIcon>
                    <Icon>looks_one</Icon>
                </ListItemIcon>
                <ListItemText primary={t('design.psd')} />
                <TextField
                    value={param.psd_num}
                    onChange={e => dispatch({ type: 'SET_PSD_NUM', num: e.target.value })}
                />
            </ListItem>
            <Divider />
            <PanelTypeLi />
        </>
    );
};

export default DesignListGZMTR;

const PanelTypeLi = () => {
    const { t } = useTranslation();
    const classes = useStyles();

    const { param, dispatch } = React.useContext(ParamContext);
    const [open, setOpen] = React.useState(false);

    return React.useMemo(
        () => (
            <>
                <ListItem button onClick={() => setOpen(prevOpen => !prevOpen)}>
                    <ListItemIcon>
                        <Icon style={{ transform: 'rotate(180deg)' }}>credit_card</Icon>
                    </ListItemIcon>
                    <ListItemText
                        primary={t('design.panelType.button')}
                        secondary={open ? '' : t('design.panelType.' + param.info_panel_type)}
                    />
                    {open ? <Icon color="action">expand_less</Icon> : <Icon color="action">expand_more</Icon>}
                </ListItem>
                <Collapse in={open} unmountOnExit>
                    <RadioGroup
                        name="panel-type"
                        value={param.info_panel_type}
                        className={classes.radioGroup}
                        onChange={e =>
                            dispatch({
                                type: 'SET_PANEL_TYPE',
                                variant: e.target.value as 'gz1' | 'gz28' | 'gz3' | 'gz1421' | 'gzgf',
                            })
                        }
                    >
                        {Object.keys(allInfoPanelTypes).map(type => (
                            <FormControlLabel
                                value={type}
                                key={type}
                                control={<Radio size="small" color="primary" />}
                                label={t('design.panelType.' + type)}
                            />
                        ))}
                    </RadioGroup>
                </Collapse>
            </>
        ),
        [param.info_panel_type, open, classes.radioGroup]
    );
};
