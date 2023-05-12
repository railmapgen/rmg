import { CanvasType } from '../../constants/constants';
import { ReactNode } from 'react';
import DestinationMTR from './destination-mtr';
import RailMapMTR from './railmap-mtr';

const mtrSvgs: Partial<Record<CanvasType, ReactNode>> = {
    destination: <DestinationMTR />,
    railmap: <RailMapMTR />,
};

export default mtrSvgs;
