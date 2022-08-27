import { CanvasType } from '../../constants/constants';
import { ReactNode } from 'react';
import DestinationSHMetro from '../destination/destination-shmetro';
import RunInSHMetro from '../runin/runin-shmetro';
import RailMapSHMetro from '../railmap/railmap-shmetro';
import IndoorSHMetro from '../indoor/indoor-shmetro';

const shmetroSvgs: Partial<Record<CanvasType, ReactNode>> = {
    destination: <DestinationSHMetro />,
    runin: <RunInSHMetro />,
    railmap: <RailMapSHMetro />,
    indoor: <IndoorSHMetro />,
};

export default shmetroSvgs;
