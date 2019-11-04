const WorkerPlugin = require('worker-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

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
      // new CopyWebpackPlugin(
      //   [
      //     {
      //       from: 'src/modules/*.wasm',
      //       to: 'static/',
      //     }
      //   ],
      //   // { context: 'src/modules/*.wasm' }
      // ),
    ],
  },
};
