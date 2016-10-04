var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index: './src/index.js'
  },
  output: {
    path: './build',
    filename: 'bundle-[name].js'
  },
  resolve: {
    modules: ['node_modules', path.resolve(__dirname, 'web_modules')]
  },
  module: {
    loaders: [
      {test: /\.css$/, loader: "style-loader!css-loader?minimize&root=."},
      {test: /\.js/, exclude: /node_modules/, loader: 'babel-loader?cacheDirectory'}
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: false,
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html'
    })
  ]
};
