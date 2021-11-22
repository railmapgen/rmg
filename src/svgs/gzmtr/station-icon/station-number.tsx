import React, { SVGProps, useEffect, useRef, useState } from 'react';
import StationIcon from './station-icon';

const TEXT_MAX_WIDTH = 15;

interface StationNumberProps extends SVGProps<SVGGElement> {
    lineNum: string;
    stnNum: string;
    passed?: boolean;
    large?: boolean;
}

export default function StationNumber(props: StationNumberProps) {
    const { lineNum, stnNum, passed, large, ...others } = props;

    const lineNumEl = useRef<SVGTextElement | null>(null);
    const stnNumEl = useRef<SVGTextElement | null>(null);

    const [lineNumBBox, setLineNumBBox] = useState({ width: 0 } as DOMRect);
    const [stnNumBBox, setStnNumBBox] = useState({ width: 0 } as DOMRect);

    useEffect(() => {
        setLineNumBBox(lineNumEl.current!.getBBox());
        setStnNumBBox(stnNumEl.current!.getBBox());
    }, [lineNum, stnNum]);

    const lineNumScale = TEXT_MAX_WIDTH / Math.max(TEXT_MAX_WIDTH, lineNumBBox.width);
    const stnNumScale =
        lineNum.length === 2 && stnNum.length === 2
            ? lineNumScale
            : TEXT_MAX_WIDTH / Math.max(TEXT_MAX_WIDTH, stnNumBBox.width);

    return (
        <g {...others}>
            <StationIcon passed={passed} large={large} />
            <g
                textAnchor="middle"
                fontSize={13.5}
                transform={large ? 'scale(1.4)' : ''}
                fill={passed ? '#aaa' : '#000'}
            >
                <g transform={`translate(-9.25,0)scale(${lineNumScale})`}>
                    <text ref={lineNumEl} className="rmg-name__zh">
                        {lineNum}
                    </text>
                </g>
                <g transform={`translate(9.25,0)scale(${stnNumScale})`}>
                    <text ref={stnNumEl} className="rmg-name__zh">
                        {stnNum}
                    </text>
                </g>
            </g>
        </g>
    );
}
