import React from 'react';
import { Direction, InterchangeInfo, Name, Position } from '../../constants/constants';
import InterchangeTick from './interchange-tick';

interface OsiStationProps {
    interchangeInfoList: InterchangeInfo[];
    direction: Direction;
    isPassed?: boolean;
    isReverse?: boolean;
    isTerminal?: boolean;
    stationName?: Name;
}

export default function OsiStation(props: OsiStationProps) {
    const { interchangeInfoList, direction, isPassed, isReverse, isTerminal, stationName } = props;

    const enNameLines = stationName?.[1]?.split('\\')?.length ?? 1;

    const transforms = {
        icon: {
            v: 18 * (interchangeInfoList.length - 1),
            scaleY: isReverse ? -1 : 1,
        },
        name: {
            x: isTerminal
                ? 0
                : interchangeInfoList.length === 1
                ? direction === Direction.left
                    ? -13
                    : 13
                : direction === Direction.left
                ? 13
                : -13,
            y: isTerminal
                ? isReverse
                    ? 19
                    : -28
                : -4 + (isReverse ? -9 : 9) * (interchangeInfoList.length - 1) - 5 * (enNameLines - 1),
        },
    };

    return (
        <g>
            {interchangeInfoList.map((info, i, arr) => (
                <g key={i} transform={`translate(0,${isReverse ? -18 * i : 18 * i})`}>
                    <InterchangeTick
                        interchangeInfo={info}
                        isPassed={isPassed}
                        position={
                            arr.length === 1
                                ? isReverse
                                    ? Position.UP
                                    : Position.DOWN
                                : direction === Direction.right
                                ? Position.RIGHT
                                : Position.LEFT
                        }
                    />
                </g>
            ))}

            <path
                d={`M-8,0 v${transforms.icon.v} a8,8 0 0,0 16,0 v-${transforms.icon.v} a8,8 0 0,0 -16,0Z`}
                className="rmg-stn__mtr"
                stroke={isPassed ? 'var(--rmg-grey)' : 'var(--rmg-black)'}
                transform={`scale(1,${transforms.icon.scaleY})`}
            />

            <g
                textAnchor={transforms.name.x === 0 ? 'middle' : transforms.name.x > 0 ? 'start' : 'end'}
                fill={isPassed ? 'var(--rmg-grey)' : 'var(--rmg-black)'}
                transform={`translate(${transforms.name.x},${transforms.name.y})`}
            >
                <text className="rmg-name__zh" fontSize={14}>
                    {stationName?.[0]}
                </text>
                {stationName?.[1]?.split('\\')?.map((txt, i) => (
                    <text key={i} className="rmg-name__en" fontSize={9} dy={12 + 10 * i}>
                        {txt}
                    </text>
                ))}
            </g>
        </g>
    );
}
