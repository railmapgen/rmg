import { ColourHex } from '@railmapgen/rmg-palette-resources';
import { Translation } from '@railmapgen/rmg-translate';
import { forwardRef, memo, Ref, SVGProps, useEffect, useMemo, useRef, useState } from 'react';
import { ExtendedInterchangeInfo, Facilities, InterchangeGroup, PanelTypeShmetro } from '../../constants/constants';
import { useRootSelector } from '../../redux';

export const INT_BOX_SIZE = {
    width: {
        singleDigit: 19.8,
        doubleDigit: 24.2,
    },
    height: 22,
    padding: 2,
};

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
        : (stnInfo.parents.length > 1 || stnInfo.children.length > 1
              ? 8 + 12 * (stnInfo.localisedName.en?.split('\\')?.length ?? 1)
              : 0) * (direction === 'r' ? -1 : 1);

    let stationIconStyle: string;
    const stationIconColor: { [pos: string]: string } = {};
    if (info_panel_type === PanelTypeShmetro.sh2024) {
        const int_length = stnInfo.transfer.groups.at(0)?.lines?.length ?? 0;
        const osi_osysi_length = [
            ...(stnInfo.transfer.groups.at(1)?.lines || []),
            ...(stnInfo.transfer.groups.at(2)?.lines || []),
        ].length;

        if (stnInfo.services.length === 3) stationIconStyle = 'stn_sh_2020_direct';
        else if (stnInfo.services.length === 2) stationIconStyle = 'stn_sh_2020_express';
        else if (int_length > 0 && osi_osysi_length === 0) {
            // 仅换乘车站
            stationIconStyle = 'stn_sh_2024_int';
            stationIconColor.stroke = stnState === -1 ? 'gray' : color ? color : 'var(--rmg-theme-colour)';
        } else if (int_length > 0 && osi_osysi_length > 0) {
            // 站内换乘+出站换乘
            stationIconStyle = 'stn_sh_2024_int_osysi';
            stationIconColor.stroke = stnState === -1 ? 'gray' : color ? color : 'var(--rmg-theme-colour)';
        } else if (int_length === 0 && osi_osysi_length === 1) {
            // 仅2线出站换乘
            stationIconStyle = 'stn_sh_2024_osysi2';
            stationIconColor.stroke = stnState === -1 ? 'gray' : color ? color : 'var(--rmg-theme-colour)';
        } else if (int_length === 0 && osi_osysi_length === 2) {
            // 仅3线出站换乘
            stationIconStyle = 'stn_sh_2024_osysi3';
            stationIconColor.stroke = stnState === -1 ? 'gray' : color ? color : 'var(--rmg-theme-colour)';
        } else stationIconStyle = 'stn_sh_2020';
        stationIconColor.fill = stnState === -1 ? 'gray' : color ? color : 'var(--rmg-theme-colour)';
    } else if (info_panel_type === PanelTypeShmetro.sh2020) {
        if (stnInfo.services.length === 3) stationIconStyle = 'stn_sh_2020_direct';
        else if (stnInfo.services.length === 2) stationIconStyle = 'stn_sh_2020_express';
        else stationIconStyle = 'stn_sh_2020';
        stationIconColor.fill = stnState === -1 ? 'gray' : color ? color : 'var(--rmg-theme-colour)';
    } else {
        // param.info_panel_type === 'sh' or others (from other styles)
        if (stnInfo.services.length === 3) stationIconStyle = 'direct_sh';
        else if (stnInfo.services.length === 2) stationIconStyle = 'express_sh';
        else if ([...(stnInfo.transfer.groups[0].lines || []), ...(stnInfo.transfer.groups[1]?.lines || [])].length > 0)
            stationIconStyle = 'int2_sh';
        else stationIconStyle = 'stn_sh';
        stationIconColor.stroke = stnState === -1 ? 'gray' : color ? color : 'var(--rmg-theme-colour)';
    }

    const bank = bank_ ?? 0;
    const dx2024 = info_panel_type === PanelTypeShmetro.sh2024 ? (direction === 'l' ? -5 : 5) : 0;
    const dx = (direction === 'l' ? 6 : -6) + branchNameDX + bank * 30 + dx2024;
    const is2020or2024 = info_panel_type === PanelTypeShmetro.sh2020 || info_panel_type === PanelTypeShmetro.sh2024;
    const dy = (is2020or2024 ? -20 : -6) + Math.abs(bank) * (is2020or2024 ? 25 : 11);
    const dr = bank ? 0 : direction === 'l' ? -45 : 45;
    return (
        <>
            <use
                xlinkHref={`#${stationIconStyle}`}
                {...stationIconColor} // different styles use either `fill` or `stroke`
                // sh and sh2020 have different headings of int_sh, so -1 | 1 is multiplied
                transform={`translate(${bank * (is2020or2024 ? 5 : 0)},0)rotate(${bank * 90 * (is2020or2024 ? 1 : -1)})`}
            />
            <g transform={`translate(${dx},${dy})rotate(${dr})`}>
                <StationNameGElement
                    name={stnInfo.localisedName}
                    groups={stnInfo.transfer.groups}
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
    name: Translation;
    groups: InterchangeGroup[];
    stnState: -1 | 0 | 1;
    direction: 'l' | 'r';
    facility?: Facilities;
    bank: -1 | 0 | 1;
    oneLine: boolean;
    intPadding: number;
}

