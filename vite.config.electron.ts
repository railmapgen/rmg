import { defineConfig, splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config
export default defineConfig({
    base: './',
    plugins: [react(), splitVendorChunkPlugin()],
    build: {
        outDir: 'build',
    },
});
