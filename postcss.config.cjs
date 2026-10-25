// PostCSS 配置：启用 Mantine 预设及跨断点 CSS 变量。
module.exports = {
    plugins: {
        'postcss-preset-mantine': {
            autoRem: true,
        },
        'postcss-simple-vars': {
            variables: {
                'mantine-breakpoint-xs': '36em',
                'mantine-breakpoint-sm': '48em',
                'mantine-breakpoint-md': '62em',
                'mantine-breakpoint-lg': '75em',
                'mantine-breakpoint-xl': '88em',
            },
        },
    },
};
