import React from 'react';
import { Direction, InterchangeInfo, Position } from '../../constants/constants';
import InterchangeTick from './interchange-tick';

interface InterchangeStationProps {
    interchangeInfoList: InterchangeInfo[];
    direction?: Direction;
    isPassed?: boolean;
    isReverse?: boolean;
    repel?: Direction;
}

export default function InterchangeStation(props: InterchangeStationProps) {
    const { interchangeInfoList, direction, isPassed, isReverse, repel } = props;

    const transforms = {
        icon: {
            v: interchangeInfoList.length <= 1 ? 0 : 18 * interchangeInfoList.length,
            scaleY: isReverse ? -1 : 1,
        },
    };

    return (
        <g>
            {interchangeInfoList.length === 1 && (
                <InterchangeTick
                    interchangeInfo={interchangeInfoList[0]}
                    isPassed={isPassed}
                    position={isReverse ? Position.UP : Position.DOWN}
                    repel={repel}
                />
            )}

            {interchangeInfoList.length > 1 &&
                interchangeInfoList.map((info, i) => (
                    <g key={i} transform={`translate(0,${isReverse ? -18 * (i + 1) : 18 * (i + 1)})`}>
                        <InterchangeTick
                            interchangeInfo={info}
                            isPassed={isPassed}
                            position={direction === Direction.right ? Position.RIGHT : Position.LEFT}
                        />
                    </g>
                ))}

            <path
                d={`M-8,0 v${transforms.icon.v} a8,8 0 0,0 16,0 v-${transforms.icon.v} a8,8 0 0,0 -16,0Z`}
                className="rmg-stn__mtr"
                stroke={isPassed ? 'var(--rmg-grey)' : 'var(--rmg-black)'}
                transform={`scale(1,${transforms.icon.scaleY})`}
            />
        </g>
    );
}
