import * as React from 'react';

import { Grid, CircularProgress } from '@material-ui/core';

import { RMGParam } from '../../types';

import DesignCommon from './list-common';
const DesignMTR = React.lazy(() => import(/* webpackChunkName: "panelDesignMTR" */ './list-mtr'));
const DesignGZMTR = React.lazy(() => import(/* webpackChunkName: "panelDesignGZMTR" */ './list-gzmtr'));

interface Props {
    param: RMGParam;
    paramUpdate: (key, data) => void;
}

export default (props: Props) => {
    return (
        <Grid container spacing={3} justify="center" alignItems="flex-start">
            <Grid item xs={12} sm={6} md={5} lg={4}>
                <DesignCommon
                    theme={props.param.theme}
                    lineName={props.param.line_name}
                    platformNum={props.param.platform_num}
                    paramUpdate={props.paramUpdate}
                />
            </Grid>
            {window.urlParams.get('style') === 'mtr' ? (
                <Grid item xs={12} sm={6} md={5} lg={4}>
                    <React.Suspense fallback={<CircularProgress />}>
                        <DesignMTR />
                    </React.Suspense>
                </Grid>
            ) : (
                <></>
            )}
            {window.urlParams.get('style') === 'gzmtr' ? (
                <Grid item xs={12} sm={6} md={5} lg={4}>
                    <React.Suspense fallback={<CircularProgress />}>
                        <DesignGZMTR />
                    </React.Suspense>
                </Grid>
            ) : (
                <></>
            )}
        </Grid>
    );
};
