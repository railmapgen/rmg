import React, { memo, useEffect, useRef, useState } from 'react';
import { InterchangeInfo, MonoColour, Name } from '../../../constants/constants';

export default memo(
    function LineBox(props: { info: InterchangeInfo; stnState: -1 | 0 | 1 }) {
        return (
            <g textAnchor="middle" fill={props.stnState === -1 ? MonoColour.white : props.info[3]}>
                <use xlinkHref="#intbox" fill={props.stnState === -1 ? '#aaa' : props.info[2]} />
                {props.info[4][0] === props.info[5][0] ? (
                    <LineBoxNameSpan name={props.info.slice(-2) as Name} />
                ) : (
                    <LineBoxName name={props.info.slice(-2) as Name} />
                )}
            </g>
        );
    },
    (prevProps, nextProps) =>
        prevProps.info.toString() === nextProps.info.toString() && prevProps.stnState === nextProps.stnState
);

const LineBoxName = memo(
    (props: { name: Name }) => {
        let nameZHEl = [] as JSX.Element[];
        let dy = 0;
        props.name[0].match(/\d+|\D+/g)?.forEach((t, i) => {
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

        const nameZHGroupEl = useRef<SVGTextElement | null>(null);
        const [zhBBox, setZhBBox] = useState({ width: 0 } as DOMRect);
        useEffect(
            () => setZhBBox(nameZHGroupEl.current!.getBBox()),
            // eslint-disable-next-line react-hooks/exhaustive-deps
            [props.name[0]]
        );
        const nameZHGroupScale = zhBBox.width > 43.5 ? 43.5 / zhBBox.width : 1;

        const nameENEl = useRef<SVGTextElement | null>(null);
        const [enBBox, setEnBBox] = useState({ width: 0 } as DOMRect);
        useEffect(
            () => setEnBBox(nameENEl.current!.getBBox()),
            // eslint-disable-next-line react-hooks/exhaustive-deps
            [props.name[1]]
        );
        const nameENScale = enBBox.width > 43.5 ? 43.5 / enBBox.width : 1;

        return (
            <>
                <text
                    ref={nameZHGroupEl}
                    y={navigator.userAgent.includes('Firefox') ? -0.5 : 2}
                    className="rmg-name__zh"
                    fontSize={12}
                    transform={`scale(${nameZHGroupScale},1)`}
                >
                    {nameZHEl}
                </text>
                <text
                    ref={nameENEl}
                    y={19.5}
                    fontSize={props.name[1].replace('\\', ' ').length > 10 ? 7 : 8}
                    className="rmg-name__en"
                    transform={`scale(${nameENScale},1)`}
                >
                    {props.name[1]}
                </text>
            </>
        );
    },
    (prevProps, nextProps) => prevProps.name.toString() === nextProps.name.toString()
);

const LineBoxNameSpan = memo(
    (props: { name: Name }) => {
        let sharedText = '';
        for (let idx in [...props.name[0]]) {
            if (props.name[0][idx] === props.name[1][idx]) {
                sharedText += props.name[0][idx];
            } else {
                break;
            }
        }

        const nameEl = useRef<SVGTextElement | null>(null);
        const [bBox, setBBox] = useState({ x: 0, width: 0 } as DOMRect);
        useEffect(
            () => setBBox(nameEl.current!.getBBox()),
            // eslint-disable-next-line react-hooks/exhaustive-deps
            [props.name.toString()]
        );

        const nameScale = bBox.width > 43.5 ? 43.5 / bBox.width : 1;

        // unsymmetrical scaling, wrap with <g>
        return (
            <g transform={`scale(${nameScale},1)`}>
                <g transform={`translate(${-bBox.x - bBox.width / 2},0)`}>
                    <text ref={nameEl} className="rmg-name__zh" fontSize={14} y={12} textAnchor="end">
                        {sharedText}
                        <tspan className="rmg-name__zh" fontSize={8} x={0} dy={-2} textAnchor="start">
                            {props.name[0].slice(sharedText.length)}
                        </tspan>
                        <tspan className="rmg-name__en" fontSize={4} x={0} dy={6} textAnchor="start">
                            {props.name[1].slice(sharedText.length).trim()}
                        </tspan>
                    </text>
                </g>
            </g>
        );
    },
    (prevProps, nextProps) => prevProps.name.toString() === nextProps.name.toString()
);
