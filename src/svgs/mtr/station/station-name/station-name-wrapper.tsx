import { SVGProps, useEffect, useRef, useState } from 'react';
import { Direction, Facilities, StationState } from '../../../../constants/constants';
import StationName from './station-name';
import { Translation } from '@railmapgen/rmg-translate';

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
 * This is also the width and height of the facility icon.
 */
export const NAME_FULL_HEIGHT = -NAME_ZH_TOP + NAME_ZH_EN_GAP + NAME_EN_HEIGHT + NAME_EN_TOP;
/**
 * Height (in pixels) of the gap between the centre of the line and the top of station's Chinese name.
 */
const STN_NAME_LINE_GAP = 14;
const MULTI_INTERCHANGES_EXTRA_GAP = 11;

interface StationNameWrapperProps extends SVGProps<SVGGElement> {
    stationName: Translation;
    stationState: StationState;
    facility?: Facilities;
    lower?: boolean;
    align?: Direction;
    interchangeCount?: number;
}

export default function StationNameWrapper(props: StationNameWrapperProps) {
    const { stationName, stationState, lower, align, facility, interchangeCount = 0, ...others } = props;

    /**
     * align = undefined: { x: -40, width: 80 }
     * align = left: { x: 0, width: 80 }
     * align = right: { x: -80, width: 80 }
     */
    const [bBox, setBBox] = useState({ x: 0, width: 0 } as SVGRect);
    const [gBBox, setGBBox] = useState({ x: 0, y: 0, height: 0, width: 0 } as SVGRect);
    const gRef = useRef<SVGGElement>(null);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (gRef.current) {
                setGBBox(gRef.current.getBBox());
            }
        }, 100);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [gRef.current, bBox, facility, align, interchangeCount]);

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

    const nameEnRows = stationName.en?.split('\\')?.length ?? 1;
    const transforms = {
        g: {
            x: align ? (align === Direction.right ? -3 : 3) : 0,
            y:
                (lower ? STN_NAME_LINE_GAP - NAME_ZH_TOP : -STN_NAME_LINE_GAP - NAME_ZH_TOP - gBBox.height) +
                (align ? (lower ? 10 : -10) : 0),
        },
        use: {
            x:
                align === Direction.right
                    ? -(NAME_FULL_HEIGHT + 2) / 2 -
                      bBox.width -
                      3 -
                      (interchangeCount > 1 ? MULTI_INTERCHANGES_EXTRA_GAP : 0)
                    : align === Direction.left
                      ? (NAME_FULL_HEIGHT + 2) / 2 - 2 + (interchangeCount > 1 ? MULTI_INTERCHANGES_EXTRA_GAP : 0)
                      : -(bBox.width + 3) / 2,
            y: NAME_ZH_TOP - 1 + 5.5 * (nameEnRows - 1),
        },
        StationName: {
            x:
                align === Direction.right
                    ? interchangeCount > 1
                        ? -MULTI_INTERCHANGES_EXTRA_GAP
                        : 0
                    : align === Direction.left
                      ? (interchangeCount > 1 ? MULTI_INTERCHANGES_EXTRA_GAP : 0) +
                        (facility ? NAME_FULL_HEIGHT + 3 : 0)
                      : facility
                        ? (NAME_FULL_HEIGHT + 5) / 2
                        : 0,
            y: 0,
        },
    };
    return (
        <g fill={getFill(stationState)} transform={`translate(${transforms.g.x},${transforms.g.y})`} {...others}>
            {stationState === StationState.CURRENT && (
                <rect
                    x={gBBox.x - 3}
                    y={gBBox.y - 1}
                    width={gBBox.width + 6}
                    height={gBBox.height + 2}
                    fill="var(--rmg-black)"
                />
            )}

            <g ref={gRef}>
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
