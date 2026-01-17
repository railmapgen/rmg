import classes from './svg-router.module.css';
import { CanvasType } from '../constants/constants';
import { useRootDispatch, useRootSelector } from '../redux';
import useCanvasMap from './use-canvas-map';
import { ActionIcon, Flex, Group, LoadingOverlay, Stack, Text } from '@mantine/core';
import { RMErrorBoundary } from '@railmapgen/mantine-components';
import { MdOutlineVisibility, MdOutlineVisibilityOff } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { addCanvasToShow, removeCanvasToShow } from '../redux/app/app-slice';

export default function SvgRouter() {
    const { t } = useTranslation();

    const dispatch = useRootDispatch();
    const { canvasToShow, canvasScale } = useRootSelector(state => state.app);
    const { svg_height: svgHeight, style: rmgStyle } = useRootSelector(state => state.param);

    const canvasMap = useCanvasMap(rmgStyle);
    const scaledHeight = svgHeight * canvasScale;

    if (!Object.keys(canvasMap).length) return <LoadingOverlay visible />;

    return (
        <Stack className={classes.wrapper}>
            {(Object.keys(canvasMap) as CanvasType[]).map(canvas => {
                const visible = canvasToShow.includes(canvas);
                return (
                    <Flex key={canvas + rmgStyle} direction="column">
                        <Group>
                            <Text>{t('CanvasType.' + canvas)}</Text>
                            {visible ? (
                                <ActionIcon
                                    variant="default"
                                    aria-label={t('Hide canvas')}
                                    title={t('Hide canvas')}
                                    onClick={() => dispatch(removeCanvasToShow(canvas))}
                                >
                                    <MdOutlineVisibility />
                                </ActionIcon>
                            ) : (
                                <ActionIcon
                                    variant="default"
                                    aria-label={t('Show canvas')}
                                    title={t('Show canvas')}
                                    onClick={() => dispatch(addCanvasToShow(canvas))}
                                >
                                    <MdOutlineVisibilityOff />
                                </ActionIcon>
                            )}
                        </Group>
                        {visible && (
                            <div>
                                <RMErrorBoundary style={{ height: scaledHeight }}>{canvasMap[canvas]}</RMErrorBoundary>
                            </div>
                        )}
                    </Flex>
                );
            })}
        </Stack>
    );
}
