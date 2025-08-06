import { ExtendedInterchangeInfo, Services, StationState } from '../../constants/constants';
import { useRootSelector } from '../../redux';
import { LineIcon, MidpointStation, StationNumber } from '@railmapgen/svg-assets/gzmtr';
import StationNameWrapper from './station-name/station-name-wrapper';
import { MonoColour, Theme } from '@railmapgen/rmg-palette-resources';
import { useEffect, useRef, useState } from 'react';

interface Props {
    stnId: string;
    stnState: StationState;
    stnY: number;
}

export default function Station(props: Props) {
    const { stnId, stnState, stnY } = props;

    const {
        theme,
        line_name: lineName,
        line_num: lineNumber,
        spanLineNum,
        stn_list,
        loop,
        loop_info: { midpoint_station, clockwise },
    } = useRootSelector(store => store.param);
    const stnInfo = stn_list[stnId];
    const isMidpoint = midpoint_station === stnId;

    const [nameBBox, setNameBBox] = useState({ height: 0 } as DOMRect);
    const stationNameEl = useRef<SVGGElement>(null);
    useEffect(() => {
        if (stationNameEl.current) {
            setNameBBox(stationNameEl.current.getBBox());
        }
    }, [stationNameEl.current, stnY, stnInfo.localisedName, stnInfo.localisedSecondaryName, stnInfo.services]);

    const isNameShift = stnInfo.parents.length === 2 || stnInfo.children.length === 2;
    const tickRotation =
        stnY > 0
            ? 180
            : stnInfo.parents.indexOf(stnInfo.branch?.left?.[1] || '') === 1 ||
                stnInfo.children.indexOf(stnInfo.branch?.right?.[1] || '') === 1
              ? 180
              : 0;
    const nameENLns = stnInfo.localisedName.en?.split('\\')?.length ?? 1;
    const nameDX = isNameShift
        ? tickRotation === 180
            ? 16 + (nameENLns - 1) * 12 * Math.cos(-45)
            : -9
        : tickRotation === 180
          ? -6
          : (25 + (nameENLns - 1) * 15) * Math.cos(-45);

    const midpointDY = stnY > 0 ? nameBBox.height + 23 : -nameBBox.height - 23;

    return (
        <>
            <IntGroup
                intInfos={
                    isNameShift
                        ? [
                              {
                                  theme: [
                                      theme[0],
                                      theme[1],
                                      'var(--rmg-theme-colour)',
                                      'var(--rmg-theme-fg)',
                                  ] as unknown as Theme,
                                  name: lineName,
                              },
                              ...(stnInfo.transfer.groups[0].lines ?? []),
                          ]
                        : (stnInfo.transfer.groups[0].lines ?? [])
                }
                stnState={loop ? StationState.FUTURE : stnState}
                tickRotation={tickRotation}
                spanDigits={spanLineNum}
            />
            <StationNumber
                lineNum={lineNumber}
                stnNum={stnInfo.num}
                strokeColour={theme[2]}
                classNames={{ digits: 'rmg-name__zh' }}
                passed={stnState === -1}
                alwaysShowColouredBorder={loop}
                bolderBorder
                useSameScale
            />
            <g ref={stationNameEl} transform={`translate(${-nameDX},0)`}>
                <StationNameWrapper
                    primaryName={stnInfo.localisedName}
                    secondaryName={stnInfo.localisedSecondaryName}
                    stationState={stnState}
                    flipped={tickRotation === 180}
                    express={stnInfo.services.includes(Services.express)}
                    underConstruction={stnInfo.underConstruction}
                />
            </g>
            {isMidpoint && (
                <MidpointStation
                    transform={`translate(0,${midpointDY})`}
                    clockwise={clockwise}
                    anchorAt={stnY > 0 ? 'text' : 'circle'}
                />
            )}
        </>
    );
}

interface IntGroupProps {
    intInfos: ExtendedInterchangeInfo[];
    stnState: StationState;
    tickRotation: 0 | 180;
    spanDigits?: boolean;
}

const IntGroup = (props: IntGroupProps) => (
    <>
        <IntTicks strokeWidth={4} {...props} />
        <IntBoxs transform={`translate(0,${props.tickRotation === 180 ? -47 : 23})`} {...props} />
    </>
);

const IntTicks = (props: IntGroupProps & React.SVGProps<SVGGElement>) => {
    const { intInfos, stnState, tickRotation, spanDigits, ...others } = props;

    return (
        <g {...others}>
            {intInfos.map((info, i) => (
                <use
                    key={i}
                    xlinkHref="#inttick"
                    stroke={stnState === -1 ? '#aaa' : info.theme?.[2]}
                    transform={`translate(${-2 * (intInfos.length - 1) + 4 * i},0)rotate(${
                        tickRotation === 180 ? 180 : 0
                    })`}
                />
            ))}
        </g>
    );
};

const IntBoxs = (props: IntGroupProps & React.SVGProps<SVGGElement>) => {
    const { intInfos, tickRotation, stnState, spanDigits, ...other } = props;

    return (
        <g {...other}>
            {intInfos.map((info, i) => (
                <g key={i} transform={`translate(0,${i * 28 * (tickRotation === 180 ? -1 : 1)})`}>
                    <LineIcon
                        zhName={info.name[0]}
                        enName={info.name[1]}
                        foregroundColour={info.theme?.[3] ?? MonoColour.white}
                        backgroundColour={info.theme?.[2] ?? '#aaaaaa'}
                        passed={stnState === -1}
                        spanDigits={spanDigits}
                        classNames={{ digits: 'rmg-font__en', zh: 'rmg-font__zh', en: 'rmg-font__en' }}
                    />
                </g>
            ))}
        </g>
    );
};
