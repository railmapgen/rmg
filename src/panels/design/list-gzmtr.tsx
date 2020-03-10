import * as React from 'react';
import { withTranslation, useTranslation } from 'react-i18next';

import { Card, List, ListItem, ListItemIcon, Icon, TextField, ListItemText, Dialog, DialogTitle, DialogContent } from '@material-ui/core';

import { RMGLineGZ } from '../../Line/LineGZ';

const allInfoPanelTypes = {
    gz1: 'Line 1',
    gz28: 'Line 2/8',
    gz3: 'Line 3',
    gzgf: 'Line 6/Guangfo Line',
    gz1421: 'Line 14/21',
}

interface DesignListGZMTRProps {
    t: any;
    lineNum: string;
    psdNum: string;
    panelType: string;
    paramUpdate: (key, data) => void;
}

interface DesignListGZMTRState {
    panelTypeDialogOpened: boolean;
    autoNumDialogOpened: boolean;
}

class DesignListGZMTR extends React.Component<DesignListGZMTRProps, DesignListGZMTRState> {
    constructor(props) {
        super(props);

        this.state = {
            panelTypeDialogOpened: false,
            autoNumDialogOpened: false
        }
    }

    lineNumChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.props.paramUpdate('line_num', event.target.value);
        (window.myLine as RMGLineGZ).lineNum = event.target.value;
    }

    psdNumChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.props.paramUpdate('psd_num', event.target.value);
        (window.myLine as RMGLineGZ).psdNum = event.target.value;
    }

    panelTypeDialogClose(action: string) {
        if (action === 'close') {
            this.setState({ panelTypeDialogOpened: false });
            return;
        }
        this.setState({
            panelTypeDialogOpened: false,
            // panelType: action
        });
        this.props.paramUpdate('info_panel_type', action);
        (window.myLine as RMGLineGZ).infoPanelType = action;
    }

    render() {
        return (
            <div>
                <Card>
                    <List component="nav">
                        <ListItem>
                            <ListItemIcon>
                                <Icon>looks_one</Icon>
                            </ListItemIcon>
                            <TextField
                                label={this.props.t('design.lineNum')}
                                variant="outlined"
                                value={this.props.lineNum}
                                onChange={this.lineNumChange.bind(this)}
                                style={{ marginRight: 5 }} />
                            <TextField
                                label={this.props.t('design.psd')}
                                variant="outlined"
                                value={this.props.psdNum}
                                onChange={this.psdNumChange.bind(this)} />
                        </ListItem>
                        <ListItem button onClick={() => this.setState({ panelTypeDialogOpened: true })}>
                            <ListItemIcon>
                                <Icon style={{ transform: 'rotate(180deg)' }}>credit_card</Icon>
                            </ListItemIcon>
                            <ListItemText
                                primary={this.props.t('design.panelType.button')}
                                secondary={this.props.t('design.panelType.' + this.props.panelType)} />
                        </ListItem>
                    </List>
                </Card>

                <PanelTypeDialog open={this.state.panelTypeDialogOpened} onClose={this.panelTypeDialogClose.bind(this)} />
            </div>
        )
    }
}

export default withTranslation()(DesignListGZMTR);

function PanelTypeDialog(props) {
    const { t } = useTranslation();

    return (
        <Dialog onClose={() => props.onClose('close')} open={props.open}>
            <DialogTitle>{t('design.panelType.title')}</DialogTitle>
            <DialogContent dividers>
                <List>
                    {Object.keys(allInfoPanelTypes).map(key => (
                        <ListItem button onClick={() => props.onClose(key)} key={key}>
                            <ListItemText primary={t('design.panelType.' + key)} />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
        </Dialog>
    );
}

