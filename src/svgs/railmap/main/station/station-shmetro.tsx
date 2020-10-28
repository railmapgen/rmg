import React, { useContext, useRef, memo } from 'react';
import { ParamContext } from '../../../../context';

interface Props {
    stnId: string;
    stnState: -1 | 0 | 1;
}

const StationSHMetro = (props: Props) => {
    const { param } = useContext(ParamContext);
    const stnInfo = param.stn_list[props.stnId];

    const branchNameDX =
        ([...stnInfo.branch.left, ...stnInfo.branch.right].length ? 8 + 12 * stnInfo.name[1].split('\\').length : 0) *
        (param.direction === 'l' ? 1 : -1);

    let stationIconStyle = 'stn_sh';
    if (stnInfo.services.length === 3) stationIconStyle = 'direct_sh';
    else if (stnInfo.services.length === 2) stationIconStyle = 'express_sh';
    else if (stnInfo.transfer.info.reduce((acc, cur) => acc + cur.length, 0)) stationIconStyle = 'int2_sh';

    return (
        <>
            <use
                xlinkHref={`#${stationIconStyle}`}
                stroke={props.stnState === -1 ? '#aaa' : 'var(--rmg-theme-colour)'}
            />
            <g transform={`translate(${branchNameDX},0)`}>
                <StationNameGElement
                    name={stnInfo.name}
                    infos={stnInfo.transfer.info}
                    stnState={props.stnState}
                    direction={param.direction}
                />
            </g>
        </>
    );
};

export default StationSHMetro;

interface StationNameGElementProps {
    name: Name;
    infos: InterchangeInfo[][];
    stnState: -1 | 0 | 1;
    direction: 'l' | 'r';
}

const StationNameGElement = (props: StationNameGElementProps) => {
    const nameENLn = props.name[1].split('\\').length;

    // get the exact station name width so that the
    // interchange station icon can be right after the station name
    const stnNameEl = useRef<SVGGElement | null>(null);
    // the original name position
    const [bBox, setBBox] = React.useState({ width: 0 } as DOMRect);
    React.useEffect(
        () => setBBox(stnNameEl.current!.getBBox()),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [...props.name]
    );
    // the original name position's right x
    const x = bBox.width + 5;

    // rotate the station info now
    // other wise the bcr will be inaccurate due to the rotation
    // Chito: so, use BBox instead

    return (
        <g transform={`translate(${props.direction === 'l' ? 6 : -6},-6)rotate(${props.direction === 'l' ? -45 : 45})`}>
            {props.infos.reduce((sum, infos) => sum + infos.length, 0) && (
                <line
                    x1={0}
                    x2={props.direction === 'l' ? x : -x}
                    stroke={props.stnState === -1 ? '#aaa' : 'black'}
                    strokeWidth={0.5}
                />
            )}

            <IntBoxGroup
                intInfos={props.infos[1] ? ([] as InterchangeInfo[]).concat(...props.infos) : props.infos[0]}
                transform={`translate(${x * (props.direction === 'l' ? 1 : -1)},-10.75)`}
                direction={props.direction}
            />

            <g
                textAnchor={props.direction === 'l' ? 'start' : 'end'}
                transform={`translate(0,${-14.15625 - 2 - 12 * (nameENLn - 1)})`}
            >
                <StationName
                    ref={stnNameEl}
                    stnName={props.name}
                    fill={props.stnState === -1 ? '#aaa' : props.stnState === 0 ? 'red' : 'black'}
                />

                {props.infos[1]?.length && (
                    <g
                        transform={`translate(${
                            (x + props.infos.reduce((sum, infos) => sum + infos.length, 0) * 15) *
                            (props.direction === 'l' ? 1 : -1)
                        },-22)`}
                    >
                        <OSIText osiInfos={props.infos[1]} />
                    </g>
                )}
            </g>
        </g>
    );
};

