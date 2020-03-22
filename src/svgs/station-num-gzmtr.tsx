import React from 'react';

const StationNumberText = (props: { lineNum: string; stnNum: string } & React.SVGProps<SVGGElement>) => {
    const { lineNum, stnNum, ...others } = props;

    const LINE_NUM_MAX_WIDTH = 15.03125;

    const lineNumEl = React.useRef<SVGTextElement | null>(null);
    const [bBox, setBBox] = React.useState({ width: LINE_NUM_MAX_WIDTH } as DOMRect);
    React.useEffect(() => setBBox(lineNumEl.current!.getBBox()), [lineNum]);

    const lineNumScale = bBox.width > LINE_NUM_MAX_WIDTH ? LINE_NUM_MAX_WIDTH / bBox.width : 1;
    const stnNumScale = lineNum.length === 2 ? lineNumScale : 1;

    return (
        <g textAnchor="middle" fontSize={13.5} {...others}>
            {React.useMemo(
                () => (
                    <>
                        <g transform={`translate(-9.25,0)scale(${lineNumScale})`}>
                            <text ref={lineNumEl} className="rmg-name__zh">
                                {lineNum}
                            </text>
                        </g>
                        <g transform={`translate(9.25,0)scale(${stnNumScale})`}>
                            <text className="rmg-name__zh">{stnNum}</text>
                        </g>
                    </>
                ),
                // eslint-disable-next-line react-hooks/exhaustive-deps
                [bBox.width, lineNum, stnNum]
            )}
        </g>
    );
};

export default StationNumberText;
