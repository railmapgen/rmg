/// <reference types="vitest/config" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config
export default defineConfig({
    base: '/rmg/',
    plugins: [react()],
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    react: [
                        'react',
                        'react-dom',
                        'react-router-dom',
                        '@reduxjs/toolkit',
                        'react-redux',
                        'react-i18next',
                    ],
                    chakra: ['@chakra-ui/react', '@emotion/react', '@emotion/styled', 'framer-motion', 'react-icons'],
                    'ag-grid-community': ['ag-grid-community'],
                    'ag-grid-react': ['ag-grid-react'],
                },
            },
        },
    },
    server: {
        proxy: {
            '^(/styles/|/fonts/|/rmg-palette/|/rmg-templates/)': {
                target: 'https://railmapgen.github.io',
                changeOrigin: true,
                secure: false,
            },
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.ts',
        server: {
            deps: {
                fallbackCJS: false,
            },
        },
        watch: false,
    },
});
