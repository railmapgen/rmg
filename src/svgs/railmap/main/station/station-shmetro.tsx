import React from 'react';
import { InterchangeInfo, Name, Facilities, ColourHex } from '../../../../constants/constants';
import { useRootSelector } from '../../../../redux';

interface Props {
    stnId: string;
    stnState: -1 | 0 | 1;
    color?: ColourHex; // Control the station color if coline is in effect.
    bank?: -1 | 0 | 1; // Loopline requires station element to be horizontal. Default to 0 (no bank to other side).
    direction?: 'l' | 'r'; // Loopline requires station element to change direction. Default to current param.
}

const StationSHMetro = (props: Props) => {
    const { stnId, stnState, color, bank: bank_, direction: direction_override } = props;
    const { direction: direction_param, info_panel_type, stn_list, loop } = useRootSelector(store => store.param);
    const stnInfo = stn_list[stnId];
    const direction = direction_override ?? direction_param;

    // shift station name if the line bifurcate here
    // no shift for loop as there is no vertical line covering the station
    const branchNameDX = loop
        ? 0
        : ([...stnInfo.branch.left, ...stnInfo.branch.right].length ? 8 + 12 * stnInfo.name[1].split('\\').length : 0) *
          (direction === 'r' ? -1 : 1);

    let stationIconStyle = '';
    let stationIconColor: { [pos: string]: string } = {};
    if (info_panel_type === 'sh2020') {
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

    const bank = bank_ ?? 0;
    const dx = (direction === 'l' ? 6 : -6) + branchNameDX + bank * 30;
    const dy = (info_panel_type === 'sh2020' ? -20 : -6) + Math.abs(bank) * (info_panel_type === 'sh2020' ? 25 : 11);
    const dr = bank ? 0 : direction === 'l' ? -45 : 45;
    return (
        <>
            <use
                xlinkHref={`#${stationIconStyle}`}
                {...stationIconColor} // different styles use either `fill` or `stroke`
                // sh and sh2020 have different headings of int_sh, so -1 | 1 is multiplied
                transform={
                    `translate(${bank * (info_panel_type === 'sh2020' ? 5 : 0)},0)` +
                    `rotate(${bank * 90 * (info_panel_type === 'sh2020' ? 1 : -1)})`
                }
            />
            <g transform={`translate(${dx},${dy})rotate(${dr})`}>
                <StationNameGElement
                    name={stnInfo.name}
                    infos={stnInfo.transfer.info}
                    stnState={stnState}
                    direction={direction}
                    facility={stnInfo.facility}
                    bank={bank}
                    oneLine={stnInfo.one_line}
                    intPadding={stnInfo.int_padding}
                />
            </g>
            {stnState === 0 ? <CurrentStationText /> : undefined}
        </>
    );
};

export default StationSHMetro;

interface StationNameGElementProps {
    name: Name;
    infos: InterchangeInfo[][];
    stnState: -1 | 0 | 1;
    direction: 'l' | 'r';
    facility: Facilities;
    bank: -1 | 0 | 1;
    oneLine: boolean;
    intPadding: number;
}

const StationNameGElement = (props: StationNameGElementProps) => {
    const { name, infos, stnState, direction, facility, bank, oneLine, intPadding } = props;
    const { svg_height } = useRootSelector(store => store.param);

    // legacy ref to get the exact station name width
    const stnNameEl = React.useRef<SVGGElement | null>(null);

    // simplify the calculation times
    const directionPolarity = direction === 'l' ? 1 : -1;

    // main elements icon's dx will change if there is a facility icon or not
    const mainDx = facility !== Facilities.none ? 30 : 0;

    // interchange will have a line under the name, and should be stretched when placed horizontal in loop
    const lineDx = bank ? -12 : 0;

    const intEl = React.useRef<SVGGElement | null>(null);
    const [intWidth, setIntWidth] = React.useState(0);
    React.useEffect(() => setIntWidth(intEl.current?.getBBox().width ?? 0), [...JSON.stringify(infos)]);
    const intDx = intPadding - intWidth;

    return (
        <>
            {infos.flat().length > 0 && (
                <>
                    <line
                        x1={(lineDx + mainDx) * directionPolarity}
                        x2={intDx * directionPolarity}
                        stroke={stnState === -1 ? 'gray' : 'black'}
                        strokeWidth={0.5}
                    />
                    <IntBoxGroup
                        ref={intEl}
                        intInfos={infos}
                        direction={direction}
                        transform={`translate(${intDx * directionPolarity},-10.75)`}
                    />
                </>
            )}

            {facility !== Facilities.none && <use xlinkHref={'#' + facility} x={10 * directionPolarity} y={-30} />}

            <g
                textAnchor={direction === 'l' ? 'start' : 'end'}
                transform={`translate(${mainDx * directionPolarity},-14)`}
            >
                <StationName
                    ref={stnNameEl}
                    stnName={name}
                    oneLine={oneLine}
                    directionPolarity={directionPolarity}
                    fill={stnState === -1 ? 'gray' : stnState === 0 ? 'red' : 'black'}
                />

                {/* deal out-of-station here as it is a y axis element. leave out-of-system in IntBoxGroup */}
                {infos[1]?.length > 0 && (
                    <g transform={`translate(${(intDx + intWidth / 2) * directionPolarity},-30)`}>
                        <OSIText osiInfos={infos[1]} />
                    </g>
                )}

                {/* deal out-of-system here as it's dx is fixed and has nothing to do with IntBoxGroup */}
                {[...(infos[2] || [])].length > 0 && (
                    <g transform={`translate(${(intPadding + 5) * directionPolarity},0)`}>
                        <OSysIText osysiInfos={infos[2]} direction={props.direction} />
                    </g>
                )}
            </g>
        </>
    );
};

const StationName = React.forwardRef(
    (
        props: { stnName: Name; oneLine: boolean; directionPolarity: 1 | -1 } & React.SVGProps<SVGGElement>,
        ref: React.Ref<SVGGElement>
    ) => {
        const { stnName, oneLine, directionPolarity, ...others } = props;

        const zhEl = React.useRef<SVGGElement | null>(null);
        const [enDx, setEnDx] = React.useState(0);
        React.useEffect(() => {
            if (oneLine) setEnDx(zhEl.current!.getBBox().width + 5);
            else setEnDx(0);
        }, [...stnName, oneLine]);

        const [ZH_HEIGHT, EN_HEIGHT] = [20, 8];

        return (
            <g ref={ref} {...others}>
                {React.useMemo(
                    () => (
                        <>
                            <g ref={zhEl}>
                                {stnName[0].split('\\').map((txt, i, arr) => (
                                    <text
                                        key={i}
                                        className="rmg-name__zh"
                                        dy={
                                            (arr.length - 1 - i) * -ZH_HEIGHT +
                                            (oneLine ? EN_HEIGHT : (stnName[1].split('\\').length - 1) * -EN_HEIGHT)
                                        }
                                    >
                                        {txt}
                                    </text>
                                ))}
                            </g>
                            <g fontSize={8} transform={`translate(${enDx * directionPolarity},0)`}>
                                {stnName[1].split('\\').map((txt, i, arr) => (
                                    <text key={i} className="rmg-name__en" dy={(arr.length - 2 - i) * -EN_HEIGHT + 2}>
                                        {txt}
                                    </text>
                                ))}
                            </g>
                        </>
                    ),
                    [...stnName, oneLine, enDx, directionPolarity]
                )}
            </g>
        );
    }
);

const CurrentStationText = () => {
    const { stn_list } = useRootSelector(store => store.param);
    const servicesPresent = new Set(
        Object.values(stn_list)
            .map(stn => stn.services)
            .flat()
    );
    const dy = [-1, 35, 50, 75][servicesPresent.size];

    return (
        <g transform={`translate(0, ${dy})`}>
            <text className="rmg-name__zh" fill="red" textAnchor="middle">
                本站
            </text>
        </g>
    );
};

const IntBoxGroup = React.forwardRef(
    (
        props: { intInfos: InterchangeInfo[][]; direction: 'l' | 'r' } & React.SVGProps<SVGGElement>,
        ref: React.Ref<SVGGElement>
    ) => {
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
            <g ref={ref} fontSize={14} textAnchor="middle" {...others}>
                {boxInfos.map((info, i) => {
                    const isLineNumber = Boolean(info[4].match(/^\d.*$/));
                    const isMaglev = Boolean(info[4].match(/^磁(悬)*浮/));

                    if (props.direction === 'r') {
                        dx -= (isLineNumber || isMaglev ? 20 : info[4].length * 14 + 12) + (i === 0 ? 0 : 5);
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
            </g>
        );
    }
);

const IntBoxMaglev = React.memo(
    (props: { info: InterchangeInfo }) => (
        <>
            <use xlinkHref="#intbox_maglev" fill={props.info[2]} stroke={props.info[2]} />
        </>
    ),
    (prevProps, nextProps) => prevProps.info.toString() === nextProps.info.toString()
);

const IntBoxNumber = React.memo(
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

const IntBoxLetter = React.memo(
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
