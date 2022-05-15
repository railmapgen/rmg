import React from 'react';
import { Direction, Name, Position, ShortDirection, StationTransfer } from '../../../../constants/constants';
import { useAppSelector } from '../../../../redux';
import StationNameWrapper from '../../../mtr/station-name/station-name-wrapper';
import StationIcon from '../../../mtr/station-icon';
import InterchangeTick from '../../../mtr/interchange-tick';
import OsiStation from '../../../mtr/osi-station';

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
                    osiName={stnInfo.transfer.osi_names[0]}
                />
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
    osiName?: Name;
}

const IntTickGroup = (props: IntTickGroupProps) => {
    const { variant, stnTrans, stnState, namePos, end, osiName } = props;
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
        case 'osi12':
            return (
                <g transform={`translate(0,${!namePos ? 26 : -26})`}>
                    <OsiStation
                        interchangeInfoList={stnTrans.info[1]}
                        direction={stnTrans.tick_direc === ShortDirection.right ? Direction.right : Direction.left}
                        stationName={osiName}
                        isPassed={stnState === -1}
                        isReverse={namePos}
                    />
                </g>
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
                    <g transform={`translate(0,${!namePos ? 26 : -26})`}>
                        <OsiStation
                            interchangeInfoList={stnTrans.info[1]}
                            direction={stnTrans.tick_direc === ShortDirection.right ? Direction.right : Direction.left}
                            stationName={osiName}
                            isPassed={stnState === -1}
                            isReverse={namePos}
                        />
                    </g>
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
                    <g transform={`translate(${end === Direction.left ? -41 : 41},0)`}>
                        <OsiStation
                            interchangeInfoList={stnTrans.info[1]}
                            direction={end === Direction.right ? Direction.right : Direction.left}
                            stationName={osiName}
                            isPassed={stnState === -1}
                            isReverse={!namePos}
                            isTerminal={true}
                        />
                    </g>
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
