import { memo, useEffect, useRef } from 'react';
import { Translation } from '@railmapgen/rmg-translate';

interface StationNameProps {
    stnName: Translation;
    onUpdate?: (bBox: SVGRect) => void;
}

export default memo(
    function StationName(props: StationNameProps) {
        const { stnName, onUpdate } = props;
        const { zh: zhName = '', en: enName = '' } = stnName;

        const nameEl = useRef<SVGGElement | null>(null);

        useEffect(() => {
            if (nameEl.current && onUpdate) {
                onUpdate(nameEl.current.getBBox());
            }
        }, [JSON.stringify(stnName)]);

        return (
            <g ref={nameEl}>
                <text className="rmg-name__zh" fontSize={18}>
                    {zhName}
                </text>
                <g fontSize={10.5}>
                    {enName.split('\\').map((txt, i) => (
                        <text key={i} className="rmg-name__en" dy={16 + i * 11}>
                            {txt}
                        </text>
                    ))}
                </g>
            </g>
        );
    },
    (prevProps, nextProps) => JSON.stringify(prevProps.stnName) === JSON.stringify(nextProps.stnName)
);
