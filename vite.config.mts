import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { coverageConfigDefaults } from 'vitest/config';

// https://vitejs.dev/config
export default defineConfig({
    base: '/rmg/',
    plugins: [react()],
    build: {
        rolldownOptions: {
            output: {
                codeSplitting: {
                    groups: [
                        { test: /node_modules\/react/, name: 'react' },
                        { test: /node_modules\/@mantine/, name: 'mantine' },
                    ],
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
        watch: false,
        coverage: {
            provider: 'v8',
            exclude: coverageConfigDefaults.exclude,
            skipFull: true,
        },
    },
});
