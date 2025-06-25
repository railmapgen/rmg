import classes from './svg-router.module.css';
import { CanvasType } from '../constants/constants';
import { useRootSelector } from '../redux';
import useCanvasMap from './use-canvas-map';
import { Flex, LoadingOverlay, Stack, Text } from '@mantine/core';
import { RMErrorBoundary } from '@railmapgen/mantine-components';

export default function SvgRouter() {
    const { canvasToShow, canvasScale } = useRootSelector(state => state.app);
    const { svg_height: svgHeight, style: rmgStyle } = useRootSelector(state => state.param);

    const canvasMap = useCanvasMap(rmgStyle);

    const filteredCanvas = (Object.keys(canvasMap) as CanvasType[]).filter(canvas => canvasToShow.includes(canvas));
    const scaledHeight = svgHeight * canvasScale;

    return (
        <Stack className={classes.wrapper}>
            {Object.keys(canvasMap).length === 0 ? (
                <LoadingOverlay visible />
            ) : (
                filteredCanvas.map(canvas => (
                    <Flex key={canvas + rmgStyle} direction="column">
                        <Text>{canvas}</Text>
                        <div>
                            <RMErrorBoundary style={{ height: scaledHeight }}>{canvasMap[canvas]}</RMErrorBoundary>
                        </div>
                    </Flex>
                ))
            )}
        </Stack>
    );
}