const StationNameGElement = (props: StationNameGElementProps) => {
    const { name, groups, stnState, direction, facility, bank, oneLine, intPadding } = props;
    const { info_panel_type } = useRootSelector(store => store.param);

    // legacy ref to get the exact station name width
    const stnNameEl = useRef<SVGGElement | null>(null);

    // simplify the calculation times
    const directionPolarity = direction === 'l' ? 1 : -1;

    // main elements icon's dx will change if there is a facility icon or not
    const mainDx = facility ? 30 : 0;

    // interchange will have a line under the name, and should be stretched when placed horizontal in loop
    const lineDx = bank ? -12 : 0;

    // int group
    const intEl = useRef<SVGGElement | null>(null);
    const [intWidth, setIntWidth] = useState(0);
    useEffect(() => {
        // IntBoxGroup2024 will use double render to get the width of the text elements
        // so we need to wait and get the int group width
        setTimeout(() => setIntWidth(intEl.current?.getBBox().width ?? 0), 10);
    }, [JSON.stringify(groups), directionPolarity]);
    const intDx = intPadding - intWidth;

    return (
        <>
            {groups.map(group => group.lines ?? []).flat().length > 0 && (
                <>
                    <line
                        x1={(lineDx + mainDx) * directionPolarity}
                        x2={intDx * directionPolarity}
                        stroke={stnState === -1 ? 'var(--rmg-grey)' : 'var(--rmg-black)'}
                        strokeWidth={0.5}
                    />
                    {info_panel_type !== PanelTypeShmetro.sh2024 ? (
                        <>
                            <IntBoxGroup
                                ref={intEl}
                                groups={groups}
                                direction={direction}
                                transform={`translate(${intDx * directionPolarity},-10.75)`}
                            />
                        </>
                    ) : (
                        <IntBoxGroup2024
                            ref={intEl}
                            groups={groups}
                            direction={direction}
                            stnState={stnState}
                            intPadding={intPadding}
                        />
                    )}
                </>
            )}

            {facility && <use xlinkHref={'#' + facility} x={10 * directionPolarity} y={-30} />}

            <g
                textAnchor={direction === 'l' ? 'start' : 'end'}
                transform={`translate(${mainDx * directionPolarity},-14)`}
            >
                <StationName
                    ref={stnNameEl}
                    stnName={name}
                    oneLine={info_panel_type === PanelTypeShmetro.sh2024 ? true : oneLine}
                    directionPolarity={directionPolarity}
                    fill={stnState === -1 ? 'gray' : stnState === 0 ? 'red' : 'black'}
                />

                {info_panel_type !== PanelTypeShmetro.sh2024 && (
                    <>
                        {/* this is out-of-station text displayed above the IntBoxGroup */}
                        {groups[1]?.lines?.length && (
                            <g transform={`translate(${(intDx + intWidth / 2) * directionPolarity},-30)`}>
                                <OSIText osiInfos={groups[1].lines} />
                            </g>
                        )}
                        {/* deal out-of-system here as it's dx is fixed and has nothing to do with IntBoxGroup */}
                        {groups[2]?.lines?.length && (
                            <g transform={`translate(${(intPadding + 5) * directionPolarity},0)`}>
                                <OSysIText osysiInfos={groups[2].lines} direction={props.direction} />
                            </g>
                        )}
                    </>
                )}
            </g>
        </>
    );
};

