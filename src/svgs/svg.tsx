

import * as React from 'react';
import Destination from './destination';
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
            <Destination />
            <RailMap />
        </div>
    )
};

export default SVGs;