/// <reference types="vitest" />

import { defineConfig, splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';

// https://vitejs.dev/config
export default defineConfig({
    base: '/rmg/',
    plugins: [
        react(),
        checker({ typescript: true, eslint: { lintCommand: 'eslint ./src' } }),
        splitVendorChunkPlugin(),
    ],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.ts',
        deps: {
            fallbackCJS: true,
        },
        mockReset: true,
        watch: false,
    },
});
