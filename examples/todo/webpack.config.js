var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  devtool: 'cheap-module-eval-source-map',

  entry: {
    index: './src/index.js'
  },
  output: {
    path: './build',
    filename: 'bundle-[name].js'
  },
  module: {
    loaders: [
      {test: /\.js/, exclude: /node_modules/, loader: 'babel-loader'},
      {test: /\.css$/, loader: "style-loader!css-loader" }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: true
    }),
     new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html'
    })
  ]
};
