

import * as React from 'react';
import Destination from './destination';
import RunIn from './runin';
import RailMap from './railmap';
import { makeStyles, createStyles } from '@material-ui/core';

const useStyles = makeStyles(() => (
    createStyles({
        root: {
            height: '100%',
            display: 'flex',
            flexDirection: 'row',
            overflowX: 'scroll',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
                display: 'none',
            },
            '& > svg': {
                flex: '0 0 auto',
                border: '1px solid black'
            }
        },
    })
));

const SVGs = () => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            {window.urlParams.get('style')==='mtr' && <Destination />}
            {window.urlParams.get('style')==='gzmtr' && <RunIn />}
            <RailMap />
        </div>
    )
};

export default SVGs;