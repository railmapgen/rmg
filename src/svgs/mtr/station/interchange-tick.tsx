import React, { memo } from 'react';
import { Direction, ExtendedInterchangeInfo, Position } from '../../../constants/constants';

interface InterchangeTickProps {
    interchangeInfo: ExtendedInterchangeInfo;
    isPassed?: boolean;
    position: Position;
    repel?: Direction; // osi22
    repelOffset?: number;
}

function InterchangeTick(props: InterchangeTickProps) {
    const {
        interchangeInfo: { theme, name, facility },
        isPassed,
        position,
        repel,
        repelOffset,
    } = props;

    const zhNameParts = name[0].split('\\');
    const enNameParts = name[1].split('\\');
    const extraHeights = 10 * (zhNameParts.length - 1) + 7 * (enNameParts.length - 1);
    const repelDX = (repel === Direction.left ? -1 : repel === Direction.right ? 1 : 0) * (repelOffset ?? 3);

    const textAnchor =
        position === Position.LEFT || repel === Direction.left
            ? 'end'
            : position === Position.RIGHT || repel === Direction.right
            ? 'start'
            : facility
            ? 'start'
            : 'middle';

    const transforms = {
        [Position.LEFT]: {
            path: { rotate: 90 },
            use: { x: -32, y: -8 },
            g: {
                x: (facility ? -42 : -24) + repelDX,
                y: 6 - (20 + extraHeights - 1) / 2,
            },
        },
        [Position.RIGHT]: {
            path: { rotate: -90 },
            use: { x: 32, y: -8 },
            g: {
                x: (facility ? 42 : 24) + repelDX,
                y: 6 - (20 + extraHeights - 1) / 2,
            },
        },
        [Position.UP]: {
            path: { rotate: 180 },
            use: { x: 0, y: -41 },
            g: {
                x: (facility ? (repel === Direction.left ? -14 : repel === Direction.right ? 14 : 10) : 0) + repelDX,
                y: -36 - extraHeights,
            },
        },
        [Position.DOWN]: {
            path: { rotate: 0 },
            use: { x: 0, y: 26 },
            g: {
                x: (facility ? (repel === Direction.left ? -14 : repel === Direction.right ? 14 : 10) : 0) + repelDX,
                y: 31,
            },
        },
    }[position];

    return (
        <>
            <path
                d="M0,0v17"
                strokeLinecap="round"
                stroke={isPassed ? 'var(--rmg-grey)' : theme?.[2]}
                strokeWidth={8}
                transform={`rotate(${transforms.path.rotate})`}
            />
            {facility && (
                <use
                    xlinkHref={'#' + facility}
                    fill={isPassed ? 'var(--rmg-grey)' : 'var(--rmg-black)'}
                    transform={`translate(${transforms.use.x},${transforms.use.y})scale(0.45)`}
                />
            )}
            <g
                textAnchor={textAnchor}
                transform={`translate(${transforms.g.x},${transforms.g.y})`}
                fill={isPassed ? 'var(--rmg-grey)' : 'var(--rmg-black)'}
            >
                {zhNameParts.map((txt, i) => (
                    <text key={i} dy={10 * i} className="rmg-name__zh" fontSize={10}>
                        {txt}
                    </text>
                ))}
                {enNameParts.map((txt, j) => (
                    <text
                        key={zhNameParts.length + j}
                        dy={zhNameParts.length * 10 - 1 + 7 * j}
                        className="rmg-name__en"
                        fontSize={7}
                    >
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
        JSON.stringify(prevProps.interchangeInfo) === JSON.stringify(nextProps.interchangeInfo) &&
        prevProps.isPassed === nextProps.isPassed &&
        prevProps.position === nextProps.position &&
        prevProps.repel === nextProps.repel
);
