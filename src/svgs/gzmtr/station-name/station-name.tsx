import { memo, useEffect, useRef } from 'react';
import { Name } from '../../../constants/constants';

interface StationNameProps {
    stnName: Name;
    onUpdate?: (bBox: SVGRect) => void;
}

export default memo(
    function StationName(props: StationNameProps) {
        const { stnName, onUpdate } = props;

        const nameEl = useRef<SVGGElement | null>(null);

        useEffect(() => {
            if (nameEl.current && onUpdate) {
                onUpdate(nameEl.current.getBBox());
            }
        }, [stnName.toString()]);

        return (
            <g ref={nameEl}>
                <text className="rmg-name__zh" fontSize={18}>
                    {stnName[0]}
                </text>
                <g fontSize={10.5}>
                    {stnName[1].split('\\').map((txt, i) => (
                        <text key={i} className="rmg-name__en" dy={16 + i * 11}>
                            {txt}
                        </text>
                    ))}
                </g>
            </g>
        );
    },
    (prevProps, nextProps) => prevProps.stnName.toString() === nextProps.stnName.toString()
);
