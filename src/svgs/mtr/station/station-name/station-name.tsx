import React, { memo, useEffect, useRef } from 'react';
import { Direction, Name } from '../../../../constants/constants';
import { waitForFontReady } from '../../utils';

interface StationNameProps {
    stnName: Name;
    onUpdate?: (bBox: SVGRect) => void;
    align?: Direction;
}

export default memo(
    function StationName(props: StationNameProps) {
        const { stnName, onUpdate, align } = props;

        const nameEl = useRef<SVGGElement>(null);

        const updateNameBBox = () => {
            onUpdate?.(nameEl.current!.getBBox());
        };

        useEffect(() => {
            updateNameBBox();
            waitForFontReady().then().catch(console.error).finally(updateNameBBox);
        }, [stnName.toString(), align]);

        const getTextAnchor = (direction?: Direction) => {
            switch (direction) {
                case Direction.left:
                    return 'start';
                case Direction.right:
                    return 'end';
                default:
                    return 'middle';
            }
        };

        const getDy = (index: number) => 17 + 11 * index;

        return (
            <g ref={nameEl} textAnchor={getTextAnchor(align)}>
                <text className="rmg-name__zh rmg-name__mtr--station">{stnName[0]}</text>

                {stnName[1].split('\\').map((txt, i) => (
                    <text key={i} className="rmg-name__en rmg-name__mtr--station" dy={getDy(i)}>
                        {txt}
                    </text>
                ))}
            </g>
        );
    },
    (prevProps, nextProps) =>
        prevProps.stnName.toString() === nextProps.stnName.toString() && prevProps.align === nextProps.align
);
