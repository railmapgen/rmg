import { ColourHex } from '@railmapgen/rmg-palette-resources';
import { Translation } from '@railmapgen/rmg-translate';
import { Fragment, Ref, SVGProps, forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import {
    ExtendedInterchangeInfo,
    InterchangeGroup,
    PanelTypeGZMTR,
    PanelTypeShmetro,
    Services,
} from '../../../constants/constants';
import { useRootSelector } from '../../../redux';

/**
 * Which direction to display station name. Currently shmetro only.
 */
export type NameDirection = 'upward' | 'downward' | 'left' | 'right';

interface Props {
    stnId: string;
    nameDirection: NameDirection;
    services: Services[];
    color?: ColourHex; // Control the station color if coline is in effect.
}

export const StationSHMetro = (props: Props) => {
    const { stnId, nameDirection, services, color } = props;
    const { stn_list, info_panel_type } = useRootSelector(store => store.param);
    const stnInfo = stn_list[stnId];

    let stationIconStyle: string;
    const stationIconColor: { [pos: string]: string } = {};
    if (info_panel_type === PanelTypeShmetro.sh2024) {
        const int_length = stnInfo.transfer.groups.at(0)?.lines?.length ?? 0;
        const osi_osysi_length = [
            ...(stnInfo.transfer.groups.at(1)?.lines || []),
            ...(stnInfo.transfer.groups.at(2)?.lines || []),
        ].length;

        stationIconColor.stroke = 'var(--rmg-theme-colour)';
        if (stnInfo.services.length === 3) {
            stationIconStyle = 'stn_sh_2020_direct';
        } else if (stnInfo.services.length === 2) {
            stationIconStyle = 'stn_sh_2020_express';
        } else if (osi_osysi_length > 1) {
            // 不管多少条站内换乘，只要有超过1个的出站换乘就是3个圆了
            stationIconStyle = 'stn_sh_2024_osysi3';
        } else if (int_length > 0 && osi_osysi_length === 0) {
            // 仅换乘车站
            stationIconStyle = 'stn_sh_2024_int';
        } else if (int_length > 0 && osi_osysi_length > 0) {
            // 站内换乘+出站换乘
            stationIconStyle = 'stn_sh_2024_int_osysi';
        } else if (int_length === 0 && osi_osysi_length === 1) {
            // 仅2线出站换乘
            stationIconStyle = 'stn_sh_2024_osysi2';
        } else {
            stationIconStyle = 'stn_sh_2024';
            delete stationIconColor.stroke;
            stationIconColor.fill = 'var(--rmg-theme-colour)';
        }
    } else {
        const non_osysi_transfer = [
            ...(stnInfo.transfer.groups[0]?.lines || []),
            ...(stnInfo.transfer.groups[1]?.lines || []),
        ];
        if (stnInfo.services.length === 3) stationIconStyle = 'direct_indoor_sh';
        else if (stnInfo.services.length === 2) stationIconStyle = 'express_indoor_sh';
        else if (stnInfo.transfer.groups[1]?.lines?.length ?? 0 > 0) stationIconStyle = 'osi_indoor_sh';
        else if (non_osysi_transfer.length > 0) stationIconStyle = 'int2_indoor_sh';
        else stationIconStyle = 'stn_indoor_sh';
        stationIconColor.stroke =
            non_osysi_transfer.length > 0 ? 'var(--rmg-black)' : (color ?? 'var(--rmg-theme-colour)');
    }

    const dr = nameDirection === 'left' || nameDirection === 'right' ? 90 : 0;
    return (
        <>
            <StationNameGElement
                name={stnInfo.localisedName}
                groups={stnInfo.transfer.groups}
                nameDirection={nameDirection}
                services={services}
            />
            <use
                xlinkHref={`#${stationIconStyle}`}
                transform={`rotate(${dr})`}
                {...stationIconColor} // different styles use either `fill` or `stroke`
            />
            {/* This should be in IntBoxGroupProps, put here because the station icon will cover this */}
            {stnInfo.services.length > 1 && (
                <text className="rmg-name__zh" writingMode="tb" fontSize="60%" dy="-12">
                    {`大站车${stnInfo.services.length > 2 ? ' 直达车' : ''}停靠`}
                </text>
            )}
        </>
    );
};

export default StationSHMetro;

const stationNameDY = (
    info_panel_type: PanelTypeShmetro | PanelTypeGZMTR,
    nameDirection: NameDirection,
    nameENLn: number
) => {
    if (info_panel_type === PanelTypeShmetro.sh2024) {
        if (nameDirection === 'upward') return 5;
        if (nameDirection === 'downward') return -45 - 12 * (nameENLn - 1);
        if (nameDirection === 'left' || nameDirection === 'right') return -10 * (nameENLn - 1);
    } else {
        if (nameDirection === 'upward') return -2;
        if (nameDirection === 'downward') return -30 - 12 * (nameENLn - 1);
        if (nameDirection === 'left' || nameDirection === 'right') return -10 * (nameENLn - 1);
    }
    return 0;
};

const STATION_NAME_2024_ZH_FONT_SIZE = 22;

interface StationNameGElementProps {
    name: Translation;
    groups: InterchangeGroup[];
    nameDirection: NameDirection;
    services: Services[];
}

const StationNameGElement = (props: StationNameGElementProps) => {
    const { name, groups, nameDirection, services } = props;
    const { en: enName = '' } = name;
    const nameENLn = enName.split('\\').length;
    const { info_panel_type } = useRootSelector(store => store.param);
    const dy = { upward: 60, downward: -30, left: 0, right: 0 }[nameDirection];
    const osysi_dx =
        // only compute when there is an out-of-system transfer
        groups[2]?.lines?.length
            ? {
                  upward: 0,
                  downward: 0,
                  left: (groups[0].lines?.length || 0) + (groups[1]?.lines?.length || 0) !== 0 ? 85 : 25,
                  right: (groups[0].lines?.length || 0) + (groups[1]?.lines?.length || 0) !== 0 ? -85 : -25,
              }[nameDirection]
            : 0;
    const osysi_dy =
        // only compute when there is an out-of-system transfer
        groups[2]?.lines?.length
            ? {
                  upward:
                      groups[0]?.lines?.length && groups[1]?.lines?.length
                          ? -210
                          : groups[0]?.lines?.length || groups[1]?.lines?.length
                            ? -177.5
                            : -145,
                  downward:
                      (groups[0]?.lines?.length && groups[1]?.lines?.length
                          ? 185
                          : groups[0].lines?.length || groups[1]?.lines?.length
                            ? 157.5
                            : 125) + (services.length === 3 ? 40 : 0),
                  left:
                      groups[0]?.lines?.length && groups[1]?.lines?.length
                          ? -67
                          : groups[0].lines?.length || groups[1]?.lines?.length
                            ? -30
                            : 0,
                  right:
                      groups[0]?.lines?.length && groups[1]?.lines?.length
                          ? -67
                          : groups[0].lines?.length || groups[1]?.lines?.length
                            ? -30
                            : 0,
              }[nameDirection]
            : 0;
    const nameRef = useRef<SVGGElement | null>(null);
    const MIN_NAME_LINE_LENGTH = 60;
    const [nameSize, setNameSize] = useState({ width: MIN_NAME_LINE_LENGTH, height: 0, x: 0, y: 0 });
    useEffect(() => {
        if (nameRef?.current) setNameSize(nameRef.current.getBBox());
    }, [name.zh, name.en]);

    const panel_type = info_panel_type as PanelTypeShmetro;
    const verticalLineY = {
        [PanelTypeShmetro.sh2024]: { upward: -15, downward: -30 },
        [PanelTypeShmetro.sh2020]: { upward: -23, downward: -10 },
        [PanelTypeShmetro.sh]: { upward: -23, downward: -10 },
    };
    const intBoxGroup2024DY = {
        upward: stationNameDY(info_panel_type, nameDirection, nameENLn) + nameSize.height + INT_BOX_SIZE.height / 2,
        downward:
            stationNameDY(info_panel_type, nameDirection, nameENLn) -
            STATION_NAME_2024_ZH_FONT_SIZE / 2 -
            INT_BOX_SIZE.height / 2,
        left: 7,
        right: 7,
    };

    return (
        <g transform={`translate(0,${dy})`}>
            {nameDirection === 'upward' || nameDirection === 'downward' ? (
                <>
                    {info_panel_type !== PanelTypeShmetro.sh2024 && (
                        <line
                            x1={-nameSize.width / 2}
                            x2={nameSize.width / 2}
                            y1={verticalLineY[panel_type][nameDirection]}
                            y2={verticalLineY[panel_type][nameDirection]}
                            stroke="black"
                        />
                    )}
                    <line
                        y1={verticalLineY[panel_type][nameDirection]}
                        y2={
                            // TODO: this is too ugly
                            nameDirection === 'upward'
                                ? -23 - 25 - (info_panel_type === PanelTypeShmetro.sh2024 ? 6 : 0)
                                : 20
                        }
                        stroke="black"
                    />
                </>
            ) : (
                <>
                    {info_panel_type !== PanelTypeShmetro.sh2024 && (
                        <line
                            x1={nameDirection === 'left' ? -50 : 15}
                            x2={nameDirection === 'left' ? -15 : 50}
                            y1={0}
                            y2={0}
                            stroke="black"
                        />
                    )}
                    <line
                        x1={nameDirection === 'left' ? -50 : 50}
                        x2={nameDirection === 'left' ? -50 : 50}
                        y1={-30}
                        y2={30}
                        stroke="black"
                    />
                </>
            )}

            {info_panel_type !== PanelTypeShmetro.sh2024 ? (
                [...(groups[0].lines || []), ...(groups[1]?.lines || [])].length && (
                    <IntBoxGroup
                        intInfos={[groups[0].lines || [], groups[1]?.lines || []]}
                        arrowDirection={nameDirection}
                        services={services}
                    />
                )
            ) : (
                <IntBoxGroup2024 groups={groups} dy={intBoxGroup2024DY[nameDirection]} />
            )}

            <StationName ref={nameRef} stnName={name} nameDirection={nameDirection} fill="black" />

            {info_panel_type !== PanelTypeShmetro.sh2024 && groups[2]?.lines?.length && (
                <g transform={`translate(${osysi_dx},${osysi_dy})`}>
                    <OSysIText osysiInfos={groups[2].lines} nameDirection={nameDirection} />
                </g>
            )}
        </g>
    );
};

const StationName = forwardRef(function StationName(
    props: { stnName: Translation; nameDirection: NameDirection } & SVGProps<SVGGElement>,
    ref: Ref<SVGGElement>
) {
    const { info_panel_type } = useRootSelector(store => store.param);
    const { stnName, nameDirection, ...others } = props;
    const { zh: zhName = '', en: enName = '' } = stnName;
    const name = zhName.split('\\');
    const nameENLn = enName.split('\\').length;
    const dx = { upward: 0, downward: 0, left: -60, right: 60 }[nameDirection];
    const dy = stationNameDY(info_panel_type, nameDirection, nameENLn);
    const anchor = { upward: 'middle', downward: 'middle', left: 'end', right: 'start' }[nameDirection];

    const fontSize = {
        zh: info_panel_type === PanelTypeShmetro.sh2024 ? STATION_NAME_2024_ZH_FONT_SIZE : 16,
        en: info_panel_type === PanelTypeShmetro.sh2024 ? 11 : 9.6,
    };

    return (
        <g ref={ref} {...others} textAnchor={anchor} transform={`translate(${dx},${dy})`}>
            {name.map((txt, i, array) => (
                <text
                    key={i}
                    className="rmg-name__zh"
                    dy={nameDirection === 'upward' ? 16 * i : (array.length - 1 - i) * -16}
                    fontSize={fontSize.zh}
                >
                    {txt}
                </text>
            ))}
            <g fontSize={fontSize.en}>
                {enName.split('\\')?.map((txt, i) => (
                    <text
                        key={i}
                        className="rmg-name__en"
                        dy={12 * (i + 1) + (nameDirection === 'upward' ? (name.length > 1 ? name.length * 7.5 : 0) : 0)}
                    >
                        {txt}
                    </text>
                ))}
            </g>
        </g>
    );
});

const INT_BOX_SIZE = {
    width: {
        singleDigit: 27,
        doubleDigit: 33,
    },
    height: 30,
    padding: 2,
};

interface IntBoxGroupProps {
    intInfos: ExtendedInterchangeInfo[][];
    arrowDirection: NameDirection;
    services: Services[];
}

const IntBoxGroup = (props: IntBoxGroupProps & SVGProps<SVGGElement>) => {
    const { intInfos, arrowDirection, services } = props;

    // name each different linearGradient that will fill the arrow
    const intNameId = intInfos
        .flatMap(intInfo => intInfo.map(info => info.theme?.[2]))
        .reduce((name, color) => name + color, '');

    // get the interchange line names
    const lineNames = intInfos.map(intInfo =>
        [
            intInfo
                .filter(info => info.name[0].match(/^\d+.*$/))
                .map(info => info.name[0].replace(/^(\d+)(.*)$/, '$1'))
                .join('，')
                .concat('号线'),
            intInfo
                .filter(info => !info.name[0].match(/^\d+.*$/))
                .map(info => info.name[0])
                .join('，'),
        ]
            .filter(name => name && name !== '号线')
            .join('，')
    );
    const lineNamesEn = intInfos.map(intInfo =>
        [
            'Line '.concat(
                // contact number lines to Line 1,2,3...
                intInfo
                    .filter(info => /^(L|l)ine \d+$/.test(info.name[1]))
                    .map(info => info.name[1].replace('Line', '').replace('line', '').trim())
                    .join(',')
            ),
            // and then add text lines without any change
            intInfo
                .filter(info => !/^(L|l)ine \d+$/.test(info.name[1]))
                .map(info => info.name[1])
                .join(', '),
        ]
            .filter(name => name && name !== 'Line ')
            .join(', ')
    );

    // for services contains three level (normal, express, direct)
    // additional length is required on transfer arrow otherwise
    // the station icon will be longer than the arrow itself
    const arrowLength = services.length === 3 ? 80 : 45;
    const transfer_dy = { upward: -145, downward: 125 + (services.length === 3 ? 40 : 0), left: 7, right: 7 }[
        arrowDirection
    ];

    // bunch of constants for all four directions
    const arrow_dx = { upward: 0, downward: 0, left: 20, right: -20 }[arrowDirection];
    const arrow_dy = { upward: -74, downward: 44, left: 0, right: 0 }[arrowDirection];
    const arrow_dr = { upward: 0, downward: 180, left: 90, right: -90 }[arrowDirection];
    const transfer_dx = { upward: 0, downward: 0, left: 85, right: -85 }[arrowDirection];
    const transfer_anchor = { upward: 'middle', downward: 'middle', left: 'start', right: 'end' }[arrowDirection];

    const osi_dx = transfer_dx;
    const osi_dy = {
        upward: (intInfos.at(0)?.length ?? 0) ? -177.5 : -145,
        downward: ((intInfos.at(0)?.length ?? 0) ? 157.5 : 125) + (services.length === 3 ? 40 : 0),
        left: (intInfos.at(0)?.length ?? 0) ? -30 : 7,
        right: (intInfos.at(0)?.length ?? 0) ? -30 : 7,
    }[arrowDirection];

    return (
        <g>
            <path
                id="int_indoor_arrow_sh"
                stroke="var(--rmg-black)"
                strokeWidth={1}
                transform={`translate(${arrow_dx},${arrow_dy})rotate(${arrow_dr})`}
                fill={intInfos.flat().length === 1 ? intInfos.flat()[0].theme?.[2] : `url(#grad${intNameId})`}
                d={`M -7.5,0 v -${arrowLength} h -7.5 l 15,-15 l 15,15 h -7.5 v ${arrowLength} Z`}
            />

            {intInfos.flat().length > 1 && (
                <linearGradient
                    id={`grad${intNameId}`}
                    y1="0"
                    y2="0"
                    x1={arrowDirection === 'upward' ? '25%' : '75%'}
                    x2={arrowDirection === 'upward' ? '75%' : '25%'}
                >
                    {intInfos.flat().map((intInfo, i) => (
                        <Fragment key={i}>
                            {/* more about React.Fragment on https://stackoverflow.com/a/59390967 */}
                            <stop // start from
                                offset={`${(100 / intInfos.flat().length) * i}%`}
                                stopColor={intInfo.theme?.[2]}
                            />
                            <stop // to
                                offset={`${(100 / intInfos.flat().length) * (i + 1)}%`}
                                stopColor={intInfo.theme?.[2]}
                            />
                        </Fragment>
                    ))}
                </linearGradient>
            )}

            {(intInfos.at(0)?.length ?? 0) > 0 && (
                <g transform={`translate(${transfer_dx},${transfer_dy})`} textAnchor={`${transfer_anchor}`}>
                    <text className="rmg-name__zh" dy={-7}>
                        {`换乘${lineNames[0]}`}
                    </text>
                    <text className="rmg-name__en" dy={5} fontSize={9.6}>
                        {`Interchange ${lineNamesEn[0]}`}
                    </text>
                </g>
            )}
            {(intInfos.at(1)?.length ?? 0) > 0 && (
                <g transform={`translate(${osi_dx},${osi_dy})`} textAnchor={`${transfer_anchor}`}>
                    <text className="rmg-name__zh" dy={-7}>
                        {`出站换乘${lineNames[1]}`}
                    </text>
                    <text className="rmg-name__en" dy={5} fontSize={9.6}>
                        {`Out-of-station Transfer ${lineNamesEn[1]}`}
                    </text>
                </g>
            )}
        </g>
    );
};

const IntBoxGroup2024 = forwardRef(function IntBoxGroup2024(
    props: { groups: InterchangeGroup[]; dy: number },
    ref: Ref<SVGGElement>
) {
    const { groups, dy } = props;
    const directionPolarity = 1;

    const transfer = [groups.at(0)?.lines ?? [], groups.at(1)?.lines ?? [], groups.at(2)?.lines ?? []];

    const [outOfSystemLine, setOutOfSystemLine] = useState(0); // also for start point of 出站换乘
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
            intBoxDX[key] = dx * directionPolarity;
            return boxWidth + INT_BOX_SIZE.padding;
        };

        let dx = 0; // update in every box
        const intBoxDX: { [k in string]: number } = {};
        transfer[0].forEach(info => {
            dx += getBBoxWidth(info);
        });
        let outOfStationLine = 0;
        if (transfer[1].length) {
            // there will be a line and a text element for 出站换乘
            // each will take 22px
            const elementWidth = INT_BOX_SIZE.height;
            if (transfer[0].length) {
                outOfStationLine = dx + INT_BOX_SIZE.padding;
                dx += elementWidth + 2 * INT_BOX_SIZE.padding;
            } else {
                dx += INT_BOX_SIZE.padding;
                // hide this line if there is no previous transfer
                outOfStationLine = 0;
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
        setOutOfSystemLine(outOfStationLine);
        setIntBoxGroupWidth(dx);
    }, [JSON.stringify(transfer)]);

    // only in case of one non out-of-station text line transfer, the text will be centered
    const nonOutOfStationTransfer = [groups.at(0)?.lines ?? [], groups.at(2)?.lines ?? []];
    const onlyOneNonOutOfStationTextInt =
        transfer.flat().length === 1 &&
        nonOutOfStationTransfer.flat().length === 1 &&
        !nonOutOfStationTransfer.flat()[0].name[0].match(/^(\d+)号线$/);

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
                    <IntBoxText2024 info={info} onlyOne={onlyOneNonOutOfStationTextInt} />
                )}
            </g>
        );
    };

    const dx = onlyOneNonOutOfStationTextInt ? 0 : -intBoxGroupWidth / 2;
    return (
        <g ref={ref} fontSize={30} textAnchor="middle" transform={`translate(${dx},${dy})`}>
            {transfer[0].map(makeBoxElement)}
            {transfer[1].length && (
                <>
                    {transfer[0].length > 0 && (
                        <line
                            y1={-INT_BOX_SIZE.height}
                            y2={0}
                            x1={outOfSystemLine - 2}
                            x2={outOfSystemLine - 2}
                            stroke="var(--rmg-black)"
                        />
                    )}
                    <g
                        transform={`translate(${outOfSystemLine},-13.5)`}
                        fill="var(--rmg-black)"
                        fontSize="15"
                        textAnchor="start"
                        className="rmg-name__zh"
                    >
                        <text dy="-4">出站</text>
                        <text dy="11">换乘</text>
                    </g>
                    {transfer[1].map(makeBoxElement)}
                </>
            )}
            {transfer[2].map(makeBoxElement)}
        </g>
    );
});

