import { CanvasType } from '../constants/constants';
import { useRootSelector } from '../redux';
import { Flex } from '@chakra-ui/react';
import useCanvasMap from './use-canvas-map';
import { RmgErrorBoundary, RmgLoader } from '@railmapgen/rmg-components';

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

export default function SvgRouter() {
    const { canvasToShow, canvasScale } = useRootSelector(state => state.app);
    const { svg_height: svgHeight, style: rmgStyle } = useRootSelector(state => state.param);

    const canvasMap = useCanvasMap(rmgStyle);

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
