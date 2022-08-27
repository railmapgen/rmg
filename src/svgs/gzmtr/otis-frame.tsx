import React from 'react';
import { useRootSelector } from '../../redux';
import { CanvasType } from '../../constants/constants';

interface OtisFrameProps {
    canvasType: CanvasType;
}

export default function OtisFrame(props: OtisFrameProps) {
    const { canvasType } = props;
    const { svgWidth: svgWidths, svg_height: svgHeight } = useRootSelector(store => store.param);

    return (
        <g id="otis_frame" strokeWidth={3} stroke="black">
            <line y2={svgHeight} transform={`translate(${svgWidths[canvasType] / 2},0)`} />
            <line x2={svgWidths[canvasType]} transform="translate(0,90)" />
        </g>
    );
}