const IntBoxNumber2024 = (props: { info: ExtendedInterchangeInfo }) => {
    const {
        info: { name, theme },
    } = props;
    const num = name[0].match(/^(\d+)号线$/)?.[1] ?? '';
    const width = num.length > 1 ? INT_BOX_SIZE.width.doubleDigit : INT_BOX_SIZE.width.singleDigit;
    const letterSpacing = num.length > 1 ? -3 : 0;
    return (
        <g>
            <rect height={INT_BOX_SIZE.height} width={width} y={-INT_BOX_SIZE.height / 2} fill={theme?.at(2)} />
            <text
                x={width / 2}
                className="rmg-name__zh"
                fill={theme?.at(3)}
                dominantBaseline="central"
                textAnchor="middle"
                letterSpacing={letterSpacing}
            >
                {num}
            </text>
        </g>
    );
};

const IntBoxText2024 = (props: { info: ExtendedInterchangeInfo; onlyOne: boolean }) => {
    const {
        info: { name },
        onlyOne,
    } = props;
    return (
        <g
            className="rmg-name__zh"
            fill={'var(--rmg-black)'}
            dominantBaseline="central"
            textAnchor={onlyOne ? 'middle' : 'start'}
        >
            <text dy="-5" fontSize="18">
                {name[0]}
            </text>
            <text dy="10" fontSize="9">
                {name[1]}
            </text>
        </g>
    );
};

const OSysIText = (props: { osysiInfos: ExtendedInterchangeInfo[]; nameDirection: NameDirection }) => {
    const anchor = { upward: 'middle', downward: 'middle', left: 'start', right: 'end' }[props.nameDirection];
    return useMemo(
        () => (
            <g textAnchor={`${anchor}`}>
                <text className="rmg-name__zh" dy={-5}>
                    {`转乘${props.osysiInfos.map(info => info.name[0]).join('，')}`}
                </text>
                <text className="rmg-name__en" dy={7.5} fontSize={9.6}>
                    {`To ${props.osysiInfos.map(info => info.name[1]).join(', ')}`}
                </text>
            </g>
        ),
        [JSON.stringify(props.osysiInfos), props.nameDirection]
    );
};
