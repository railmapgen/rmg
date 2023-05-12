import React from 'react';
import { Direction, ExtendedInterchangeInfo, Position } from '../../../constants/constants';
import InterchangeTick from './interchange-tick';
import StationIcon from './station-icon';

interface InterchangeStationProps {
    interchangeInfoList: ExtendedInterchangeInfo[];
    direction?: Direction;
    isPassed?: boolean;
    isReversed?: boolean;
    repel?: Direction;
}

export default function InterchangeStation(props: InterchangeStationProps) {
    const { interchangeInfoList, direction, isPassed, isReversed, repel } = props;

    const iconLength = interchangeInfoList.length <= 1 ? 0 : 18 * interchangeInfoList.length;

    return (
        <g>
            {interchangeInfoList.length === 1 && (
                <InterchangeTick
                    interchangeInfo={interchangeInfoList[0]}
                    isPassed={isPassed}
                    position={isReversed ? Position.UP : Position.DOWN}
                    repel={repel}
                />
            )}

            {interchangeInfoList.length > 1 &&
                interchangeInfoList.map((info, i) => (
                    <g key={i} transform={`translate(0,${isReversed ? -18 * (i + 1) : 18 * (i + 1)})`}>
                        <InterchangeTick
                            interchangeInfo={info}
                            isPassed={isPassed}
                            position={direction === Direction.right ? Position.RIGHT : Position.LEFT}
                        />
                    </g>
                ))}

            <StationIcon length={iconLength} isPassed={isPassed} isReversed={isReversed} />
        </g>
    );
}
