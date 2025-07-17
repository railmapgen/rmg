import { ReactNode, useEffect, useState } from 'react';
import { CanvasType, Events, RmgStyle } from '../constants/constants';
import { STYLE_CONFIG } from './config';
import rmgRuntime, { logger } from '@railmapgen/rmg-runtime';

export default function useCanvasMap(style: RmgStyle) {
    const [canvasMap, setCanvasMap] = useState<Partial<Record<CanvasType, ReactNode>>>({});

    const { components, fonts } = STYLE_CONFIG[style];

    const load = async (signal: AbortSignal) => {
        const fontFamilies = (await fonts?.()) ?? [];
        await Promise.all(fontFamilies.map(font => rmgRuntime.loadFont(font)));
        if (!signal.aborted) {
            document
                .querySelector<HTMLLinkElement>('#css_share')
                ?.setAttribute('href', import.meta.env.BASE_URL + `styles/share_${style}.css`);
        }

        const { default: map } = await components();
        setCanvasMap(map);
    };

    useEffect(() => {
        const controller = new AbortController();
        load(controller.signal).catch(e => {
            logger.error(`Failed to load canvas for style ${style}`, e);
            setCanvasMap({});
        });

        rmgRuntime.event(Events.STYLE_CHANGE, { style });

        // reset canvas map while loading module for next style
        return () => {
            controller.abort();
            setCanvasMap({});
        };
    }, [style]);

    return canvasMap;
}
