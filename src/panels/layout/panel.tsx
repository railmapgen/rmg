import * as React from 'react';

import { Grid, CircularProgress } from '@material-ui/core';

import LayoutCommon from './common';
const LayoutGZMTR = React.lazy(() => import(/* webpackChunkName: "panelLayoutGZMTR" */ './gzmtr'));

export default () => {
    const [expanded, setExpanded] = React.useState(false as false | number);

    const handleChange = (index: number) => (_, isExpanded: boolean) => {
        setExpanded(isExpanded ? index : false);
    };

    return (
        <Grid container spacing={3} justify="center" alignItems="flex-start">
            <Grid item xs={12} sm={12} md={6} lg={5}>
                <LayoutCommon expanded={expanded} onChange={handleChange} />
                {window.urlParams.get('style') === 'gzmtr' &&
                    <React.Suspense fallback={<CircularProgress />}>
                        <LayoutGZMTR expanded={expanded} onChange={handleChange} />
                    </React.Suspense>}
            </Grid>
        </Grid>
    );
}
