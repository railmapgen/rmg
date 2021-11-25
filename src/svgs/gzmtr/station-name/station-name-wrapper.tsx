import React, { useState } from 'react';
import { Name, StationState } from '../../../constants/constants';
import StationName from './station-name';
import StationSecondaryName from './station-secondary-name';
import ExpressTag from './express-tag';

interface StationNameWrapperProps {
    primaryName: Name;
    secondaryName?: Name;
    stationState: StationState;
    flipped?: boolean;
    express?: boolean;
}

export default function StationNameWrapper(props: StationNameWrapperProps) {
    const { primaryName, secondaryName, stationState, flipped, express } = props;

    const [primaryBBox, setPrimaryBBox] = useState({ width: 0 } as SVGRect);
    const [secondaryBBox, setSecondaryBBox] = useState({ x: 0, width: -20 } as SVGRect);

    const getFill = (state: StationState) => {
        switch (state) {
            case StationState.PASSED:
                return '#aaa';
            case StationState.CURRENT:
                return '#f00';
            case StationState.FUTURE:
                return '#000';
        }
    };

    const primaryNameEnRows = primaryName[1].split('\\').length;
    const translates = {
        g: {
            x: 0,
            y: flipped ? 17.5 : -20 - primaryNameEnRows * 14 * Math.cos(-45),
        },
        StationSecondaryName: {
            x: (primaryBBox.width + secondaryBBox.width / 2 + 10) * (flipped ? -1 : 1),
            y: 2 + 5 * (primaryNameEnRows - 1),
        },
        ExpressTag: {
            x: (primaryBBox.width + secondaryBBox.width + 20 + 35) * (flipped ? -1 : 1),
            y: 2 + 5 * (primaryNameEnRows - 1),
        },
    };

    return (
        <g
            textAnchor={flipped ? 'end' : 'start'}
            fill={getFill(stationState)}
            transform={`translate(${translates.g.x},${translates.g.y})rotate(-45)`}
        >
            <StationName stnName={primaryName} onUpdate={setPrimaryBBox} />

            {secondaryName && (
                <StationSecondaryName
                    stnName={secondaryName}
                    onUpdate={setSecondaryBBox}
                    passed={stationState === StationState.PASSED}
                    transform={`translate(${translates.StationSecondaryName.x},${translates.StationSecondaryName.y})`}
                />
            )}

            {express && (
                <ExpressTag
                    passed={stationState === StationState.PASSED}
                    transform={`translate(${translates.ExpressTag.x},${translates.ExpressTag.y})`}
                />
            )}
        </g>
    );
}
