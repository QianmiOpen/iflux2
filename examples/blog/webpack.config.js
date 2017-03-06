var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: './apps/index.tsx',
  output: {
    path: './build',
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.web.js', '.js', '.json', '.ts', '.tsx'],
  },
  module: {
    loaders: [
      { test: /\.tsx?$/, exclude: /node_modules/, loader: 'ts-loader' }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: true,
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html'
    })
  ],
  devServer: {
    host: '0.0.0.0',
    port: 3000
  }
}