const StationName = forwardRef(function StationName(
    props: { stnName: Translation; oneLine: boolean; directionPolarity: 1 | -1 } & SVGProps<SVGGElement>,
    ref: Ref<SVGGElement>
) {
    const { stnName, oneLine, directionPolarity, ...others } = props;
    const { zh: zhName = '', en: enName = '' } = stnName;

    const zhEl = useRef<SVGGElement | null>(null);
    const [enDx, setEnDx] = useState(0);
    useEffect(() => {
        if (oneLine && zhEl.current) setEnDx(zhEl.current.getBBox().width + 5);
        else setEnDx(0);
    }, [stnName.zh, stnName.en, oneLine]);

    const [ZH_HEIGHT, EN_HEIGHT] = [20, 8];

    return (
        <g ref={ref} {...others}>
            <g ref={zhEl}>
                {zhName.split('\\').map((txt, i, arr) => (
                    <text
                        key={i}
                        className="rmg-name__zh rmg-outline"
                        dy={
                            (arr.length - 1 - i) * -ZH_HEIGHT +
                            (oneLine ? EN_HEIGHT : (enName.split('\\').length - 1) * -EN_HEIGHT)
                        }
                    >
                        {txt}
                    </text>
                ))}
            </g>
            <g fontSize={8} transform={`translate(${enDx * directionPolarity},0)`}>
                {enName.split('\\').map((txt, i, arr) => (
                    <text key={i} className="rmg-name__en rmg-outline" dy={(arr.length - 2 - i) * -EN_HEIGHT + 2}>
                        {txt}
                    </text>
                ))}
            </g>
        </g>
    );
});

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

const IntBoxGroup = forwardRef(function IntBoxGroup(
    props: { groups: InterchangeGroup[]; direction: 'l' | 'r' } & SVGProps<SVGGElement>,
    ref: Ref<SVGGElement>
) {
    const { groups, direction, ...others } = props;

    // also known as non out-of-system transfers
    const boxInfos: ExtendedInterchangeInfo[] = [
        ...(groups[0].lines || []),
        ...(groups[1]?.lines || []),
        // some dirty tricks here as shmetro shows maglev icon even it is an out-of-system transfer
        // and display a maglev icon is much easier in boxInfos than in OSysIText
        ...(groups[2]?.lines?.filter(info => Boolean(info.name[0].match(/^磁(悬)*浮/))) || []),
    ];

    let dx = 0; // update in every boxInfos

    return (
        <g ref={ref} fontSize={14} textAnchor="middle" {...others}>
            {boxInfos.map((info, i) => {
                const isLineNumber = Boolean(info.name[0].match(/^\w+(号)?线/));
                const isMaglev = Boolean(info.name[0].match(/^磁(悬)*浮/));

                if (direction === 'r') {
                    dx -= (isLineNumber || isMaglev ? 20 : info.name[0].length * 14 + 12) + (i === 0 ? 0 : 5);
                }

                let el: JSX.Element;
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

                if (direction === 'l') {
                    dx += isLineNumber || isMaglev ? 20 + 5 : info.name[0].length * 14 + 12 + 5;
                }
                return el;
            })}
        </g>
    );
});

