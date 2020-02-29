import * as React from 'react';

import { Dialog, DialogTitle, DialogContent, List, ListItem, Paper, Icon, InputBase, ListItemIcon, TextField, MenuItem, DialogActions, Button, withStyles } from '@material-ui/core';

import { CityEntry, InterchangeInfo, LineEntry, Name } from '../types';
import { getTransText, countryCode2Emoji } from '../utils';

const style = {
    paperRoot: {
        width: 250, 
    },
    iconRoot: {
        position: 'absolute' as 'absolute',
    },
    inputBaseRoot: {
        display: 'block', 
    }, 
    inputBaseInputZH: {
        fontFamily: 'Helvetica, Arial, Noto Serif KR, Noto Serif JP, Noto Serif TC, Noto Serif SC, HiraMinProN-W6, serif', 
        textAlign: 'center' as 'center',
        fontSize: 36,
        padding: 0, 
        paddingTop: 6,
        height: 45,
    },
    inputBaseInputEN: {
        fontFamily: 'Helvetica, Arial, sans-serif',
        textAlign: 'center' as 'center',
        fontSize: 18, 
        padding: 0, 
        paddingBottom: 6,
        height: 'auto',
    },
    menuItemSpan: {
        padding: '0 .3rem',
    }
}

interface NameDialogProps {
    open: boolean;
    classes: any;
    theme: [string, string, string, '#000' | '#fff'];
    lineName: Name;
    onUpdate: (key: string, value: any) => void;
    onClose: () => void;
}

interface NameDialogState {
    theme: [string, string, string, '#000' | '#fff'];
    lineName: Name;
    hexTemp: string;
    cityList: CityEntry[];
    lineList: LineEntry[];
}

class UnstyledNameDialog extends React.Component<NameDialogProps, NameDialogState> {
    constructor(props) {
        super(props);

        this.state = {
            theme: this.props.theme,
            lineName: this.props.lineName,
            hexTemp: this.props.theme[2],
            cityList: [] as CityEntry[], 
            lineList: [] as LineEntry[]
        }
    }

    nameChange(value: string, index: number) {
        this.setState(prevState => {
            let name = {...prevState.lineName, [index]: value} as Name;
            this.props.onUpdate('name', name);
            return {lineName: name};
        });
    }

    cityChange(event) {
        if (event.target.value === this.state.theme[0]) return;

        fetch(`data/${event.target.value}.json`)
            .then(response => response.json())
            .then((data: LineEntry[]) => {
                this.setState(() => {
                    let theme = [
                        event.target.value, 
                        data[0].id, 
                        data[0].colour, 
                        data[0].fg || '#fff'
                    ] as [string, string, string, '#000' | '#fff'];
                    this.props.onUpdate('theme', theme);
                    return {
                        theme, lineList: data, hexTemp: data[0].colour
                    }
                })
            })
    }

    lineChange(event) {
        let line = event.target.value;
        this.setState(prevState => {
            let theme = [
                prevState.theme[0], 
                line, 
                prevState.lineList.filter(l => l.id === line)[0].colour, 
                prevState.lineList.filter(l => l.id === line)[0].fg || '#fff', 
            ] as [string, string, string, '#000' | '#fff'];
            this.props.onUpdate('theme', theme);
            return {theme, hexTemp: theme[2]};
        })
    }

