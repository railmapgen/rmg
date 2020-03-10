import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, TextField, Slider } from '@material-ui/core';
import StyledExpansionPanel from './styled-expansion-panel';
import { ParamContext } from '../../context';

interface Props {
    expanded: false | number;
    onChange: (index: number) => (event, isExpanded: boolean) => void;
}

const LayoutCommon = (props: Props) => {
    const { t } = useTranslation();
    const { param, dispatch } = React.useContext(ParamContext);

    const [isGrow, setIsGrow] = React.useState(false);
    React.useEffect(() => {
        setIsGrow(true);
        return () => setIsGrow(false);
    }, []);

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
                        value={param.svg_dest_width.toString()}
                        onChange={e => !isNaN(Number(e.target.value)) &&
                            dispatch({ type: 'SET_WIDTH', targetId: 'destination', value: Number(e.target.value) })} />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField style={{ display: 'flex' }}
                        label={t('layout.size.width')}
                        value={param.svg_width.toString()}
                        onChange={e => !isNaN(Number(e.target.value)) &&
                            dispatch({ type: 'SET_WIDTH', targetId: 'railmap', value: Number(e.target.value) })} />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField style={{ display: 'flex' }}
                        label={t('layout.size.height')}
                        value={param.svg_height.toString()}
                        onChange={e => !isNaN(Number(e.target.value)) &&
                            dispatch({ type: 'SET_HEIGHT', value: Number(e.target.value) })} />
                </Grid>
            </Grid>
        </StyledExpansionPanel>
    ), [param.svg_dest_width, param.svg_width, param.svg_height, props.expanded, isGrow]);

    return (
        <>
            {sizePanel}
            <YPcPanel in={isGrow} expanded={props.expanded === 1} onChange={props.onChange} />
            <BranchSpacingPanel in={isGrow} expanded={props.expanded === 2} onChange={props.onChange} />
            <PaddingPanel in={isGrow} expanded={props.expanded === 3} onChange={props.onChange} />
        </>
    )
}

export default LayoutCommon;

interface ExpansionPanelProps {
    in: boolean;
    expanded: boolean;
    onChange: (index: number) => (event: React.ChangeEvent<{}>, expanded: boolean) => void;
}

const YPcPanel = (props: ExpansionPanelProps) => {
    const { t } = useTranslation();
    const { param, dispatch } = React.useContext(ParamContext);

    return React.useMemo(() => (
        <StyledExpansionPanel in={props.in} growTimeout={400}
            expanded={props.expanded}
            onChange={props.onChange(1)}
            icon="vertical_align_center"
            heading={t('layout.y')}
            secondaryHeading={param.y_pc.toFixed(2) + '%'}>
            <Slider
                value={param.y_pc}
                onChange={(_, value: number) => dispatch({ type: 'SET_Y', value })}
                step={0.01}
                marks={[{ value: 0, label: '0%' }, { value: 100, label: '100%' }]}
                valueLabelDisplay="auto"
            />
        </StyledExpansionPanel>
    ), [param.y_pc, props.in, props.expanded]);
};

const BranchSpacingPanel = (props: ExpansionPanelProps) => {
    const { t } = useTranslation();
    const { param, dispatch } = React.useContext(ParamContext);

    return React.useMemo(() => (
        <StyledExpansionPanel in={props.in} growTimeout={600}
            expanded={props.expanded}
            onChange={props.onChange(2)}
            icon="format_line_spacing"
            heading={t('layout.branchSpacing')}
            secondaryHeading={param.branch_spacing.toFixed(2) + 'px'}>
            <Slider
                value={param.branch_spacing}
                onChange={(_, value: number) => dispatch({ type: 'SET_BRANCH_SPACING', value })}
                step={0.01}
                marks={[{ value: 0, label: '0px' }, { value: 100, label: '100px' }]}
                valueLabelDisplay="auto"
            />
        </StyledExpansionPanel>
    ), [param.branch_spacing, props.in, props.expanded]);
};

const PaddingPanel = (props: ExpansionPanelProps) => {
    const { t } = useTranslation();
    const { param, dispatch } = React.useContext(ParamContext);

    return React.useMemo(() => (
        <StyledExpansionPanel in={props.in} growTimeout={800}
            expanded={props.expanded}
            onChange={props.onChange(3)}
            icon="stay_current_landscape"
            heading={t('layout.padding')}
            secondaryHeading={param.padding.toFixed(2) + '%'}>
            <Slider
                value={param.padding}
                onChange={(_, value: number) => dispatch({ type: 'SET_PADDING', value })}
                step={0.01} max={50}
                marks={[{ value: 0, label: '0%' }, { value: 50, label: '50%' }]}
                valueLabelDisplay="auto"
            />
        </StyledExpansionPanel>
    ), [param.padding, props.in, props.expanded]);
};