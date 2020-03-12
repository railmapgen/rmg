import * as React from 'react';
import { useTranslation } from 'react-i18next';

import {
    Card,
    List,
    ListItem,
    ListItemIcon,
    Icon,
    TextField,
    ListItemText,
    Dialog,
    DialogTitle,
    DialogContent,
} from '@material-ui/core';

import { ParamContext } from '../../context';

const allInfoPanelTypes = {
    gz1: 'Line 1',
    gz28: 'Line 2/8',
    gz3: 'Line 3',
    gzgf: 'Line 6/Guangfo Line',
    gz1421: 'Line 14/21',
};

const DesignListGZMTR = () => {
    const { t } = useTranslation();
    const { param, dispatch } = React.useContext(ParamContext);

    const [panelTypeDialogOpened, setPanelTypeDialogOpened] = React.useState(false);

    const panelTypeDialogClose = (action: 'close' | 'gz1' | 'gz28' | 'gz3' | 'gz1421' | 'gzgf') => {
        if (action !== 'close') dispatch({ type: 'SET_PANEL_TYPE', variant: action });
        setPanelTypeDialogOpened(false);
    };

    return (
        <div>
            <Card>
                <List component="nav">
                    <ListItem>
                        <ListItemIcon>
                            <Icon>looks_one</Icon>
                        </ListItemIcon>
                        <TextField
                            label={t('design.lineNum')}
                            variant="outlined"
                            value={param.line_num}
                            onChange={e => dispatch({ type: 'SET_LINE_NUM', num: e.target.value })}
                            style={{ marginRight: 5 }}
                        />
                        <TextField
                            label={t('design.psd')}
                            variant="outlined"
                            value={param.psd_num}
                            onChange={e => dispatch({ type: 'SET_PSD_NUM', num: e.target.value })}
                        />
                    </ListItem>
                    <ListItem button onClick={() => setPanelTypeDialogOpened(true)}>
                        <ListItemIcon>
                            <Icon style={{ transform: 'rotate(180deg)' }}>credit_card</Icon>
                        </ListItemIcon>
                        <ListItemText
                            primary={t('design.panelType.button')}
                            secondary={t('design.panelType.' + param.info_panel_type)}
                        />
                    </ListItem>
                </List>
            </Card>

            <PanelTypeDialog open={panelTypeDialogOpened} onClose={panelTypeDialogClose} />
        </div>
    );
};

export default DesignListGZMTR;

interface PanelTypeDialogProps {
    open: boolean;
    onClose: (action: 'close' | 'gz1' | 'gz28' | 'gz3' | 'gz1421' | 'gzgf') => void;
}

function PanelTypeDialog(props: PanelTypeDialogProps) {
    const { t } = useTranslation();

    return (
        <Dialog onClose={() => props.onClose('close')} open={props.open}>
            <DialogTitle>{t('design.panelType.title')}</DialogTitle>
            <DialogContent dividers>
                <List>
                    {Object.keys(allInfoPanelTypes).map((key: keyof typeof allInfoPanelTypes) => (
                        <ListItem button onClick={() => props.onClose(key)} key={key}>
                            <ListItemText primary={t('design.panelType.' + key)} />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
        </Dialog>
    );
}
