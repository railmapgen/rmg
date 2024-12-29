import { RmgStyle } from '../constants/constants';

type StyleConfig = {
    components: () => Promise<any>;
    fonts?: () => Promise<string[]>;
};

export const STYLE_CONFIG: Record<RmgStyle, StyleConfig> = {
    mtr: {
        components: () => import('./mtr'),
        fonts: () => import('./mtr').then(module => module.mtrFonts),
    },
    gzmtr: {
        components: () => import('./gzmtr'),
    },
    shmetro: {
        components: () => import('./shmetro'),
    },
    shsubrwy: {
        components: () => import('./shanghaisuburbanrailway'),
    },
};
