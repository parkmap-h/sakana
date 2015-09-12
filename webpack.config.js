// For instructions about this file refer to
// webpack and webpack-hot-middleware documentation
var webpack = require('webpack');
var path = require('path');

module.exports = {
  debug: true,
  devtool: '#eval-source-map',
  context: path.join(__dirname, 'app'),

  entry: {
    javascript: [
      'webpack/hot/dev-server',
      'webpack-hot-middleware/client',
      './js/main'
    ]
  },
  output: {
    path: path.join(__dirname, 'public','js'),
    publicPath: '/js/',
    filename: 'main.js'
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],

  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loaders: ['babel'] },
    ]
  }
};
