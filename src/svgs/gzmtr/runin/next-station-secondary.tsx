import { SVGProps, useEffect, useRef, useState } from 'react';
import { Translation } from '@railmapgen/rmg-translate';

type NextStationSecondaryProps = {
    secName: Translation;
} & SVGProps<SVGGElement>;

export default function NextStationSecondary({ secName, ...others }: NextStationSecondaryProps) {
    const { zh, en } = secName;

    const nameEl = useRef<SVGGElement | null>(null);
    const [bBox, setBBox] = useState({ x: 0, width: 0 } as DOMRect);
    useEffect(() => {
        if (nameEl.current) setBBox(nameEl.current.getBBox());
    }, [zh, en]);

    return (
        <g {...others}>
            <g transform="translate(0,2.5)" fontSize={25}>
                <text textAnchor="end" x={bBox.x - 3} className="rmg-name__zh">
                    {'('}
                </text>
                <text textAnchor="start" x={bBox.width + bBox.x + 3} className="rmg-name__zh">
                    {')'}
                </text>
            </g>
            <g ref={nameEl}>
                <text className="rmg-name__zh" fontSize={18}>
                    {zh}
                </text>
                <text className="rmg-name__en" fontSize={10} dy={15}>
                    {en}
                </text>
            </g>
        </g>
    );
}
