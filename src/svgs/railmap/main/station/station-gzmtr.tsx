import React from 'react';
import StationNumber from '../../../gzmtr/station-icon/station-number';
import { InterchangeInfo, Services } from '../../../../constants/constants';
import { useRootSelector } from '../../../../redux';
import LineIcon from '../../../gzmtr/line-icon/line-icon';
import StationNameWrapper from '../../../gzmtr/station-name/station-name-wrapper';

interface Props {
    stnId: string;
    stnState: -1 | 0 | 1;
    stnY: number;
}

const StationGZMTR = (props: Props) => {
    const { stnId, stnState, stnY } = props;

    const theme = useRootSelector(store => store.param.theme);
    const lineName = useRootSelector(store => store.param.line_name);
    const lineNumber = useRootSelector(store => store.param.line_num);
    const stnInfo = useRootSelector(store => store.param.stn_list[stnId]);

    const isNameShift = stnInfo.parents.length === 2 || stnInfo.children.length === 2;
    const tickRotation =
        stnY > 0
            ? 180
            : stnInfo.parents.indexOf(stnInfo.branch.left[1] || '') === 1 ||
              stnInfo.children.indexOf(stnInfo.branch.right[1] || '') === 1
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
                        ? (
                              [
                                  [theme[0], theme[1], 'var(--rmg-theme-colour)', 'var(--rmg-theme-fg)', ...lineName],
                              ] as any[] as InterchangeInfo[]
                          ).concat(stnInfo.transfer.info[0])
                        : stnInfo.transfer.info[0]
                }
                stnState={stnState}
                tickRotation={tickRotation}
            />
            <StationNumber lineNum={lineNumber} stnNum={stnInfo.num} passed={stnState === -1} />
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
};

export default StationGZMTR;

interface IntGroupProps {
    intInfos: InterchangeInfo[];
    stnState: -1 | 0 | 1;
    tickRotation: 0 | 180;
}

const IntGroup = (props: IntGroupProps) => (
    <>
        <IntTicks strokeWidth={4} {...props} />
        <IntBoxs transform={`translate(0,${props.tickRotation === 180 ? -47 : 23})`} {...props} />
    </>
);

const IntTicks = (props: IntGroupProps & React.SVGProps<SVGGElement>) => {
    const { intInfos, stnState, tickRotation, ...others } = props;

    return (
        <g {...others}>
            {intInfos.map((info, i) => (
                <use
                    key={i}
                    xlinkHref="#inttick"
                    stroke={stnState === -1 ? '#aaa' : info[2]}
                    transform={`translate(${-2 * (intInfos.length - 1) + 4 * i},0)rotate(${
                        tickRotation === 180 ? 180 : 0
                    })`}
                />
            ))}
        </g>
    );
};

const IntBoxs = (props: IntGroupProps & React.SVGProps<SVGGElement>) => {
    const { intInfos, tickRotation, stnState, ...other } = props;

    return (
        <g {...other}>
            {intInfos.map((info, i) => (
                <g key={i} transform={`translate(0,${i * 28 * (tickRotation === 180 ? -1 : 1)})`}>
                    <LineIcon
                        lineName={[info[4], info[5]]}
                        foregroundColour={info[3]}
                        backgroundColour={info[2]}
                        passed={stnState === -1}
                    />
                </g>
            ))}
        </g>
    );
};
