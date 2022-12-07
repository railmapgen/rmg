import { ReactNode, useEffect, useState } from 'react';
import { CanvasType, RmgStyle } from '../constants/constants';

const modules: Record<RmgStyle, () => Promise<any>> = {
    mtr: () => import('./mtr'),
    gzmtr: () => import('./gzmtr'),
    shmetro: () => import('./shmetro'),
};

export default function useCanvasMap(style: RmgStyle) {
    const [canvasMap, setCanvasMap] = useState<Partial<Record<CanvasType, ReactNode>>>({});

    useEffect(() => {
        modules[style]()
            .then(module => {
                setCanvasMap(module.default);
            })
            .catch(e => {
                console.error(`Failed to load canvas for style ${style}`, e);
                setCanvasMap({});
            });

        // reset canvas map while loading module for next style
        return () => {
            setCanvasMap({});
        };
    }, [style]);

    return canvasMap;
}
