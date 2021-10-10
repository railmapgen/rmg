import React from 'react';
import { Divider, Grid, LinearProgress, List, Paper } from '@material-ui/core';
import DesignCommon from './list-common';
import { useAppSelector } from '../../redux';
import { RmgStyle } from '../../constants/constants';

const DesignMTR = React.lazy(() => import(/* webpackChunkName: "panelDesignMTR" */ './list-mtr'));
const DesignGZMTR = React.lazy(() => import(/* webpackChunkName: "panelDesignGZMTR" */ './list-gzmtr'));
const DesignShmetro = React.lazy(() => import(/* webpackChunkName: "panelDesignShmetro" */ './list-shmetro'));

const DesignPanel = () => {
    const rmgStyle = useAppSelector(store => store.app.rmgStyle);
    return (
        <Grid container spacing={3} justify="center" alignItems="flex-start">
            <Grid item xs={12} sm={10} md={7} lg={5}>
                <Paper>
                    <List component="div" disablePadding>
                        <DesignCommon />
                        {rmgStyle === RmgStyle.MTR && (
                            <React.Suspense fallback={<LinearProgress />}>
                                <Divider />
                                <DesignMTR />
                            </React.Suspense>
                        )}
                        {rmgStyle === RmgStyle.GZMTR && (
                            <React.Suspense fallback={<LinearProgress />}>
                                <Divider />
                                <DesignGZMTR />
                            </React.Suspense>
                        )}
                        {rmgStyle === RmgStyle.SHMetro && (
                            <React.Suspense fallback={<LinearProgress />}>
                                <Divider />
                                <DesignShmetro />
                            </React.Suspense>
                        )}
                    </List>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default DesignPanel;
