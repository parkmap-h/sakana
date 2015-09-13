'use strict';

var gulp = require('gulp');

var server = require('./gulp/server');
var webpack = require('./gulp/webpack');
var copyHTML = require('./gulp/copy-html');

gulp.task('server', server);
gulp.task('webpack', webpack);
gulp.task('copy:html', copyHTML);

gulp.task('default', [
  'webpack',
  'copy:html',
  'server'
  ]);
