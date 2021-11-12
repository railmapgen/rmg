import React, { memo, useEffect, useRef, useState } from 'react';
import { Name } from '../../../constants/constants';
import { MAX_WIDTH } from './line-icon';

interface LineIconType2Props {
    lineName: Name;
    commonPart: string;
}

export default memo(
    function LineIconType2(props: LineIconType2Props) {
        const { lineName, commonPart } = props;

        const wrapperEl = useRef<SVGGElement | null>(null);
        const [bBox, setBBox] = useState({ x: 0, height: 0, width: 0 } as DOMRect);
        useEffect(() => {
            wrapperEl.current && setBBox(wrapperEl.current.getBBox());
        }, [lineName.toString()]);

        const scale = MAX_WIDTH / Math.max(MAX_WIDTH, bBox.width);
        const dx = (-bBox.x - bBox.width / 2) * scale;
        const dy = (bBox.height * (1 - scale) * 1.2) / 2;

        return (
            <g ref={wrapperEl} transform={`translate(${dx},${dy})scale(${scale})`}>
                <text className="rmg-name__zh" fontSize={14} y={12} textAnchor="end">
                    {commonPart}
                    <tspan className="rmg-name__zh" fontSize={8} x={0} dy={-2} textAnchor="start">
                        {lineName[0].slice(commonPart.length).trim()}
                    </tspan>
                    <tspan className="rmg-name__en" fontSize={4} x={0} dy={6} textAnchor="start">
                        {lineName[1].slice(commonPart.length).trim()}
                    </tspan>
                </text>
            </g>
        );
    },
    (prevProps, nextProps) => prevProps.lineName.toString() === nextProps.lineName.toString()
);
