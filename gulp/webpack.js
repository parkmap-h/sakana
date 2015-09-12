'use strict';

var gulp    = require('gulp');
var webpack = require("webpack");
var gutil   = require('gulp-util');

module.exports = function(cb) {
  var compiler = webpack(require("../webpack.config"));
  compiler.watch({
    aggregateTimeout: 300, // wait so long for more changes
    poll: true
  }, function(err, stats) {
    if(err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({
      colors: true
    }));
  });
  cb();
};
