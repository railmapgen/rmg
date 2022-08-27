import React, { useEffect } from 'react';
import { CanvasType, RmgStyle } from '../constants/constants';
import { useRootSelector } from '../redux';
import { useDispatch } from 'react-redux';
import { setStyle } from '../redux/param/action';
import { useLocation, useNavigate } from 'react-router-dom';
import { Flex } from '@chakra-ui/react';
import ErrorBoundary from '../error-boundary';
import FallbackLoader from '../components/fallback-loader';
import useCanvasMap from './use-canvas-map';

const style = {
    flexDirection: 'row',
    overflowX: 'auto',
    '&::before, &::after': {
        content: '""',
        margin: 'auto',
    },
    '& > svg': {
        flex: '0 0 auto',
        border: '1px solid black',
    },
};

export default function SvgRouter() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { canvasToShow, canvasScale } = useRootSelector(state => state.app);
    const { svg_height: svgHeight, style: rmgStyle } = useRootSelector(state => state.param);

    const canvasMap = useCanvasMap(rmgStyle);

    useEffect(() => {
        const pathname = location.pathname;
        console.log(`SvgRouter:: requestedPath=${pathname}`);
        if (pathname !== '/' + rmgStyle) {
            const nextStyle = pathname.split('/').slice(-1)[0] as RmgStyle;
            if (Object.values(RmgStyle).includes(nextStyle)) {
                // set style in param
                console.log(`SvgRouter:: updating param style to ${nextStyle}`);
                dispatch(setStyle(nextStyle));
            } else {
                // push route to match param's style
                console.log(`SvgRouter:: updating path to /${rmgStyle}`);
                navigate(rmgStyle);
            }
        }
    }, []);

    useEffect(() => {
        (document.getElementById('css_share') as HTMLLinkElement).href =
            process.env.PUBLIC_URL + `/styles/share_${rmgStyle}.css`;
    }, [rmgStyle]);

    const filteredCanvas = (Object.keys(canvasMap) as CanvasType[]).filter(canvas =>
        canvasToShow === 'all' ? true : canvasToShow === canvas
    );

    return (
        <Flex sx={style}>
            {Object.keys(canvasMap).length === 0 ? (
                <FallbackLoader />
            ) : (
                filteredCanvas.map(canvas => (
                    <ErrorBoundary
                        key={canvas + rmgStyle}
                        style={{ minWidth: 750, height: svgHeight * canvasScale, overflowY: 'auto' }}
                    >
                        {canvasMap[canvas]}
                    </ErrorBoundary>
                ))
            )}
        </Flex>
    );
}
