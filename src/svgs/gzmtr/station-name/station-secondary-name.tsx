import { SVGProps, useEffect, useRef, useState } from 'react';
import { Translation } from '@railmapgen/rmg-translate';

interface StationSecondaryNameProps extends SVGProps<SVGGElement> {
    stnName: Translation;
    onUpdate?: (bBox: SVGRect) => void;
    passed?: boolean;
}

export default function StationSecondaryName(props: StationSecondaryNameProps) {
    const { stnName, onUpdate, passed, ...others } = props;
    const { zh: zhName = '', en: enName = '' } = stnName;

    const nameEl = useRef<SVGGElement | null>(null);
    const [bBox, setBBox] = useState({ x: 0, width: 0 } as SVGRect);

    useEffect(() => {
        if (nameEl.current) {
            const nextBBox = nameEl.current.getBBox();
            setBBox(nextBBox);
            onUpdate?.(nextBBox);
        }
    }, [stnName.toString()]);

    if (!zhName && !enName) {
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
                    {zhName}
                </text>
                <text dy={10} className="rmg-name__en" fontSize={6.5}>
                    {enName}
                </text>
            </g>
        </g>
    );
}
