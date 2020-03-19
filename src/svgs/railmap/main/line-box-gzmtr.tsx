import * as React from 'react';
import { InterchangeInfo } from '../../../types';

const LineBox = React.memo(
    (props: { info: InterchangeInfo; stnState: -1 | 0 | 1 }) => {
        let nameZHEl = [];
        let dy = 0;
        props.info[4].match(/\d+|\D+/g)?.forEach((t, i) => {
            if (isNaN(Number(t))) {
                // text
                nameZHEl.push(
                    <tspan key={i} dominantBaseline="hanging" dy={1 - dy}>
                        {t}
                    </tspan>
                );
                dy += 1 - dy;
            } else {
                // number
                nameZHEl.push(
                    <tspan key={i} dominantBaseline="hanging" fontSize={16} dy={-dy}>
                        {t}
                    </tspan>
                );
                dy = 0;
            }
        });

        const nameZHGroupEl = React.useRef<SVGTextElement>();
        const [zhBBox, setZhBBox] = React.useState({ width: 0 } as DOMRect);
        React.useEffect(() => setZhBBox(nameZHGroupEl.current.getBBox()), [props.info[4]]);
        const nameZHGroupScale = zhBBox.width > 43.5 ? 43.5 / zhBBox.width : 1;

        const nameENEl = React.useRef<SVGTextElement>();
        const [enBBox, setEnBBox] = React.useState({ width: 0 } as DOMRect);
        React.useEffect(() => setEnBBox(nameENEl.current.getBBox()), [props.info[5]]);
        const nameENScale = enBBox.width > 43.5 ? 43.5 / enBBox.width : 1;

        return (
            <g textAnchor="middle" fill={props.stnState === -1 ? '#fff' : props.info[3]}>
                <use xlinkHref="#intbox" fill={props.stnState === -1 ? '#aaa' : props.info[2]} />
                <text
                    ref={nameZHGroupEl}
                    y={2}
                    className="rmg-name__zh"
                    fontSize={12}
                    transform={`scale(${nameZHGroupScale},1)`}
                >
                    {nameZHEl}
                </text>
                <text
                    ref={nameENEl}
                    y={19.5}
                    fontSize={props.info[5].length > 10 ? 7 : 8}
                    className="rmg-name__en"
                    transform={`scale(${nameENScale},1)`}
                >
                    {props.info[5]}
                </text>
            </g>
        );
    },
    (prevProps, nextProps) =>
        prevProps.info.toString() === nextProps.info.toString() && prevProps.stnState === nextProps.stnState
);

export default LineBox;
