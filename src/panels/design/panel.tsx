import * as React from 'react';

import { Grid, Paper, List, Divider, LinearProgress } from '@material-ui/core';

import DesignCommon from './list-common';
const DesignMTR = React.lazy(() => import(/* webpackChunkName: "panelDesignMTR" */ './list-mtr'));
const DesignGZMTR = React.lazy(() => import(/* webpackChunkName: "panelDesignGZMTR" */ './list-gzmtr'));

const DesignPanel = () => {
    return (
        <Grid container spacing={3} justify="center" alignItems="flex-start">
            <Grid item xs={12} sm={10} md={7} lg={5}>
                <Paper>
                    <List component="div" disablePadding>
                        <DesignCommon />
                        {window.urlParams.get('style') === 'mtr' && (
                            <React.Suspense fallback={<LinearProgress />}>
                                <Divider />
                                <DesignMTR />
                            </React.Suspense>
                        )}
                        {window.urlParams.get('style') === 'gzmtr' && (
                            <React.Suspense fallback={<LinearProgress />}>
                                <Divider />
                                <DesignGZMTR />
                            </React.Suspense>
                        )}
                    </List>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default DesignPanel;
