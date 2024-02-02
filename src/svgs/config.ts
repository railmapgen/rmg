import { RmgStyle } from '../constants/constants';

type StyleConfig = {
    components: () => Promise<any>;
    fonts?: string[];
};

export const STYLE_CONFIG: Record<RmgStyle, StyleConfig> = {
    mtr: {
        components: () => import('./mtr'),
        fonts: ['Myriad Pro', 'Vegur', 'GenYoMin TW'],
    },
    gzmtr: {
        components: () => import('./gzmtr'),
    },
    shmetro: {
        components: () => import('./shmetro'),
    },
};
