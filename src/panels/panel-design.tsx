import * as React from 'react';

import { Grid, Paper, List, ListItem, ListItemIcon, Icon, ListItemText, TextField, ListItemSecondaryAction, Switch, Card, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';

import { getParams, getTransText, countryCode2Emoji } from '../utils';
import { CityEntry, LineEntry, Name, InterchangeInfo } from '../types';
import { RMGLineHK } from '../Line/LineHK';
import { RMGLineGZ } from '../Line/LineGZ';

const NameDialog = React.lazy(() => import(/* webpackChunkName: "panelNameDiag" */ './panel-name-diag'));
import ColourDialog from './panel-colour-diag';
import { withTranslation, useTranslation } from 'react-i18next';

export default class PanelDesign extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Grid container spacing={3} justify="center" alignItems="flex-start">
                <Grid item xs={12} sm={6} md={5} lg={4}>
                    <TranslatedDesignList />
                </Grid>
                {window.urlParams.get('style') === 'mtr' ? 
                <Grid item xs={12} sm={6} md={5} lg={4}>
                    <DesignListMTR />
                </Grid> : 
                <div />}
                {window.urlParams.get('style') === 'gzmtr' ? 
                <Grid item xs={12} sm={6} md={5} lg={4}>
                    <TranslatedDesignListGZMTR />
                </Grid> : 
                <div />}
            </Grid>
        );
    }
}

const allDirections = {
    l: 'Left', r: 'Right'
};

interface DesignListProps {
    t: any;
}

interface DesignListState {
    theme: [string, string, string, '#000' | '#fff'];
    lineName: Name;
    direction: 'l' | 'r';
    platformNum: string;

    themeDialogOpened: boolean;
    nameDialogOpened: boolean;
}

class DesignList extends React.Component<DesignListProps, DesignListState> {
    constructor(props) {
        super(props);

        let param = getParams();
        this.state = {
            theme: param.theme, 
            lineName: param.line_name,
            direction: param.direction, 
            platformNum: param.platform_num, 

            themeDialogOpened: false, 
            nameDialogOpened: false,
        }

        this.themeDialogClose = this.themeDialogClose.bind(this);
        this.directionClick = this.directionClick.bind(this);
        this.platformNumChange = this.platformNumChange.bind(this);
    }

    themeDialogClose(action: string | string[]) {
        if (action === 'close') {
            this.setState({themeDialogOpened: false});
            return;
        } else {
            this.setState({
                theme: action as [string, string, string, '#000' | '#fff'], 
                themeDialogOpened: false
            });
            window.myLine.theme = action as [string, string, string, '#000' | '#fff'];
        }
    }

    nameDialogUpdate(key: string, value: any) {
        if (key === 'name') {
            window.myLine.lineNames = Object.values(value) as Name;
            this.setState({lineName: value});
        }
        if (key === 'theme') {
            window.myLine.theme = value;
            this.setState({theme: value});
        }
    }

    directionClick() {
        if (this.state.direction === 'r') {
            this.setState({direction: 'l'});
            window.myLine.direction = 'l';
        } else {
            this.setState({direction: 'r'});
            window.myLine.direction = 'r';
        }
    }

    platformNumChange(event) {
        this.setState({platformNum: event.target.value});
        window.myLine.platformNum = event.target.value;
    }

    render() {
        return (
            <div>
                <Paper>
                    <List component="nav">
                        <ListItem button onClick={() => this.setState({nameDialogOpened: true})}>
                            <ListItemIcon>
                                <Icon>color_lens</Icon>
                            </ListItemIcon>
                            <ListItemText primary={this.props.t('design.theme')} secondary={
                                <span style={{
                                    backgroundColor: this.state.theme[2], 
                                    color: this.state.theme[3], 
                                    paddingRight: '.3rem', 
                                    paddingLeft: '.3rem'
                                }}>{Object.values(this.state.lineName).join()}</span>
                            } />
                        </ListItem>
                        <ListItem button onClick={this.directionClick}>
                            <ListItemIcon>
                                <Icon>directions</Icon>
                            </ListItemIcon>
                            <ListItemText
                                primary={this.props.t('design.direction.button')}
                                secondary={this.props.t('design.direction.'+this.state.direction)} />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <Icon>looks_one</Icon>
                            </ListItemIcon>
                            <TextField
                                label={this.props.t('design.platform')}
                                variant="outlined" 
                                value={this.state.platformNum} 
                                onChange={this.platformNumChange} />
                        </ListItem>
                        <ListItem button onClick={() => window.myLine.reverseStns()}>
                            <ListItemIcon>
                                <Icon>cached</Icon>
                            </ListItemIcon>
                            <ListItemText primary={this.props.t('design.reverse')} />
                        </ListItem>
                    </List>
                </Paper>

                <ColourDialog
                    open={this.state.nameDialogOpened}
                    theme={this.state.theme} lineName={this.state.lineName}
                    onUpdate={this.nameDialogUpdate.bind(this)}
                    onClose={() => this.setState({nameDialogOpened: false})}
                />
            </div>
        )
    }
}

const TranslatedDesignList = withTranslation()(DesignList);

function DesignListMTR(props) {
    const {t, i18n} = useTranslation();

    const [destLegacy, setDestLegacy] = React.useState(getParams().dest_legacy);
    
    const destLegacyChange = (event) => {
        setDestLegacy(event.target.checked);
        (window.myLine as RMGLineHK).destLegacy = event.target.checked;
    };

    return (
        <div>
            <Paper>
                <List component="nav">
                    <ListItem button onClick={
                        () => (window.myLine as RMGLineHK).txtFlip = !getParams().txt_flip
                    }>
                        <ListItemIcon>
                            <Icon>swap_vert</Icon>
                        </ListItemIcon>
                        <ListItemText primary={t('design.flipName')} />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <Icon>rotate_left</Icon>
                        </ListItemIcon>
                        <ListItemText primary={t('design.MTRLegacy')} />
                        <ListItemSecondaryAction>
                            <Switch
                                edge="end"
                                onChange={destLegacyChange}
                                checked={destLegacy}
                            />
                        </ListItemSecondaryAction>
                    </ListItem>
                </List>
            </Paper>
        </div>
    );
}

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

const TranslatedDesignListGZMTR = withTranslation()(DesignListGZMTR);

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

            // // update station chip number (if applicable)
            // $('#stn_list').find('#'+stnId).find('.mdc-chip__icon--leading').text(num);
            // // update station name in add station dialogue (if applicable)
            // $(`#pivot__selection li[data-value="${stnId}"]`).text(`${num}: ${stnList[stnId].name.join()}`);
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