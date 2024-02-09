import { CanvasType } from '../../constants/constants';
import { ReactNode } from 'react';
import DestinationMTR from './destination-mtr';
import RailMapMTR from './railmap-mtr';
import { FONTS as StationNameFonts } from './station/station-name/station-name';
import { FONTS as PlatformNumFonts } from './platform-number';

const mtrSvgs: Partial<Record<CanvasType, ReactNode>> = {
    destination: <DestinationMTR />,
    railmap: <RailMapMTR />,
};

export const mtrFonts = [...StationNameFonts, ...PlatformNumFonts];

export default mtrSvgs;
