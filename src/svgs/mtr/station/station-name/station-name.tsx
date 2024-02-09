import { memo, useEffect, useRef } from 'react';
import { Direction, Name } from '../../../../constants/constants';

interface StationNameProps {
    stnName: Name;
    onUpdate?: (bBox: SVGRect) => void;
    align?: Direction;
}

export const FONTS = ['MyriadPro-Semibold', 'Vegur-Bold', 'GenYoMinTW-SB'];

export default memo(
    function StationName(props: StationNameProps) {
        const { stnName, onUpdate, align } = props;

        const nameEl = useRef<SVGGElement>(null);

        const updateNameBBox = () => {
            if (nameEl.current && onUpdate) {
                onUpdate(nameEl.current.getBBox());
            }
        };

        useEffect(() => {
            const abortController = new AbortController();
            updateNameBBox();
            document.fonts
                .load('12px ' + FONTS.join(', '), stnName.join(''))
                .then()
                .finally(() => {
                    setTimeout(() => {
                        if (!abortController.signal.aborted) {
                            updateNameBBox();
                        }
                    }, 100);
                });
            return () => {
                abortController.abort();
            };
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

        const getDy = (index: number) => 16 + 10 * index;

        return (
            <g ref={nameEl} textAnchor={getTextAnchor(align)}>
                <text className="rmg-name__zh" fontSize={18} transform="scale(1,0.97)">
                    {stnName[0]}
                </text>

                {stnName[1].split('\\').map((txt, i) => (
                    <text key={i} className="rmg-name__en" fontSize={10} dy={getDy(i)}>
                        {txt}
                    </text>
                ))}
            </g>
        );
    },
    (prevProps, nextProps) =>
        prevProps.stnName.toString() === nextProps.stnName.toString() && prevProps.align === nextProps.align
);
