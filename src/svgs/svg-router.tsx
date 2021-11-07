import { createStyles, makeStyles } from '@material-ui/core';
import React, { lazy, ReactNode, useEffect } from 'react';
import { CanvasType, RmgStyle } from '../constants/constants';
import { useAppSelector } from '../redux';
import SvgWrapper from './svg-wrapper';
import { useDispatch } from 'react-redux';
import { setStyle } from '../redux/param/action';
import { useHistory, useLocation } from 'react-router-dom';

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
    }),
);

export default function SvgRouter() {
    const classes = useStyles();
    const location = useLocation();
    const history = useHistory();
    const dispatch = useDispatch();

    const { canvasToShow, canvasScale } = useAppSelector(state => state.app);
    const { svgWidth: svgWidths, svg_height: svgHeight, style: rmgStyle, theme } = useAppSelector(state => state.param);

    if (location.pathname !== '/' + rmgStyle) {
        const nextStyle = location.pathname.slice(1) as RmgStyle;
        if (Object.values(RmgStyle).includes(nextStyle)) {
            // set style in param
            dispatch(setStyle(nextStyle));
        } else {
            // push route to match param's style
            history.push('/' + rmgStyle)
        }
    }

    useEffect(() => {
        (document.getElementById('css_share') as HTMLLinkElement).href =
            process.env.PUBLIC_URL + `/styles/share_${rmgStyle}.css`;
    }, [rmgStyle]);

    const filteredCanvas = (Object.keys(canvasList[rmgStyle]) as CanvasType[])
        .filter(canvas => (canvasToShow === 'all' ? true : canvasToShow === canvas));

    return (
        <div className={classes.root}>
            {filteredCanvas.map(canvas => (
                <SvgWrapper
                    key={canvas}
                    type={canvas}
                    style={rmgStyle}
                    svgWidth={svgWidths[canvas]}
                    svgHeight={svgHeight}
                    canvasScale={canvasScale}
                    theme={theme}
                >
                    {canvasList[rmgStyle][canvas]}
                </SvgWrapper>
            ))}
        </div>
    );
}

// Canvas available

const RunInGZMTR = lazy(() => import(/* webpackChunkName: "runinGZMTR" */ './runin/runin-gzmtr'));
const RailMapGZMTR = lazy(() => import(/* webpackChunkName: "railmapGZMTR" */ './railmap/railmap-gzmtr'));

const DestinationMTR = lazy(() => import(/* webpackChunkName: "destinationMTR" */ './destination/destination-mtr'));
const RailMapMTR = lazy(() => import(/* webpackChunkName: "railmapMTR" */ './railmap/railmap-mtr'));

const DestinationSHMetro = lazy(
    () => import(/* webpackChunkName: "destinationSHMetro" */ './destination/destination-shmetro'),
);
const RunInSHMetro = lazy(() => import(/* webpackChunkName: "runinSHMetro" */ './runin/runin-shmetro'));
const RailMapSHMetro = lazy(() => import(/* webpackChunkName: "railmapSHMetro" */ './railmap/railmap-shmetro'));
const IndoorSHMetro = lazy(() => import(/* webpackChunkName: "indoorSHMetro" */ './indoor/indoor-shmetro'));

/**
 * Each value of this object is an object of ORDERED key-value pairs
 */
const canvasList: Record<RmgStyle, { [c in CanvasType]?: ReactNode }> = {
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
