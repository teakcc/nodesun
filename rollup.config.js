import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript';
import commonjs from 'rollup-plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';

const isProd = !process.env.ROLLUP_WATCH;

export default {
  input: './src/nodesun.ts',
  output: {
    file: 'build/nodesun.js',
    format: 'cjs',
  },
  watch: {
    include: 'src/**/*',
  },
  external: ['commander', 'chalk', 'chokidar'],
  plugins: [
    resolve(),
    typescript({
      exclude: /node_modules/,
    }),
    commonjs(),
    isProd && uglify(),
  ],
};
