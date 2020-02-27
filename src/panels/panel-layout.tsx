import * as React from 'react';

import { Grid, Card, List, ListItem, ListItemIcon, Icon, TextField, Typography, Slider } from '@material-ui/core';

import { getParams } from '../utils';
import { RMGLineGZ } from '../Line/LineGZ';

export default class PanelLayout extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Grid container spacing={3} justify="center" alignItems="flex-start">
                <Grid item xs={12} sm={12} md={6} lg={5}>
                    <LayoutList />
                </Grid>
                {window.urlParams.get('style')==='gzmtr' && 
                <Grid item xs={12} sm={12} md={6} lg={5}>
                    <LayoutListGZMTR />
                </Grid>}
            </Grid>
        );
    }
}

interface LayoutListState {
    svgDestWidth: number;
    svgWidth: number;
    svgHeight: number;
    yPc: number;
    branchSpacing: number;
    padding: number;
}

class LayoutList extends React.Component<{}, LayoutListState> {
    constructor(props) {
        super(props);

        let param = getParams();
        this.state = {
            svgDestWidth: param.svg_dest_width, 
            svgWidth: param.svg_width, 
            svgHeight: param.svg_height, 
            yPc: param.y_pc, 
            branchSpacing: param.branch_spacing, 
            padding: param.padding
        }

        this.svgDestWidthChange = this.svgDestWidthChange.bind(this);
        this.svgWidthChange = this.svgWidthChange.bind(this);
        this.svgHeightChange = this.svgHeightChange.bind(this);
        this.yPcChange = this.yPcChange.bind(this);
        this.branchSpacingChange = this.branchSpacingChange.bind(this);
        this.paddingChange = this.paddingChange.bind(this);
    }

    svgDestWidthChange(event: React.ChangeEvent<HTMLInputElement>) {
        let val = Number(event.target.value);
        this.setState({svgDestWidth: val});
        window.myLine.svgDestWidth = val;
    }

    svgWidthChange(event: React.ChangeEvent<HTMLInputElement>) {
        let val = Number(event.target.value);
        this.setState({svgWidth: val});
        window.myLine.svgWidth = val;
    }
    
    svgHeightChange(event: React.ChangeEvent<HTMLInputElement>) {
        let val = Number(event.target.value);
        this.setState({svgHeight: val});
        window.myLine.svgHeight = val;
    }

    yPcChange(event, value: number) {
        this.setState({yPc: value});
        window.myLine.yPc = value;
    }

    branchSpacingChange(event, value: number) {
        this.setState({branchSpacing: value});
        window.myLine.branchSpacing = value;
    }

    paddingChange(event, value: number) {
        this.setState({padding: value});
        window.myLine.padding = value;
    }

    render() {
        return (
            <div>
                <Card>
                    <List component="nav">
                        <ListItem>
                            <ListItemIcon>
                                <Icon>panorama_horizontal</Icon>
                            </ListItemIcon>
                            <TextField 
                                label="Destination Panel Width" 
                                variant="outlined" 
                                value={this.state.svgDestWidth.toString()} 
                                onChange={this.svgDestWidthChange}
                                style={{marginRight:5}} />
                            <TextField 
                                label="Rail Map Width" 
                                variant="outlined" 
                                value={this.state.svgWidth.toString()}
                                onChange={this.svgWidthChange} />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <Icon>panorama_vertical</Icon>
                            </ListItemIcon>
                            <TextField
                                label="Canvas Height" 
                                variant="outlined" 
                                value={this.state.svgHeight.toString()} 
                                onChange={this.svgHeightChange} />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <Icon>vertical_align_center</Icon>
                            </ListItemIcon>
                            <div style={{width: '100%', marginRight: 16}}>
                                <Typography gutterBottom>
                                    Vertical Position
                                </Typography>
                                <Slider
                                    value={this.state.yPc}
                                    onChange={this.yPcChange}
                                    step={0.01}
                                    marks={[{value: 0, label: '0%'}, {value: 100, label: '100%'}]}
                                    valueLabelDisplay="auto" />
                            </div>
                        </ListItem>
                        <ListItem>
                        <ListItemIcon>
                                <Icon>format_line_spacing</Icon>
                            </ListItemIcon>
                            <div style={{width: '100%', marginRight: 16}}>
                                <Typography gutterBottom>
                                    Branch Spacing
                                </Typography>
                                <Slider
                                    value={this.state.branchSpacing}
                                    onChange={this.branchSpacingChange}
                                    step={0.01}
                                    marks={[{value: 0, label: '0px'}, {value: 100, label: '100px'}]}
                                    valueLabelDisplay="auto" />
                            </div>
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <Icon>stay_current_landscape</Icon>
                            </ListItemIcon>
                            <div style={{width: '100%', marginRight: 16}}>
                                <Typography gutterBottom>
                                    Line Margin
                                </Typography>
                                <Slider
                                    value={this.state.padding}
                                    onChange={this.paddingChange}
                                    step={0.01} max={25}
                                    marks={[{value: 0, label: '0%'}, {value: 25, label: '25%'}]}
                                    valueLabelDisplay="auto" />
                            </div>
                        </ListItem>
                    </List>
                </Card>
            </div>
        )
    }
}

interface LayoutListGZMTRState {
    directionGZX: number;
    directionGZY: number;
}

class LayoutListGZMTR extends React.Component<{}, LayoutListGZMTRState> {
    constructor(props) {
        super(props);

        let param = getParams();
        this.state = {
            directionGZX: param.direction_gz_x, 
            directionGZY: param.direction_gz_y
        }

        this.directionGZXChange = this.directionGZXChange.bind(this);
        this.directionGZYChange = this.directionGZYChange.bind(this);
    }

    directionGZXChange(event, value: number) {
        this.setState({directionGZX: value});
        (window.myLine as RMGLineGZ).directionGZX = value;
    }

    directionGZYChange(event, value) {
        this.setState({directionGZY: value});
        (window.myLine as RMGLineGZ).directionGZY = value;
    }

    render() {
        return (
            <div>
                <Card>
                    <List component="nav">
                        <ListItem>
                            <ListItemIcon>
                                <Icon>open_with</Icon>
                            </ListItemIcon>
                            <div style={{width: '100%', marginRight: 16}}>
                                <Typography gutterBottom>
                                    Direction Indicator Position
                                </Typography>
                                <Slider
                                    value={this.state.directionGZX}
                                    onChange={this.directionGZXChange}
                                    step={0.01}
                                    marks={[{value: 0, label: 'Left'}, {value: 100, label: 'Right'}]}
                                    valueLabelDisplay="auto" />
                                <Slider
                                    value={this.state.directionGZY}
                                    onChange={this.directionGZYChange}
                                    step={0.01}
                                    marks={[{value: 0, label: 'Top'}, {value: 100, label: 'Bottom'}]}
                                    valueLabelDisplay="auto" />
                            </div>
                        </ListItem>
                    </List>
                </Card>
            </div>
        )
    }
}