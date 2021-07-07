export enum LoadingStatus {
    init = 'init',
    loading = 'loading',
    loaded = 'loaded',
    failed = 'failed',
}

export enum RmgStyle {
    MTR = 'mtr',
    GZMTR = 'gzmtr',
    SHMetro = 'shmetro',
}

export enum CanvasType {
    Destination = 'destination',
    RunIn = 'runin',
    RailMap = 'railmap',
}

export const AllCanvas = 'all';

export const canvasConfig: { [s in RmgStyle]: CanvasType[] } = {
    [RmgStyle.MTR]: [CanvasType.Destination, CanvasType.RailMap],
    [RmgStyle.GZMTR]: [CanvasType.RunIn, CanvasType.RailMap],
    [RmgStyle.SHMetro]: [CanvasType.Destination, CanvasType.RunIn, CanvasType.RailMap],
};

export const PanelTypesGZMTR: PanelTypeGZMTR[] = [
    'gz1',
    'gz2otis',
    'gz28',
    'gz3',
    'gz4',
    'gz1421',
    'gz5',
    'gz6',
    'gzgf',
];

export const PanelTypesShmetro: PanelTypeShmetro[] = ['sh', 'sh2020'];
