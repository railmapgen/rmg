import React, { memo, useEffect, useRef, useState } from 'react';
import { Name } from '../../../constants/constants';
import LineIconType2 from './line-icon-type2';
import InterchangeBox from './interchange-box';
import { ColourHex, MonoColour } from '@railmapgen/rmg-palette-resources';

export const MAX_WIDTH = 42;

interface LineIconProps {
    lineName: Name;
    foregroundColour: MonoColour;
    backgroundColour: ColourHex;
    passed?: boolean;
}

export default memo(
    function LineIcon(props: LineIconProps) {
        const { lineName, foregroundColour, backgroundColour, passed } = props;

        const [type, commonPart] = getType(lineName);

        const nameZhEl = useRef<SVGTextElement | null>(null);
        const nameEnEl = useRef<SVGTextElement | null>(null);

        const [nameZhBBox, setNameZhBBox] = useState({ width: 0 } as DOMRect);
        const [nameEnBBox, setNameEnBBox] = useState({ width: 0 } as DOMRect);

        useEffect(() => {
            nameZhEl.current && setNameZhBBox(nameZhEl.current.getBBox());
            nameEnEl.current && setNameEnBBox(nameEnEl.current.getBBox());
        }, [lineName.toString()]);

        const nameZhScale = MAX_WIDTH / Math.max(MAX_WIDTH, nameZhBBox.width);
        const nameEnScale = MAX_WIDTH / Math.max(MAX_WIDTH, nameEnBBox.width);

        const transforms = {
            nameZh: {
                // 7.3 -- original y
                // 13.5 -- text height
                // (1 - scale) -- offset multiplier
                // scale -- visualisation offset
                // 2 -- divide into halves (top and bottom)
                y: 7.3 + (13.5 * (1 - nameZhScale) * nameZhScale) / 2,
            },
            nameEn: {
                y: 19.5 - (9 * (1 - nameEnScale) * nameEnScale) / 2,
            },
        };

        return (
            <g textAnchor="middle" fill={passed ? MonoColour.white : foregroundColour}>
                <InterchangeBox fill={passed ? '#aaa' : backgroundColour} />
                {type === 2 ? (
                    <LineIconType2 lineName={lineName} commonPart={commonPart} />
                ) : (
                    <>
                        <text
                            ref={nameZhEl}
                            className="rmg-name__zh"
                            fontSize={12}
                            transform={`translate(0,${transforms.nameZh.y})scale(${nameZhScale})`}
                        >
                            {type === 1 ? (
                                <>
                                    <tspan fontSize={16} dy={0.7} className="rmg-name__zh">
                                        {commonPart}
                                    </tspan>
                                    <tspan dy={-0.7} className="rmg-name__zh">
                                        {lineName[0].slice(commonPart.length)}
                                    </tspan>
                                </>
                            ) : (
                                lineName[0]
                            )}
                        </text>
                        <text
                            ref={nameEnEl}
                            className="rmg-name__en"
                            fontSize={8}
                            transform={`translate(0,${transforms.nameEn.y})scale(${nameEnScale})`}
                        >
                            {lineName[1]}
                        </text>
                    </>
                )}
            </g>
        );
    },
    (prevProps, nextProps) =>
        prevProps.lineName.toString() === nextProps.lineName.toString() &&
        prevProps.foregroundColour === nextProps.foregroundColour &&
        prevProps.backgroundColour === nextProps.backgroundColour &&
        prevProps.passed === nextProps.passed
);

/**
 * type 1: 2号线
 * type 2: APM线
 * type 3: 佛山2号线
 */
const getType = (name: Name): [1 | 2 | 3, string] => {
    const matchResultForType1 = name[0].match(/^(\d+)\D+$/);
    if (matchResultForType1) return [1, matchResultForType1[1]];

    const matchResultForType2 = name.map(text => text.match(/^(\w+).+$/));
    if (matchResultForType2[0] && matchResultForType2[1] && matchResultForType2[0][1] === matchResultForType2[1][1]) {
        return [2, matchResultForType2[0][1]];
    }

    return [3, ''];
};
