const path = require('path');

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
  ],
  plugins: [
    '@babel/plugin-syntax-dynamic-import',
  ],
  exclude: [
    path.resolve('./src/workers/rustwasm.worker.ts'),
  ]
};
