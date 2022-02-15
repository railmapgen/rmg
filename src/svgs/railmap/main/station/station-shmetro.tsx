import React, { useRef, memo } from 'react';
import {
    InterchangeInfo,
    Name,
    PanelTypeGZMTR,
    PanelTypeShmetro,
    Facilities,
    ColourHex,
} from '../../../../constants/constants';
import { useAppSelector } from '../../../../redux';

interface Props {
    stnId: string;
    stnState: -1 | 0 | 1;
    color?: ColourHex; // control the station color if coline is in effect
}

const StationSHMetro = (props: Props) => {
    const { stnId, stnState, color } = props;
    const param = useAppSelector(store => store.param);
    const stnInfo = param.stn_list[stnId];

    // shift station name if the line bifurcate here
    const branchNameDX =
        ([...stnInfo.branch.left, ...stnInfo.branch.right].length ? 8 + 12 * stnInfo.name[1].split('\\').length : 0) *
        (param.direction === 'r' ? -1 : 1);

    let stationIconStyle = '';
    let stationIconColor: { [pos: string]: string } = {};
    if (param.info_panel_type === 'sh2020') {
        if (stnInfo.services.length === 3) stationIconStyle = 'stn_sh_2020_direct';
        else if (stnInfo.services.length === 2) stationIconStyle = 'stn_sh_2020_express';
        else stationIconStyle = 'stn_sh_2020';
        stationIconColor.fill = stnState === -1 ? 'gray' : color ? color : 'var(--rmg-theme-colour)';
    } else {
        // param.info_panel_type === 'sh' or others (from other styles)
        if (stnInfo.services.length === 3) stationIconStyle = 'direct_sh';
        else if (stnInfo.services.length === 2) stationIconStyle = 'express_sh';
        else if ([...stnInfo.transfer.info[0], ...(stnInfo.transfer.info[1] || [])].length > 0)
            stationIconStyle = 'int2_sh';
        else stationIconStyle = 'stn_sh';
        stationIconColor.stroke = stnState === -1 ? 'gray' : color ? color : 'var(--rmg-theme-colour)';
    }

    return (
        <>
            <use
                xlinkHref={`#${stationIconStyle}`}
                {...stationIconColor} // different styles use either `fill` or `stroke`
            />
            <g transform={`translate(${branchNameDX},0)`}>
                <StationNameGElement
                    name={stnInfo.name}
                    infos={stnInfo.transfer.info}
                    stnState={stnState}
                    direction={param.direction}
                    info_panel_type={param.info_panel_type}
                    facility={stnInfo.facility}
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
    info_panel_type: PanelTypeGZMTR | PanelTypeShmetro;
    facility: Facilities;
}

const StationNameGElement = (props: StationNameGElementProps) => {
    const { name, infos, stnState, info_panel_type, direction, facility } = props;
    const nameENLn = props.name[1].split('\\').length;

    // get the exact station name width so that the
    // interchange station icon can be right after the station name
    const stnNameEl = useRef<SVGGElement | null>(null);
    // the original name position
    const [bBox, setBBox] = React.useState({ width: 0 } as DOMRect);
    React.useEffect(
        () => setBBox(stnNameEl.current!.getBBox()),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [...name]
    );
    // the original name position's right x
    const x = bBox.width + 5;

    // rotate the station info now
    // other wise the bcr will be inaccurate due to the rotation
    // Chito: so, use BBox instead

    // simplify the calculation times
    const directionPolarity = direction === 'l' ? 1 : -1;

    // main elements icon's dx will change if there is a facility icon or not
    const mainDx = facility !== Facilities.none ? 30 : 0;

    return (
        <g
            transform={`translate(${direction === 'l' ? 6 : -6},${info_panel_type === 'sh2020' ? -20 : -6})rotate(${
                props.direction === 'l' ? -45 : 45
            })`}
        >
            {infos.flat().length > 0 && (
                <>
                    <line
                        x1={mainDx * directionPolarity}
                        x2={(mainDx + x) * directionPolarity}
                        stroke={stnState === -1 ? 'gray' : 'black'}
                        strokeWidth={0.5}
                    />
                    <IntBoxGroup
                        intInfos={infos}
                        transform={`translate(${(mainDx + x) * directionPolarity},-10.75)`}
                        direction={direction}
                    />
                </>
            )}

            {facility !== Facilities.none && <use xlinkHref={'#' + facility} x={10 * directionPolarity} y={-30} />}

            <g
                textAnchor={direction === 'l' ? 'start' : 'end'}
                transform={`translate(${mainDx * directionPolarity},${-14.15625 - 2 - 12 * (nameENLn - 1)})`}
            >
                <StationName
                    ref={stnNameEl}
                    stnName={name}
                    fill={stnState === -1 ? 'gray' : stnState === 0 ? 'red' : 'black'}
                />

                {/* deal out-of-station here as it is a y axis element. leave out-of-system in IntBoxGroup*/}
                {infos[1]?.length > 0 && (
                    <g
                        transform={`translate(${
                            (x + infos.reduce((sum, infos) => sum + infos.length, 0) * 15) * directionPolarity
                        },-30)`}
                    >
                        <OSIText osiInfos={infos[1]} />
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
                            {stnName[0].split('\\').map((txt, i, array) => (
                                <text key={i} className="rmg-name__zh" dy={(array.length - 1 - i) * -15}>
                                    {txt}
                                </text>
                            ))}
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

const IntBoxGroup = (props: { intInfos: InterchangeInfo[][]; direction: 'l' | 'r' } & React.SVGProps<SVGGElement>) => {
    const { intInfos, direction, ...others } = props;

    // also known as non out-of-system transfers
    const boxInfos = [
        ...intInfos[0],
        ...(intInfos[1] || []),
        // some dirty tricks here as shmetro shows maglev icon even it is a out-of-system transfer
        // and display a maglev icon is much easier in boxInfos than in OSysIText
        ...(intInfos[2]?.filter(info => Boolean(info[4].match(/^磁(悬)*浮/))) || []),
    ];

    let dx = 0; // update in every boxInfos

    return (
        <g fontSize={14} textAnchor="middle" {...others}>
            {boxInfos.map((info, i) => {
                const isLineNumber = Boolean(info[4].match(/^\d.*$/));
                const isMaglev = Boolean(info[4].match(/^磁(悬)*浮/));

                if (props.direction === 'r') {
                    dx -= (isLineNumber || isMaglev ? 20 : info[4].length * 14 + 12 + 0) + (i === 0 ? 0 : 5);
                }

                let el = <g />;
                if (isMaglev) {
                    el = (
                        <g transform={`translate(${dx},-16)scale(0.1428571429)`} key={i}>
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

                if (props.direction === 'l') {
                    dx += isLineNumber || isMaglev ? 20 + 5 : info[4].length * 14 + 12 + 5;
                }
                return el;
            })}

            {[...(intInfos[2] || [])].length > 0 && (
                <g transform={`translate(${dx - (props.direction === 'r' ? 5 : 0)},0)`} key={boxInfos.length + 1}>
                    <OSysIText osysiInfos={intInfos[2]} direction={props.direction} />
                </g>
            )}
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
    // get the all names from the out of station interchanges
    const lineNames = props.osiInfos.map(info => info[4]).join('，');
    return React.useMemo(
        () => (
            <g textAnchor="middle" fontSize="50%">
                <text className="rmg-name__zh" dy={-5}>
                    {`换乘${lineNames}`}
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

const OSysIText = (props: { osysiInfos: InterchangeInfo[]; direction: 'l' | 'r' }) => {
    // get the all names from out of system transfers
    const lineNames = props.osysiInfos.map(info => info[4]).join('，');
    const lineNamesEn = props.osysiInfos.map(info => info[5]).join(', ');

    return React.useMemo(
        () => (
            <g textAnchor={props.direction === 'l' ? 'start' : 'end'} fontSize="50%">
                <text className="rmg-name__zh" dy={3}>
                    转乘{lineNames}
                </text>
                <text className="rmg-name__en" dy={10} fontSize="75%">
                    To {lineNamesEn}
                </text>
            </g>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props.osysiInfos.toString(), props.direction]
    );
};
