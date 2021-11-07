import React, { SVGProps, useEffect, useRef, useState } from 'react';

const TEXT_MAX_WIDTH = 15;

interface StationNumberProps extends SVGProps<SVGGElement> {
    lineNum: string;
    stnNum: string;
}

export default function StationNumber(props: StationNumberProps) {
    const { lineNum, stnNum, ...others } = props;

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
        <g textAnchor="middle" fontSize={13.5} {...others}>
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
    );
}
