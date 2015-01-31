var webpack = require('webpack');
var root = __dirname;
var path = require('path');

module.exports = {
  context: __dirname,
  entry: path.join(__dirname, 'app.js'),
  output: {
    path: path.join(root, 'build'),
    filename: 'output.js',
    publicPath: "/build/"
  },
  module: {
    loaders: [
      { test: /\.js$/,  loader: 'jsx-loader' },
      { test: /\.less$/, loader: 'style-loader!css?sourceMap!less-loader?sourceMap=true' },
    ]
  },
  devtool: '#source-map'
};