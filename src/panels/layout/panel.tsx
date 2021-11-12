import React from 'react';
import { Grid, LinearProgress, List, Paper } from '@material-ui/core';
import LayoutCommon from './common';
import { useAppSelector } from '../../redux';
import { RmgStyle } from '../../constants/constants';

const LayoutGZMTR = React.lazy(() => import(/* webpackChunkName: "panelLayoutGZMTR" */ './gzmtr'));

export default React.memo(function LayoutPanel() {
    const rmgStyle = useAppSelector(store => store.param.style);
    return (
        <Grid container spacing={3} justifyContent="center" alignItems="flex-start">
            <Grid item xs={12} sm={10} md={7} lg={5}>
                <Paper>
                    <List component="div" disablePadding>
                        <LayoutCommon />
                        {rmgStyle === RmgStyle.GZMTR && (
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
