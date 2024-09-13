import { ExtendedInterchangeInfo, Services } from '../../constants/constants';
import { useRootSelector } from '../../redux';
import { LineIcon, StationNumber } from '@railmapgen/svg-assets/gzmtr';
import StationNameWrapper from './station-name/station-name-wrapper';
import { MonoColour, Theme } from '@railmapgen/rmg-palette-resources';

interface Props {
    stnId: string;
    stnState: -1 | 0 | 1;
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
    } = useRootSelector(store => store.param);
    const stnInfo = stn_list[stnId];

    const isNameShift = stnInfo.parents.length === 2 || stnInfo.children.length === 2;
    const tickRotation =
        stnY > 0
            ? 180
            : stnInfo.parents.indexOf(stnInfo.branch?.left?.[1] || '') === 1 ||
                stnInfo.children.indexOf(stnInfo.branch?.right?.[1] || '') === 1
              ? 180
              : 0;
    const nameENLns = stnInfo.name[1].split('\\').length;
    const nameDX = isNameShift
        ? tickRotation === 180
            ? 16 + (nameENLns - 1) * 12 * Math.cos(-45)
            : -9
        : tickRotation === 180
          ? -6
          : (25 + (nameENLns - 1) * 15) * Math.cos(-45);

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
                stnState={stnState}
                tickRotation={tickRotation}
                spanDigits={spanLineNum}
            />
            <StationNumber
                lineNum={lineNumber}
                stnNum={stnInfo.num}
                strokeColour={theme[2]}
                textClassName="rmg-name__zh"
                passed={stnState === -1}
            />
            <g transform={`translate(${-nameDX},0)`}>
                <StationNameWrapper
                    primaryName={stnInfo.name}
                    secondaryName={stnInfo.secondaryName || undefined}
                    stationState={stnState}
                    flipped={tickRotation === 180}
                    express={stnInfo.services.includes(Services.express)}
                />
            </g>
        </>
    );
}

interface IntGroupProps {
    intInfos: ExtendedInterchangeInfo[];
    stnState: -1 | 0 | 1;
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
                        zhClassName="rmg-name__zh"
                        enClassName="rmg-name__en"
                        passed={stnState === -1}
                        spanDigits={spanDigits}
                    />
                </g>
            ))}
        </g>
    );
};
