import * as React from 'react';
import { Name } from '../../types';
import { Paper, List, ListItem, ListItemIcon, Icon, ListItemText, TextField } from '@material-ui/core';
import ColourDialog from '../panel-colour-diag';
import { withTranslation } from 'react-i18next';

const allDirections = {
    l: 'Left', r: 'Right'
};

interface DesignListProps {
    t: any;
    theme: [string, string, string, '#000' | '#fff'];
    lineName: Name;
    direction: 'l' | 'r';
    platformNum: string;
    paramUpdate: (key, data) => void;
}

interface DesignListState {
    nameDialogOpened: boolean;
}

class DesignList extends React.Component<DesignListProps, DesignListState> {
    constructor(props) {
        super(props);

        this.state = {
            nameDialogOpened: false,
        }

        this.directionClick = this.directionClick.bind(this);
        this.platformNumChange = this.platformNumChange.bind(this);
    }

    nameDialogUpdate(key: string, value: any) {
        if (key === 'name') {
            window.myLine.lineNames = Object.values(value) as Name;
            // this.setState({lineName: value});
            this.props.paramUpdate('line_name', Object.values(value) as Name);
        }
        if (key === 'theme') {
            window.myLine.theme = value;
            // this.setState({theme: value});
            this.props.paramUpdate('theme', value);
        }
    }

    directionClick() {
        if (this.props.direction === 'r') {
            // this.setState({direction: 'l'});
            this.props.paramUpdate('direction', 'l');
            window.myLine.direction = 'l';
        } else {
            // this.setState({direction: 'r'});
            this.props.paramUpdate('direction', 'r');
            window.myLine.direction = 'r';
        }
    }

    platformNumChange(event) {
        // this.setState({platformNum: event.target.value});
        this.props.paramUpdate('platform_num', event.target.value);
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
                                    backgroundColor: this.props.theme[2], 
                                    color: this.props.theme[3], 
                                    paddingRight: '.3rem', 
                                    paddingLeft: '.3rem'
                                }}>{Object.values(this.props.lineName).join()}</span>
                            } />
                        </ListItem>
                        <ListItem button onClick={this.directionClick}>
                            <ListItemIcon>
                                <Icon>directions</Icon>
                            </ListItemIcon>
                            <ListItemText
                                primary={this.props.t('design.direction.button')}
                                secondary={this.props.t('design.direction.'+this.props.direction)} />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <Icon>looks_one</Icon>
                            </ListItemIcon>
                            <TextField
                                label={this.props.t('design.platform')}
                                variant="outlined" 
                                value={this.props.platformNum} 
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
                    theme={this.props.theme} lineName={this.props.lineName}
                    onUpdate={this.nameDialogUpdate.bind(this)}
                    onClose={() => this.setState({nameDialogOpened: false})}
                />
            </div>
        )
    }
}

export default withTranslation()(DesignList);

