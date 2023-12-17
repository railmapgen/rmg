import React from 'react';
import { Direction, InterchangeGroup, Position } from '../../../constants/constants';
import InterchangeTick from './interchange-tick';
import StationIcon from './station-icon';

interface OsiStationProps {
    interchangeGroup: InterchangeGroup;
    direction: Direction;
    isPassed?: boolean;
    isReversed?: boolean;
    isTerminal?: boolean;
}

export default function OsiStation(props: OsiStationProps) {
    const {
        interchangeGroup: { name, lines },
        direction,
        isPassed,
        isReversed,
        isTerminal,
    } = props;

    const enNameLines = name?.[1]?.split('\\')?.length ?? 1;

    const iconLength = 18 * ((lines?.length || 0) - 1);
    const transforms = {
        name: {
            x: isTerminal
                ? 0
                : lines?.length === 1
                  ? direction === Direction.left
                      ? -13
                      : 13
                  : direction === Direction.left
                    ? 13
                    : -13,
            y: isTerminal
                ? isReversed
                    ? 19
                    : -28
                : -4 + (isReversed ? -9 : 9) * ((lines?.length || 0) - 1) - 5 * (enNameLines - 1),
        },
    };

    return (
        <g>
            {lines?.map((info, i, arr) => (
                <g key={i} transform={`translate(0,${isReversed ? -18 * i : 18 * i})`}>
                    <InterchangeTick
                        interchangeInfo={info}
                        isPassed={isPassed}
                        position={
                            arr.length === 1
                                ? isReversed
                                    ? Position.UP
                                    : Position.DOWN
                                : direction === Direction.right
                                  ? Position.RIGHT
                                  : Position.LEFT
                        }
                        repel={isTerminal ? direction : undefined}
                        repelOffset={isTerminal && arr.length === 1 ? -4 : 0}
                    />
                </g>
            ))}

            <StationIcon length={iconLength} isPassed={isPassed} isReversed={isReversed} />

            <g
                textAnchor={transforms.name.x === 0 ? 'middle' : transforms.name.x > 0 ? 'start' : 'end'}
                fill={isPassed ? 'var(--rmg-grey)' : 'var(--rmg-black)'}
                transform={`translate(${transforms.name.x},${transforms.name.y})`}
            >
                <text className="rmg-name__zh" fontSize={14}>
                    {name?.[0]}
                </text>
                {name?.[1]?.split('\\')?.map((txt, i) => (
                    <text key={i} className="rmg-name__en" fontSize={8.5} dy={13 + 10 * i}>
                        {txt}
                    </text>
                ))}
            </g>
        </g>
    );
}
