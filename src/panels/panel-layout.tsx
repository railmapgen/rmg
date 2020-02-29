import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { Grid, Card, List, ListItem, ListItemIcon, Icon, TextField, Typography, Slider, Paper, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';

import { getParams } from '../utils';
import { RMGLineGZ } from '../Line/LineGZ';

export default function PanelLayout(props) {
    const [expanded, setExpanded] = React.useState(false as false | number);

    const handleChange = index => (event, isExpanded) => {
        setExpanded(isExpanded ? index : false);
    };

    return (
        <Grid container spacing={3} justify="center" alignItems="flex-start">
            <Grid item xs={12} sm={12} md={6} lg={5}>
                {/* <LayoutList /> */}
                <LayoutList2 expanded={expanded} onChange={handleChange} />
                {window.urlParams.get('style')==='gzmtr' && <LayoutListGZMTR2 expanded={expanded} onChange={handleChange} />}
            </Grid>
        </Grid>
    );
}

interface LayoutListProps {
    expanded: false | number;
    onChange: (index: number) => (event, isExpanded: boolean) => void;
}

function LayoutList2(props: LayoutListProps) {
    const {t, i18n} = useTranslation();

    let param = getParams();
    const [svgDestWidth, setSvgDestWidth] = React.useState(param.svg_dest_width);
    const [svgWidth, setSvgWidth] = React.useState(param.svg_width);
    const [svgHeight, setSvgHeight] = React.useState(param.svg_height);
    const [yPc, setYPc] = React.useState(param.y_pc);
    const [branchSpacing, setBranchSpacing] = React.useState(param.branch_spacing);
    const [padding, setPadding] = React.useState(param.padding);

    const svgDestWidthChange = (event) => {
        let _val = Number(event.target.value);
        if (isNaN(_val)) return;
        setSvgDestWidth(_val);
        window.myLine.svgDestWidth = _val;
    }

    const svgWidthChange = (event) => {
        let _val = Number(event.target.value);
        if (isNaN(_val)) return;
        setSvgWidth(_val);
        window.myLine.svgWidth = _val;
    }

    const svgHeightChange = (event) => {
        let _val = Number(event.target.value);
        if (isNaN(_val)) return;
        setSvgHeight(_val);
        window.myLine.svgHeight = _val;
    }

    const yPcChange = (event, value: number) => {
        setYPc(value);
        window.myLine.yPc = value;
    };

    const branchSpacingChange = (event, value: number) => {
        setBranchSpacing(value);
        window.myLine.branchSpacing = value;
    };

    const paddingChange = (event, value: number) => {
        setPadding(value);
        window.myLine.padding = value;
    };

    return (
        <div>
            <ExpansionPanel expanded={props.expanded === 0} onChange={props.onChange(0)}>
                <ExpansionPanelSummary expandIcon={<Icon>expand_more</Icon>}>
                    <Icon style={{minWidth: 48}}>panorama_horizontal</Icon>
                    <Typography>{t('layout.size.title')}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Grid container spacing={1} justify="center" alignItems="flex-start">
                        <Grid item xs={12} sm={4}>
                            <TextField style={{display: 'flex'}}
                                label={t('layout.size.destWidth')} 
                                variant="outlined" 
                                value={svgDestWidth.toString()} 
                                onChange={svgDestWidthChange} />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField style={{display: 'flex'}}
                                label={t('layout.size.width')}
                                variant="outlined" 
                                value={svgWidth.toString()}
                                onChange={svgWidthChange} />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField style={{display: 'flex'}}
                                label={t('layout.size.height')}
                                variant="outlined" 
                                value={svgHeight.toString()} 
                                onChange={svgHeightChange} />
                        </Grid>
                    </Grid>
                </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel expanded={props.expanded === 1} onChange={props.onChange(1)}>
                <ExpansionPanelSummary expandIcon={<Icon>expand_more</Icon>}>
                    <Icon style={{minWidth: 48}}>vertical_align_center</Icon>
                    <Typography>{t('layout.y')}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Slider
                        value={yPc}
                        onChange={yPcChange}
                        step={0.01}
                        marks={[{value: 0, label: '0%'}, {value: 100, label: '100%'}]}
                        valueLabelDisplay="auto"
                     />
                </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel expanded={props.expanded === 2} onChange={props.onChange(2)}>
                <ExpansionPanelSummary expandIcon={<Icon>expand_more</Icon>}>
                    <Icon style={{minWidth: 48}}>format_line_spacing</Icon>
                    <Typography>{t('layout.branchSpacing')}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Slider
                        value={branchSpacing}
                        onChange={branchSpacingChange}
                        step={0.01}
                        marks={[{value: 0, label: '0px'}, {value: 100, label: '100px'}]}
                        valueLabelDisplay="auto"
                     />
                </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel expanded={props.expanded === 3} onChange={props.onChange(3)}>
                <ExpansionPanelSummary expandIcon={<Icon>expand_more</Icon>}>
                    <Icon style={{minWidth: 48}}>stay_current_landscape</Icon>
                    <Typography>{t('layout.padding')}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Slider
                        value={padding}
                        onChange={paddingChange}
                        step={0.01}
                        marks={[{value: 0, label: '0%'}, {value: 100, label: '100%'}]}
                        valueLabelDisplay="auto"
                     />
                </ExpansionPanelDetails>
            </ExpansionPanel>
        </div>
    )
}

function LayoutListGZMTR2(props: LayoutListProps) {
    const {t, i18n} = useTranslation();

    let param = getParams();
    const [directionGZX, setDirectionGZX] = React.useState(param.direction_gz_x);
    const [directionGZY, setDirectionGZY] = React.useState(param.direction_gz_y);

    const directionGZXChange = (event, value: number) => {
        setDirectionGZX(value);
        (window.myLine as RMGLineGZ).directionGZX = value;
    }

    const directionGZYChange = (event, value) => {
        setDirectionGZY(value);
        (window.myLine as RMGLineGZ).directionGZY = value;
    }

    return (
        <ExpansionPanel expanded={props.expanded === 4} onChange={props.onChange(4)}>
            <ExpansionPanelSummary expandIcon={<Icon>expand_more</Icon>}>
                <Icon style={{minWidth: 48}}>open_with</Icon>
                <Typography>{t('layout.directionGZ.title')}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails style={{flexDirection: 'column'}}>
                <Slider
                    value={directionGZX}
                    onChange={directionGZXChange}
                    step={0.01}
                    marks={[
                        {value: 0, label: t('layout.directionGZ.left')}, 
                        {value: 100, label: t('layout.directionGZ.right')}
                    ]}
                    valueLabelDisplay="auto" />
                <Slider
                    value={directionGZY}
                    onChange={directionGZYChange}
                    step={0.01}
                    marks={[
                        {value: 0, label: t('layout.directionGZ.top')}, 
                        {value: 100, label: t('layout.directionGZ.bottom')}
                    ]}
                    valueLabelDisplay="auto" />
            </ExpansionPanelDetails>
        </ExpansionPanel>
    )
}