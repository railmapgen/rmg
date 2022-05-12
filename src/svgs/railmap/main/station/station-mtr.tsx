import React from 'react';
import { Direction, Name, Position, ShortDirection, StationTransfer } from '../../../../constants/constants';
import { useAppSelector } from '../../../../redux';
import StationNameWrapper from '../../../mtr/station-name/station-name-wrapper';
import StationIcon from '../../../mtr/station-icon';
import InterchangeTick from '../../../mtr/interchange-tick';

interface Props {
    stnId: string;
    stnState: -1 | 0 | 1;
    namePos: boolean;
    stnY?: number;
}

const StationMTR = (props: Props) => {
    const { stnId, stnState, namePos } = props;
    const stnInfo = useAppSelector(store => store.param.stn_list[stnId]);

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
            <g>
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
            <g transform={`scale(${stnInfo.children[0] === 'lineend' ? 1 : -1},${namePos ? -1 : 1})`}>
                <StationIcon
                    withinTransfer={stnInfo.transfer.info[0]?.length}
                    outStationTransfer={stnInfo.transfer.info[1]?.length}
                    isTerminal={stnInfo.parents[0] === 'linestart' || stnInfo.children[0] === 'lineend'}
                    isPassed={stnState === -1}
                    isPaidArea={stnInfo.transfer.paid_area}
                />
            </g>
            <StationNameWrapper
                stationName={stnInfo.name}
                stationState={stnState}
                facility={stnInfo.facility}
                lower={namePos}
                align={
                    stnIcon === 'osi22'
                        ? stnInfo.transfer.tick_direc === ShortDirection.left
                            ? Direction.left
                            : Direction.right
                        : undefined
                }
            />
        </>
    );
};

export default StationMTR;

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
                <InterchangeTick
                    interchangeInfo={stnTrans.info[0][0]}
                    isPassed={stnState === -1}
                    position={namePos ? Position.UP : Position.DOWN}
                />
            );

        case 'osi11':
            return (
                <g transform={`translate(0,${namePos ? -26 : 26})`}>
                    <InterchangeTick
                        interchangeInfo={stnTrans.info[1][0]}
                        isPassed={stnState === -1}
                        position={namePos ? Position.UP : Position.DOWN}
                    />
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
                            <InterchangeTick
                                interchangeInfo={intInfo}
                                isPassed={stnState === -1}
                                position={stnTrans.tick_direc === ShortDirection.right ? Position.RIGHT : Position.LEFT}
                            />
                        </g>
                    ))}
                </>
            );
        case 'osi22':
            return (
                <>
                    <g>
                        <InterchangeTick
                            interchangeInfo={stnTrans.info[0][0]}
                            isPassed={stnState === -1}
                            isRepelled={stnTrans.tick_direc === ShortDirection.right ? Direction.right : Direction.left}
                            position={namePos ? Position.DOWN : Position.UP}
                        />
                    </g>
                    {stnTrans.info[1].map((intInfo, i) => (
                        <g
                            key={i}
                            transform={`translate(0,${
                                !namePos ? 8 + 18 * (i + 1) : -8 - 18 * (stnTrans.info[1].length - i)
                            })`}
                        >
                            <InterchangeTick
                                interchangeInfo={intInfo}
                                isPassed={stnState === -1}
                                position={stnTrans.tick_direc === ShortDirection.right ? Position.RIGHT : Position.LEFT}
                            />
                        </g>
                    ))}
                </>
            );
        case 'osi22end':
            return (
                <>
                    <g>
                        <InterchangeTick
                            interchangeInfo={stnTrans.info[0][0]}
                            isPassed={stnState === -1}
                            position={namePos ? Position.UP : Position.DOWN}
                        />
                    </g>
                    {stnTrans.info[1].map((intInfo, i) => (
                        <g
                            key={i}
                            transform={`translate(${end === Direction.left ? -41 : 41},${
                                namePos ? 18 * i : -18 * (stnTrans.info[1].length - 1 - i)
                            })`}
                        >
                            <InterchangeTick
                                interchangeInfo={intInfo}
                                isPassed={stnState === -1}
                                position={end === Direction.right ? Position.RIGHT : Position.LEFT}
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
                                <InterchangeTick
                                    interchangeInfo={intInfo}
                                    isPassed={stnState === -1}
                                    position={
                                        stnTrans.tick_direc === ShortDirection.right ? Position.RIGHT : Position.LEFT
                                    }
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
