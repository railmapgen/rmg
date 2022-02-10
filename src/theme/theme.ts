import { ComponentSingleStyleConfig, extendTheme } from '@chakra-ui/react';

const config = {
    initialColorMode: 'light',
    useSystemColorMode: true,
};

const components: Record<string, ComponentSingleStyleConfig> = {
    RmgDataTable: {
        baseStyle: ({ colorMode }) => ({
            '& thead': {
                position: 'sticky',
                top: 0,
                zIndex: 10,
            },

            '& td, th': {
                borderRight: '1px solid',
                borderColor: colorMode === 'dark' ? 'whiteAlpha.400' : 'blackAlpha.200',
                backgroundColor: colorMode === 'dark' ? 'gray.700' : 'gray.50',
                whiteSpace: 'nowrap',

                '&:first-of-type': {
                    position: 'sticky',
                    left: 0,
                    zIndex: 1,
                },

                '&:last-of-type': {
                    borderRight: 'none',
                    position: 'sticky',
                    right: 0,
                    zIndex: 1,
                },
            },
        }),
    },

    RmgLabel: {
        baseStyle: {
            m: 1,
            w: 'unset',

            '& label': {
                overflow: 'hidden',
                fontSize: 12,
                mr: 0,
                mb: -0.5,
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
            },
        },
    },
};

const theme = extendTheme({ config, components });

export default theme;
