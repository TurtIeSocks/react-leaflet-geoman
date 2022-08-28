import { resolve } from 'path'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import checker from 'vite-plugin-checker'
import typescript from '@rollup/plugin-typescript'

export default defineConfig(({ mode }) => ({
  plugins:
    mode === 'development'
      ? [
          react({
            jsxRuntime: 'classic',
          }),
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
    target: ['safari11.1', 'chrome64', 'firefox66', 'edge88'],
    outDir: resolve(__dirname, './dist'),
    sourcemap: true,
    minify: false,
    input:
      mode === 'development'
        ? { main: resolve(__dirname, 'index.html') }
        : undefined,
    lib:
      mode === 'development'
        ? undefined
        : {
            name: 'react-leaflet-geoman',
            entry: 'src/index.ts',
            fileName: 'index',
          },
    rollupOptions:
      mode === 'development'
        ? {}
        : {
            plugins: [typescript({ tsconfig: './tsconfig.build.json' })],
            external: [
              'react',
              'leaflet',
              'react-leaflet',
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
}))
