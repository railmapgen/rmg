import * as React from 'react';
import { ParamContext } from '../../../../context';
import { Name, InterchangeInfo } from '../../../../types';

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
    const nameENLns = stnInfo.name[1].split('\\').length;
    const nameDX = isNameShift
        ? props.stnY > 0
            ? 16 + (nameENLns - 1) * 12 * Math.cos(-45)
            : -9
        : props.stnY > 0
        ? -6
        : (24 + (nameENLns - 1) * 12) * Math.cos(-45);

    return (
        <>
            <IntGroup
                intInfos={
                    isNameShift
                        ? ([
                              [
                                  param.theme[0],
                                  param.theme[1],
                                  'var(--rmg-theme-colour)',
                                  'var(--rmg-theme-fg)',
                                  param.line_name[0],
                                  param.line_name[1],
                              ],
                          ] as InterchangeInfo[]).concat(stnInfo.transfer.info[0])
                        : stnInfo.transfer.info[0]
                }
                stnState={props.stnState}
                stnY={props.stnY}
            />
            <g>
                <use
                    xlinkHref="#stn"
                    className={props.stnState === -1 ? 'rmg-stn--pass' : 'rmg-stn--future'}
                />
                <g className={`Name ${props.stnState === -1 ? 'Pass' : 'Future'}`}>
                    <text
                        className="rmg-name__zh rmg-name__gzmtr--line-num"
                        style={{ transform: `translateX(-9.25px)` }}
                    >
                        {param.line_num}
                    </text>
                    <text
                        className="rmg-name__zh rmg-name__gzmtr--station-num"
                        style={{ transform: `translateX(9.25px)` }}
                    >
                        {stnInfo.num}
                    </text>
                </g>
            </g>
            <g style={{ transform: `translateX(${-nameDX}px)` }}>
                <StationNameGElement
                    name={stnInfo.name}
                    stnState={props.stnState}
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
    stnY: number;
    isExpress: boolean;
}

const StationNameGElement = (props: StationNameGElementProps) => {
    const nameDY =
        props.stnY > 0
            ? 17.5
            : -4 - 21.921875 - (props.name[1].split('\\').length - 1) * 12 * Math.cos(-45);

    const stnNameEl = React.createRef<SVGGElement>();
    const [bBox, setBBox] = React.useState({} as DOMRect);
    React.useEffect(() => setBBox(stnNameEl.current.getBBox()), []);

    return (
        <g
            className={`Name ${
                props.stnState === -1 ? 'Pass' : props.stnState === 0 ? 'CurrentGZ' : 'Future'
            }`}
            style={{
                transform: `translateY(${nameDY}px)rotate(-45deg)`,
                textAnchor: props.stnY > 0 ? 'end' : 'start',
            }}
        >
            <g ref={stnNameEl}>
                <StationName name={props.name} />
            </g>
            {props.isExpress && (
                <g
                    style={{
                        transform: `translate(${(bBox.width + 35) *
                            (props.stnY > 0 ? -1 : 1)}px,${2 +
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
                    <text
                        key={i}
                        className="rmg-name__en rmg-name__gzmtr--station"
                        dy={15 + i * 10}
                    >
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
                    transform: `translateY(${props.stnY > 0 ? -47 : 23}px)`,
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
                            transform: `translateX(${x}px)rotate(${props.stnY > 0 ? 180 : 0}deg)`,
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
                        transform: `translateY(${i * 28 * (props.stnY > 0 ? -1 : 1)}px)`,
                    }}
                >
                    <LineBox info={info} stnState={props.stnState} />
                </g>
            ))}
        </>
    );
};

const LineBox = React.memo(
    (props: { info: InterchangeInfo; stnState: -1 | 0 | 1 }) => {
        const nameZHs = props.info[4].match(/[\d]+|[\D]+/g) || [''];
        let intNameSplitOk = false;
        if (nameZHs.length == 2) {
            if (!isNaN(Number(nameZHs[0])) && isNaN(Number(nameZHs[1]))) {
                intNameSplitOk = true;
            }
        }

        return (
            <g textAnchor="middle" fill={props.stnState === -1 ? '#fff' : props.info[3]}>
                <use xlinkHref="#intbox" fill={props.stnState === -1 ? '#aaa' : props.info[2]} />
                <text y={2.5} className="rmg-name__zh rmg-name__gzmtr--int">
                    <tspan fontSize="16px" dominantBaseline="hanging">
                        {intNameSplitOk ? nameZHs[0] : ''}
                    </tspan>
                    <tspan dominantBaseline="hanging" dy={0.5}>
                        {intNameSplitOk ? nameZHs[1] : nameZHs.join('')}
                    </tspan>
                </text>
                <text
                    y={19.5}
                    className={
                        'rmg-name__en ' +
                        (props.info[5].length > 10
                            ? 'rmg-name__gzmtr--int-small'
                            : 'rmg-name__gzmtr--int')
                    }
                >
                    {props.info[5]}
                </text>
            </g>
        );
    },
    (prevProps, nextProps) =>
        prevProps.info.toString() === nextProps.info.toString() &&
        prevProps.stnState === nextProps.stnState
);
