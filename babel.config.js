const path = require('path');

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
  ],
  plugins: [
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-syntax-import-meta',
    '@babel/plugin-proposal-optional-chaining',
  ],
  // exclude: [
  //   path.resolve('./src/workers/rustwasm.worker.ts'),
  // ]
};
