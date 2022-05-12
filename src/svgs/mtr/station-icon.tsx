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

    return (
        <g stroke={isPassed ? 'var(--rmg-grey)' : 'var(--rmg-black)'} data-testid="station-icon-wrapper">
            {outStationTransfer && (
                <path
                    d={isTerminal ? 'M0,0H41' : 'M0,0V26'}
                    strokeWidth={2.69}
                    strokeDasharray={isPaidArea ? 0 : 2.5}
                />
            )}

            {withinTransfer <= 1 ? (
                <circle r={8} className="rmg-stn__mtr" />
            ) : (
                <path
                    d={`M-8,0 v${18 * withinTransfer} a8,8 0 0,0 16,0 v-${18 * withinTransfer} a8,8 0 0,0 -16,0Z`}
                    className="rmg-stn__mtr"
                />
            )}

            {outStationTransfer &&
                (outStationTransfer === 1 ? (
                    <circle r={8} cy={26} className="rmg-stn__mtr" />
                ) : (
                    <path
                        d={`M-8,0 v${18 * (outStationTransfer - 1)} a8,8 0 0,0 16,0 v-${
                            18 * (outStationTransfer - 1)
                        } a8,8 0 0,0 -16,0Z`}
                        className="rmg-stn__mtr"
                        transform={`translate(${isTerminal ? 41 : 0},${isTerminal ? -18 : 26})`}
                    />
                ))}
        </g>
    );
}
