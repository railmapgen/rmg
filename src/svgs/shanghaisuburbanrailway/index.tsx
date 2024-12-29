import { ReactNode } from 'react';
import { CanvasType } from '../../constants/constants';
import DestinationSHSuburbanRailway from './destination-shsubrwy';
import PlatformSHSuburbanRailway from './platform-shsubrwy';
import RunInSHSuburbanRailway from './runin-shsubrwy';

const shsubrwySvgs: Partial<Record<CanvasType, ReactNode>> = {
    destination: <DestinationSHSuburbanRailway />,
    runin: <RunInSHSuburbanRailway />,
    platform: <PlatformSHSuburbanRailway />,
};

export default shsubrwySvgs;