const StationName = React.forwardRef(
    (props: { stnName: Name } & React.SVGProps<SVGGElement>, ref: React.Ref<SVGGElement>) => {
        const { stnName, ...others } = props;

        return (
            <g ref={ref} {...others}>
                {React.useMemo(
                    () => (
                        <>
                            <text className="rmg-name__zh">{stnName[0]}</text>
                            <g fontSize={9.6}>
                                {stnName[1].split('\\').map((txt, i) => (
                                    <text key={i} className="rmg-name__en" dy={12 * (i + 1)}>
                                        {txt}
                                    </text>
                                ))}
                            </g>
                        </>
                    ),
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                    [...stnName]
                )}
            </g>
        );
    }
);

const IntBoxGroup = (props: { intInfos: InterchangeInfo[]; direction: 'l' | 'r' } & React.SVGProps<SVGGElement>) => {
    const { intInfos, direction, ...others } = props;

    let dx = 0;
    return (
        <g fontSize={14} textAnchor="middle" {...others}>
            {intInfos.map((info, i) => {
                // start with digit
                const isLineNumber = Boolean(info[4].match(/^\d.*$/));
                const isMaglev = Boolean(info[4].match(/^磁(悬)*浮/));

                if (props.direction === 'r') {
                    dx -= (isLineNumber || isMaglev ? 20 : info[4].length * 14 + 12 + 0) + (i === 0 ? 0 : 5);
                }

                let el = <g />;
                if (isMaglev) {
                    el = (
                        <g transform={`translate(${dx},0)`} key={i}>
                            <IntBoxMaglev info={info} />
                        </g>
                    );
                } else if (isLineNumber) {
                    el = (
                        <g transform={`translate(${dx},0)`} key={i}>
                            <IntBoxNumber info={info} />
                        </g>
                    );
                } else {
                    el = (
                        <g transform={`translate(${dx},0)`} key={i}>
                            <IntBoxLetter info={info} />
                        </g>
                    );
                }

                // 20 + 5(margin) for number line
                // 60 + 5(margin) for letter line
                if (props.direction === 'l') {
                    dx += isLineNumber || isMaglev ? 25 : info[4].length * 14 + 12 + 5;
                }
                return el;
            })}
        </g>
    );
};

const IntBoxMaglev = memo(
    (props: { info: InterchangeInfo }) => (
        <>
            <use xlinkHref="#intbox_maglev" fill={props.info[2]} stroke={props.info[2]} />
        </>
    ),
    (prevProps, nextProps) => prevProps.info.toString() === nextProps.info.toString()
);

const IntBoxNumber = memo(
    (props: { info: InterchangeInfo }) => (
        <>
            <use xlinkHref="#intbox_number" fill={props.info[2]} />
            <text x={10} className="rmg-name__zh" fill={props.info[3]} dominantBaseline="central">
                {/* // line starts with numbers */}
                {props.info[4].match(/(\d*)\w+/)![0]}
            </text>
        </>
    ),
    (prevProps, nextProps) => prevProps.info.toString() === nextProps.info.toString()
);

const IntBoxLetter = memo(
    (props: { info: InterchangeInfo }) => {
        // box width: 16 * number of characters + 12
        const textCount = props.info[4].split('\\')[0].length;
        return (
            <>
                <rect height={22} width={textCount * 14 + 12} y={-11} fill={props.info[2]} />
                <text x={textCount * 7 + 6} className="rmg-name__zh" fill={props.info[3]} dominantBaseline="central">
                    {props.info[4].split('\\')[0]}
                </text>
            </>
        );
    },
    (prevProps, nextProps) => prevProps.info.toString() === nextProps.info.toString()
);

const OSIText = (props: { osiInfos: InterchangeInfo[] }) => {
    // get the all names from the out of station changes
    const lineNames = props.osiInfos.map(info => info[4]);
    return React.useMemo(
        () => (
            <g textAnchor="middle" fontSize="50%">
                <text className="rmg-name__zh" dy={-5}>
                    {'换乘' + lineNames.join('，')}
                </text>
                <text className="rmg-name__zh" dy={5}>
                    仅限公共交通卡
                </text>
                <text className="rmg-name__en" dy={12.5} fontSize="75%">
                    Only for Public Transportation Card
                </text>
            </g>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [lineNames.toString()]
    );
};
