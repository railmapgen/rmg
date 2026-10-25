// 广州地铁画布集合：注册进站信息与线路图视图。
import { ReactNode } from 'react';
import { CanvasType } from '../../constants/constants';
import RailMapGZMTR from './rail-map/railmap-gzmtr';
import RunInGZMTR from './runin/runin-gzmtr';

const gzmtrSvgs: Partial<Record<CanvasType, ReactNode>> = {
    runin: <RunInGZMTR />,
    railmap: <RailMapGZMTR />,
};

export default gzmtrSvgs;