const IntBoxGroup2024 = forwardRef(function IntBoxGroup2024(
    props: { groups: InterchangeGroup[]; direction: 'l' | 'r'; stnState: -1 | 0 | 1; intPadding: number },
    ref: Ref<SVGGElement>
) {
    const { groups, direction, stnState, intPadding } = props;
    const directionPolarity = direction === 'l' ? 1 : -1;

    const transfer = [groups.at(0)?.lines ?? [], groups.at(1)?.lines ?? [], groups.at(2)?.lines ?? []];

    const [outOfSystemLine, setOutOfSystemLine] = useState([0, 0]); // also for start point of 出站换乘
    const [intBoxesDX, setIntBoxesDX] = useState<{ [k in string]: number }>({});
    const textLineRefs = useRef<{ [k in string]: SVGGElement }>({});
    const [intBoxGroupWidth, setIntBoxGroupWidth] = useState(0);
    useEffect(() => {
        // update the width of each text line
        const textLineWidth = Object.fromEntries(
            transfer
                .flat()
                .filter(info => !info.name[0].match(/^(\d+)号线$/))
                .map(info => {
                    const key = info.name[0];
                    return [key, textLineRefs.current[key]?.getBBox().width ?? 0];
                })
        );

        const getBBoxWidth = (info: ExtendedInterchangeInfo) => {
            const key = info.name[0];
            const lineNumber = key.match(/^(\d+)号线$/);
            const boxWidth = lineNumber
                ? Number(lineNumber[1]) >= 10
                    ? INT_BOX_SIZE.width.doubleDigit
                    : INT_BOX_SIZE.width.singleDigit
                : textLineWidth[info.name[0]];
            intBoxDX[key] = dx * directionPolarity + (lineNumber && direction === 'r' ? -boxWidth : 0);
            return boxWidth + INT_BOX_SIZE.padding;
        };

        let dx = 0; // update in every box
        const intBoxDX: { [k in string]: number } = {};
        transfer[0].forEach(info => {
            dx += getBBoxWidth(info);
        });
        let outOfSystemLine = [0, 0];
        if (transfer[1].length) {
            // there will be a line and a text element for 出站换乘
            // each will take 22px
            const elementWidth = INT_BOX_SIZE.height;
            if (transfer[0].length) {
                outOfSystemLine = [dx, dx + elementWidth];
                dx += elementWidth * 2;
            } else {
                dx += INT_BOX_SIZE.padding;
                // hide this line if there is no previous transfer
                outOfSystemLine = [dx, dx];
                dx += elementWidth;
            }
            transfer[1].forEach(info => {
                dx += getBBoxWidth(info);
            });
        }
        transfer[2].forEach(info => {
            dx += getBBoxWidth(info);
        });
        setIntBoxesDX(intBoxDX);
        setOutOfSystemLine(outOfSystemLine);
        setIntBoxGroupWidth(dx);
    }, [JSON.stringify(transfer), direction]);

    const makeBoxElement = (info: ExtendedInterchangeInfo) => {
        const key = info.name[0];
        const isLineNumber = Boolean(key.match(/^(\d+)号线$/));
        return (
            <g
                key={key}
                ref={el => {
                    if (el && !isLineNumber) textLineRefs.current[key] = el;
                }}
                transform={`translate(${intBoxesDX[key] ?? 0},${-INT_BOX_SIZE.height / 2})`}
            >
                {isLineNumber ? (
                    <IntBoxNumber2024 info={info} />
                ) : (
                    <IntBoxText2024 info={info} state={stnState} direction={direction} />
                )}
            </g>
        );
    };

    const intBoxDX = (intPadding - intBoxGroupWidth) * directionPolarity;
    return (
        <g ref={ref} fontSize={24} textAnchor="middle" transform={`translate(${intBoxDX},0)`}>
            {transfer[0].map(makeBoxElement)}
            {transfer[1].length && (
                <>
                    {transfer[0].length > 0 && (
                        <line
                            x1={(outOfSystemLine[0] - 2) * directionPolarity}
                            x2={(outOfSystemLine[1] - 2) * directionPolarity}
                            stroke={stnState < 0 ? 'var(--rmg-grey)' : 'var(--rmg-black)'}
                            strokeWidth={0.5}
                        />
                    )}
                    <g
                        transform={`translate(${outOfSystemLine[1] * directionPolarity},-13.5)`}
                        fill={stnState < 0 ? 'var(--rmg-grey)' : 'var(--rmg-black)'}
                        fontSize="10"
                        textAnchor={direction === 'l' ? 'start' : 'end'}
                        className="rmg-name__zh"
                    >
                        <text dy="1.5">出站</text>
                        <text dy="12.5">换乘</text>
                    </g>
                    {transfer[1].map(makeBoxElement)}
                </>
            )}
            {transfer[2].map(makeBoxElement)}
        </g>
    );
});

