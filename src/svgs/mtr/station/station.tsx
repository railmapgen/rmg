import React from 'react';
import { Direction, ShortDirection, StationState } from '../../../constants/constants';
import InterchangeStation from './interchange-station';
import { useAppSelector } from '../../../redux';
import OsiStation from './osi-station';
import StationNameWrapper from './station-name/station-name-wrapper';

interface StationProps {
    stationId: string;
    stationState: StationState;
    isReversed: boolean; // reverse = up
}

export default function Station(props: StationProps) {
    const { stationId, stationState, isReversed } = props;

    const {
        name,
        parents,
        children,
        transfer: { info, tick_direc, osi_names, paid_area },
        facility,
    } = useAppSelector(state => state.param.stn_list[stationId]);

    const end: Direction | undefined = info[0]?.length
        ? parents.includes('linestart')
            ? Direction.left
            : children.includes('lineend')
            ? Direction.right
            : undefined
        : undefined;
    const isRepelled = Boolean(info[1]?.length && !end);

    const transforms = {
        link: {
            scaleX: end === Direction.left ? -1 : 1,
            scaleY: isReversed ? -1 : 1,
        },
        osi: {
            x: end ? (end === Direction.left ? -41 : 41) : 0,
            y: end ? 0 : !isReversed ? 26 : -26,
        },
    };

    return (
        <g data-testid="station-icon-wrapper">
            {info[1]?.length && (
                <path
                    d={end && info[0]?.length ? 'M0,0H41' : 'M0,0V26'}
                    strokeWidth={2.69}
                    strokeDasharray={paid_area ? 0 : 2.5}
                    stroke={stationState === StationState.PASSED ? 'var(--rmg-grey)' : 'var(--rmg-black)'}
                    transform={`scale(${transforms.link.scaleX},${transforms.link.scaleY})`}
                />
            )}

            <InterchangeStation
                interchangeInfoList={info[0]}
                direction={tick_direc === ShortDirection.right ? Direction.right : Direction.left}
                isPassed={stationState === StationState.PASSED}
                isReversed={!end && info[1]?.length ? !isReversed : isReversed}
                repel={
                    isRepelled ? (tick_direc === ShortDirection.right ? Direction.right : Direction.left) : undefined
                }
            />

            {info[1]?.length && (
                <g transform={`translate(${transforms.osi.x},${transforms.osi.y})`}>
                    <OsiStation
                        interchangeInfoList={info[1]}
                        direction={end ? end : tick_direc === ShortDirection.right ? Direction.right : Direction.left}
                        stationName={osi_names[0]}
                        isPassed={stationState === StationState.PASSED}
                        isReversed={end ? !isReversed : isReversed}
                        isTerminal={Boolean(end)}
                    />
                </g>
            )}

            <StationNameWrapper
                stationName={name}
                stationState={stationState}
                facility={facility}
                lower={isReversed}
                align={
                    info[0]?.length && isRepelled
                        ? tick_direc === ShortDirection.left
                            ? Direction.left
                            : Direction.right
                        : undefined
                }
            />
        </g>
    );
}
