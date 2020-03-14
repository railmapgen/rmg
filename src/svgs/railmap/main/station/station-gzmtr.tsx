import * as React from 'react';
import { ParamContext } from '../../../../context';
import { Name, InterchangeInfo } from '../../../../types';
import StationNumberText from '../../../station-num-gzmtr';
import LineBox from '../line-box-gzmtr';

interface Props {
    stnId: string;
    stnState: -1 | 0 | 1;
    stnY: number;
    namePos?: boolean;
}

const StationGZMTR = (props: Props) => {
    const { param } = React.useContext(ParamContext);
    const stnInfo = param.stn_list[props.stnId];

    const isNameShift = stnInfo.parents.length === 2 || stnInfo.children.length === 2;
    const tickRotation =
        props.stnY > 0
            ? 180
            : stnInfo.parents.indexOf(stnInfo.branch.left[1]) === 1 ||
              stnInfo.children.indexOf(stnInfo.branch.right[1]) === 1
            ? 180
            : 0;
    const nameENLns = stnInfo.name[1].split('\\').length;
    const nameDX = isNameShift
        ? tickRotation === 180
            ? 16 + (nameENLns - 1) * 12 * Math.cos(-45)
            : -9
        : tickRotation === 180
        ? -6
        : (24 + (nameENLns - 1) * 12) * Math.cos(-45);

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
                stnY={props.stnY}
                tickRotation={tickRotation}
            />
            <g>
                <use xlinkHref="#stn" className={props.stnState === -1 ? 'rmg-stn--pass' : 'rmg-stn--future'} />
                <g className={`Name ${props.stnState === -1 ? 'Pass' : 'Future'}`}>
                    <StationNumberText lineNum={param.line_num} stnNum={stnInfo.num} />
                </g>
            </g>
            <g style={{ transform: `translateX(${-nameDX}px)` }}>
                <StationNameGElement
                    name={stnInfo.name}
                    stnState={props.stnState}
                    tickRotation={tickRotation}
                    stnY={props.stnY}
                    isExpress={stnInfo.services.includes('express')}
                />
            </g>
        </>
    );
};

export default StationGZMTR;

interface StationNameGElementProps {
    name: Name;
    stnState: -1 | 0 | 1;
    tickRotation: 0 | 180;
    stnY: number;
    isExpress: boolean;
}

const StationNameGElement = (props: StationNameGElementProps) => {
    const nameDY =
        props.tickRotation === 180
            ? 17.5
            : -4 - 21.921875 - (props.name[1].split('\\').length - 1) * 12 * Math.cos(-45);

    const stnNameEl = React.createRef<SVGGElement>();
    const [bBox, setBBox] = React.useState({} as DOMRect);
    React.useEffect(() => setBBox(stnNameEl.current.getBBox()), [props.name.toString()]);

    return (
        <g
            className={`Name ${props.stnState === -1 ? 'Pass' : props.stnState === 0 ? 'CurrentGZ' : 'Future'}`}
            style={{
                transform: `translateY(${nameDY}px)rotate(-45deg)`,
                textAnchor: props.tickRotation === 180 ? 'end' : 'start',
            }}
        >
            <g ref={stnNameEl}>
                <StationName name={props.name} />
            </g>
            {props.isExpress && (
                <g
                    style={{
                        transform: `translate(${(bBox.width + 35) * (props.tickRotation === 180 ? -1 : 1)}px,${2 +
                            5 * (props.name[1].split('\\').length - 1)}px)`,
                        fill: props.stnState === -1 ? '#aaa' : 'var(--rmg-theme-colour)',
                    }}
                >
                    <ExpressTag />
                </g>
            )}
        </g>
    );
};

const StationName = (props: { name: Name }) => {
    return React.useMemo(
        () => (
            <>
                <text className="rmg-name__zh rmg-name__gzmtr--station">{props.name[0]}</text>
                {props.name[1].split('\\').map((txt, i) => (
                    <text key={i} className="rmg-name__en rmg-name__gzmtr--station" dy={15 + i * 10}>
                        {txt}
                    </text>
                ))}
            </>
        ),
        [props.name[0], props.name[1]]
    );
};

const ExpressTag = React.memo(() => (
    <g textAnchor="middle">
        <text className="rmg-name__zh rmg-name__gzmtr--express">快车停靠站</text>
        <text dy={10} className="rmg-name__en rmg-name__gzmtr--express">
            Express Station
        </text>
    </g>
));

interface IntGroupProps {
    intInfos: InterchangeInfo[];
    stnState: -1 | 0 | 1;
    tickRotation: 0 | 180;
    stnY: number;
}

const IntGroup = (props: IntGroupProps) => {
    return (
        <>
            <g className="rmg-line rmg-line__gzmtr rmg-line__change">
                <IntTicks {...props} />
            </g>
            <g
                style={{
                    transform: `translateY(${props.tickRotation === 180 ? -47 : 23}px)`,
                }}
            >
                <IntBoxs {...props} />
            </g>
        </>
    );
};

const IntTicks = (props: IntGroupProps) => {
    return (
        <>
            {props.intInfos.map((info, i) => {
                let x = -2 * (props.intInfos.length - 1) + 4 * i;
                return (
                    <use
                        key={i}
                        xlinkHref="#inttick"
                        stroke={props.stnState === -1 ? '#aaa' : info[2]}
                        style={{
                            transform: `translateX(${x}px)rotate(${props.tickRotation === 180 ? 180 : 0}deg)`,
                        }}
                    />
                );
            })}
        </>
    );
};

const IntBoxs = (props: IntGroupProps) => {
    return (
        <>
            {props.intInfos.map((info, i) => (
                <g
                    key={i}
                    style={{
                        transform: `translateY(${i * 28 * (props.tickRotation === 180 ? -1 : 1)}px)`,
                    }}
                >
                    <LineBox info={info} stnState={props.stnState} />
                </g>
            ))}
        </>
    );
};
