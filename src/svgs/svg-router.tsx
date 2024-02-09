import { useEffect } from 'react';
import { CanvasType, Events, RmgStyle } from '../constants/constants';
import { useRootSelector } from '../redux';
import { Flex } from '@chakra-ui/react';
import useCanvasMap from './use-canvas-map';
import { RmgErrorBoundary, RmgLoader } from '@railmapgen/rmg-components';
import rmgRuntime from '@railmapgen/rmg-runtime';
import { STYLE_CONFIG } from './config';

const style = {
    position: 'relative',
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

const loadFontsByStyle = async (style: RmgStyle, signal: AbortSignal) => {
    const fonts = (await STYLE_CONFIG[style].fonts?.()) ?? [];
    await Promise.all(fonts.map(font => rmgRuntime.loadFont(font)));
    if (!signal.aborted) {
        document
            .querySelector<HTMLLinkElement>('#css_share')
            ?.setAttribute('href', import.meta.env.BASE_URL + `styles/share_${style}.css`);
    }
};

export default function SvgRouter() {
    const { canvasToShow, canvasScale } = useRootSelector(state => state.app);
    const { svg_height: svgHeight, style: rmgStyle } = useRootSelector(state => state.param);

    const canvasMap = useCanvasMap(rmgStyle);

    useEffect(() => {
        const controller = new AbortController();
        loadFontsByStyle(rmgStyle, controller.signal).then();
        rmgRuntime.event(Events.STYLE_CHANGE, { style: rmgStyle });

        return () => {
            controller.abort();
        };
    }, [rmgStyle]);

    const filteredCanvas = (Object.keys(canvasMap) as CanvasType[]).filter(canvas => canvasToShow.includes(canvas));
    const scaledHeight = svgHeight * canvasScale;

    return (
        <Flex minH={scaledHeight} sx={style}>
            {Object.keys(canvasMap).length === 0 ? (
                <RmgLoader isIndeterminate={true} />
            ) : (
                filteredCanvas.map(canvas => (
                    <RmgErrorBoundary key={canvas + rmgStyle} sx={{ minWidth: 750, height: scaledHeight }}>
                        {canvasMap[canvas]}
                    </RmgErrorBoundary>
                ))
            )}
        </Flex>
    );
}
