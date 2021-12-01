import React, { memo, SVGProps, useEffect, useRef } from 'react';
import { Direction, Name } from '../../../constants/constants';

interface StationNameProps extends SVGProps<SVGGElement> {
    stnName: Name;
    onUpdate?: (bBox: SVGRect) => void;
    align?: Direction;
}

export default memo(
    function StationName(props: StationNameProps) {
        const { stnName, onUpdate, align, ...others } = props;

        const nameEl = useRef<SVGGElement>(null);

        useEffect(() => {
            document.fonts.ready.then(() => onUpdate?.(nameEl.current!.getBBox()));
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
            <g ref={nameEl} textAnchor={getTextAnchor(align)} {...others}>
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
