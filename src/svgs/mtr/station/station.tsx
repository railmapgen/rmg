import React from 'react';
import { Direction, ShortDirection, StationState } from '../../../constants/constants';
import InterchangeStation from './interchange-station';
import { useRootSelector } from '../../../redux';
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
        transfer: { groups, tick_direc, paid_area },
        facility,
    } = useRootSelector(state => state.param.stn_list[stationId]);

    const end: Direction | undefined = groups[0].lines?.length
        ? parents.includes('linestart')
            ? Direction.left
            : children.includes('lineend')
              ? Direction.right
              : undefined
        : undefined;

    const hasOsi = !!groups[1]?.lines?.length;
    const isRepelled = hasOsi && !end;

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
            {hasOsi && (
                <path
                    d={end && groups[0].lines?.length ? 'M0,0H41' : 'M0,0V26'}
                    strokeWidth={2.69}
                    strokeDasharray={paid_area ? 0 : 2.5}
                    stroke={stationState === StationState.PASSED ? 'var(--rmg-grey)' : 'var(--rmg-black)'}
                    transform={`scale(${transforms.link.scaleX},${transforms.link.scaleY})`}
                />
            )}

            <InterchangeStation
                interchangeInfoList={groups[0].lines ?? []}
                direction={tick_direc === ShortDirection.right ? Direction.right : Direction.left}
                isPassed={stationState === StationState.PASSED}
                isReversed={isRepelled ? !isReversed : isReversed}
                repel={
                    isRepelled ? (tick_direc === ShortDirection.right ? Direction.right : Direction.left) : undefined
                }
            />

            {hasOsi && (
                <g transform={`translate(${transforms.osi.x},${transforms.osi.y})`}>
                    <OsiStation
                        interchangeGroup={groups[1]}
                        direction={end ? end : tick_direc === ShortDirection.right ? Direction.right : Direction.left}
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
                    groups[0].lines?.length && isRepelled
                        ? tick_direc === ShortDirection.left
                            ? Direction.left
                            : Direction.right
                        : undefined
                }
            />
        </g>
    );
}
