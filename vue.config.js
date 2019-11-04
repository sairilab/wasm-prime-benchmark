const WorkerPlugin = require('worker-plugin');

module.exports = {
  configureWebpack: {
    resolve: {
      extensions: ['.js', '.wasm'],
    },
    output: {
      chunkFilename: '[id].[chunkhash].js',
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
    },
    plugins: [
      new WorkerPlugin({

      }),
    ],
  },
};
