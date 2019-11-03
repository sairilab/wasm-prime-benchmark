const WorkerPlugin = require('worker-plugin');

module.exports = {
  chainWebpack: config => config.resolve.symlinks(false),
  configureWebpack: {
    // module: {
    //   rules: [
    //     {
    //       test: /\.worker\.ts$/,
    //       use: [
    //         {
    //           loader: 'worker-loader',
    //           options: {
    //             name: '[name].js',
    //           },
    //         },
    //         'ts-loader',
    //       ],
    //     },
    //   ],
    // },
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
