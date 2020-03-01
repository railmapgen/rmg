import * as React from 'react';
import { withTranslation, useTranslation } from 'react-i18next';

import { Card, List, ListItem, ListItemIcon, Icon, TextField, ListItemText, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';

import { getParams } from '../../utils';
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
}

interface DesignListGZMTRState {
    lineNum: string;
    psdNum: string;
    panelType: string;
    panelTypeDialogOpened: boolean;
    autoNumDialogOpened: boolean;
}

class DesignListGZMTR extends React.Component<DesignListGZMTRProps, DesignListGZMTRState> {
    constructor(props) {
        super(props);
        
        let param = getParams();
        this.state = {
            lineNum: param.line_num,
            psdNum: param.psd_num,
            panelType: param.info_panel_type,
            panelTypeDialogOpened: false,
            autoNumDialogOpened: false
        }
    }

    lineNumChange(event) {
        this.setState({lineNum: event.target.value});
        (window.myLine as RMGLineGZ).lineNum = event.target.value;
    }

    psdNumChange(event) {
        this.setState({psdNum: event.target.value});
        (window.myLine as RMGLineGZ).psdNum = event.target.value;
    }

    panelTypeDialogClose(action: string) {
        if (action === 'close') {
            this.setState({panelTypeDialogOpened: false});
            return;
        }
        this.setState({
            panelTypeDialogOpened: false, 
            panelType: action
        });
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
                                value={this.state.lineNum} 
                                onChange={this.lineNumChange.bind(this)}
                                style={{marginRight: 5}} />
                            <TextField
                                label={this.props.t('design.psd')}
                                variant="outlined" 
                                value={this.state.psdNum} 
                                onChange={this.psdNumChange.bind(this)} />
                        </ListItem>
                        <ListItem button onClick={() => this.setState({panelTypeDialogOpened: true})}>
                            <ListItemIcon>
                                <Icon style={{transform: 'rotate(180deg)'}}>credit_card</Icon>
                            </ListItemIcon>
                            <ListItemText
                                primary={this.props.t('design.panelType.button')}
                                secondary={this.props.t('design.panelType.'+this.state.panelType)} />
                        </ListItem>
                        <ListItem button onClick={() => this.setState({autoNumDialogOpened: true})}>
                            <ListItemIcon>
                                <Icon>filter_1</Icon>
                            </ListItemIcon>
                            <ListItemText primary={this.props.t('design.autoNum.button')} />
                        </ListItem>
                    </List>
                </Card>

                <PanelTypeDialog open={this.state.panelTypeDialogOpened} onClose={this.panelTypeDialogClose.bind(this)} />
                <AutoNumDialog open={this.state.autoNumDialogOpened} onClose={() => this.setState({autoNumDialogOpened: false})} />
            </div>
        )
    }
}

export default withTranslation()(DesignListGZMTR);

function PanelTypeDialog(props) {
    const {t, i18n} = useTranslation();

    return (
        <Dialog onClose={() => props.onClose('close')} open={props.open}>
            <DialogTitle>{t('design.panelType.title')}</DialogTitle>
            <DialogContent dividers>
                <List>
                    {Object.keys(allInfoPanelTypes).map(key => (
                        <ListItem button onClick={() => props.onClose(key)} key={key}>
                            <ListItemText primary={t('design.panelType.'+key)} />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
        </Dialog>
    );
}

function AutoNumDialog(props) {
    const {t, i18n} = useTranslation();

    const handleClick = (action: 'ascend' | 'descend') => {
        let stnList = getParams().stn_list;
        let branch0 = window.myLine.branches[0];
        branch0.forEach((stnId, i) => {
            let num: string;
            if (action === 'ascend') {
                num = (i+1).toString().padStart(2, '0');
            } else {
                num = (branch0.length-i).toString().padStart(2, '0');
            }
            (window.myLine as RMGLineGZ).updateStnNum(stnId, num);
        });

        props.onClose();
    }

    return (
        <Dialog onClose={props.onClose} open={props.open}>
            <DialogTitle>{t('design.autoNum.title')}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {t('design.autoNum.msg')}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose} color="primary" autoFocus>
                    {t('dialog.cancel')}
                </Button>
                <Button onClick={() => handleClick('ascend')} color="primary">
                    {t('design.autoNum.ascend')}
                </Button>
                <Button onClick={() => handleClick('descend')} color="primary">
                    {t('design.autoNum.descend')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}