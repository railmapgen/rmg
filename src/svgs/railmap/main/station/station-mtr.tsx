import React, { useMemo, useState } from 'react';
import {
    Direction,
    Facilities,
    InterchangeInfo,
    Name,
    ShortDirection,
    StationTransfer,
} from '../../../../constants/constants';
import { useAppSelector } from '../../../../redux';
import StationName from '../../../mtr/station-name/station-name';
import StationNameWrapper from '../../../mtr/station-name/station-name-wrapper';

interface Props {
    stnId: string;
    stnState: -1 | 0 | 1;
    namePos: boolean;
    stnY?: number;
}

const StationMTR = (props: Props) => {
    const { stnId, stnState, namePos } = props;
    const stnInfo = useAppSelector(store => store.param.stn_list[stnId]);

    /**
     * Arrays of directions of the branches a station has.
     */
    const branchPos = useMemo(
        () => {
            let pos: ('SE' | 'NE' | 'SW' | 'NW')[] = [];
            if (stnInfo.branch.right.length) {
                pos.push(stnInfo.children.indexOf(stnInfo.branch.right[1]) === 1 ? 'SE' : 'NE');
            }
            if (stnInfo.branch.left.length) {
                pos.push(stnInfo.parents.indexOf(stnInfo.branch.left[1]) === 1 ? 'SW' : 'NW');
            }
            return pos;
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [stnInfo.parents.toString(), stnInfo.children.toString(), JSON.stringify(stnInfo.branch)]
    );

    /**
     * Affix added to station icon's `href`.
     */
    const branchAffix = useMemo(
        () => {
            let pos = branchPos;
            if (pos.length === 0) {
                return '';
            }
            if (pos.includes('NW') && pos.includes('SE')) {
                return '_bb';
            }
            if (pos.includes('NE') && pos.includes('SW')) {
                return '_bb';
            }
            return '_b';
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [branchPos.toString()]
    );

    /**
     * Changes of vertical position of station icon due to branching shift (11px/line width). Icon rotation should also be applied when using this property.
     */
    const branchDy = useMemo(
        () => {
            let affix = branchAffix;
            if (affix === '') {
                return 0;
            } else if (affix === '_bb') {
                return namePos ? 9.68 : -9.68;
            } else {
                let pos = branchPos;
                if (pos.includes('SE') || pos.includes('SW')) {
                    return namePos ? 9.68 : 0;
                }
                if (pos.includes('NE') || pos.includes('NW')) {
                    return namePos ? 0 : -9.68;
                }
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [branchPos.toString(), branchAffix, namePos]
    );

    /**
     * Changes of vertical position of other elements such as intTick or intName. The result of the ternary operator is the opposite of `this._branchDy`
     */
    const branchElDy = useMemo(() => {
        let affix = branchAffix;
        if (affix === '') {
            return 0;
        } else if (affix === '_bb') {
            return namePos ? -9.68 : 9.68;
        } else {
            let pos = branchPos;
            if (pos.includes('SE') || pos.includes('SW')) {
                return namePos ? 0 : 9.68;
            }
            if (pos.includes('NE') || pos.includes('NW')) {
                return namePos ? -9.68 : 0;
            }
        }
    }, [branchAffix, namePos, branchPos]);

    const stnIcon = ((l: number[]) => {
        const fallback = (n: number) => (n < 11 ? 'int' + (n + 1) : 'int12');
        if (!l[1]) {
            if (!l[0]) {
                return 'stn';
            } else if (l[0] === 1) {
                return 'int';
            } else {
                return fallback(l[0]);
            }
        } else if (l[1] === 1) {
            return l[0] <= 1 ? 'osi11' : fallback(l[0]);
        } else if (l[1] === 2) {
            if (l[0] === 0) {
                return 'osi12';
            } else if (l[0] === 1) {
                if (stnInfo.parents[0] === 'linestart' || stnInfo.children[0] === 'lineend') {
                    return 'osi22end';
                } else {
                    return 'osi22';
                }
            } else {
                return fallback(l[0]);
            }
        } else {
            if (!l[0] || l[0] === 1) {
                return 'osi12';
            } else {
                return fallback(l[0]);
            }
        }
    })(stnInfo.transfer.info.map(val => val.length));

    return (
        <>
            <g transform={`translate(0,${branchElDy})`}>
                <IntTickGroup
                    variant={stnIcon}
                    stnTrans={stnInfo.transfer}
                    stnState={stnState}
                    namePos={namePos}
                    end={
                        stnIcon === 'osi22end'
                            ? stnInfo.parents[0] === 'linestart'
                                ? Direction.left
                                : Direction.right
                            : undefined
                    }
                />
                {stnIcon.includes('osi') && (
                    <OSIName
                        name={stnInfo.transfer.osi_names[0]}
                        stnState={stnState}
                        variant={stnIcon}
                        tickDirec={stnInfo.transfer.tick_direc}
                        namePos={namePos}
                        end={
                            stnIcon === 'osi22end'
                                ? stnInfo.parents[0] === 'linestart'
                                    ? Direction.left
                                    : Direction.right
                                : undefined
                        }
                    />
                )}
            </g>
            <use
                xlinkHref={'#' + stnIcon + branchAffix}
                stroke={stnState === -1 ? 'var(--rmg-grey)' : 'var(--rmg-black)'}
                className={stnInfo.transfer.paid_area ? 'rmg-stn__mtr--paid-osi' : 'rmg-stn__mtr--unpaid-osi'}
                transform={
                    `translate(0,${branchDy})` +
                    `scale(${stnInfo.children[0] === 'lineend' ? 1 : -1},${namePos ? -1 : 1})`
                }
            />
            <StationNameWrapper stationName={stnInfo.name} stationState={stnState} />
            <g transform={`translate(0,${branchDy})`}>
                <StationNameGElement
                    name={stnInfo.name}
                    namePos={namePos}
                    stnState={stnState}
                    facility={stnInfo.facility}
                    nameDX={stnIcon === 'osi22' ? (stnInfo.transfer.tick_direc === 'l' ? 3 : -3) : undefined}
                />
            </g>
        </>
    );
};

export default StationMTR;

interface StationNameGElementProps {
    name: Name;
    namePos: boolean;
    stnState: -1 | 0 | 1;
    nameDX?: number;
    facility: Facilities;
}

const StationNameGElement = (props: StationNameGElementProps) => {
    const { name, namePos, stnState, nameDX, facility } = props;
    /**
     * Top (in pixels) of station's Chinese name.
     */
    const NAME_ZH_TOP = -10.8125;
    /**
     * Height (in pixels) of station's Chinese name.
     */
    // const NAME_ZH_HEIGHT = 21.625;
    /**
     * Top (in pixels) of station's English name (1 line).
     */
    const NAME_EN_TOP = -8;
    /**
     * Height (in pixels) of station's English name (1 line).
     */
    const NAME_EN_HEIGHT = 13.21875;
    /**
     * Difference of `y`s of station's Chinese name and English name (1 line). (This number should used as the `dy` of the English `text` element after Chinese `text` elements. )
     */
    const NAME_ZH_EN_GAP = 17;
    /**
     * Height (in pixels) from the top of station's Chinese name to the bottom of English name (1 line).
     */
    const NAME_FULL_HEIGHT = -NAME_ZH_TOP + NAME_ZH_EN_GAP + NAME_EN_HEIGHT + NAME_EN_TOP;
    /**
     * Height (in pixels) of the gap between the centre of the line and the top of station's Chinese name.
     */
    const STN_NAME_LINE_GAP = 14;

    const [bBox, setBBox] = useState({ width: 0, x: 0 } as DOMRect);

    const dy = namePos
        ? STN_NAME_LINE_GAP - NAME_ZH_TOP
        : -STN_NAME_LINE_GAP - NAME_ZH_TOP - NAME_FULL_HEIGHT - (name[1].split('\\').length - 1) * 11;

    const align = !nameDX ? undefined : nameDX > 0 ? Direction.left : Direction.right;
    const osi22DY = !nameDX ? 0 : namePos ? 10 : -10;

    const facilityX = !nameDX
        ? -(bBox.width + 3) / 2
        : nameDX > 0
        ? nameDX + (NAME_FULL_HEIGHT + 2) / 2
        : -(NAME_FULL_HEIGHT + 2) / 2 - bBox.width + nameDX;
    const facilityNameDX =
        facility === Facilities.none
            ? 0
            : !nameDX
            ? (NAME_FULL_HEIGHT + 2 + 3) / 2
            : nameDX < 0
            ? 0
            : NAME_FULL_HEIGHT + 2 + 3 + nameDX;

    return (
        <g
            transform={`translate(0,${dy + osi22DY})`}
            className={`Name ${stnState === -1 ? 'Pass' : stnState === 0 ? 'Current' : 'Future'}`}
        >
            {stnState === 0 && (
                <rect
                    x={bBox.x - 3 + (facilityNameDX === 0 ? 0 : facilityNameDX - 3 - NAME_FULL_HEIGHT)}
                    y={NAME_ZH_TOP - 1}
                    width={bBox.width + 6 + (facilityNameDX === 0 ? 0 : 3 + NAME_FULL_HEIGHT)}
                    height={NAME_FULL_HEIGHT + (name[1].split('\\').length - 1) * 11 + 2}
                    fill="var(--rmg-black)"
                />
            )}
            {facility !== Facilities.none && (
                <use
                    xlinkHref={'#' + facility}
                    fill={stnState === -1 ? 'var(--rmg-grey)' : 'var(--rmg-black)'}
                    x={facilityX}
                    y={NAME_ZH_TOP - 1 + (name[1].split('\\').length - 1) * 5.5}
                />
            )}

            <StationName stnName={name} onUpdate={setBBox} transform={`translate(${facilityNameDX},0)`} align={align} />
        </g>
    );
};

interface IntTickGroupProps {
    variant: string;
    stnTrans: StationTransfer;
    stnState: -1 | 0 | 1;
    namePos: boolean;
    end?: Direction;
}

const IntTickGroup = (props: IntTickGroupProps) => {
    const { variant, stnTrans, stnState, namePos, end } = props;
    switch (variant) {
        case 'int':
            return (
                <g>
                    <IntTick intInfo={stnTrans.info[0][0]} stnState={stnState} rotation={namePos ? 180 : 0} />
                </g>
            );

        case 'osi11':
            return (
                <g transform={`translate(0,${namePos ? -26 : 26})`}>
                    <IntTick intInfo={stnTrans.info[1][0]} stnState={stnState} rotation={namePos ? 180 : 0} />
                </g>
            );
        case 'osi12':
            return (
                <>
                    {stnTrans.info[1].map((intInfo, i) => (
                        <g
                            key={i}
                            transform={`translate(0,${
                                !namePos ? 8 + 18 * (i + 1) : -8 - 18 * (stnTrans.info[1].length - i)
                            })`}
                        >
                            <IntTick
                                intInfo={intInfo}
                                stnState={stnState}
                                rotation={stnTrans.tick_direc === ShortDirection.right ? -90 : 90}
                            />
                        </g>
                    ))}
                </>
            );
        case 'osi22':
            return (
                <>
                    <g>
                        <IntTick
                            intInfo={stnTrans.info[0][0]}
                            stnState={stnState}
                            rotation={namePos ? 0 : 180}
                            nameDX={stnTrans.tick_direc === ShortDirection.right ? 3 : -3}
                        />
                    </g>
                    {stnTrans.info[1].map((intInfo, i) => (
                        <g
                            key={i}
                            transform={`translate(0,${
                                !namePos ? 8 + 18 * (i + 1) : -8 - 18 * (stnTrans.info[1].length - i)
                            })`}
                        >
                            <IntTick
                                intInfo={intInfo}
                                stnState={stnState}
                                rotation={stnTrans.tick_direc === ShortDirection.right ? -90 : 90}
                            />
                        </g>
                    ))}
                </>
            );
        case 'osi22end':
            return (
                <>
                    <g>
                        <IntTick intInfo={stnTrans.info[0][0]} stnState={stnState} rotation={namePos ? 180 : 0} />
                    </g>
                    {stnTrans.info[1].map((intInfo, i) => (
                        <g
                            key={i}
                            transform={`translate(${end === Direction.left ? -41 : 41},${
                                namePos ? 18 * i : -18 * (stnTrans.info[1].length - 1 - i)
                            })`}
                        >
                            <IntTick
                                intInfo={intInfo}
                                stnState={stnState}
                                rotation={end === Direction.left ? 90 : -90}
                            />
                        </g>
                    ))}
                </>
            );
        default:
            if (variant.includes('int')) {
                return (
                    <>
                        {stnTrans.info[0].map((intInfo, i) => (
                            <g
                                key={i}
                                style={{
                                    transform: `translateY(${
                                        !namePos ? 18 * (i + 1) : -18 * (stnTrans.info[0].length - i)
                                    }px)`,
                                }}
                            >
                                <IntTick
                                    intInfo={intInfo}
                                    stnState={stnState}
                                    rotation={stnTrans.tick_direc === ShortDirection.right ? -90 : 90}
                                />
                            </g>
                        ))}
                    </>
                );
            } else {
                return <></>;
            }
    }
};

interface IntTickProps {
    intInfo: InterchangeInfo;
    stnState: -1 | 0 | 1;
    rotation: 0 | 90 | 180 | -90;
    nameDX?: number;
}

const IntTick = (props: IntTickProps) => {
    const { intInfo, stnState, rotation, nameDX } = props;

    const nameZHLns = intInfo[4].split('\\').length;
    const nameENLns = intInfo[5].split('\\').length;

    const x = (rotation => {
        switch (rotation) {
            case 90:
                return -24;
            case -90:
                return 24;
            default:
                return 0;
        }
    })(rotation);

    const y = (rotation => {
        switch (rotation) {
            case 0:
                return 25 + 5.953125;
            case 180:
                return -25 + 5.953125 - 18.65625 - 10 * (nameZHLns - 1) - 7 * (nameENLns - 1);
            default:
                return 5.953125 - (19.65625 + 10 * (nameZHLns - 1) + 7 * (nameENLns - 1) - 1) / 2;
        }
    })(rotation);

    const textAnchor = (rotation => {
        switch (rotation) {
            case 90:
                return 'end';
            case -90:
                return 'start';
            default:
                if (!nameDX) {
                    return 'middle';
                } else if (nameDX > 0) {
                    return 'start';
                } else {
                    return 'end';
                }
        }
    })(rotation);

    return useMemo(
        () => (
            <>
                <use
                    xlinkHref="#inttick"
                    stroke={intInfo[2]}
                    transform={`rotate(${rotation})`}
                    className={'rmg-line rmg-line__mtr rmg-line__change' + (stnState === -1 ? ' rmg-line__pass' : '')}
                />
                <g
                    textAnchor={textAnchor}
                    transform={`translate(${x + (nameDX || 0)},${y})`}
                    className={`Name ${stnState === -1 ? 'Pass' : 'Future'}`}
                >
                    {intInfo[4].split('\\').map((txt, i) => (
                        <text key={i} className="rmg-name__zh IntName" dy={10 * i}>
                            {txt}
                        </text>
                    ))}
                    {intInfo[5].split('\\').map((txt, i) => (
                        <text key={nameZHLns + i} className="rmg-name__en IntName" dy={nameZHLns * 10 - 1 + 7 * i}>
                            {txt}
                        </text>
                    ))}
                </g>
            </>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [intInfo.toString(), rotation, stnState]
    );
};

interface OSINameProps {
    name: Name;
    stnState: -1 | 0 | 1;
    variant: string;
    tickDirec: ShortDirection;
    namePos: boolean;
    end?: Direction;
}

const OSIName = (props: OSINameProps) => {
    const { name, stnState, variant, tickDirec, namePos, end } = props;

    const textAnchor = (variant => {
        switch (variant) {
            case 'osi11':
                return tickDirec === ShortDirection.left ? 'end' : 'start';
            case 'osi22':
                return tickDirec === ShortDirection.left ? 'start' : 'end';
            default:
                return 'middle';
        }
    })(variant);

    const x = (variant => {
        switch (variant) {
            case 'osi11':
                return tickDirec === ShortDirection.left ? -13 : 13;
            case 'osi22':
                return tickDirec === ShortDirection.left ? 13 : -13;
            case 'osi22end':
                return end === Direction.left ? -41 : 41;
            default:
                return 0;
        }
    })(variant);

    const y = (variant => {
        switch (variant) {
            case 'osi11':
                return (
                    (!namePos ? 26 : -26) +
                    8.34375 -
                    25.03125 / 2 -
                    (!namePos ? 0 : 10 * (name?.[1]?.split('\\').length - 1))
                );
            case 'osi12':
                return !namePos
                    ? 26 + 18 + 10 + 8.34375
                    : -(26 + 18 + 10) + 8.34375 - 25.03125 - 10 * (name?.[1]?.split('\\').length - 1);
            case 'osi22':
                return (
                    (!namePos ? 26 - 18 : -8) -
                    (namePos ? 18 + 9 : -27) +
                    8.34375 -
                    25.03125 / 2 -
                    5 * (name?.[1]?.split('\\').length - 1)
                );
            case 'osi22end':
                return !namePos ? 10 + 8.34375 : -10 + 8.34375 - 25.03125 - 10 * (name?.[1]?.split('\\').length - 1);
            default:
                return 0;
        }
    })(variant);

    return (
        <g
            textAnchor={textAnchor}
            transform={`translate(${x},${y})`}
            className={`Name ${stnState === -1 ? 'Pass' : 'Future'}`}
        >
            <text className="rmg-name__zh rmg-name__mtr--osi">{name?.[0]}</text>
            {name?.[1]?.split('\\').map((txt, i) => (
                <text key={i} className="rmg-name__en rmg-name__mtr--osi" dy={12 + 10 * i}>
                    {txt}
                </text>
            ))}
        </g>
    );
};
