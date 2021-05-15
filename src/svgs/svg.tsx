import React, { useContext, useEffect, memo, lazy } from 'react';
import { makeStyles, createStyles, CircularProgress } from '@material-ui/core';
import { CanvasContext, ParamContext } from '../context';
import { Switch, Route, Redirect } from 'react-router-dom';
import ErrorBoundary from '../error-boundary';

import { ProvidedCanvases } from '../constants/constants';

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
    const { canvasScale } = React.useContext(CanvasContext);

    const sharedProps = React.useCallback(
        (canvas: ProvidedCanvas): React.SVGProps<SVGSVGElement> => ({
            id: canvas,
            xmlns: 'http://www.w3.org/2000/svg',
            xmlnsXlink: 'http://www.w3.org/1999/xlink',
            height: param.svg_height * canvasScale,
            viewBox: `0 0 ${param.svgWidth[canvas]} ${param.svg_height}`,
            colorInterpolationFilters: 'sRGB',
            style: {
                ['--rmg-svg-width' as any]: param.svgWidth[canvas] + 'px',
                ['--rmg-svg-height' as any]: param.svg_height + 'px',
                ['--rmg-theme-colour' as any]: param.theme[2],
                ['--rmg-theme-fg' as any]: param.theme[3],
            },
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [param.svg_height, JSON.stringify(param.svgWidth), param.theme[2], param.theme[3], canvasScale]
    );

    return (
        <div className={classes.root}>
            <Switch>
                {(Object.keys(canvasList) as ProvidedStyles[]).map(s => (
                    <Route path={`/${s}`} key={s}>
                        <StyleSpecificSVGs rmgStyle={s} canvasAvailable={canvasList[s]} svgProps={sharedProps} />
                    </Route>
                ))}
                <Redirect to={'/' + (new URLSearchParams(window.location.search).get('style') || 'mtr')} />
            </Switch>
        </div>
    );
};

export default SVGs;

const StyleSpecificSVGs = memo(
    (props: {
        rmgStyle: ProvidedStyles;
        canvasAvailable: { [canvas in ProvidedCanvas]?: JSX.Element };
        svgProps: (canvas: ProvidedCanvas) => React.SVGProps<SVGSVGElement>;
    }) => {
        const { canvasToShown, setCanvasToShown, setCanvasAvailable } = useContext(CanvasContext);
        useEffect(
            () => {
                ['share', ...ProvidedCanvases].forEach(canvas => {
                    if (canvas in props.canvasAvailable || canvas === 'share') {
                        (document.getElementById('css_' + canvas) as HTMLLinkElement).href =
                            process.env.PUBLIC_URL + `/styles/${canvas}_${props.rmgStyle}.css`;
                    } else {
                        (document.getElementById('css_' + canvas) as HTMLLinkElement).href = '';
                    }
                });
                setCanvasAvailable(Object.keys(props.canvasAvailable) as ProvidedCanvas[]);
                setCanvasToShown(prevCanvas =>
                    ['all', ...Object.keys(props.canvasAvailable)].includes(prevCanvas) ? prevCanvas : 'all'
                );
            },
            // eslint-disable-next-line react-hooks/exhaustive-deps
            []
        );

        return (
            <>
                {(Object.keys(props.canvasAvailable) as (keyof typeof props.canvasAvailable)[]).map(
                    canvas =>
                        ['all', canvas].includes(canvasToShown) && (
                            <React.Suspense key={canvas} fallback={<CircularProgress />}>
                                <ErrorBoundary>
                                    <svg {...props.svgProps(canvas)}>
                                        <rect
                                            id="canvas-bg"
                                            fill="white"
                                            style={{ height: 'var(--rmg-svg-height)', width: 'var(--rmg-svg-width)' }}
                                        />
                                        {props.canvasAvailable[canvas]}
                                        <rect
                                            id="canvas-border"
                                            fill="none"
                                            strokeWidth={3}
                                            stroke="none"
                                            style={{ height: 'var(--rmg-svg-height)', width: 'var(--rmg-svg-width)' }}
                                        />
                                    </svg>
                                </ErrorBoundary>
                            </React.Suspense>
                        )
                )}
            </>
        );
    }
);

// Canvas available

const RunInGZMTR = lazy(() => import(/* webpackChunkName: "runinGZMTR" */ './runin/runin-gzmtr'));
const RailMapGZMTR = lazy(() => import(/* webpackChunkName: "railmapGZMTR" */ './railmap/railmap-gzmtr'));

const DestinationMTR = lazy(() => import(/* webpackChunkName: "destinationMTR" */ './destination/destination-mtr'));
const RailMapMTR = lazy(() => import(/* webpackChunkName: "railmapMTR" */ './railmap/railmap-mtr'));

const DestinationSHMetro = lazy(() =>
    import(/* webpackChunkName: "destinationSHMetro" */ './destination/destination-shmetro')
);
const RunInSHMetro = lazy(() => import(/* webpackChunkName: "runinSHMetro" */ './runin/runin-shmetro'));
const RailMapSHMetro = lazy(() => import(/* webpackChunkName: "railmapSHMetro" */ './railmap/railmap-shmetro'));

/**
 * Each value of this object is an object of ORDERED key-value pairs
 */
const canvasList: { [s in ProvidedStyles]: { [c in ProvidedCanvas]?: JSX.Element } } = {
    gzmtr: {
        runin: <RunInGZMTR />,
        railmap: <RailMapGZMTR />,
    },
    mtr: {
        destination: <DestinationMTR />,
        railmap: <RailMapMTR />,
    },
    shmetro: {
        destination: <DestinationSHMetro />,
        runin: <RunInSHMetro />,
        railmap: <RailMapSHMetro />,
    },
};
