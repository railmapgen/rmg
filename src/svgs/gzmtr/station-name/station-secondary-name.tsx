import { SVGProps, useEffect, useRef, useState } from 'react';
import { Name } from '../../../constants/constants';

interface StationSecondaryNameProps extends SVGProps<SVGGElement> {
    stnName: Name;
    onUpdate?: (bBox: SVGRect) => void;
    passed?: boolean;
}

export default function StationSecondaryName(props: StationSecondaryNameProps) {
    const { stnName, onUpdate, passed, ...others } = props;

    const nameEl = useRef<SVGGElement | null>(null);
    const [bBox, setBBox] = useState({ x: 0, width: 0 } as SVGRect);

    useEffect(() => {
        if (nameEl.current) {
            const nextBBox = nameEl.current.getBBox();
            setBBox(nextBBox);
            onUpdate && onUpdate(nextBBox);
        }
    }, [stnName.toString()]);

    if (!stnName[0] && !stnName[1]) {
        return <></>;
    }

    return (
        <g fill={passed ? '#aaa' : '#000'} {...others}>
            <g transform="translate(0,3)" fontSize={18}>
                <text textAnchor="end" x={bBox.x - 3} className="rmg-name__zh">
                    {'('}
                </text>
                <text textAnchor="start" x={bBox.width + bBox.x + 3} className="rmg-name__zh">
                    {')'}
                </text>
            </g>
            <g ref={nameEl} textAnchor="middle">
                <text className="rmg-name__zh" fontSize={13}>
                    {stnName[0]}
                </text>
                <text dy={10} className="rmg-name__en" fontSize={6.5}>
                    {stnName[1]}
                </text>
            </g>
        </g>
    );
}
