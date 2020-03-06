import * as React from 'react';

import { Grid } from '@material-ui/core';

import { RMGParam } from '../../types';

import LayoutCommon from './common';
import LayoutGZMTR from './gzmtr';

interface Props {
    param: RMGParam;
    paramUpdate: (key, data) => void;
}

export default (props: Props) => {
    const [expanded, setExpanded] = React.useState(false as false | number);

    const handleChange = (index: number) => (_, isExpanded: boolean) => {
        setExpanded(isExpanded ? index : false);
    };

    return (
        <Grid container spacing={3} justify="center" alignItems="flex-start">
            <Grid item xs={12} sm={12} md={6} lg={5}>
                <LayoutCommon 
                    expanded={expanded} 
                    onChange={handleChange}
                    svgDestWidth={props.param.svg_dest_width}
                    svgWidth={props.param.svg_width}
                    svgHeight={props.param.svg_height}
                    yPc={props.param.y_pc}
                    padding={props.param.padding}
                    branchSpacing={props.param.branch_spacing}
                    paramUpdate={props.paramUpdate} />
                {window.urlParams.get('style')==='gzmtr' && 
                    <LayoutGZMTR expanded={expanded} onChange={handleChange}
                        directionGZX={props.param.direction_gz_x}
                        directionGZY={props.param.direction_gz_y}
                        paramUpdate={props.paramUpdate} />}
            </Grid>
        </Grid>
    );
}
