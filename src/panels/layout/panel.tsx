import React, { useContext } from 'react';

import { Grid, Paper, List, LinearProgress } from '@material-ui/core';

import LayoutCommon from './common';
import { CanvasContext } from '../../context';
const LayoutGZMTR = React.lazy(() => import(/* webpackChunkName: "panelLayoutGZMTR" */ './gzmtr'));

export default React.memo(function LayoutPanel() {
    const { rmgStyle } = useContext(CanvasContext);
    return (
        <Grid container spacing={3} justify="center" alignItems="flex-start">
            <Grid item xs={12} sm={10} md={7} lg={5}>
                <Paper>
                    <List component="div" disablePadding>
                        <LayoutCommon />
                        {rmgStyle === 'gzmtr' && (
                            <React.Suspense fallback={<LinearProgress />}>
                                <LayoutGZMTR />
                            </React.Suspense>
                        )}
                    </List>
                </Paper>
            </Grid>
        </Grid>
    );
});

// export default LayoutPanel;
