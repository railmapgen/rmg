import { StationInfo } from '../../../constants/constants';
import { LineIcon } from '@railmapgen/svg-assets/gzmtr';
import { MonoColour } from '@railmapgen/rmg-palette-resources';
import { SVGProps, useEffect, useRef, useState } from 'react';

type ViaStationProps = {
    stationInfo: StationInfo;
} & SVGProps<SVGGElement>;

export default function ViaStation({ stationInfo, ...others }: ViaStationProps) {
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
        <g {...others}>
            <g ref={nameRef}>
                <text className="rmg-name__zh" fontSize={20}>
                    {localisedName.zh}
                </text>
                <text className="rmg-name__en" fontSize={12} dy={19}>
                    {localisedName.en}
                </text>
            </g>
            <g transform={`translate(${nameBBox.width + 2},7)`}>
                {lines?.length && (
                    <>
                        <path d="M0,0 H8" stroke={lines[0].theme?.[2] ?? '#aaa'} strokeWidth={3.5} />
                        <LineIcon
                            zhName={lines[0].name[0]}
                            enName={lines[0].name[1]}
                            backgroundColour={lines[0].theme?.[2] ?? '#aaa'}
                            foregroundColour={lines[0].theme?.[3] ?? MonoColour.white}
                            zhClassName="rmg-name__zh"
                            enClassName="rmg-name__en"
                            spanDigits
                            transform={`translate(27,-8.5)scale(0.75)`}
                        />
                    </>
                )}
            </g>
        </g>
    );
}
