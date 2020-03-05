import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ExpansionPanel, ExpansionPanelSummary, Icon, Typography, ExpansionPanelDetails, Grid, TextField, Slider, Grow } from '@material-ui/core';

interface Props {
    expanded: false | number;
    onChange: (index: number) => (event, isExpanded: boolean) => void;

    svgDestWidth: number;
    svgWidth: number;
    svgHeight: number;
    yPc: number;
    branchSpacing: number;
    padding: number;
    paramUpdate: (key, data) => void;
}

const LayoutCommon = (props: Props) => {
    const { t } = useTranslation();

    const [isGrow, setIsGrow] = React.useState(false);
    React.useEffect(() => {
        setIsGrow(true);
        return () => setIsGrow(false);
    }, []);

    const svgDestWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let _val = Number(event.target.value);
        if (isNaN(_val)) return;
        props.paramUpdate('svg_dest_width', _val);
        window.myLine.svgDestWidth = _val;
    }

    const svgWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let _val = Number(event.target.value);
        if (isNaN(_val)) return;
        props.paramUpdate('svg_width', _val);
        window.myLine.svgWidth = _val;
    }

    const svgHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let _val = Number(event.target.value);
        if (isNaN(_val)) return;
        props.paramUpdate('svg_height', _val);
        window.myLine.svgHeight = _val;
    }

    const yPcChange = (event, value: number) => {
        props.paramUpdate('y_pc', value);
        window.myLine.yPc = value;
    };

    const yPcPanel = React.useMemo(() => (
        <ExpansionPanel expanded={props.expanded === 1} onChange={props.onChange(1)}>
            <ExpansionPanelSummary expandIcon={<Icon>expand_more</Icon>}>
                <Icon style={{minWidth: 48}}>vertical_align_center</Icon>
                <Typography>{t('layout.y')}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                <Slider
                    value={props.yPc}
                    onChange={yPcChange}
                    step={0.01}
                    marks={[{value: 0, label: '0%'}, {value: 100, label: '100%'}]}
                    valueLabelDisplay="auto"
                />
            </ExpansionPanelDetails>
        </ExpansionPanel>
    ), [props.yPc, props.expanded]);

    const branchSpacingChange = (event, value: number) => {
        props.paramUpdate('branch_spacing', value);
        window.myLine.branchSpacing = value;
    };

    const branchSpacingPanel = React.useMemo(() => (
        <ExpansionPanel expanded={props.expanded === 2} onChange={props.onChange(2)}>
            <ExpansionPanelSummary expandIcon={<Icon>expand_more</Icon>}>
                <Icon style={{minWidth: 48}}>format_line_spacing</Icon>
                <Typography>{t('layout.branchSpacing')}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                <Slider
                    value={props.branchSpacing}
                    onChange={branchSpacingChange}
                    step={0.01}
                    marks={[{value: 0, label: '0px'}, {value: 100, label: '100px'}]}
                    valueLabelDisplay="auto"
                />
            </ExpansionPanelDetails>
        </ExpansionPanel>
    ), [props.branchSpacing, props.expanded]);

    const paddingChange = (event, value: number) => {
        props.paramUpdate('padding', value);
        window.myLine.padding = value;
    };

    const paddingPanel = React.useMemo(() => (
        <ExpansionPanel expanded={props.expanded === 3} onChange={props.onChange(3)}>
            <ExpansionPanelSummary expandIcon={<Icon>expand_more</Icon>}>
                <Icon style={{minWidth: 48}}>stay_current_landscape</Icon>
                <Typography>{t('layout.padding')}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                <Slider
                    value={props.padding}
                    onChange={paddingChange}
                    step={0.01} max={50}
                    marks={[{value: 0, label: '0%'}, {value: 50, label: '50%'}]}
                    valueLabelDisplay="auto"
                />
            </ExpansionPanelDetails>
        </ExpansionPanel>
    ), [props.padding, props.expanded]);

    return (
        <>
            <Grow in={isGrow} style={{ transformOrigin: '0 0 1' }} timeout={200}>
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
                                    value={props.svgDestWidth.toString()} 
                                    onChange={svgDestWidthChange} />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField style={{display: 'flex'}}
                                    label={t('layout.size.width')}
                                    variant="outlined" 
                                    value={props.svgWidth.toString()}
                                    onChange={svgWidthChange} />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField style={{display: 'flex'}}
                                    label={t('layout.size.height')}
                                    variant="outlined" 
                                    value={props.svgHeight.toString()} 
                                    onChange={svgHeightChange} />
                            </Grid>
                        </Grid>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </Grow>
            <Grow in={isGrow} style={{ transformOrigin: '0 0 1' }} timeout={400}>
                {yPcPanel}
            </Grow>
            <Grow in={isGrow} style={{ transformOrigin: '0 0 1' }} timeout={600}>
                {branchSpacingPanel}
            </Grow>
            <Grow in={isGrow} style={{ transformOrigin: '0 0 1' }} timeout={800}>
                {paddingPanel}
            </Grow>
        </>
    )
}

export default LayoutCommon;