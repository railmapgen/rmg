import { CanvasType, Theme } from '../../constants/constants';
import React, { ReactNode } from 'react';

interface SvgWrapperProps {
    type: CanvasType;
    svgWidth: number;
    svgHeight: number;
    canvasScale: number;
    theme: Theme;
    children: ReactNode;
}

export default function SvgWrapper(props: SvgWrapperProps) {
    const { type, svgWidth, svgHeight, canvasScale, theme, children } = props;

    return (
        <svg
            id={type}
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            height={svgHeight * canvasScale}
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            colorInterpolationFilters="sRGB"
            style={{
                ['--rmg-svg-width' as any]: svgWidth + 'px',
                ['--rmg-svg-height' as any]: svgHeight + 'px',
                ['--rmg-theme-colour' as any]: theme[2],
                ['--rmg-theme-fg' as any]: theme[3],
            }}
        >
            <rect
                id="canvas-bg"
                fill="white"
                style={{ height: 'var(--rmg-svg-height)', width: 'var(--rmg-svg-width)' }}
            />
            {children}
            <rect
                id="canvas-border"
                fill="none"
                strokeWidth={3}
                stroke="none"
                style={{ height: 'var(--rmg-svg-height)', width: 'var(--rmg-svg-width)' }}
            />
        </svg>
    );
}
