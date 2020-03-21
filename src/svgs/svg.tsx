import * as React from 'react';
import Destination from './destination';
import RunIn from './runin';
import RailMap from './railmap';
import { makeStyles, createStyles, CircularProgress } from '@material-ui/core';
import { CanvasContext, ParamContext } from '../context';
import { ProvidedCanvas } from '../types';

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'row',
            overflowX: 'scroll',
            '&::before, &::after': {
                content: '""',
                margin: 'auto',
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

    const { param } = React.useContext(ParamContext);
    const { canvasAvailable, canvasToShown, canvasScale } = React.useContext(CanvasContext);

    const sharedProps = (canvas: ProvidedCanvas): React.SVGProps<SVGSVGElement> & { children?: React.ReactNode } => ({
        id: canvas,
        xmlns: 'http://www.w3.org/2000/svg',
        xmlnsXlink: 'http://www.w3.org/1999/xlink',
        height: param.svg_height * canvasScale,
        viewBox: `0 0 ${param.svgWidth[canvas]} ${param.svg_height}`,
        style: {
            ['--rmg-svg-width' as any]: param.svgWidth[canvas] + 'px',
            ['--rmg-svg-height' as any]: param.svg_height + 'px',
            ['--rmg-theme-colour' as any]: param.theme[2],
            ['--rmg-theme-fg' as any]: param.theme[3],
        },
        children: (
            <rect
                x={0}
                y={0}
                fill="white"
                stroke="none"
                style={{ height: 'var(--rmg-svg-height)', width: 'var(--rmg-svg-width)' }}
            />
        ),
    });

    return (
        <div className={classes.root}>
            {canvasAvailable.map(
                canvas =>
                    [canvas, 'all'].includes(canvasToShown) && (
                        <React.Suspense key={canvas} fallback={<CircularProgress />}>
                            {(c => {
                                switch (c) {
                                    case 'destination':
                                        return <Destination {...sharedProps(c)} />;
                                    case 'runin':
                                        return <RunIn {...sharedProps(c)} />;
                                    case 'railmap':
                                        return <RailMap {...sharedProps(c)} />;
                                }
                            })(canvas)}
                        </React.Suspense>
                    )
            )}
        </div>
    );
};

export default SVGs;
