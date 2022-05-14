import React from 'react';

interface StationIconProps {
    withinTransfer: number;
    outStationTransfer: number;
    isTerminal?: boolean;
    isPassed: boolean;
    isPaidArea?: boolean;
}

export default function StationIcon(props: StationIconProps) {
    const { withinTransfer, outStationTransfer, isTerminal, isPassed, isPaidArea } = props;

    const transforms = {
        icon: {
            v: withinTransfer <= 1 ? 0 : 18 * withinTransfer,
        },
        osiIcon: {
            v: 18 * (outStationTransfer - 1),
            x: isTerminal && withinTransfer ? 41 : 0,
            y: isTerminal && withinTransfer ? 0 : 26,
            scaleY: isTerminal && withinTransfer ? -1 : 1,
        },
    };

    return (
        <g stroke={isPassed ? 'var(--rmg-grey)' : 'var(--rmg-black)'} data-testid="station-icon-wrapper">
            {outStationTransfer && (
                <path
                    d={isTerminal && withinTransfer ? 'M0,0H41' : 'M0,0V26'}
                    strokeWidth={2.69}
                    strokeDasharray={isPaidArea ? 0 : 2.5}
                />
            )}

            <path
                d={`M-8,0 v${transforms.icon.v} a8,8 0 0,0 16,0 v-${transforms.icon.v} a8,8 0 0,0 -16,0Z`}
                className="rmg-stn__mtr"
            />

            {outStationTransfer && (
                <path
                    d={`M-8,0 v${transforms.osiIcon.v} a8,8 0 0,0 16,0 v-${transforms.osiIcon.v} a8,8 0 0,0 -16,0Z`}
                    className="rmg-stn__mtr"
                    transform={`translate(${transforms.osiIcon.x},${transforms.osiIcon.y})scale(1,${transforms.osiIcon.scaleY})`}
                />
            )}
        </g>
    );
}
