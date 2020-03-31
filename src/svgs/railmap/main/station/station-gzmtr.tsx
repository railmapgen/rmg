import React, { useContext, useState, useEffect, useRef, useMemo, forwardRef } from 'react';
import { ParamContext } from '../../../../context';
import StationNumberText from '../../../station-num-gzmtr';
import LineBox from '../line-box-gzmtr';

interface Props {
    stnId: string;
    stnState: -1 | 0 | 1;
    stnY: number;
}

const StationGZMTR = (props: Props) => {
    const { param } = useContext(ParamContext);
    const stnInfo = param.stn_list[props.stnId];

    const isNameShift = stnInfo.parents.length === 2 || stnInfo.children.length === 2;
    const tickRotation =
        props.stnY > 0
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
                        ? (([
                              [
                                  param.theme[0],
                                  param.theme[1],
                                  'var(--rmg-theme-colour)',
                                  'var(--rmg-theme-fg)',
                                  param.line_name[0],
                                  param.line_name[1],
                              ],
                          ] as any[]) as InterchangeInfo[]).concat(stnInfo.transfer.info[0])
                        : stnInfo.transfer.info[0]
                }
                stnState={props.stnState}
                tickRotation={tickRotation}
            />
            <g>
                <use xlinkHref="#stn" stroke={props.stnState === -1 ? '#aaa' : 'var(--rmg-theme-colour)'} />
                <StationNumberText
                    className={`Name ${props.stnState === -1 ? 'Pass' : 'Future'}`}
                    lineNum={param.line_num}
                    stnNum={stnInfo.num}
                />
            </g>
            <g transform={`translate(${-nameDX},0)`}>
                <StationNameGElement
                    name={stnInfo.name}
                    secondaryName={stnInfo.secondaryName}
                    stnState={props.stnState}
                    tickRotation={tickRotation}
                    isExpress={stnInfo.services.includes('express')}
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

    const stnNameEl = useRef<SVGGElement | null>(null);
    const [bBox, setBBox] = useState({ width: 0 } as DOMRect);
    useEffect(
        () => setBBox(stnNameEl.current!.getBBox()),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props.name.toString()]
    );

    const secNameEl = useRef<SVGGElement | null>(null);
    const [secNameBBox, setSecNameBBox] = useState({ x: 0, width: -20 } as DOMRect);
    useEffect(
        () => {
            if (secNameEl.current) {
                setSecNameBBox(secNameEl.current.getBBox());
            } else {
                setSecNameBBox(prevBBox => ({ ...prevBBox, width: -20 }));
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props.secondaryName.toString()]
    );

    return (
        <g
            textAnchor={props.tickRotation === 180 ? 'end' : 'start'}
            className={`Name ${props.stnState === -1 ? 'Pass' : props.stnState === 0 ? 'CurrentGZ' : 'Future'}`}
            transform={`translate(0,${nameDY})rotate(-45)`}
        >
            <StationName ref={stnNameEl} name={props.name} />
            {props.secondaryName && (
                <g
                    transform={`translate(${(bBox.width + secNameBBox.width / 2 + 10) *
                        (props.tickRotation === 180 ? -1 : 1)},${2 + 5 * (props.name[1].split('\\').length - 1)})`}
                    className={`Name ${props.stnState === -1 ? 'Pass' : 'Future'}`}
                >
                    <g transform="translate(0,3)" fontSize={18}>
                        <text textAnchor="end" x={secNameBBox.x - 3} className="rmg-name__zh">
                            {'('}
                        </text>
                        <text textAnchor="start" x={secNameBBox.width + secNameBBox.x + 3} className="rmg-name__zh">
                            {')'}
                        </text>
                    </g>
                    <StationSecondaryName ref={secNameEl} secName={props.secondaryName} />
                </g>
            )}
            {props.isExpress && (
                <ExpressTag
                    fill={props.stnState === -1 ? '#aaa' : 'var(--rmg-theme-colour)'}
                    transform={`translate(${(bBox.width + secNameBBox.width + 20 + 35) *
                        (props.tickRotation === 180 ? -1 : 1)},${2 + 5 * (props.name[1].split('\\').length - 1)})`}
                />
            )}
        </g>
    );
};

const StationName = forwardRef((props: { name: Name }, ref: React.Ref<SVGGElement>) =>
    useMemo(
        () => (
            <g ref={ref}>
                <text className="rmg-name__zh" fontSize={18}>
                    {props.name[0]}
                </text>
                <g fontSize={10.5}>
                    {props.name[1].split('\\').map((txt, i) => (
                        <text key={i} className="rmg-name__en" dy={16 + i * 11}>
                            {txt}
                        </text>
                    ))}
                </g>
            </g>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props.name[0], props.name[1]]
    )
);

const StationSecondaryName = forwardRef((props: { secName: Name }, ref: React.Ref<SVGGElement>) =>
    useMemo(
        () => (
            <g ref={ref} textAnchor="middle">
                <text className="rmg-name__zh" fontSize={13}>
                    {props.secName[0]}
                </text>
                <text dy={10} className="rmg-name__en" fontSize={6.5}>
                    {props.secName[1]}
                </text>
            </g>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props.secName.toString()]
    )
);

const ExpressTag = React.memo((props: React.SVGProps<SVGGElement>) => (
    <g textAnchor="middle" {...props}>
        <text className="rmg-name__zh" fontSize={13}>
            快车停靠站
        </text>
        <text dy={10} className="rmg-name__en" fontSize={6.5}>
            Express Station
        </text>
    </g>
));

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
                    <LineBox info={info} stnState={stnState} />
                </g>
            ))}
        </g>
    );
};
