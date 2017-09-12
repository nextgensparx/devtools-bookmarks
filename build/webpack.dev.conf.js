let utils = require('./utils');
let webpack = require('webpack');
let config = require('../config');
let merge = require('webpack-merge');
let baseWebpackConfig = require('./webpack.base.conf');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
let CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.dev.cssSourceMap,
    }),
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env,
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'panel.html',
      template: utils.resolve('src/panel.html'),
      chunks: ['app'],
      inject: true,
    }),
    new HtmlWebpackPlugin({
      filename: 'devtools.html',
      template: utils.resolve('src/devtools.html'),
      chunks: ['devtools'],
      inject: true,
    }),
    new FriendlyErrorsPlugin(),
    new CopyWebpackPlugin([{
      from: utils.resolve('static'),
      to: config.dev.assetsSubDirectory,
      ignore: ['.*'],
    }]),
  ],
});
