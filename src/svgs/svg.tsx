import * as React from 'react';
import Destination from './destination';
import RunIn from './runin';
import RailMap from './railmap';
import { makeStyles, createStyles, CircularProgress } from '@material-ui/core';
import { CanvasContext } from '../context';

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            height: '100%',
            display: 'flex',
            flexDirection: 'row',
            overflowX: 'scroll',
            scrollbarWidth: 'none',
            '&::before, &::after': {
                content: '""',
                margin: 'auto',
            },
            '&::-webkit-scrollbar': {
                display: 'none',
            },
            '& > svg': {
                flex: '0 0 auto',
                border: '1px solid black',
            },
        },
    })
);

const SVGs = () => {
    const classes = useStyles();

    const { canvasAvailable, canvasToShown } = React.useContext(CanvasContext);

    return (
        <div className={classes.root}>
            {canvasAvailable.includes('destination') && ['destination', 'all'].includes(canvasToShown) && (
                <React.Suspense fallback={<CircularProgress />}>
                    <Destination />
                </React.Suspense>
            )}
            {canvasAvailable.includes('runin') && ['runin', 'all'].includes(canvasToShown) && (
                <React.Suspense fallback={<CircularProgress />}>
                    <RunIn />
                </React.Suspense>
            )}
            {canvasAvailable.includes('railmap') && ['railmap', 'all'].includes(canvasToShown) && (
                <React.Suspense fallback={<CircularProgress />}>
                    <RailMap />
                </React.Suspense>
            )}
        </div>
    );
};

export default SVGs;
