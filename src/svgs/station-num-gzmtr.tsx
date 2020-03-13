import * as React from 'react';

const StationNumberText = (props: { lineNum: string; stnNum: string }) => {
    const LINE_NUM_MAX_WIDTH = 15.03125;

    const lineNumEl = React.createRef<SVGTextElement>();
    const [bBox, setBBox] = React.useState({ width: LINE_NUM_MAX_WIDTH } as DOMRect);
    React.useEffect(() => setBBox(lineNumEl.current.getBBox()), [props.lineNum]);

    const lineNumScale = bBox.width > LINE_NUM_MAX_WIDTH ? LINE_NUM_MAX_WIDTH / bBox.width : 1;

    return React.useMemo(
        () => (
            <>
                <g
                    style={{
                        transform: `translateX(-9.25px)scale(var(--scale))`,
                        ['--scale' as any]: lineNumScale,
                    }}
                >
                    <text ref={lineNumEl} className="rmg-name__zh rmg-name__gzmtr--line-num">
                        {props.lineNum}
                    </text>
                </g>
                <g
                    style={{
                        transform: `translateX(9.25px)scale(var(--scale))`,
                        ['--scale' as any]: props.lineNum.length === 2 ? lineNumScale : 1,
                    }}
                >
                    <text className="rmg-name__zh rmg-name__gzmtr--station-num">{props.stnNum}</text>
                </g>
            </>
        ),
        [bBox.width, props.lineNum, props.stnNum]
    );
};

export default StationNumberText;
