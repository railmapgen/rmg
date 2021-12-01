import React, { useState } from 'react';
import { Facilities, Name, StationState } from '../../../constants/constants';
import StationName from './station-name';

interface StationNameWrapperProps {
    stationName: Name;
    stationState: StationState;
    lower?: boolean;
    facility?: Facilities;
}

export default function StationNameWrapper(props: StationNameWrapperProps) {
    const { stationName, stationState, lower, facility } = props;

    const [bBox, setBBox] = useState({ x: 0, width: 0 } as SVGRect);

    return (
        <g>
            <StationName stnName={stationName} onUpdate={setBBox} />
        </g>
    );
}