const IntBoxMaglev = memo(
    function IntBoxMaglev(props: { info: ExtendedInterchangeInfo }) {
        return (
            <>
                <use xlinkHref="#intbox_maglev" fill={props.info.theme?.[2]} stroke={props.info.theme?.[2]} />
            </>
        );
    },
    (prevProps, nextProps) => JSON.stringify(prevProps.info) === JSON.stringify(nextProps.info)
);

const IntBoxNumber = memo(
    function IntBoxNumber(props: { info: ExtendedInterchangeInfo }) {
        return (
            <>
                <use xlinkHref="#intbox_number" fill={props.info.theme?.[2]} />
                <text x={10} className="rmg-name__zh" fill={props.info.theme?.[3]} dominantBaseline="central">
                    {/* // line starts with numbers */}
                    {props.info.name[0].match(/(\d*)\w+/)?.[0]}
                </text>
            </>
        );
    },
    (prevProps, nextProps) => JSON.stringify(prevProps.info) === JSON.stringify(nextProps.info)
);

export const IntBoxNumber2024 = (props: { info: ExtendedInterchangeInfo }) => {
    const {
        info: { name, theme },
    } = props;
    const num = name[0].match(/^(\d+)号线$/)?.[1] ?? '';
    const width = num.length > 1 ? INT_BOX_SIZE.width.doubleDigit : INT_BOX_SIZE.width.singleDigit;
    const letterSpacing = num.length > 1 ? -2.5 : 0;
    return (
        <g>
            <rect height={INT_BOX_SIZE.height} width={width} y={-11} fill={theme?.at(2)} />
            <text
                x={10}
                className="rmg-name__zh"
                fill={theme?.at(3)}
                dominantBaseline="central"
                letterSpacing={letterSpacing}
            >
                {num}
            </text>
        </g>
    );
};

const IntBoxLetter = memo(
    function IntBoxLetter(props: { info: ExtendedInterchangeInfo }) {
        // box width: 16 * number of characters + 12
        const textCount = props.info.name[0].split('\\')[0].length;
        return (
            <>
                <rect height={22} width={textCount * 14 + 12} y={-11} fill={props.info.theme?.[2]} />
                <text
                    x={textCount * 7 + 6}
                    className="rmg-name__zh"
                    fill={props.info.theme?.[3]}
                    dominantBaseline="central"
                >
                    {props.info.name[0].split('\\')[0]}
                </text>
            </>
        );
    },
    (prevProps, nextProps) => JSON.stringify(prevProps.info) === JSON.stringify(nextProps.info)
);

export const IntBoxText2024 = (props: { info: ExtendedInterchangeInfo; state: -1 | 0 | 1; direction: 'l' | 'r' }) => {
    const {
        info: { name },
        state,
        direction,
    } = props;
    return (
        <g
            className="rmg-name__zh"
            fill={state < 0 ? 'gray' : 'black'}
            dominantBaseline="central"
            textAnchor={direction === 'l' ? 'start' : 'end'}
        >
            <text dy="-4" fontSize="13">
                {name[0]}
            </text>
            <text dy="7" fontSize="8">
                {name[1]}
            </text>
        </g>
    );
};

const OSIText = (props: { osiInfos: ExtendedInterchangeInfo[] }) => {
    // get the all names from the out of station interchanges
    const lineNames = props.osiInfos.map(info => info.name[0]).join('，');
    return useMemo(
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
        [lineNames.toString()]
    );
};

const OSysIText = (props: { osysiInfos: ExtendedInterchangeInfo[]; direction: 'l' | 'r' }) => {
    // get the all names from out of system transfers
    const lineNames = props.osysiInfos.map(info => info.name[0]).join('，');
    const lineNamesEn = props.osysiInfos.map(info => info.name[1]).join(', ');

    return (
        <g textAnchor={props.direction === 'l' ? 'start' : 'end'} fontSize="50%">
            <text className="rmg-name__zh" dy={3}>
                转乘{lineNames}
            </text>
            <text className="rmg-name__en" dy={10} fontSize="75%">
                To {lineNamesEn}
            </text>
        </g>
    );
};
