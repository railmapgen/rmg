import React, { lazy, memo, useCallback, useEffect } from 'react';
import { CircularProgress, createStyles, makeStyles } from '@material-ui/core';
import { Redirect, Route, Switch } from 'react-router-dom';
import ErrorBoundary from '../error-boundary';
import { AllCanvas, canvasConfig, CanvasType, RmgStyle } from '../constants/constants';
import { selectCanvas } from '../redux/app/action';
import { setStyle } from '../redux/param/action';
import { useAppDispatch, useAppSelector } from '../redux';

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

    const canvasScale = useAppSelector(store => store.app.canvasScale);
    const svgHeight = useAppSelector(store => store.param.svg_height);
    const svgWidths = useAppSelector(store => store.param.svgWidth);
    const theme = useAppSelector(store => store.param.theme);

    const sharedProps = useCallback(
        (canvas: CanvasType): React.SVGProps<SVGSVGElement> => ({
            id: canvas,
            xmlns: 'http://www.w3.org/2000/svg',
            xmlnsXlink: 'http://www.w3.org/1999/xlink',
            height: svgHeight * canvasScale,
            viewBox: `0 0 ${svgWidths[canvas]} ${svgHeight}`,
            colorInterpolationFilters: 'sRGB',
            style: {
                ['--rmg-svg-width' as any]: svgWidths[canvas] + 'px',
                ['--rmg-svg-height' as any]: svgHeight + 'px',
                ['--rmg-theme-colour' as any]: theme[2],
                ['--rmg-theme-fg' as any]: theme[3],
            },
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [svgHeight, JSON.stringify(svgWidths), theme, canvasScale]
    );

    const rmgStyle = useAppSelector(store => store.param.style);

    return (
        <div className={classes.root}>
            <Switch>
                {Object.values(RmgStyle).map(s => (
                    <Route path={`/${s}`} key={s}>
                        <StyleSpecificSVGs style={s} canvasAvailable={canvasList[s]} svgProps={sharedProps} />
                    </Route>
                ))}
                <Redirect to={`/${rmgStyle}`} />
            </Switch>
        </div>
    );
};

export default SVGs;

const StyleSpecificSVGs = memo(
    (props: {
        style: RmgStyle;
        canvasAvailable: { [canvas in CanvasType]?: JSX.Element };
        svgProps: (canvas: CanvasType) => React.SVGProps<SVGSVGElement>;
    }) => {
        const dispatch = useAppDispatch();

        const canvasToShow = useAppSelector(store => store.app.canvasToShow);

        dispatch(setStyle(props.style));

        useEffect(
            () => {
                ['share', ...Object.values(CanvasType)].forEach(canvas => {
                    if (canvas in props.canvasAvailable || canvas === 'share') {
                        (document.getElementById('css_' + canvas) as HTMLLinkElement).href =
                            process.env.PUBLIC_URL + `/styles/${canvas}_${props.style}.css`;
                    } else {
                        (document.getElementById('css_' + canvas) as HTMLLinkElement).href = '';
                    }
                });

                ![...canvasConfig[props.style], AllCanvas].includes(canvasToShow) && dispatch(selectCanvas(AllCanvas));
            },
            // eslint-disable-next-line react-hooks/exhaustive-deps
            []
        );

        return (
            <>
                {(Object.keys(props.canvasAvailable) as (keyof typeof props.canvasAvailable)[]).map(
                    canvas =>
                        [AllCanvas, canvas].includes(canvasToShow) && (
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

const DestinationSHMetro = lazy(
    () => import(/* webpackChunkName: "destinationSHMetro" */ './destination/destination-shmetro')
);
const RunInSHMetro = lazy(() => import(/* webpackChunkName: "runinSHMetro" */ './runin/runin-shmetro'));
const RailMapSHMetro = lazy(() => import(/* webpackChunkName: "railmapSHMetro" */ './railmap/railmap-shmetro'));
const IndoorSHMetro = lazy(() => import(/* webpackChunkName: "indoorSHMetro" */ './indoor/indoor-shmetro'));

/**
 * Each value of this object is an object of ORDERED key-value pairs
 */
const canvasList: { [s in RmgStyle]: { [c in CanvasType]?: JSX.Element } } = {
    [RmgStyle.GZMTR]: {
        [CanvasType.RunIn]: <RunInGZMTR />,
        [CanvasType.RailMap]: <RailMapGZMTR />,
    },
    [RmgStyle.MTR]: {
        [CanvasType.Destination]: <DestinationMTR />,
        [CanvasType.RailMap]: <RailMapMTR />,
    },
    [RmgStyle.SHMetro]: {
        [CanvasType.Destination]: <DestinationSHMetro />,
        [CanvasType.RunIn]: <RunInSHMetro />,
        [CanvasType.RailMap]: <RailMapSHMetro />,
        [CanvasType.Indoor]: <IndoorSHMetro />,
    },
};
