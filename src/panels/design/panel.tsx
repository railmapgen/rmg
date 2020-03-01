import * as React from 'react';
import { withTranslation, useTranslation } from 'react-i18next';

import { Grid, Paper, List, ListItem, ListItemIcon, Icon, ListItemText, TextField, ListItemSecondaryAction, Switch } from '@material-ui/core';

import { getParams, getTransText, countryCode2Emoji } from '../../utils';
import { Name } from '../../types';
import { RMGLineHK } from '../../Line/LineHK';

import ColourDialog from '../panel-colour-diag';

const DesignListGZMTR = React.lazy(() => import(/* webpackChunkName: "panelDesignGZMTR" */ './list-gzmtr'));

export default (props) => {
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
                <DesignListGZMTR />
            </Grid> : 
            <div />}
        </Grid>
    );
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

