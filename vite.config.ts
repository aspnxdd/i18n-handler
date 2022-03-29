import react from '@vitejs/plugin-react';
import { UserConfig, ConfigEnv } from 'vite';
import { viteCommonjs, esbuildCommonjs } from '@originjs/vite-plugin-commonjs';

import { join } from 'path';
// const path = require("path");
// const join = path.join;

const srcRoot = join(__dirname, 'src');

export default ({ command }: ConfigEnv): UserConfig => {
  // DEV
  if (command === 'serve') {
    return {
      root: srcRoot,
      base: '/',
      plugins: [react()],
      resolve: {
        alias: {
          '/@': srcRoot
        }
      },
      build: {
        outDir: join(srcRoot, '/out'),
        emptyOutDir: true,
        rollupOptions: {}
      },
      server: {
        port: process.env.PORT === undefined ? 3000 : +process.env.PORT
      },
      optimizeDeps: {
        exclude: ['path']
      }
    };
  }
  // PROD
  return {
    root: srcRoot,
    base: './',
    plugins: [react(),    viteCommonjs(),
    ],
    resolve: {
      alias: {
        '/@': srcRoot
      }
    },
    build: {
      outDir: join(srcRoot, '/out'),
      emptyOutDir: true,
      rollupOptions: {}
    },
    server: {
      port: process.env.PORT === undefined ? 3000 : +process.env.PORT
    },
    optimizeDeps: {
      esbuildOptions: {
        plugins: [
          // Solves:
          // https://github.com/vitejs/vite/issues/5308
          esbuildCommonjs(['react-flagpack'])
        ],
      },
      exclude: ['path']
    }
  };
};
