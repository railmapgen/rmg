import { memo, useEffect, useRef } from 'react';
import { Direction } from '../../../../constants/constants';
import { Translation } from '@railmapgen/rmg-translate';

interface StationNameProps {
    stnName: Translation;
    onUpdate?: (bBox: SVGRect) => void;
    align?: Direction;
}

export const FONTS = ['MyriadPro-Semibold', 'Vegur-Bold', 'GenYoMinTW-SB'];

export default memo(
    function StationName(props: StationNameProps) {
        const { stnName, onUpdate, align } = props;
        const { zh: zhName = '', en: enName = '' } = stnName;

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
                .load('12px ' + FONTS.join(', '), zhName + enName)
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
                    {zhName}
                </text>

                {enName.split('\\').map((txt, i) => (
                    <text key={i} className="rmg-name__en" fontSize={10} dy={getDy(i)}>
                        {txt}
                    </text>
                ))}
            </g>
        );
    },
    (prevProps, nextProps) =>
        JSON.stringify(prevProps.stnName) === JSON.stringify(nextProps.stnName) && prevProps.align === nextProps.align
);
