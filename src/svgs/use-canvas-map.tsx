import { ReactNode, useEffect, useState } from 'react';
import { CanvasType, RmgStyle } from '../constants/constants';

export default function useCanvasMap(style: RmgStyle) {
    const [canvasMap, setCanvasMap] = useState<Partial<Record<CanvasType, ReactNode>>>({});

    useEffect(() => {
        import(`./${style}/index`)
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