    hexChange(event) {
        let hex = event.target.value;
        this.setState({hexTemp: hex}); // always update hexTemp

        if (this.state.theme[0] !== 'other') {
            // change city to other
            fetch('data/other.json')
                .then(response => response.json())
                .then((data: LineEntry[]) => {
                    data[0].fg = this.state.theme[3];
                    if (hex.match(/^#[0-9a-fA-f]{6}$/g) !== null) {
                        // if hex is valid, modify fetched data
                        // also update master
                        data[0].colour = hex;
                        this.props.onUpdate('theme', [
                            'other', 'other', hex, this.state.theme[3]
                        ]);
                        this.setState(prevState => {
                            return {
                                theme: ['other', 'other', hex, prevState.theme[3]], 
                                lineList: data, 
                            };
                        })
                    } else {
                        // if not, use previous state, update hexTemp only
                        data[0].colour = this.state.theme[2];
                        this.props.onUpdate('theme', [
                            'other', 'other', this.state.theme[2], this.state.theme[3]
                        ]);
                        this.setState(prevState => {
                            return {
                                theme: ['other', 'other', prevState.theme[2], prevState.theme[3]], 
                                lineList: data, 
                            }
                        })
                    }
                });
        } else {
            // city is already other
            if (hex.match(/^#[0-9a-fA-f]{6}$/g) !== null) {
                // if hex is valid, modify fetched data
                this.setState(prevState => {
                    let newLineList = prevState.lineList;
                    let newTheme = prevState.theme;
                    newLineList[0].colour = hex;
                    newTheme[2] = hex;
                    this.props.onUpdate('theme', newTheme);
                    return {
                        lineList: newLineList, 
                        theme: newTheme
                    };
                });
            } else {
                // if hex is not valid, update hexTemp only
            }
        }
    }

    fgChange(event) {
        let fg = event.target.value as '#fff' | '#000';
        if (this.state.theme[3] === fg) {
            // no changes;
            return;
        } else {
            if (this.state.theme[0] !== 'other') {
                fetch('data/other.json')
                    .then(response => response.json())
                    .then((data: LineEntry[]) => {
                        data[0].colour = this.state.theme[2];
                        data[0].fg = fg;
                        let theme = ['other', 'other', this.state.theme[2], fg] as [string, string, string, '#000' | '#fff'];
                        this.props.onUpdate('theme', theme);
                        this.setState({theme, lineList: data});
                    })
            } else {
                this.setState(prevState => {
                    let lineList = prevState.lineList;
                    lineList[0].fg = fg;
                    let theme = prevState.theme;
                    theme[3] = fg;
                    this.props.onUpdate('theme', theme);
                    return {lineList, theme};
                });
            }
        }
    }

    handleClose() {
        if (this.state.hexTemp !== this.state.theme[2]) {
            this.setState(prevState => ({hexTemp: prevState.theme[2]}));
        }
        this.props.onClose();
    }

    componentDidMount() {
        fetch('data/city_list.json')
            .then(response => response.json())
            .then((data: CityEntry[]) => this.setState({cityList: data}));

        if (this.state.theme[0]) {
            fetch(`data/${this.state.theme[0]}.json`)
            .then(response => response.json())
            .then((data: LineEntry[]) => {
                if (this.state.theme[0] === 'other') {
                    data[0].colour = this.state.theme[2];
                    data[0].fg = this.state.theme[3];
                }
                this.setState({lineList: data})
            });
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.theme[0] !== this.props.theme[0]) {
            this.setState({
                theme: this.props.theme,
                lineName: this.props.lineName,
                hexTemp: this.props.theme[2],
            });
            if (this.props.theme[0]) {
                fetch(`data/${this.props.theme[0]}.json`)
                .then(response => response.json())
                .then((data: LineEntry[]) => {
                    if (this.props.theme[0] === 'other') {
                        data[0].colour = this.props.theme[2];
                        data[0].fg = this.props.theme[3];
                    }
                    this.setState({lineList: data})
                });
            }
        } else if (prevProps.theme[1] !== this.props.theme[1]) {
            this.setState({
                theme: this.props.theme,
                lineName: this.props.lineName,
                hexTemp: this.props.theme[2],
            });
        } else if (prevProps.theme[2] !== this.props.theme[2]) {
            this.setState({
                theme: this.props.theme,
                lineName: this.props.lineName,
                hexTemp: this.props.theme[2],
            });
        } else if (prevProps.theme[3] !== this.props.theme[3]) {
            this.setState({
                theme: this.props.theme,
                lineName: this.props.lineName,
            });
        } else if (prevProps.lineName[0] !== this.props.lineName[0] || prevProps.lineName[1] !== this.props.lineName[1]) {
            this.setState({
                lineName: this.props.lineName,
            });
        } else {
            return;
        }
    }

    render() {
        let { classes } = this.props;
        return (
            <Dialog onClose={this.handleClose.bind(this)} open={this.props.open}>
                <DialogTitle>Edit Names and Colour</DialogTitle>
                <DialogContent dividers>
                    <List>
                        <ListItem style={{justifyContent: 'center'}}>
                            <Paper className={classes.paperRoot}
                                style={{backgroundColor: this.state.theme[2]}}
                            >
                                <Icon color="action" className={classes.iconRoot}>edit</Icon>
                                <InputBase
                                    value={this.state.lineName[0]}
                                    classes={{
                                        root: classes.inputBaseRoot,
                                        input: classes.inputBaseInputZH
                                    }}
                                    style={{color: this.state.theme[3] || '#fff'}}
                                    onChange={(e) => this.nameChange(e.target.value, 0)}
                                />
                                <InputBase
                                    value={this.state.lineName[1]}
                                    classes={{
                                        root: classes.inputBaseRoot,
                                        input: classes.inputBaseInputEN,
                                    }}
                                    style={{color: this.state.theme[3] || '#fff'}}
                                    onChange={(e) => this.nameChange(e.target.value, 1)}
                                />
                            </Paper>
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <Icon>location_city</Icon>
                            </ListItemIcon>
                            <TextField select 
                                style={{width: '100%'}}
                                variant="outlined"
                                label="City"
                                onChange={this.cityChange.bind(this)}
                                value={this.state.theme[0]} >
                                {this.state.cityList.map(c => (
                                    <MenuItem key={c.id} value={c.id}>
                                        <span dangerouslySetInnerHTML={{
                                            __html: countryCode2Emoji(c.country) + 
                                                getTransText(c.name, window.urlParams.get('lang'))
                                        }} />
                                    </MenuItem>
                                ))}
                            </TextField>
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <Icon>subway</Icon>
                            </ListItemIcon>
                            <TextField select 
                                style={{width: '100%'}}
                                variant="outlined"
                                label="Line"
                                onChange={this.lineChange.bind(this)}
                                value={this.state.theme[1]} >
                                {this.state.lineList.map(l => (
                                    <MenuItem key={l.id} value={l.id}>
                                        <span className={classes.menuItemSpan}
                                            style={{
                                                backgroundColor: l.colour, 
                                                color: l.fg || '#fff', 
                                            }}>
                                            {getTransText(l.name, window.urlParams.get('lang'))}
                                        </span>
                                    </MenuItem>
                                ))}
                            </TextField>
                        </ListItem>
                        <ListItem>
                            <TextField 
                                error={!this.state.hexTemp?.match(/^#[0-9a-fA-f]{6}$/g)}
                                style={{width: '100%', marginRight:5}}
                                variant="outlined"
                                label="Background Colour (HEX) #"
                                onChange={this.hexChange.bind(this)}
                                value={this.state.hexTemp?.toUpperCase() || ''} >
                            </TextField>
                            <TextField select
                                style={{width: '100%'}}
                                variant="outlined"
                                label="Foreground Colour"
                                onChange={this.fgChange.bind(this)}
                                value={this.state.theme[3] || '#fff'} >
                                <MenuItem key="#fff" value="#fff">White</MenuItem>
                                <MenuItem key="#000" value="#000">Black</MenuItem>
                            </TextField>
                        </ListItem>
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose.bind(this)} color="primary" autoFocus>
                        Done
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default withStyles(style)(UnstyledNameDialog);