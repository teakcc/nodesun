import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript';
import { uglify } from 'rollup-plugin-uglify';

const isProd = !process.env.ROLLUP_WATCH;

export default {
  input: './src/obbo.ts',
  output: {
    file: 'build/obbo.js',
    format: 'cjs',
  },
  watch: {
    include: 'src/**/*',
  },
  plugins: [
    resolve(),
    typescript({
      exclude: /node_modules/,
    }),
    isProd && uglify(),
  ],
};
