import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import dts from 'rollup-plugin-dts';

export default [
  {
    input: './dist/main.js',
    output: {
      file: './production/pheonix-box.js',
      format: 'cjs',
    },
    plugins: [resolve(), commonjs()],
  },
  {
    input: './types/main.d.ts',
    output: {
      file: './production/pheonix-box.d.ts',
      format: 'es',
    },
    plugins: [dts()],
  },
  {
    input: './dist/mjs/main.js',
    output: {
      file: './production/pheonix-box.mjs',
      format: 'es',
    },
    plugins: [resolve(), commonjs()],
  },
  {
    input: './types/mjs/main.d.ts',
    output: {
      file: './production/pheonix-box.mjs.d.ts',
      format: 'es',
    },
    plugins: [dts()],
  },
];