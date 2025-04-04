import { useState } from 'react';
import { StationState, TEMP } from '../../../constants/constants';
import StationName from './station-name';
import StationSecondaryName from './station-secondary-name';
import ExpressTag from './express-tag';
import { Translation } from '@railmapgen/rmg-translate';
import UnderConstructionTag from './under-construction-tag';

interface StationNameWrapperProps {
    primaryName: Translation;
    secondaryName?: Translation;
    stationState: StationState;
    flipped?: boolean;
    express?: boolean;
    underConstruction?: boolean | TEMP;
}

export default function StationNameWrapper(props: StationNameWrapperProps) {
    const { primaryName, secondaryName, stationState, flipped, express, underConstruction } = props;

    const [primaryBBox, setPrimaryBBox] = useState({ width: 0 } as SVGRect);
    const [primaryEnNameBBox, setPrimaryEnNameBBox] = useState({ width: 0 } as SVGRect);
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

    const primaryNameEnRows = primaryName.en?.split('\\')?.length ?? 1;
    const transforms = {
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
        UnderConstructionTag: {
            x: (primaryEnNameBBox.width + 5 + 20) * (flipped ? -1 : 1),
            y: primaryBBox.y + primaryBBox.height - 14,
        },
    };

    return (
        <g
            textAnchor={flipped ? 'end' : 'start'}
            fill={getFill(stationState)}
            transform={`translate(${transforms.g.x},${transforms.g.y})rotate(-45)`}
        >
            <StationName stnName={primaryName} onUpdate={setPrimaryBBox} onEnNameUpdate={setPrimaryEnNameBBox} />

            {secondaryName && (
                <StationSecondaryName
                    stnName={secondaryName}
                    onUpdate={setSecondaryBBox}
                    passed={stationState === StationState.PASSED}
                    transform={`translate(${transforms.StationSecondaryName.x},${transforms.StationSecondaryName.y})`}
                />
            )}

            {express && (
                <ExpressTag
                    passed={stationState === StationState.PASSED}
                    transform={`translate(${transforms.ExpressTag.x},${transforms.ExpressTag.y})`}
                />
            )}

            {underConstruction && (
                <UnderConstructionTag
                    passed={stationState === StationState.PASSED}
                    temporary={underConstruction === 'temp'}
                    transform={`translate(${transforms.UnderConstructionTag.x},${transforms.UnderConstructionTag.y})`}
                />
            )}
        </g>
    );
}
