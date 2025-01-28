import { memo, SVGProps, useEffect, useRef, useState } from 'react';
import { Translation } from '@railmapgen/rmg-translate';

const ZH_NAME_FONT_SIZE = 92;

const getLetterSpacing = (zhNameCount?: number) => {
    switch (zhNameCount) {
        case 2:
            return 0.2;
        case 3:
            return 0.1;
        default:
            return 0;
    }
};

interface CurrentStationNameProps {
    stnName: Translation;
    bold?: boolean;
    sparse?: boolean;
    onUpdate?: (bBox: SVGRect) => void;
}

export default memo(
    function CurrentStationName(props: CurrentStationNameProps) {
        const { stnName, bold, sparse, onUpdate } = props;

        const nameEl = useRef<SVGGElement | null>(null);

        const letterSpacing = sparse ? getLetterSpacing(stnName.zh?.length) : 0;

        useEffect(() => {
            if (nameEl.current && onUpdate) {
                const bBox = nameEl.current.getBBox();
                onUpdate({
                    ...bBox,
                    x: bBox.x + (letterSpacing * ZH_NAME_FONT_SIZE) / 2,
                    width: bBox.width - letterSpacing * ZH_NAME_FONT_SIZE,
                });
            }
        }, [nameEl.current, JSON.stringify(stnName), bold, sparse]);

        return (
            <g ref={nameEl} fontWeight={bold ? 'bold' : 'normal'}>
                <text
                    className="rmg-name__zh"
                    fontSize={ZH_NAME_FONT_SIZE}
                    x={letterSpacing / 2 + 'em'}
                    letterSpacing={letterSpacing + 'em'}
                >
                    {stnName.zh}
                </text>
                <g fontSize={40}>
                    {stnName.en?.split('\\')?.map((txt, i) => (
                        <text className="rmg-name__en" key={i} dy={72 + i * 42}>
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
