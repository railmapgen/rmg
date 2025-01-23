import { memo, SVGProps, useEffect, useRef, useState } from 'react';
import { Translation } from '@railmapgen/rmg-translate';

interface CurrentStationNameProps {
    stnName: Translation;
    onUpdate?: (bBox: SVGRect) => void;
}

export default memo(
    function CurrentStationName(props: CurrentStationNameProps) {
        const { stnName, onUpdate } = props;

        const nameEl = useRef<SVGGElement | null>(null);

        useEffect(() => {
            if (nameEl.current && onUpdate) {
                onUpdate(nameEl.current.getBBox());
            }
        }, [JSON.stringify(stnName)]);

        return (
            <g ref={nameEl}>
                <text className="rmg-name__zh" fontSize={90}>
                    {stnName.zh}
                </text>
                <g fontSize={36}>
                    {stnName.en?.split('\\')?.map((txt, i) => (
                        <text className="rmg-name__en" key={i} dy={70 + i * 36}>
                            {txt}
                        </text>
                    ))}
                </g>
            </g>
        );
    },
    (prevProps, nextProps) => JSON.stringify(prevProps.stnName) === JSON.stringify(nextProps.stnName)
);

interface CurrentStationSecondaryNameProps extends SVGProps<SVGGElement> {
    secondaryName: Translation;
}

export const CurrentStationSecondaryName = (props: CurrentStationSecondaryNameProps) => {
    const { secondaryName, transform } = props;

    const nameEl = useRef<SVGGElement | null>(null);

    const [bBox, setBBox] = useState({ x: 0, width: 0 } as DOMRect);
    useEffect(() => {
        if (nameEl.current) setBBox(nameEl.current.getBBox());
    }, [secondaryName.toString()]);

    return (
        <g transform={transform}>
            <g transform="translate(0,4.5)" fontSize={36}>
                <text textAnchor="end" x={bBox.x - 3} className="rmg-name__zh">
                    {'('}
                </text>
                <text textAnchor="start" x={bBox.width + bBox.x + 3} className="rmg-name__zh">
                    {')'}
                </text>
            </g>
            <g ref={nameEl} textAnchor="middle">
                <text className="rmg-name__zh" fontSize={26}>
                    {secondaryName.zh}
                </text>
                <text dy={22} className="rmg-name__en" fontSize={14}>
                    {secondaryName.en}
                </text>
            </g>
        </g>
    );
};
