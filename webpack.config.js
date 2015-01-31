var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }),
  new ExtractTextPlugin("react-json-editor.css")
];

if (process.env.COMPRESS) {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  );
}

module.exports = {

  output: {
    library: 'ReactJsonEditor',
    libraryTarget: 'var'
  },

  externals: {
    react: 'React'
  },

  module: {
    loaders: [
      { test: /\.js$/,  loader: 'jsx-loader' },
      { test: /\.less$/, loader: ExtractTextPlugin.extract('style-loader',
         'css?sourceMap!less-loader?sourceMap=true') },
    ]

  },

  node: {
    Buffer: false
  },

  plugins: plugins

};