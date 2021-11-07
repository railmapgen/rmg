import { CanvasType, RmgStyle, Theme } from '../constants/constants';
import React, { ReactNode, useEffect } from 'react';
import { CircularProgress } from '@material-ui/core';
import ErrorBoundary from '../error-boundary';

interface SvgWrapperProps {
    type: CanvasType;
    style: RmgStyle;
    svgWidth: number;
    svgHeight: number;
    canvasScale: number;
    theme: Theme;
    children: ReactNode;
}

export default function SvgWrapper(props: SvgWrapperProps) {
    const { type, style, svgWidth, svgHeight, canvasScale, theme, children } = props;

    useEffect(() => {
        (document.getElementById('css_' + type) as HTMLLinkElement).href =
            process.env.PUBLIC_URL + `/styles/${type}_${style}.css`;
        return () => {
            (document.getElementById('css_' + type) as HTMLLinkElement).href = '';
        };
    });

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
            <React.Suspense fallback={<CircularProgress />}>
                <ErrorBoundary>{children}</ErrorBoundary>
            </React.Suspense>
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
