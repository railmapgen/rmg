import React, { useState } from 'react';
import StationNumber from '../../../gzmtr/station-icon/station-number';
import { InterchangeInfo, Name, Services } from '../../../../constants/constants';
import { useAppSelector } from '../../../../redux';
import LineIcon from '../../../gzmtr/line-icon/line-icon';
import StationName from '../../../gzmtr/station-name/station-name';
import StationSecondaryName from '../../../gzmtr/station-name/station-secondary-name';
import ExpressTag from '../../../gzmtr/station-name/express-tag';

interface Props {
    stnId: string;
    stnState: -1 | 0 | 1;
    stnY: number;
}

const StationGZMTR = (props: Props) => {
    const { stnId, stnState, stnY } = props;

    const theme = useAppSelector(store => store.param.theme);
    const lineName = useAppSelector(store => store.param.line_name);
    const lineNumber = useAppSelector(store => store.param.line_num);
    const stnInfo = useAppSelector(store => store.param.stn_list[stnId]);

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
                <StationNameGElement
                    name={stnInfo.name}
                    secondaryName={stnInfo.secondaryName}
                    stnState={stnState}
                    tickRotation={tickRotation}
                    isExpress={stnInfo.services.includes(Services.express)}
                />
            </g>
        </>
    );
};

export default StationGZMTR;

interface StationNameGElementProps {
    name: Name;
    secondaryName: false | Name;
    stnState: -1 | 0 | 1;
    tickRotation: 0 | 180;
    isExpress: boolean;
}

const StationNameGElement = (props: StationNameGElementProps) => {
    const nameDY = props.tickRotation === 180 ? 17.5 : -20 - props.name[1].split('\\').length * 14 * Math.cos(-45);

    const [bBox, setBBox] = useState({ width: 0 } as DOMRect);
    const [secNameBBox, setSecNameBBox] = useState({ x: 0, width: -20 } as SVGRect);

    return (
        <g
            textAnchor={props.tickRotation === 180 ? 'end' : 'start'}
            className={`Name ${props.stnState === -1 ? 'Pass' : props.stnState === 0 ? 'CurrentGZ' : 'Future'}`}
            transform={`translate(0,${nameDY})rotate(-45)`}
        >
            <StationName stnName={props.name} onUpdate={setBBox} />
            {props.secondaryName && (
                <StationSecondaryName
                    stnName={props.secondaryName}
                    onUpdate={setSecNameBBox}
                    passed={props.stnState === -1}
                    transform={`translate(${
                        (bBox.width + secNameBBox.width / 2 + 10) * (props.tickRotation === 180 ? -1 : 1)
                    },${2 + 5 * (props.name[1].split('\\').length - 1)})`}
                />
            )}
            {props.isExpress && (
                <ExpressTag
                    passed={props.stnState === -1}
                    transform={`translate(${
                        (bBox.width + secNameBBox.width + 20 + 35) * (props.tickRotation === 180 ? -1 : 1)
                    },${2 + 5 * (props.name[1].split('\\').length - 1)})`}
                />
            )}
        </g>
    );
};

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
                        stationState={stnState}
                    />
                </g>
            ))}
        </g>
    );
};
