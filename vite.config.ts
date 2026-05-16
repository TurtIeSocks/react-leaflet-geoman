import { resolve } from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';

export default defineConfig(({ mode }) => ({
  plugins:
    mode === 'development'
      ? [
          react(),
          checker({
            overlay: {
              initialIsOpen: false,
            },
            typescript: {
              tsconfigPath: resolve(__dirname, 'tsconfig.json'),
            },
          }),
        ]
      : [],
  build: {
    outDir: resolve(__dirname, './dist'),
    sourcemap: true,
    minify: false,
    lib:
      mode === 'development'
        ? undefined
        : {
            name: 'react-leaflet-geoman',
            entry: 'src/index.ts',
            fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`,
            formats: ['es', 'cjs'],
          },
    rollupOptions:
      mode === 'development'
        ? { input: { main: resolve(__dirname, 'index.html') } }
        : {
            external: [
              'react',
              'react/jsx-runtime',
              'leaflet',
              'react-leaflet',
              '@react-leaflet/core',
              '@geoman-io/leaflet-geoman-free',
            ],
          },
    assetsDir: '',
    emptyOutDir: true,
  },
  server: {
    host: '0.0.0.0',
    open: true,
    port: 3001,
    fs: {
      strict: false,
    },
  },
}));
