
// GW-TEXT: rollup.config.js

import { terser } from "rollup-plugin-terser";

export default [
{
  input: 'js/gw.js',
  output: {
    file: 'dist/gw-text.min.js',
    format: 'umd',
    name: 'GW',
    freeze: false,
    extend: true,
    sourcemap: true,
    plugins: [terser()]
  }
},
{
  input: 'js/index.js',
  output: {
    file: 'dist/gw-text.js',
    format: 'cjs',
    freeze: false,
  }
},

];
