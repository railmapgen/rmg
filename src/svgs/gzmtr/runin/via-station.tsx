import { StationInfo } from '../../../constants/constants';
import { LineIcon } from '@railmapgen/svg-assets/gzmtr';
import { MonoColour } from '@railmapgen/rmg-palette-resources';
import { forwardRef, SVGProps, useEffect, useRef, useState } from 'react';

type ViaStationProps = {
    stationInfo: StationInfo;
} & SVGProps<SVGGElement>;

const ViaStation = forwardRef<SVGGElement, ViaStationProps>(function ViaStation({ stationInfo, ...others }, ref) {
    const {
        localisedName,
        transfer: {
            groups: [{ lines }],
        },
    } = stationInfo;

    const [nameBBox, setNameBBox] = useState<DOMRect>({ width: 0 } as DOMRect);
    const nameRef = useRef<SVGGElement>(null);

    useEffect(() => {
        if (nameRef.current) {
            setNameBBox(nameRef.current.getBBox());
        }
    }, [nameRef.current, JSON.stringify(localisedName)]);

    return (
        <g ref={ref} {...others}>
            <g ref={nameRef}>
                <text className="rmg-name__zh" fontSize={20}>
                    {localisedName.zh}
                </text>
                {localisedName.en?.split('\\')?.map((text, i) => (
                    <text key={i} className="rmg-name__en" fontSize={12} dy={19 + 12 * i}>
                        {text}
                    </text>
                ))}
            </g>
            <g transform={`translate(${nameBBox.width + 2},7)`}>
                {lines?.length && (
                    <>
                        <g transform={`translate(0,-${(3.5 * (lines.length - 1)) / 2})`}>
                            {lines.map(({ theme }, i) => (
                                <path
                                    key={`tick-${i}`}
                                    d={`M0,${3.5 * i} H8`}
                                    stroke={theme?.[2] ?? '#aaa'}
                                    strokeWidth={3.5}
                                />
                            ))}
                        </g>
                        {lines.map((line, i) => (
                            <LineIcon
                                key={`line-icon-${i}`}
                                zhName={line.name[0]}
                                enName={line.name[1]}
                                backgroundColour={line.theme?.[2] ?? '#aaa'}
                                foregroundColour={line.theme?.[3] ?? MonoColour.white}
                                spanDigits
                                transform={`translate(${27 + 36 * i},-8.5)scale(0.75)`}
                                classNames={{ digits: 'rmg-font__en', zh: 'rmg-font__zh', en: 'rmg-font__en' }}
                            />
                        ))}
                    </>
                )}
            </g>
        </g>
    );
});

export default ViaStation;
