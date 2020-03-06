import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, TextField, Slider } from '@material-ui/core';
import StyledExpansionPanel from './styled-expansion-panel';

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

    const sizePanel = React.useMemo(() => (
        <StyledExpansionPanel in={isGrow} growTimeout={200}
            expanded={props.expanded === 0}
            onChange={props.onChange(0)}
            icon="panorama_horizontal"
            heading={t('layout.size.title')}>
            <Grid container spacing={1} justify="center" alignItems="flex-start">
                <Grid item xs={12} sm={4}>
                    <TextField style={{ display: 'flex' }}
                        label={t('layout.size.destWidth')}
                        value={props.svgDestWidth.toString()}
                        onChange={svgDestWidthChange} />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField style={{ display: 'flex' }}
                        label={t('layout.size.width')}
                        value={props.svgWidth.toString()}
                        onChange={svgWidthChange} />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField style={{ display: 'flex' }}
                        label={t('layout.size.height')}
                        value={props.svgHeight.toString()}
                        onChange={svgHeightChange} />
                </Grid>
            </Grid>
        </StyledExpansionPanel>
    ), [props.svgDestWidth, props.svgWidth, props.svgHeight, props.expanded, isGrow]);

    const yPcChange = (_, value: number) => {
        props.paramUpdate('y_pc', value);
        window.myLine.yPc = value;
    };

    const yPcPanel = React.useMemo(() => (
        <StyledExpansionPanel in={isGrow} growTimeout={400}
            expanded={props.expanded === 1}
            onChange={props.onChange(1)}
            icon="vertical_align_center"
            heading={t('layout.y')}
            secondaryHeading={props.yPc.toFixed(2) + '%'}>
            <Slider
                value={props.yPc}
                onChange={yPcChange}
                step={0.01}
                marks={[{ value: 0, label: '0%' }, { value: 100, label: '100%' }]}
                valueLabelDisplay="auto"
            />
        </StyledExpansionPanel>
    ), [props.yPc, props.expanded, isGrow]);

    const branchSpacingChange = (_, value: number) => {
        props.paramUpdate('branch_spacing', value);
        window.myLine.branchSpacing = value;
    };

    const branchSpacingPanel = React.useMemo(() => (
        <StyledExpansionPanel in={isGrow} growTimeout={600}
            expanded={props.expanded === 2}
            onChange={props.onChange(2)}
            icon="format_line_spacing"
            heading={t('layout.branchSpacing')}
            secondaryHeading={props.branchSpacing.toFixed(2) + 'px'}>
            <Slider
                value={props.branchSpacing}
                onChange={branchSpacingChange}
                step={0.01}
                marks={[{ value: 0, label: '0px' }, { value: 100, label: '100px' }]}
                valueLabelDisplay="auto"
            />
        </StyledExpansionPanel>
    ), [props.branchSpacing, props.expanded, isGrow]);

    const paddingChange = (_, value: number) => {
        props.paramUpdate('padding', value);
        window.myLine.padding = value;
    };

    const paddingPanel = React.useMemo(() => (
        <StyledExpansionPanel in={isGrow} growTimeout={800}
            expanded={props.expanded === 3}
            onChange={props.onChange(3)}
            icon="stay_current_landscape"
            heading={t('layout.padding')}
            secondaryHeading={props.padding.toFixed(2) + '%'}>
            <Slider
                value={props.padding}
                onChange={paddingChange}
                step={0.01} max={50}
                marks={[{ value: 0, label: '0%' }, { value: 50, label: '50%' }]}
                valueLabelDisplay="auto"
            />
        </StyledExpansionPanel>
    ), [props.padding, props.expanded, isGrow]);

    return (
        <>
            {sizePanel}
            {yPcPanel}
            {branchSpacingPanel}
            {paddingPanel}
        </>
    )
}

export default LayoutCommon;

