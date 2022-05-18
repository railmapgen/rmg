import React, { memo } from 'react';
import { Direction, InterchangeInfo, Position } from '../../../constants/constants';

const getRotation = (position: Position): number => {
    switch (position) {
        case Position.UP:
            return 180;
        case Position.DOWN:
            return 0;
        case Position.LEFT:
            return 90;
        case Position.RIGHT:
            return -90;
    }
};

interface InterchangeTickProps {
    interchangeInfo: InterchangeInfo;
    isPassed?: boolean;
    position: Position;
    repel?: Direction; // osi22
}

function InterchangeTick(props: InterchangeTickProps) {
    const { interchangeInfo, isPassed, position, repel } = props;

    const zhNameLines = interchangeInfo[4].split('\\').length;
    const enNameLines = interchangeInfo[5].split('\\').length;

    const textAnchor =
        position === Position.LEFT || repel === Direction.left
            ? 'end'
            : position === Position.RIGHT || repel === Direction.right
            ? 'start'
            : 'middle';

    const transforms = {
        path: {
            rotate: getRotation(position),
        },
        g: {
            x:
                (position === Position.LEFT ? -24 : position === Position.RIGHT ? 24 : 0) +
                (repel === Direction.left ? -3 : repel === Direction.right ? 3 : 0),
            y:
                position === Position.UP
                    ? -37 - 10 * (zhNameLines - 1) - 7 * (enNameLines - 1)
                    : position === Position.DOWN
                    ? 31
                    : 6 - (20 + 10 * (zhNameLines - 1) + 7 * (enNameLines - 1) - 1) / 2,
        },
    };

    return (
        <>
            <path
                d="M0,0v17"
                strokeLinecap="round"
                stroke={isPassed ? 'var(--rmg-grey)' : interchangeInfo[2]}
                strokeWidth={8}
                transform={`rotate(${transforms.path.rotate})`}
            />
            <g
                textAnchor={textAnchor}
                transform={`translate(${transforms.g.x},${transforms.g.y})`}
                fill={isPassed ? 'var(--rmg-grey)' : 'var(--rmg-black)'}
            >
                {interchangeInfo[4].split('\\').map((txt, i) => (
                    <text key={i} dy={10 * i} className="rmg-name__zh" fontSize={10}>
                        {txt}
                    </text>
                ))}
                {interchangeInfo[5].split('\\').map((txt, j) => (
                    <text key={zhNameLines + j} dy={zhNameLines * 10 - 1 + 7 * j} className="rmg-name__en" fontSize={7}>
                        {txt}
                    </text>
                ))}
            </g>
        </>
    );
}

export default memo(
    InterchangeTick,
    (prevProps, nextProps) =>
        prevProps.interchangeInfo.toString() === nextProps.interchangeInfo.toString() &&
        prevProps.isPassed === nextProps.isPassed &&
        prevProps.position === nextProps.position &&
        prevProps.repel === nextProps.repel
);
