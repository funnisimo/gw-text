
// rollup.config.js

export default {
  input: 'js/index.js',
  output: {
    file: 'dist/text.js',
    format: 'umd',
    name: 'GW',
    freeze: false,
    extend: true,
  }
};
