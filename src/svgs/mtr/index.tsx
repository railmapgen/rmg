import { CanvasType } from '../../constants/constants';
import { ReactNode } from 'react';
import DestinationMTR from './destination-mtr';
import RailMapMTR from './railmap-mtr';
import { FONTS } from './station/station-name/station-name';

const mtrSvgs: Partial<Record<CanvasType, ReactNode>> = {
    destination: <DestinationMTR />,
    railmap: <RailMapMTR />,
};

export const mtrFonts = FONTS;

export default mtrSvgs;
