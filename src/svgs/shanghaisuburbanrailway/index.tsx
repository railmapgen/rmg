// 上海市域铁路画布集合：注册目的地、进站和站台视图。
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
