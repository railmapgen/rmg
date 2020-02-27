import * as React from 'react';

import { Grid, Paper, List, ListItem, ListItemIcon, Icon, ListItemText, TextField, ListItemSecondaryAction, Switch, Card, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';

import { getParams, getTransText, countryCode2Emoji } from '../utils';
import { CityEntry, LineEntry, Name, InterchangeInfo } from '../types';
import { RMGLineHK } from '../Line/LineHK';
import { RMGLineGZ } from '../Line/LineGZ';

const NameDialog = React.lazy(() => import(/* webpackChunkName: "panelNameDiag" */ './panel-name-diag'));
import ColourDialog from './panel-colour-diag';

export default class PanelDesign extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Grid container spacing={3} justify="center" alignItems="flex-start">
                <Grid item xs={12} sm={6} md={5} lg={4}>
                    <DesignList />
                </Grid>
                {window.urlParams.get('style') === 'mtr' ? 
                <Grid item xs={12} sm={6} md={5} lg={4}>
                    <DesignListMTR />
                </Grid> : 
                <div />}
                {window.urlParams.get('style') === 'gzmtr' ? 
                <Grid item xs={12} sm={6} md={5} lg={4}>
                    <DesignListGZMTR />
                </Grid> : 
                <div />}
            </Grid>
        );
    }
}

const allDirections = {
    l: 'Left', r: 'Right'
};

interface DesignListState {
    theme: [string, string, string, '#000' | '#fff'];
    lineName: Name;
    direction: 'l' | 'r';
    platformNum: string;

    themeDialogOpened: boolean;
    nameDialogOpened: boolean;
}

class DesignList extends React.Component<{}, DesignListState> {
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
                            <ListItemText primary="Line Name and Theme Colour" secondary={
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
                            <ListItemText primary="Train Direction" secondary={allDirections[this.state.direction]} />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <Icon>looks_one</Icon>
                            </ListItemIcon>
                            <TextField
                                label="Platform Number" 
                                variant="outlined" 
                                value={this.state.platformNum} 
                                onChange={this.platformNumChange} />
                        </ListItem>
                        <ListItem button onClick={() => window.myLine.reverseStns()}>
                            <ListItemIcon>
                                <Icon>cached</Icon>
                            </ListItemIcon>
                            <ListItemText primary="Reverse Entire Line" />
                        </ListItem>
                    </List>
                </Paper>

                {/* <NameDialog
                    open={this.state.nameDialogOpened}
                    theme={this.state.theme} lineName={this.state.lineName}
                    onUpdate={this.nameDialogUpdate.bind(this)}
                    onClose={() => this.setState({nameDialogOpened: false})}
                /> */}
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

interface DesignListMTRState {
    destLegacy: boolean;
}

class DesignListMTR extends React.Component<{}, DesignListMTRState> {
    constructor(props) {
        super(props);

        this.state = {
            destLegacy: getParams().dest_legacy
        }
    }

    destLegacyChange(event) {
        this.setState({destLegacy: event.target.checked});
        (window.myLine as RMGLineHK).destLegacy = event.target.checked;
    }

    render() {
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
                            <ListItemText primary="Flip Station Names Position" />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <Icon>rotate_left</Icon>
                            </ListItemIcon>
                            <ListItemText primary="MTR Legacy Style" />
                            <ListItemSecondaryAction>
                                <Switch
                                    edge="end"
                                    onChange={this.destLegacyChange.bind(this)}
                                    checked={this.state.destLegacy}
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                    </List>
                </Paper>
            </div>
        )
    }
}

const allInfoPanelTypes = {
    gz28: 'Line 2/8', 
    gz3: 'Line 3', 
    gzgf: 'Line 6/Guangfo Line',
    gz1421: 'Line 14/21', 
}

interface DesignListGZMTRState {
    lineNum: string;
    psdNum: string;
    panelType: string;
    panelTypeDialogOpened: boolean;
    autoNumDialogOpened: boolean;
}

class DesignListGZMTR extends React.Component<{}, DesignListGZMTRState> {
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
                                label="Line Number" 
                                variant="outlined" 
                                value={this.state.lineNum} 
                                onChange={this.lineNumChange.bind(this)}
                                style={{marginRight: 5}} />
                            <TextField
                                label="Platform Door Number" 
                                variant="outlined" 
                                value={this.state.psdNum} 
                                onChange={this.psdNumChange.bind(this)} />
                        </ListItem>
                        <ListItem button onClick={() => this.setState({panelTypeDialogOpened: true})}>
                            <ListItemIcon>
                                <Icon style={{transform: 'rotate(180deg)'}}>credit_card</Icon>
                            </ListItemIcon>
                            <ListItemText primary="Info Panel Type" secondary={allInfoPanelTypes[this.state.panelType]} />
                        </ListItem>
                        <ListItem button onClick={() => this.setState({autoNumDialogOpened: true})}>
                            <ListItemIcon>
                                <Icon>filter_1</Icon>
                            </ListItemIcon>
                            <ListItemText primary="Station Auto-numbering" />
                        </ListItem>
                    </List>
                </Card>

                <PanelTypeDialog open={this.state.panelTypeDialogOpened} onClose={this.panelTypeDialogClose.bind(this)} />
                <AutoNumDialog open={this.state.autoNumDialogOpened} onClose={() => this.setState({autoNumDialogOpened: false})} />
            </div>
        )
    }
}

interface PanelTypeDialogProps {
    onClose: (action: string) => void;
    open: boolean;
}

class PanelTypeDialog extends React.Component<PanelTypeDialogProps> {
    constructor(props) {
        super(props);
    }

    render() {
        let listItems = [] as JSX.Element[];
        for (let [key, val] of Object.entries(allInfoPanelTypes)) {
            listItems.push(
                <ListItem button onClick={() => this.props.onClose(key)} key={key}>
                    <ListItemText primary={val} />
                </ListItem>
            );
        }
        return (
            <Dialog onClose={() => this.props.onClose('close')} open={this.props.open}>
                <DialogTitle>Choose a Type for Info Panel</DialogTitle>
                <List>
                    {listItems}
                </List>
            </Dialog>
        );
    }
}

interface AutoNumDialogProps {
    onClose: () => void;
    open: boolean;
}

class AutoNumDialog extends React.Component<AutoNumDialogProps> {
    constructor(props) {
        super(props);
    }

    handleClick(action: 'ascend' | 'descend') {
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

        this.props.onClose();
    }

    render() {
        return (
            <Dialog onClose={this.props.onClose} open={this.props.open}>
                <DialogTitle>Warning</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You are about to re-number all stations on the main line. This action can not be undo.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.onClose} color="primary" autoFocus>
                        Cancel
                    </Button>
                    <Button onClick={() => this.handleClick('ascend')} color="primary">
                        Ascending Order
                    </Button>
                    <Button onClick={() => this.handleClick('descend')} color="primary">
                        Descending Order
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}