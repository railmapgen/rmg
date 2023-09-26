import React, { SVGProps, useState } from 'react';
import { Direction, Facilities, Name, StationState } from '../../../../constants/constants';
import StationName from './station-name';

/**
 * Top (in pixels) of station's Chinese name.
 */
const NAME_ZH_TOP = -10.8125;
/**
 * Height (in pixels) of station's Chinese name.
 */
// const NAME_ZH_HEIGHT = 21.625;
/**
 * Top (in pixels) of station's English name (1 line).
 */
const NAME_EN_TOP = -8;
/**
 * Height (in pixels) of station's English name (1 line).
 */
const NAME_EN_HEIGHT = 13.21875;
/**
 * Difference of `y`s of station's Chinese name and English name (1 line). (This number should use as the `dy` of the English `text` element after Chinese `text` elements. )
 */
const NAME_ZH_EN_GAP = 16;
/**
 * Height (in pixels) from the top of station's Chinese name to the bottom of English name (1 line).
 */
export const NAME_FULL_HEIGHT = -NAME_ZH_TOP + NAME_ZH_EN_GAP + NAME_EN_HEIGHT + NAME_EN_TOP;
/**
 * Height (in pixels) of the gap between the centre of the line and the top of station's Chinese name.
 */
const STN_NAME_LINE_GAP = 14;

interface StationNameWrapperProps extends SVGProps<SVGGElement> {
    stationName: Name;
    stationState: StationState;
    facility?: Facilities;
    lower?: boolean;
    align?: Direction;
}

export default function StationNameWrapper(props: StationNameWrapperProps) {
    const { stationName, stationState, lower, align, facility, ...others } = props;

    /**
     * align = undefined: { x: -40, width: 80 }
     * align = left: { x: 0, width: 80 }
     * align = right: { x: -80, width: 80 }
     */
    const [bBox, setBBox] = useState({ x: 0, width: 0 } as SVGRect);

    const getFill = (state: StationState) => {
        switch (state) {
            case StationState.PASSED:
                return 'var(--rmg-grey)';
            case StationState.CURRENT:
                return '#fff';
            case StationState.FUTURE:
                return 'var(--rmg-black)';
        }
    };

    const nameEnRows = stationName[1].split('\\').length;
    const transforms = {
        g: {
            x: align ? (align === Direction.right ? -3 : 3) : 0,
            y:
                (lower
                    ? STN_NAME_LINE_GAP - NAME_ZH_TOP
                    : -STN_NAME_LINE_GAP - NAME_ZH_TOP - NAME_FULL_HEIGHT - 11 * (nameEnRows - 1)) +
                (align ? (lower ? 10 : -10) : 0),
        },
        rect: {
            x:
                bBox.x -
                3 +
                (!facility
                    ? 0
                    : align
                    ? align === Direction.right
                        ? -3 - NAME_FULL_HEIGHT
                        : 0
                    : (NAME_FULL_HEIGHT + 5) / 2 - 3 - NAME_FULL_HEIGHT),
            y: NAME_ZH_TOP - 1,
            width: bBox.width + 6 + (!facility ? 0 : NAME_FULL_HEIGHT + 3),
            height: NAME_FULL_HEIGHT + 2 + 11 * (nameEnRows - 1),
        },
        use: {
            x: align
                ? align === Direction.right
                    ? -(NAME_FULL_HEIGHT + 2) / 2 - bBox.width - 3
                    : (NAME_FULL_HEIGHT + 2) / 2 - 2
                : -(bBox.width + 3) / 2,
            y: NAME_ZH_TOP - 1 + 5.5 * (nameEnRows - 1),
        },
        StationName: {
            x: !facility
                ? 0
                : align
                ? align === Direction.right
                    ? 0
                    : NAME_FULL_HEIGHT + 3
                : (NAME_FULL_HEIGHT + 5) / 2,
            y: 0,
        },
    };

    return (
        <g {...others}>
            <g fill={getFill(stationState)} transform={`translate(${transforms.g.x},${transforms.g.y})`}>
                {stationState === StationState.CURRENT && (
                    <rect
                        x={transforms.rect.x}
                        y={transforms.rect.y}
                        width={transforms.rect.width}
                        height={transforms.rect.height}
                        fill="var(--rmg-black)"
                    />
                )}

                {facility && (
                    <use
                        xlinkHref={`#${facility}`}
                        fill={stationState === StationState.PASSED ? 'var(--rmg-grey)' : 'var(--rmg-black)'}
                        x={transforms.use.x}
                        y={transforms.use.y}
                    />
                )}

                <g transform={`translate(${transforms.StationName.x},${transforms.StationName.y})`}>
                    <StationName stnName={stationName} onUpdate={setBBox} align={align} />
                </g>
            </g>
        </g>
    );
}
