import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { RMGLineGZ } from '../../Line/LineGZ';
import { ExpansionPanel, ExpansionPanelSummary, Icon, Typography, ExpansionPanelDetails, Slider, Grow } from '@material-ui/core';

interface Props {
    expanded: false | number;
    onChange: (index: number) => (event, isExpanded: boolean) => void;

    directionGZX: number;
    directionGZY: number;
    paramUpdate: (key, data) => void;
}

export default (props: Props) => {
    const { t } = useTranslation();

    const directionGZXChange = (_, value: number) => {
        props.paramUpdate('direction_gz_x', value);
        (window.myLine as RMGLineGZ).directionGZX = value;
    }

    const directionGZYChange = (_, value) => {
        props.paramUpdate('direction_gz_y', value);
        (window.myLine as RMGLineGZ).directionGZY = value;
    }

    return (
        <Grow in={true} style={{ transformOrigin: '0 0 1' }} timeout={1000}>
            <ExpansionPanel expanded={props.expanded === 4} onChange={props.onChange(4)}>
                <ExpansionPanelSummary expandIcon={<Icon>expand_more</Icon>}>
                    <Icon style={{minWidth: 48}}>open_with</Icon>
                    <Typography>{t('layout.directionGZ.title')}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails style={{flexDirection: 'column'}}>
                    <Slider
                        value={props.directionGZX}
                        onChange={directionGZXChange}
                        step={0.01}
                        marks={[
                            {value: 0, label: t('layout.directionGZ.left')}, 
                            {value: 100, label: t('layout.directionGZ.right')}
                        ]}
                        valueLabelDisplay="auto" />
                    <Slider
                        value={props.directionGZY}
                        onChange={directionGZYChange}
                        step={0.01}
                        marks={[
                            {value: 0, label: t('layout.directionGZ.top')}, 
                            {value: 100, label: t('layout.directionGZ.bottom')}
                        ]}
                        valueLabelDisplay="auto" />
                </ExpansionPanelDetails>
            </ExpansionPanel>
        </Grow>
    );
}